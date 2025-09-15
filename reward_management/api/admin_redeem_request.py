import frappe
from frappe import _

@frappe.whitelist()
def get_redeem_request():
    try:
        current_user = frappe.session.user
        
         # Get current user's roles
        user_roles = frappe.get_roles(current_user)

        # Allow only Administrator or users with "Admin" role
        if current_user != "Administrator" and "Admin" not in user_roles:
            return {"success": False, "message": "Permission denied"}
        redeem_requests = frappe.get_list("Redeem Request", fields=["name", "customer_id", "redeemed_points", "current_point_status", "total_points", "approve_time", "received_time", "request_status", "received_date", "approved_on", "amount", "transection_id"])
        
        for request in redeem_requests:
            if request.get('received_date'):
                request['received_date'] = frappe.utils.formatdate(request['received_date'], 'dd-MM-yyyy')  # Format received_date as dd-MM-yyyy
            if request.get('approved_on'):
                request['approved_on'] = frappe.utils.formatdate(request['approved_on'], 'dd-MM-yyyy')  # Format approved_on as dd-MM-yyyy
        
        return redeem_requests
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), _("Error in get_redeem_request"))
        return {
            "success": False,
            "message": _("Failed to fetch redeem requests: {0}").format(str(e))
        }
# Reward point to rate conversion logic-------
@frappe.whitelist()
def calculate_amount(request_id):
    try:
        current_user = frappe.session.user
        
         # Get current user's roles
        user_roles = frappe.get_roles(current_user)

        # Allow only Administrator or users with "Admin" role
        if current_user != "Administrator" and "Admin" not in user_roles:
            return {"success": False, "message": "Permission denied"}
        # Fetch the redeem request document
        redeem_request = frappe.get_doc("Redeem Request", request_id)
        redeemed_points = redeem_request.get("redeemed_points")
        # Initialize amount
        amount = 0
        
        # Fetch Reward Points to Money conversion from Single Doctype
        conversion = frappe.get_doc('Reward Points to Money', 'Reward Points to Money')
        reward_point = conversion.reward_point
        payout_amount = conversion.payout_amount

        # Check if redeemed_points is present and is a number
        if redeemed_points and isinstance(redeemed_points, (int, float)):
            if reward_point and payout_amount :
                # Calculate the amount based on redeemed points
                amount = (redeemed_points / reward_point) * payout_amount
                redeem_request.amount = amount  
                # redeem_request.save() 
        else:
            # Log a message if no valid redeemed points are found
            frappe.log_warning(_("No valid redeemed points found for request ID: {0}").format(request_id))

        print("Redeem Request:", redeem_request)
        
        # Return the calculated amount
        return {"amount": amount}

    except Exception as e:
        # Log the error with traceback for debugging
        frappe.log_error(frappe.get_traceback(), _("Error in calculate_amount"))
        frappe.throw(_("Failed to calculate amount: {0}").format(str(e)))
        

# update reward request status---


# update points--------------------
@frappe.whitelist()
def update_redeem_request_status(request_id, action, transaction_id=None, amount=None):
    try:
        current_user = frappe.session.user
        
         # Get current user's roles
        user_roles = frappe.get_roles(current_user)

        # Allow only Administrator or users with "Admin" role
        if current_user != "Administrator" and "Admin" not in user_roles:
            return {"success": False, "message": "Permission denied"}
        redeem_request = frappe.get_doc("Redeem Request", request_id)
        request_action = redeem_request.request_status  # Previous status
        
        # Update request_status and timestamps
        redeem_request.request_status = action
        redeem_request.approved_on = frappe.utils.now_datetime()
        redeem_request.approve_time = frappe.utils.now_datetime().strftime('%H:%M:%S')
        
        if transaction_id:
            redeem_request.transection_id = transaction_id
        
        if amount:
            redeem_request.amount = amount
        
        # Fetch the Customer associated with the redeem request
        carpainter = frappe.get_doc("Customer", {"name": redeem_request.customer_id})

        # Handling Cancel after Approved
        if request_action == 'Approved' and action == 'Cancel':
            carpainter.current_points += redeem_request.redeemed_points
            carpainter.redeem_points = (carpainter.redeem_points or 0) - redeem_request.redeemed_points
            redeem_request.current_point_status = carpainter.current_points
            message = f"Redeem request {request_id} was approved but now cancelled."

        # Handling Approval from Cancel
        elif request_action == 'Cancel' and action == 'Approved':
            carpainter.current_points -= redeem_request.redeemed_points
            carpainter.redeem_points = (carpainter.redeem_points or 0) + redeem_request.redeemed_points
            redeem_request.current_point_status = carpainter.current_points
            redeem_request.total_points = carpainter.total_points
            create_bank_balance(redeem_request.name, redeem_request.redeemed_points, transaction_id)
            message = f"Redeem request {request_id} was cancelled but now approved."

        # Handling New Approvals
        elif action == "Approved":
            carpainter.redeem_points = (carpainter.redeem_points or 0) + redeem_request.redeemed_points
            create_bank_balance(redeem_request.name, redeem_request.redeemed_points, transaction_id)
            message = f"Redeem request {request_id} approved successfully."

        # Handling New Cancellations
        elif action == "Cancel":
            carpainter.current_points += redeem_request.redeemed_points
            redeem_request.current_point_status = carpainter.current_points
            message = f"Redeem request {request_id} cancelled successfully."

        # Save both documents
        redeem_request.save(ignore_permissions=True)
        carpainter.save(ignore_permissions=True)
        
        # Commit the transaction
        frappe.db.commit()
        
        return {
            "status": 200, 
            "success": True, 
            "message": message
        }
    
    except Exception as e:
        frappe.log_error(f"Error updating redeem request status: {str(e)}")
        return {
            "status": 500, 
            "success": False, 
            "message": f"An error occurred: {str(e)}"
        }

        
# @frappe.whitelist()
# def update_redeem_request_status(request_id, action, transaction_id=None, amount=None):
#     try:
#         redeem_request = frappe.get_doc("Redeem Request", request_id)
        
#         # Update request_status and approved_on
#         redeem_request.request_status = action
#         redeem_request.approved_on = frappe.utils.now_datetime()
#         redeem_request.approve_time = frappe.utils.now_datetime().strftime('%H:%M:%S')
        
#         # Set transaction_id if provided
#         if transaction_id:
#             redeem_request.transection_id = transaction_id
            
#         if amount:
#             redeem_request.amount = amount
        
#         # Fetch the carpainter associated with the redeem request by customer_id
#         carpainter = frappe.get_doc("Customer", {"name": redeem_request.customer_id})
        
#         # Deduct redeemed points if action is Approved
#         if action == "Approved":
#             # Calculate new current_point_status in Redeem Request
#             redeem_request.current_point_status = redeem_request.total_points - redeem_request.redeemed_points
            
#             # Update points in Carpainter
#             carpainter.current_points = carpainter.total_points - redeem_request.redeemed_points
#             carpainter.redeem_points = (carpainter.redeem_points or 0) + redeem_request.redeemed_points
            
#             # Save both documents
#             redeem_request.save(ignore_permissions=True)
#             carpainter.save(ignore_permissions=True)
            
#             # Commit the transaction
#             frappe.db.commit()
            
#             # Create Bank Balance document with current datetime
#             create_bank_balance(redeem_request.name, redeem_request.redeemed_points, transaction_id)
        
#         return {"status": "success", "message": _("Redeem request status updated successfully.")}
    
#     except Exception as e:
#         frappe.log_error(frappe.get_traceback(), _("Error in update_redeem_request_status"))
#         frappe.throw(_("Failed to update redeem request status: {0}").format(str(e)))
        
# Create Bank Balance ----------
def create_bank_balance(redeem_request_id, amount, transaction_id=None):
    
    try:
        current_user = frappe.session.user
        
         # Get current user's roles
        user_roles = frappe.get_roles(current_user)

        # Allow only Administrator or users with "Admin" role
        if current_user != "Administrator" and "Admin" not in user_roles:
            return {"success": False, "message": "Permission denied"}
        # Create Bank Balance document
        bank_balance = frappe.new_doc("Bank Balance")
        bank_balance.redeem_request_id = redeem_request_id
        bank_balance.amount = amount
        bank_balance.transaction_id = transaction_id
        bank_balance.transfer_date = frappe.utils.now_datetime()
        bank_balance.transfer_time = frappe.utils.now_datetime().strftime('%H:%M:%S')
        
        bank_balance.insert(ignore_permissions=True)
        frappe.db.commit()
        frappe.msgprint(_("Bank Balance created successfully."))  # Optional message for success

        return bank_balance.name  # Return the created Bank Balance document's name
    
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), _("Error in creating Bank Balance"))
        frappe.throw(_("Failed to create Bank Balance: {0}").format(str(e)))

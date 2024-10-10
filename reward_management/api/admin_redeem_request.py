import frappe
from frappe import _

@frappe.whitelist(allow_guest=True)
def get_redeem_request():
    redeem_requests = frappe.get_all("Redeem Request", fields=["name", "customer_id", "redeemed_points", "current_point_status", "total_points", "approve_time", "received_time", "request_status", "received_date", "approved_on", "amount", "transection_id"])
    
    for request in redeem_requests:
        if request.get('received_date'):
            request['received_date'] = frappe.utils.formatdate(request['received_date'], 'dd-MM-yyyy')  # Format received_date as dd-MM-yyyy
        if request.get('approved_on'):
            request['approved_on'] = frappe.utils.formatdate(request['approved_on'], 'dd-MM-yyyy')  # Format approved_on as dd-MM-yyyy
    
    return redeem_requests

# update reward request status---
@frappe.whitelist()
def update_redeem_request_status(request_id, action, transaction_id=None, amount=None):
    try:
        redeem_request = frappe.get_doc("Redeem Request", request_id)
        
        # Update request_status and approved_on
        redeem_request.request_status = action
        redeem_request.approved_on = frappe.utils.now_datetime()
        redeem_request.approve_time = frappe.utils.now_datetime().strftime('%H:%M:%S')
        
        # Set transaction_id if provided
        if transaction_id:
            redeem_request.transection_id = transaction_id
            
        if amount:
            redeem_request.amount = amount
        
        # Fetch the carpainter associated with the redeem request by customer_id
        carpainter = frappe.get_doc("Customer", {"name": redeem_request.customer_id})
        
        # Deduct redeemed points if action is Approved
        if action == "Approved":
            # Calculate new current_point_status in Redeem Request
            redeem_request.current_point_status = redeem_request.total_points - redeem_request.redeemed_points
            
            # Update points in Carpainter
            carpainter.current_points = carpainter.total_points - redeem_request.redeemed_points
            carpainter.redeem_points = (carpainter.redeem_points or 0) + redeem_request.redeemed_points
            
            # Save both documents
            redeem_request.save(ignore_permissions=True)
            carpainter.save(ignore_permissions=True)
            
            # Commit the transaction
            frappe.db.commit()
            
            # Create Bank Balance document with current datetime
            create_bank_balance(redeem_request.name, redeem_request.redeemed_points, transaction_id)
        
        return {"status": "success", "message": _("Redeem request status updated successfully.")}
    
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), _("Error in update_redeem_request_status"))
        frappe.throw(_("Failed to update redeem request status: {0}").format(str(e)))
        
# Create Bank Balance ----------
def create_bank_balance(redeem_request_id, amount, transaction_id=None):
    try:
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

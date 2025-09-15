# apps/reward_management/reward_management/api/redeem_request.py

import frappe
from frappe import _
from datetime import datetime
from frappe.utils import now_datetime



@frappe.whitelist()
def get_customer_details():
    logged_in_user = frappe.session.user
    user_info = frappe.get_doc("User", logged_in_user)
    user_mobile_no = user_info.mobile_no
    # Fetch Customer document based on the email
    customer = frappe.get_all("Customer", filters={"mobile_number": user_mobile_no}, fields=["name", "total_points","current_points","redeem_points","city","first_name","full_name","last_name"])
    if customer:
        return customer[0]  # Return the first match
    else:
        frappe.throw(_("Customer not found for this email"))
        
        
# Example backend logic to redeem points
@frappe.whitelist()
def redeem_points(customer_email, points_to_redeem):
    customer = frappe.get_doc("Customer", {"email": customer_email})
    
    if customer and customer.total_points >= 80 and (customer.total_points - customer.redeemed_points) >= points_to_redeem:
        # Deduct points from total_points and update redeemed_points
        customer.total_points -= points_to_redeem
        customer.redeemed_points += points_to_redeem
        customer.save()
        return {"success": True, "message": "Points redeemed successfully."}
    else:
        return {"success": False, "message": "Insufficient points to redeem or total points would drop below 80."}



@frappe.whitelist()
def create_redeem_request(customer_id, redeemed_points):
    try:
        # Fetch current point status for the customer
        current_point_status = frappe.get_value("Customer", customer_id, "total_points")
        # Ensure redeemed_points is an integer
        redeemed_points = int(redeemed_points)

        # Ensure current_point_status is an integer
        if current_point_status is None:
            current_point_status = 0
        else:
            current_point_status = int(current_point_status)

        # Check if redeemed_points is greater than the available current_points
        if redeemed_points > current_point_status:
            return {"success": False, "message": "You cannot redeem more points than your current balance."}
        
        # check redeem point is not less then minimu, point and not greater then maximum point
        redeem_setup = frappe.get_single('Redeemption Points Setup') 
        maximum_points = redeem_setup.maximum_points or 0
        minimum_points = redeem_setup.minimum_points or 0
          # Ensure redeemed_points is an integer
        maximum_points = int(maximum_points)
        minimum_points = int(minimum_points)

        if redeemed_points < minimum_points:
            return {"success": False, "message": "You cannot redeem less than the minimum points."}
        if redeemed_points > maximum_points:
            return {"success": False, "message": "You cannot redeem more than the maximum points."}
        
        # Create a new instance of the document
        redeem_request = frappe.new_doc("Redeem Request")
        
        # Set values for the fields of the document
        redeem_request.customer_id = customer_id
        redeem_request.redeemed_points = redeemed_points
        redeem_request.current_point_status = current_point_status
        
        # Set received_date to the current datetime
        current_datetime = now_datetime()
        redeem_request.received_date = current_datetime.date()
        redeem_request.received_time = current_datetime.time().strftime('%H:%M:%S')
        
        # Set request status to Pending
        redeem_request.request_status = "Pending"
        
        # Set approve_date to None or ""
        redeem_request.approve_time = ""  # or redeem_request.approve_date = ""
        
        # Save the document (this also assigns creation date)
        redeem_request.insert(ignore_permissions=True)
        
        # Print the received date and creation separately for debugging
        print(f"Received Date Set: {redeem_request.received_date}")
        print(f"Creation Date: {redeem_request.creation}")
        
        # Return success message
        return {
            "success":True,
            "message":"Redeem Request created successfully.",
            "data":redeem_request.name
            
            }
    
    except Exception as e:
        # Log error and raise exception
        frappe.log_error(f"Error creating redeem request: {str(e)}")
        frappe.throw(_("Failed to create redeem request. Please try again later."))

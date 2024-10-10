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
@frappe.whitelist(allow_guest=True)
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



@frappe.whitelist(allow_guest=True)
def create_redeem_request(customer_id, redeemed_points):
    try:
        # Fetch current point status for the customer
        current_point_status = frappe.get_value("Customer", customer_id, "total_points")
        
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
        return _("Redeem Request created successfully.")
    
    except Exception as e:
        # Log error and raise exception
        frappe.log_error(f"Error creating redeem request: {str(e)}")
        frappe.throw(_("Failed to create redeem request. Please try again later."))

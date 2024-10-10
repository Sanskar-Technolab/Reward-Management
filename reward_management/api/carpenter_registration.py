from __future__ import unicode_literals
import frappe
from frappe import _
from datetime import datetime

@frappe.whitelist(allow_guest=True)
def update_registration_request_status(registration_id, status):
    try:
        registration = frappe.get_doc("Customer Registration", registration_id)
        if status == "Approved":
            # Fetch Carpainter details
            carpainter = frappe.get_doc("Customer", registration.carpainter_id)
            
            # Check if a User with the same mobile number exists
            existing_user = frappe.get_value("User", {"mobile_no": carpainter.mobile_number}, "name")
            if not existing_user:
                # Create a new User
                user = frappe.new_doc("User")
                user.first_name = carpainter.first_name
                user.last_name = carpainter.last_name
                user.full_name = carpainter.full_name
                user.email = f"{carpainter.mobile_number}@gmail.com"
                user.mobile_no = carpainter.mobile_number
                user.role_profile_name = "Customer"  
                
                # Save the User document
                user.insert(ignore_permissions=True)
            else:
                frappe.throw(_("User with mobile number {0} already exists.").format(carpainter.mobile_number))
        
        frappe.db.commit()
        
        return {"status": "success", "message": _("Registration request status updated successfully.")}
    
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), _("Error in update_registration_request_status"))
        frappe.throw(_("Failed to update registration request status: {0}").format(str(e)))
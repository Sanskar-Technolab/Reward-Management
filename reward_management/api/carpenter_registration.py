from __future__ import unicode_literals
import frappe
from frappe import _
from datetime import datetime
from reward_management.api.sms_setting import send_api_sms

@frappe.whitelist()
def update_registration_request_status(registration_id, status):
    try:
        registration = frappe.get_doc("Customer Registration", registration_id)

        if status == "Approved":
            # Check if the Customer Registration document has a 'point_history' field
            point_history = getattr(registration, 'point_history', None)

            # Fetch Carpainter details
            # carpainter = frappe.get_doc("Carpenter Registration", registration.name)

            # Check if a User with the same mobile number exists
            existing_user = frappe.get_value("User", {"mobile_no": registration.mobile_number}, "name")

            if not existing_user:
                # Create a new User
                user = frappe.new_doc("User")
                user.first_name = registration.first_name
                user.last_name = registration.last_name
                user.full_name = f"{registration.first_name} {registration.last_name}"
                user.email = f"{registration.mobile_number}@noexit.com"
                user.mobile_no = registration.mobile_number
                user.location = registration.city
                user.role_profile_name = "Customer"  # Assigning role as Customer

                # Save the User document
                user.insert(ignore_permissions=True)

                # Log the new user details
                user_dict = user.as_dict()
                user_details = "\n".join([f"{key}: {value}" for key, value in user_dict.items()])
                frappe.logger().info(f"New User Details:\n{user_details}")

                # Create a new Customer document (Carpainter equivalent)
                new_customer = frappe.new_doc("Customer")  # Corrected to use new_doc method
                new_customer.first_name = registration.first_name
                new_customer.last_name = registration.last_name
                new_customer.full_name = registration.first_name + " " + registration.last_name
                new_customer.email = f"{registration.mobile_number}@noexit.com"

                new_customer.mobile_number = registration.mobile_number
                new_customer.city = registration.city

                # If point_history is not found or empty, create the customer without point history
                # if not point_history:
                #     new_customer.insert()

                #     # Return success message indicating no point history added
                #     return {
                #         "status": "success",
                #         "message": "Customer created successfully, but no point history found."
                #     }
                # else:
                #     # If point history exists, assign it and create customer
                #     new_customer.point_history = point_history
                #     new_customer.insert()

                    # Log the newly created customer details
                    # customer_dict = new_customer.as_dict()
                    # customer_details = "\n".join([f"{key}: {value}" for key, value in customer_dict.items()])
                    # frappe.logger().info(f"New Customer Details:\n{customer_details}")

                    # return {
                    #     "status": "success",
                    #     "message": "Customer created successfully with point history."
                    # }
                
                if point_history:
                    new_customer.point_history = point_history
                    
                new_customer.insert()
                #  Send SMS after both user and customer are created successfully
                send_api_sms(
                    mobile_number=registration.mobile_number,
                    otp=registration.mobile_number,
                    template_name="approved_customer_registration"
                )
                   # Log the newly created customer details
                customer_dict = new_customer.as_dict()
                customer_details = "\n".join([f"{key}: {value}" for key, value in customer_dict.items()])
                frappe.logger().info(f"New Customer Details:\n{customer_details}")

                return {
                        "status": "success",
                        "message": "Customer created successfully with point history."
                    }
                 

            else:
                # If user already exists, skip creating a new user and customer
                return {
                    "success": False,
                    "status": "fail",
                    "message": _("User with mobile number {0} already exists.").format(registration.mobile_number)
                }

        
        # Commit the transaction
        frappe.db.commit()

        return {"status": "success", "message": _("Registration request status updated successfully.")}

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), _("Error in update_registration_request_status"))
        return {
            "success": False, 
            "status": "fail", 
            "message": _("Failed to update registration request status: {0}").format(str(e))
        }




# cancel request-----
@frappe.whitelist()
def cancel_customer_registration(registration_id, status):
    try:
        # Fetch the registration document
        registration = frappe.get_doc("Customer Registration", registration_id)

        if status == "Cancel":
            # Update the status or perform any other necessary logic
            registration.status = "Cancel"  # Assuming 'status' field exists
            registration.save()

            return {
                "status": "success",
                "message": "Registration request status cancelled successfully."
            }
        
        # If the status is not "Cancel", return appropriate message
        return {
            "status": "fail",
            "message": "Invalid status provided."
        }

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Error in cancel_customer_registration")
        return {
            "status": "fail",
            "message": f"Failed to update registration request status: {str(e)}"
        }




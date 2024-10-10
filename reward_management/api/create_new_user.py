import frappe
from frappe.model.document import Document

@frappe.whitelist(allow_guest=True)
def check_user_registration(mobile_number):
    try:
        # Check if the mobile number exists in Mobile Verification document
        existing_verification = frappe.get_all(
            'Mobile Verification',
            filters={'mobile_number': mobile_number},
            fields=["name", "mobile_number", "otp"],
            limit=1
        )

        # Check if the mobile number exists in User document
        user_info = frappe.get_value(
            "User",
            {"mobile_no": mobile_number},
            ["name", "full_name", "email","role_profile_name"],
            as_dict=True
        )

        if existing_verification or user_info:
            if user_info:
                # If user exists, save user session and return user information
                frappe.local.login_manager.login_as(user_info.get("name"))
                frappe.session.user = user_info.get("name")
                frappe.session.full_name = user_info.get("full_name")
                frappe.session.email = user_info.get("email")
                frappe.session.role_profile_name = user_info.get("role_profile_name")

                return {
                    "registered": True,
                    "message": "User logged in successfully.",
                    "full_name": user_info.get("full_name"),
                    "email": user_info.get("email"),
                    "username": user_info.get("name"),
                    "role_profile_name" : user_info.get("role_profile_name")
                }
            else:
                # If only Mobile Verification exists and not User
                return {
                    "registered": False,
                    "message": "Mobile number not registered. Please register to continue."
                }
        else:
            # If neither Mobile Verification nor User exists for the mobile number
            return {
                "registered": False,
                "message": "Mobile number not verified or registered. Please verify your mobile number."
            }

    except Exception as e:
        # Log any exceptions that occur
        frappe.log_error(f"Error in check_user_registration: {str(e)}")
        return {
            "registered": False,
            "message": str(e)  # This will return the actual error message in case of exception
        }

    
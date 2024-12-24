import frappe
from frappe.model.document import Document



# check register user before registration

@frappe.whitelist(allow_guest=True)
def check_registered_user(mobile_number):
    try:
        # Check if the Carpainter already exists in Customer Registration
        existing_carpainter = frappe.db.get_value(
            "Customer Registration",
            {"mobile_number": mobile_number,"status":"Pending"},
            ["name", "status"],
            as_dict=True
        )

        if existing_carpainter:
            if existing_carpainter["status"] == "Pending":
                return {
                    "approved":False,
                    "registered": True,
                    "status": "failed",
                    "message": "Your registration request is pending admin approval. You will be able to log in once the request is approved."
                }

        # Check if the mobile number exists in the User document
        user_info = frappe.get_value(
            "User",
            {"mobile_no": mobile_number},
            ["name", "email"],
            as_dict=True
        )

        if user_info:
            # If user exists with the provided mobile number
            return {
                "registered": True,
                "approved":True,
                "message": "User is already registered. Please login to your account."
            }

        # If no user or carpainter registration exists for the mobile number
        return {
            "registered": False,
            "approved":False,
            "message": "Mobile number not registered. Please register to continue."
        }

    except Exception as e:
        # Log any exceptions that occur
        frappe.log_error(f"Error in check_registered_user: {str(e)}")
        return {
            "approved":False,
            "registered": False,
            "message": f"An error occurred: {str(e)}"
        }

# @frappe.whitelist(allow_guest=True)
# def check_registered_user(mobile_number):
#     try:
#         # Check if the mobile number exists in User document (matching the 'mobile_no' field)
#         user_info = frappe.get_value(
#             "User",  
#             {"mobile_no": mobile_number},  
#             ["name", "email"],
#             as_dict=True  
#         )

#         if user_info:
#             # If user exists with the provided mobile number
#             return {
#                 "registered": True,
#                 "message": "User is already registered. Please login to your account."
#             }
#         else:
#             # If no user exists with the provided mobile number
#             return {
#                 "registered": False,
#                 "message": "Mobile number not registered. Please register to continue."
#             }

#     except Exception as e:
#         # Log any exceptions that occur
#         frappe.log_error(f"Error in check_registered_user: {str(e)}")
#         return {
#             "registered": False,
#             "message": f"An error occurred: {str(e)}"  
#         }


# # check user registration login time



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
            ["name", "full_name", "email", "role_profile_name"],
            as_dict=True
        )

        if existing_verification:
            # If the mobile number is found in the Mobile Verification document
            if user_info:
                # If user exists, return user information
                return {
                    "registered": True,
                    "message": "User is registered.",
                    # "full_name": user_info.get("full_name"),
                    # "email": user_info.get("email"),
                    # "username": user_info.get("name"),
                    "role_profile_name": user_info.get("role_profile_name")
                }
            else:
                # If only Mobile Verification exists and not User
                return {
                    "registered": False,
                    "message": "Mobile number is verified, but user is not registered. Please complete registration."
                }
        
        elif user_info:
            # If only User exists but not Mobile Verification
            return {
                "registered": True,
                "message": "User is registered, but mobile number is not verified. Please verify your mobile number."
            }

        else:
            # If neither Mobile Verification nor User exists for the mobile number
            return {
                "registered": False,
                "message": "Mobile number not verified or registered. Please verify and register."
            }

    except Exception as e:
        # Log any exceptions that occur
        frappe.log_error(f"Error in check_user_registration: {str(e)}")
        return {
            "registered": False,
            "message": str(e)  # This will return the actual error message in case of exception
        }


# @frappe.whitelist(allow_guest=True)
# def check_user_registration(mobile_number):
#     try:
#         # Check if the mobile number exists in Mobile Verification document
#         existing_verification = frappe.get_all(
#             'Mobile Verification',
#             filters={'mobile_number': mobile_number},
#             fields=["name", "mobile_number", "otp"],
#             limit=1
#         )

#         # Check if the mobile number exists in User document
#         user_info = frappe.get_value(
#             "User",
#             {"mobile_no": mobile_number},
#             ["name", "full_name", "email","role_profile_name"],
#             as_dict=True
#         )

#         if existing_verification or user_info:
#             if user_info:
#                 # If user exists, save user session and return user information
#                 frappe.local.login_manager.login_as(user_info.get("name"))
#                 frappe.session.user = user_info.get("name")
#                 frappe.session.full_name = user_info.get("full_name")
#                 frappe.session.email = user_info.get("email")
#                 frappe.session.role_profile_name = user_info.get("role_profile_name")

#                 return {
#                     "registered": True,
#                     "message": "User logged in successfully.",
#                     "full_name": user_info.get("full_name"),
#                     "email": user_info.get("email"),
#                     "username": user_info.get("name"),
#                     "role_profile_name" : user_info.get("role_profile_name")
#                 }
#             else:
#                 # If only Mobile Verification exists and not User
#                 return {
#                     "registered": False,
#                     "message": "Mobile number not registered. Please register to continue."
#                 }
#         else:
#             # If neither Mobile Verification nor User exists for the mobile number
#             return {
#                 "registered": False,
#                 "message": "Mobile number not verified or registered. Please verify your mobile number."
#             }

#     except Exception as e:
#         # Log any exceptions that occur
#         frappe.log_error(f"Error in check_user_registration: {str(e)}")
#         return {
#             "registered": False,
#             "message": str(e)  # This will return the actual error message in case of exception
#         }

    
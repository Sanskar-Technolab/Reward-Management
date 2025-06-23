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
                    "activate":False,
                    "status": "failed",
                    "message": "Your registration request is pending admin approval. You will be able to log in once the request is approved."
                }

        # Check if the mobile number exists in the User document
        
         # Step 3: Check if the mobile number exists in User document
        user_info = frappe.get_value(
            "User",
            {"mobile_no": mobile_number},
            ["name", "full_name", "email", "role_profile_name"],
            as_dict=True
        )

        if user_info:
            if user_info:
                 # If user is found, check for the matching carpenter with the same mobile number
                carpenter_info = frappe.get_value(
                    "Customer",  
                    {"mobile_number": mobile_number},
                    ["name", "full_name","full_name", "email", "enabled"],
                    as_dict=True
                )

                if carpenter_info:
                    # If carpenter is found, check if the account is enabled
                    if carpenter_info["enabled"]:
                        # Carpenter exists and is enabled
                        return {
                            "approved": True,
                            "registered": True,
                            "activate":True,
                            "message": "User is already registered. Please login to your account.",
                            "full_name": user_info.get("full_name"),
                            "email": user_info.get("email"),
                            "username": user_info.get("name"),
                            "role_profile_name": user_info.get("role_profile_name"),
                        }
                    else:
                        # Carpenter exists but the account is disabled
                        return {
                            "activate":False,
                            "registered": True,
                            "approved":True,
                            "message": "Your account is deactivated. Please contact the admin."
                        }

        # If no user or carpainter registration exists for the mobile number
        return {
            "registered": False,
            "approved":False,
            "activate":False,
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






# # check user registration login time----
# @frappe.whitelist(allow_guest=True)
# def check_user_registration(mobile_number):
#     try:
        
#         # Step 1: Check if the mobile number exists in Mobile Verification
#         existing_verification = frappe.get_all(
#             'Mobile Verification',
#             filters={'mobile_number': mobile_number},
#             fields=["name", "mobile_number", "otp"],
#             limit=1
#         )

#         # Step 2: Check if the mobile number exists in Customer Registration
#         existing_carpainter = frappe.db.get_value(
#             "Customer Registration",
#             {"mobile_number": mobile_number},
#             ["name", "status"],
#             as_dict=True
#         )
        
#         if existing_carpainter:
#             if existing_carpainter["status"] == "Pending":
#                 # Registration is pending approval
#                 return {
#                     "approved": False,
#                     "registered": True,
#                     "activate":False,
#                     "status": "failed",
#                     "message": "Your registration request is pending admin approval. You will be able to log in once the request is approved."
#                 }
#             elif existing_carpainter["status"] == "Cancel":
#                 # Registration was cancelled
#                 return {
#                     "approved": False,
#                     "registered": False,
#                     "activate":False,
#                     "status": "failed",
#                     "message": "Your registration request has been cancelled. To proceed, please complete the registration process again."
#                 }
         
           
        
#         # Step 3: Check if the mobile number exists in User document
#         user_info = frappe.get_value(
#             "User",
#             {"mobile_no": mobile_number},
#             ["name", "full_name", "email", "role_profile_name"],
#             as_dict=True
#         )

#         if existing_verification:
#             # If the mobile number is found in the Mobile Verification document
#             if user_info:
#                  # If user is found, check for the matching carpenter with the same mobile number
#                 carpenter_info = frappe.get_value(
#                     "Customer",  
#                     {"mobile_number": mobile_number},
#                     ["name", "full_name","full_name", "email", "enabled"],
#                     as_dict=True
#                 )

#                 if carpenter_info:
#                     # If carpenter is found, check if the account is enabled
#                     if carpenter_info["enabled"]:
#                         # Carpenter exists and is enabled
#                         return {
#                             "approved": True,
#                             "registered": True,
#                             "activate":True,
#                             "message": "Carpenter is already registered. Login Successfull.",
#                             "full_name": user_info.get("full_name"),
#                             "email": user_info.get("email"),
#                             "username": user_info.get("name"),
#                             "role_profile_name": user_info.get("role_profile_name"),
#                         }
#                     else:
#                         # Carpenter exists but the account is disabled
#                         return {
#                             "activate":False,
#                             "registered": False,
#                             "message": "Your account is deactivated. Please contact the admin."
#                         }
            
#             else:
#                 # If only Mobile Verification exists and not User
#                 return {
#                     "registered": False,
#                     "message": "Your mobile number is not registered. Please complete the registration process to continue."
#                 }
        
#         elif user_info:
#             # If only User exists but not Mobile Verification
#             return {
#                 "registered": True,
#                 "message": "Your mobile number is not registered. Please complete the registration process to continue."
#             }

#         else:
#             # If neither Mobile Verification nor User exists for the mobile number
#             return {
#                 "registered": False,
#                 "message": "Your mobile number is not registered. Please complete the registration process to continue."
#             }

#     except Exception as e:
#         # Log any exceptions that occur
#         frappe.log_error(f"Error in check_user_registration: {str(e)}")
#         return {
#             "registered": False,
#             "message": str(e)  
#         }

# check user registration before login check from customer registration and customer and user doctype------
@frappe.whitelist(allow_guest=True)
def check_user_registration(mobile_number):
    try:
        

        # Step 2: Check if the mobile number exists in Customer Registration
        existing_carpainter = frappe.db.get_value(
            "Customer Registration",
            {"mobile_number": mobile_number},
            ["name", "status"],
            as_dict=True
        )
        
        if existing_carpainter:
            if existing_carpainter["status"] == "Pending":
                # Registration is pending approval
                return {
                    "approved": False,
                    "registered": True,
                    "activate":False,
                    "status": "failed",
                    "message": "Your registration request is pending admin approval. You will be able to log in once the request is approved."
                }
            elif existing_carpainter["status"] == "Cancel":
                # Registration was cancelled
                return {
                    "approved": False,
                    "registered": False,
                    "activate":False,
                    "status": "failed",
                    "message": "Your registration request has been cancelled. To proceed, please complete the registration process again."
                }
         
           
        
        # Step 3: Check if the mobile number exists in User document
        user_info = frappe.get_value(
            "User",
            {"mobile_no": mobile_number},
            ["name", "full_name", "email", "role_profile_name"],
            as_dict=True
        )

       
            # If the mobile number is found in the Mobile Verification document
        if user_info:
                 # If user is found, check for the matching carpenter with the same mobile number
                carpenter_info = frappe.get_value(
                    "Customer",  
                    {"mobile_number": mobile_number},
                    ["name", "full_name","full_name", "email", "enabled"],
                    as_dict=True
                )

                if carpenter_info:
                    # If carpenter is found, check if the account is enabled
                    if carpenter_info["enabled"]:
                        # Carpenter exists and is enabled
                        return {
                            "approved": True,
                            "registered": True,
                            "activate":True,
                            "message": "Carpenter is already registered. Login Successfull.",
                            "full_name": user_info.get("full_name"),
                            "email": user_info.get("email"),
                            "username": user_info.get("name"),
                            "role_profile_name": user_info.get("role_profile_name"),
                        }
                    else:
                        # Carpenter exists but the account is disabled
                        return {
                            "activate":False,
                            "registered": False,
                            "message": "Your account is deactivated. Please contact the admin."
                        }
            
        elif user_info:
            # If only User exists but not Mobile Verification
            return {
                "registered": True,
                "message": "Your mobile number is not registered. Please complete the registration process to continue."
            }

        else:
            # If neither Mobile Verification nor User exists for the mobile number
            return {
                "registered": False,
                "message": "Your mobile number is not registered. Please complete the registration process to continue."
            }

    except Exception as e:
        # Log any exceptions that occur
        frappe.log_error(f"Error in check_user_registration: {str(e)}")
        return {
            "registered": False,
            "message": str(e)  
        }

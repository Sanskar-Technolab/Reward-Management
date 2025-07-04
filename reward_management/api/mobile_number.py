
import frappe
import random
from frappe.model.document import Document
from datetime import datetime, timedelta
import re
# import requests
from reward_management.api.auth import generate_keys

from reward_management.api.sms_setting import send_api_sms

@frappe.whitelist(allow_guest=True)
def get_mobile_verification_fields():
    try:
        otp = frappe.get_list("Mobile Verification", fields=["otp", "mobile_number"])
        return otp
    except Exception as e:
        return e



# Generate or update otp with sms integration--------------------
@frappe.whitelist(allow_guest=True)
def generate_or_update_otp(mobile_number, template_name=None):
    try:
        if not mobile_number:
            return {'status': 'failed', 'message': 'Mobile number is required'}
        
        if not mobile_number.isdigit():
            return {
                "success": False,
                "status": "failed",
                "message": "Mobile number must contain only digits."
            }

        if len(mobile_number) != 10:
            return {
                "success": False,
                "status": "failed",
                "message": "Mobile number must be exactly 10 digits long."
            }

        if not re.match(r"^[6-9]", mobile_number):
            return {
                "success": False,
                "status": "failed",
                "message": "Mobile number must start with digits between 6 and 9."
            }

        # Generate OTP
        
        # Assign a fixed OTP for a specific number
        if mobile_number == "8200605367":
            otp = "123456"
        else:
            otp = str(random.randint(100000, 999999))
        
        # otp = str(random.randint(100000, 999999))
        # otp = "123456"  

        # Check if a document already exists for the given mobile number
        existing_verification = frappe.get_all(
            'Mobile Verification',
            filters={'mobile_number': mobile_number},
            fields=["name", "mobile_number", "otp"],
            limit=1
        )

        if existing_verification:
            # Update existing OTP
            doc = frappe.get_doc('Mobile Verification', existing_verification[0].name)
            doc.otp = otp
            doc.save(ignore_permissions=True)
            result = {'status': 'success', 'message': 'OTP updated successfully', 'mobile_number': mobile_number, 'otp': otp}
        else:
            # Insert new OTP record
            doc = frappe.get_doc({
                'doctype': 'Mobile Verification',
                'mobile_number': mobile_number,
                'otp': otp
            })
            doc.insert(ignore_permissions=True)
            result = {'status': 'success', 'message': 'OTP generated successfully', 'mobile_number': mobile_number, 'otp': otp}

        # Send OTP via SMS using template_name
        sms_result = send_api_sms(mobile_number, otp, template_name=template_name)

        # Combine both results: OTP generation and SMS response
        result.update({
            "sms_status": sms_result.get("status"),
            "sms_response": sms_result.get("response_text")
        })

        return result
    except Exception as e:
        frappe.log_error("error",str(e))
        return{
            "status":"failed",
            "message":str(e)
        }


# Match OTP and verify user registration status-------------------

@frappe.whitelist(allow_guest=True)
def verify_otp(mobile_number, otp):
    try:
        if not mobile_number or not otp:
            return {'status': 'failed', 'message': 'Mobile number and OTP are required'}
        
        # Fetch the Mobile Verification document
        otp_verification = frappe.get_all('Mobile Verification', filters={'mobile_number': mobile_number, 'otp': otp}, fields=["name", "mobile_number", "otp", "modified"], limit=1)
        
        if otp_verification:
            modified_time = otp_verification[0].modified
            time_diff = datetime.now() - modified_time

            if time_diff <= timedelta(minutes=2):
                # OTP is valid
                otp_status = {'status': 'success', 'message': 'OTP matched successfully', 'mobile_number': mobile_number, 'otp': otp, 'modified': modified_time}
                
                # Now check if the user is registered
                registration_status = check_user_registration(mobile_number)  # Call the user registration check function
                
                # Merge the registration status with OTP status
                otp_status.update(registration_status)

            else:
                otp_status = {'status': 'failed', 'message': 'OTP expired', 'mobile_number': mobile_number, 'otp': otp, 'modified': modified_time}
        else:
            otp_status = {'status': 'failed', 'message': 'Invalid OTP', 'mobile_number': mobile_number, 'otp': otp}
        
        # Return the result including OTP and registration status
        return otp_status
    except Exception as e:
        frappe.log_error('error',str(e))
        return{
            "success":"failed",
            "message":str(e)
        }



# get session details of verfied mobile number and otp use---
@frappe.whitelist(allow_guest=True)
def check_user_registration(mobile_number):
    try:
        # Check if the mobile number exists in the User document
        user_info = frappe.get_value(
            "User",
            {"mobile_no": mobile_number},
            ["name", "full_name", "email", "role_profile_name", "api_key", "api_secret"],
            as_dict=True
        )

        if user_info:
            # User exists, generate API keys if missing
            user_doc = frappe.get_doc("User", user_info.get("name"))
            api_secret = (
                user_doc.get_password("api_secret")
                if user_info.get("api_secret")
                else generate_keys(user_doc)
            )
            api_key = user_doc.api_key or frappe.generate_hash(length=15)

            # Log in the user
            frappe.local.login_manager.login_as(user_info.get("name"))

            # Get session details
            sid = frappe.session.sid
            csrf_token = frappe.sessions.get_csrf_token()

            # Raise an error if any critical data is missing
            if not all([sid, csrf_token, api_key, api_secret, user_info.get("name"), user_info.get("email")]):
                frappe.throw("Oops, Something Went Wrong!", frappe.DoesNotExistError)

            # Return user and session details
            return {
                "registered": True,
                "message": "User logged in successfully.",
                "full_name": user_info.get("full_name"),
                "email": user_info.get("email"),
                "username": user_info.get("name"),
                "role_profile_name": user_info.get("role_profile_name"),
                "session_details": {
                    "sid": sid,
                    "csrf_token": csrf_token,
                    "api_key": api_key,
                    "api_secret": api_secret
                }
            }
        else:
            # User not found
            return {
                "registered": False,
                "message": "Mobile number not registered. Please register to continue."
            }

    except Exception as e:
        # Log any exceptions that occur
        frappe.log_error(f"Error in check_user_registration: {str(e)}")
        return {
            "registered": False,
            "message": str(e)  
        }



        
        
        
# import frappe
# import random
# from frappe.model.document import Document
# from datetime import datetime, timedelta

# @frappe.whitelist(allow_guest=True)
# def get_mobile_verification_fields():
#     try:
#         otp = frappe.get_list("Mobile Verification", fields=["otp", "mobile_number"])
#         return otp
#     except Exception as e:
#         return e

# # Generate random OTP for mobile number and set value
# @frappe.whitelist(allow_guest=True)
# def generate_or_update_otp(mobile_number):
#     if not mobile_number:
#         return {'status': 'failed', 'message': 'Mobile number is required'}

#     # Generate OTP
#     otp = str(random.randint(100000, 999999))

#     # Check if a document already exists for the given mobile number
#     existing_verification = frappe.get_all('Mobile Verification', filters={'mobile_number': mobile_number}, fields=["name", "mobile_number", "otp"], limit=1)
    
#     if existing_verification:
#         # If a document exists, update the existing OTP
#         doc = frappe.get_doc('Mobile Verification', existing_verification[0].name)
#         doc.otp = otp
#         doc.save(ignore_permissions=True)
#         result = {'status': 'success', 'message': 'OTP updated successfully', 'mobile_number': mobile_number, 'otp': otp}
#     else:
#         # If no document exists, create a new one with the generated OTP
#         doc = frappe.get_doc({
#             'doctype': 'Mobile Verification',
#             'mobile_number': mobile_number,
#             'otp': otp
#         })
#         doc.insert(ignore_permissions=True)
#         result = {'status': 'success', 'message': 'OTP generated successfully', 'mobile_number': mobile_number, 'otp': otp}
    
#     # Print values for debugging
#     for key, value in result.items():
#         print(f"{key}: {value}")

#     return result



# verify place order otp for product order

@frappe.whitelist(allow_guest=True)
def verify_otp_product_order(mobile_number, otp):
    try:
        if not mobile_number or not otp:
            return {'status': 'failed', 'message': 'Mobile number and OTP are required'}
        
        # Fetch the Mobile Verification document
        otp_verification = frappe.get_all(
            'Mobile Verification', 
            filters={'mobile_number': mobile_number, 'otp': otp}, 
            fields=["name", "mobile_number", "otp", "modified"], 
            limit=1
        )
        
        if otp_verification:
            modified_time = otp_verification[0].get('modified')  
            time_diff = datetime.now() - modified_time

            if time_diff <= timedelta(minutes=2):
                # OTP is valid
                return {
                    'status': 'success',
                    'message': 'OTP matched successfully',
                    'mobile_number': mobile_number
                }
            else:
                return {
                    'status': 'failed',
                    'message': 'OTP expired. Please request a new one.',
                    'mobile_number': mobile_number
                }
        else:
            return {
                'status': 'failed',
                'message': 'Invalid OTP. Please try again.',
                'mobile_number': mobile_number
            }
    except Exception as e:
        frappe.log("error",str(e))
        return{
            "status":"failed",
            "message":str(e)
        }

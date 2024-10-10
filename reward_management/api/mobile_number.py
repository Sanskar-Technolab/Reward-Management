import frappe
import random
from frappe.model.document import Document
from datetime import datetime, timedelta

@frappe.whitelist(allow_guest=True)
def get_mobile_verification_fields():
    try:
        otp = frappe.get_list("Mobile Verification", fields=["otp", "mobile_number"])
        return otp
    except Exception as e:
        return e

# Generate random OTP for mobile number and set value
@frappe.whitelist(allow_guest=True)
def generate_or_update_otp(mobile_number):
    if not mobile_number:
        return {'status': 'failed', 'message': 'Mobile number is required'}

    # Generate OTP
    otp = str(random.randint(100000, 999999))

    # Check if a document already exists for the given mobile number
    existing_verification = frappe.get_all('Mobile Verification', filters={'mobile_number': mobile_number}, fields=["name", "mobile_number", "otp"], limit=1)
    
    if existing_verification:
        # If a document exists, update the existing OTP
        doc = frappe.get_doc('Mobile Verification', existing_verification[0].name)
        doc.otp = otp
        doc.save(ignore_permissions=True)
        result = {'status': 'success', 'message': 'OTP updated successfully', 'mobile_number': mobile_number, 'otp': otp}
    else:
        # If no document exists, create a new one with the generated OTP
        doc = frappe.get_doc({
            'doctype': 'Mobile Verification',
            'mobile_number': mobile_number,
            'otp': otp
        })
        doc.insert(ignore_permissions=True)
        result = {'status': 'success', 'message': 'OTP generated successfully', 'mobile_number': mobile_number, 'otp': otp}
    
    # Print values for debugging
    for key, value in result.items():
        print(f"{key}: {value}")

    return result

# Match OTP
@frappe.whitelist(allow_guest=True)
def verify_otp(mobile_number, otp):
    if not mobile_number or not otp:
        return {'status': 'failed', 'message': 'Mobile number and OTP are required'}
    
    # Fetch the Mobile Verification document
    otp_verification = frappe.get_all('Mobile Verification', filters={'mobile_number': mobile_number, 'otp': otp}, fields=["name", "mobile_number", "otp", "modified"], limit=1)
    
    if otp_verification:
        modified_time = otp_verification[0].modified
        time_diff = datetime.now() - modified_time

        if time_diff <= timedelta(minutes=10):
            result = {'status': 'success', 'message': 'OTP matched successfully', 'mobile_number': mobile_number, 'otp': otp, 'modified': modified_time}
        else:
            result = {'status': 'failed', 'message': 'OTP expired', 'mobile_number': mobile_number, 'otp': otp, 'modified': modified_time}
    else:
        result = {'status': 'failed', 'message': 'Invalid OTP', 'mobile_number': mobile_number, 'otp': otp}
    
    # Print values for debugging
    for key, value in result.items():
        print(f"{key}: {value}")

    return result

import frappe
from frappe.model.document import Document
from datetime import datetime
import re
from reward_management.api.send_admin_sms import admin_sms_for_new_carpenter_registration



# Create New Carpenter Registration --------------
@frappe.whitelist(allow_guest=True)
def create_new_carpainters(firstname, lastname, city, mobile):
    try:
        if not firstname:
            return{
                "success":False,
                "message":"firstname is required.",
                "status": "failed",
            }
        if not lastname:
            return{
                "success":False,
                "message":"lastname is required.",
                "status": "failed",
            }
        if not mobile:
            return{
                "success":False,
                "message":"mobile is required.",
                "status": "failed",
            }
        if not city:
            return{
                "success":False,
                "message":"city is required.",
                "status": "failed",
            }

        # --- Validations ---
        if firstname.strip().lower() == lastname.strip().lower():
            return {"success": False, "status": "failed", "message": "First name and last name cannot be the same."}

        if not firstname.isalpha() or not lastname.isalpha():
            return {"success": False, "status": "failed", "message": "First name and last name must contain only alphabets."}

        # if not city.isalpha():
        #     return {"success": False, "status": "failed", "message": "City name must contain only letters."}
        if not re.match(r"^[A-Za-z ]+$", city.strip()):
            return {
                "success": False,
                "status": "failed",
                "message": "City name must contain only letters and spaces."
            }

        # if not mobile.isdigit() or len(mobile) != 10:
        #     return {"success": False, "status": "failed", "message": "Mobile number must be a valid 10-digit number."}
        
        if not mobile.isdigit():
            return {
                "success": False,
                "status": "failed",
                "message": "Mobile number must contain only digits."
            }

        if len(mobile) != 10:
            return {
                "success": False,
                "status": "failed",
                "message": "Mobile number must be exactly 10 digits long."
            }

        if not re.match(r"^[6-9]", mobile):
            return {
                "success": False,
                "status": "failed",
                "message": "Mobile number must start with digits between 6 and 9."
            }
        
        
        # Check if the Carpainter already exists
        carpainter_by_mobile = frappe.db.exists("Customer", {"mobile_number": mobile})

        if carpainter_by_mobile:
            return {"success":False,"status": "failed", "message": "Customer already exists. Please login into your account."}
        
        
        
        existing_carpainter = frappe.db.get_value("Customer Registration", 
                                                  {"mobile_number": mobile , "status":"Pending"}, 
                                                  ["name", "status"], 
                                                  as_dict=True)

        if existing_carpainter:
            if existing_carpainter["status"] == "Pending":
                return {
                    "success":False,
                    "status": "failed", 
                    "message": "Your registration request is pending admin approval. You will be able to log in once the request is approved."
                }
           

        # Create full_name by combining first_name and last_name
        full_name = f"{firstname} {lastname}"

        # Create a new Carpainter Registartion ------
        carpenter_new_ragistration = frappe.get_doc({
            "doctype": "Customer Registration",
            "first_name": firstname,
            "last_name": lastname,
            "carpainter_name": full_name, 
            "city": city,
            "mobile_number": mobile,
            "status": "Pending", 
            "registration_date": frappe.utils.now_datetime().strftime('%Y-%m-%d'),  
            "registration_time": frappe.utils.now_datetime().strftime('%H:%M:%S'),
            "approved_time":'',
        })
        carpenter_new_ragistration.insert()
        
        # sent admin sms for the carpenter regiatration request---
        admin_sms_for_new_carpenter_registration(mobile)

        # Log the details of the newly created Carpainter
        carpainter_dict = carpenter_new_ragistration.as_dict()
        carpainter_details = "\n".join([f"{key}: {value}" for key, value in carpainter_dict.items()])
        frappe.logger().info(f"New Carpainter Details:\n{carpainter_details}")

        return {"success":True,"status": "success", "message": "Registration submitted successfully. Your account will be activated after admin approval"}
    except Exception as e:
        frappe.log_error(f"Error creating Carpainter or Carpainter Registration: {str(e)}")
        # frappe.logger().error(f"Error creating Carpainter or Carpainter Registration: {str(e)}")
        return {"success": False, "status": "failed", "message": str(e)}


@frappe.whitelist(allow_guest=True)
def check_carpainter_registration(mobile_no):
    try:
        # Check if the Carpainter with the provided mobile number already exists
        carpainter_by_mobile = frappe.db.exists("Customer", {"mobile_number": mobile_no})

        if carpainter_by_mobile:
            return {"is_registered": True, "message": "Customer already exists. Please login into your account."}
        else:
            return {"is_registered": False}
    except Exception as e:
        return {"is_registered": False, "message": str(e)}
    


 
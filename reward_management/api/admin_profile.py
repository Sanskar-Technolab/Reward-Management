from __future__ import unicode_literals
import json
import frappe
from frappe import _


# user details-----
@frappe.whitelist(allow_guest=True)
def get_users():
    try:
        users = frappe.get_all("User", fields=["name", "email", "mobile_no", "user_image","new_password"])
        
        # Check if users were retrieved
        if users:
            return {"status": "success", "message": users}
        else:
            return {"status": "error", "message": "No users found."}

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), _("API Error"))
        return {"status": "error", "message": str(e)}


# Get User Doctype Data 

@frappe.whitelist(allow_guest=True)
def get_user_details(name):
    try:
        # Fetch specific fields from User document based on email
        user = frappe.get_value("User", {"name": name}, 
                                ["name", "email", "first_name", "last_name", "full_name",
                                 "username", "bio", "location", "mobile_no", "phone","interest",
                                 "gender", "birth_date", "user_image","new_password","user_image"], as_dict=True)

        if user:
            # Return relevant user details as JSON
            return {
                "name": user.get("name"),
                "email": user.get("email"),
                "first_name": user.get("first_name"),
                "last_name": user.get("last_name"),
                "full_name": user.get("full_name"),
                "username": user.get("username"),
                "phone": user.get("phone"),
                "mobile_no": user.get("mobile_no"),
                "gender": user.get("gender"),
                "birth_date": user.get("birth_date"),
                "location": user.get("location"),
                "bio": user.get("bio"),
                "interest": user.get("interest"),
                "user_image": user.get("user_image" or "")
            }
        else:
            frappe.throw(_("User not found for email: {0}").format(name))

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), _("API Error"))
        raise frappe.ValidationError(_("Error fetching user details: {0}").format(str(e)))

    
# Update Admin User Profile------ 
@frappe.whitelist(allow_guest=True)
def update_user_details():
    try:
        user_data = frappe.form_dict  # Use form_dict to get form data
        name = user_data.get('name')
        print("name----",name)

        if not name:
            return {"status": "error", "message": "Name is required."}

        # Fetch User document based on the name
        user = frappe.get_doc("User", {"name": name})

        if not user:
            return {"status": "error", "message": "User not found."}

        # Update user document fields
        user.first_name = user_data.get('first_name', user.first_name)
        user.last_name = user_data.get('last_name', user.last_name)
        user.full_name = user_data.get('full_name', user.full_name)
        user.username = user_data.get('username', user.username)
        user.phone = user_data.get('phone', user.phone)
        user.mobile_no = user_data.get('mobile_no', user.mobile_no)
        user.gender = user_data.get('gender', user.gender)
        user.birth_date = user_data.get('birth_date', user.birth_date)
        user.location = user_data.get('location', user.location)
        user.bio = user_data.get('bio', user.bio)
        user.interest = user_data.get('interest', user.interest)

        # Handle profile image update
        if user_data.get('user_image'):
            user.user_image = user_data.get('user_image')

        # Save changes
        user.save()

        return {"status": "success", "message": "User details updated successfully."}

    except frappe.DoesNotExistError:
        frappe.log_error(frappe.get_traceback(), _("User Not Found Error"))
        return {"status": "error", "message": "User not found."}

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), _("API Error"))
        return {"status": "error", "message": str(e)}

  


    
@frappe.whitelist(allow_guest=True)
def update_user_image(name, new_image_url):
    try:
        # Fetch User document based on email
        user = frappe.get_doc("User", {"name": name})

        # Update user image field
        user.user_image = new_image_url

        # Save changes
        user.save()

        return {"status": "success", "message": "User image updated successfully."}

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), _("API Error"))
        return {"status": "error", "message": str(e)}
        
    
# Remove user Profile 
@frappe.whitelist(allow_guest=True)
def remove_user_image(name):
    try:
        # Fetch User document based on email
        user = frappe.get_doc("User", {"name": name})

        # Reset or remove user's image (example: setting it to None)
        user.user_image = None  # Assuming 'user_image' is the field name for image

        # Save changes
        user.save()

        return {"status": "success", "message": "User image removed successfully."}

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), _("API Error"))
        return {"status": "error", "message": str(e)}


# Update password ------
@frappe.whitelist(allow_guest=True)
def update_password_without_current():
    try:
        user_data = frappe.form_dict  # Use form_dict to get form data
        email = user_data.get('email')
        new_password = user_data.get('new_password')

        # Fetch User document based on email
        user = frappe.get_doc("User", {"email": email})

        # Set new password
        user.new_password = new_password  # Assuming 'new_password' is the field name in User doctype
        user.save()

        return {"status": "success", "message": "Password updated successfully."}

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), _("API Error"))
        return {"status": "error", "message": str(e)}
    
    
    
    
# Get Gender Doctype list-----
@frappe.whitelist(allow_guest=True)
def get_all_gender():
    try:
        genders = frappe.get_list("Gender", filters={}, fields=["name"])
        return genders
    except Exception as e:
        frappe.throw(_("Error fetching genders: {0}").format(str(e)))
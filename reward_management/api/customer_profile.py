from __future__ import unicode_literals
import json
import frappe
from frappe import _
from frappe.auth import CookieManager, LoginManager

from frappe import local
from frappe.utils import get_request_session


# user details-----
@frappe.whitelist(allow_guest=True)
def get_users():
    try:
        users = frappe.get_all("User", fields=["name", "email", "mobile_no", "user_image"])
        
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
                                ["name", "email", "first_name", "last_name", "full_name", "bio", "location", "mobile_no",
                                 "gender", "birth_date","user_image"], as_dict=True)

        if user:
            # Return relevant user details as JSON
            return {
                "name": user.get("name"),
                "email": user.get("email"),
                "first_name": user.get("first_name"),
                "last_name": user.get("last_name"),
                "full_name": user.get("full_name"),
                "mobile_no": user.get("mobile_no"),
                "gender": user.get("gender"),
                "birth_date": user.get("birth_date"),
                "location": user.get("location"),
                "user_image": user.get("user_image" or "")
            }
        else:
            frappe.throw(_("User not found for email: {0}").format(name))

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), _("API Error"))
        raise frappe.ValidationError(_("Error fetching user details: {0}").format(str(e)))


# update user profile and id--------
@frappe.whitelist(allow_guest=True)
def update_user_details():
    try:
        user_data = frappe.form_dict
        new_email = user_data.get('name')
        old_email = user_data.get('old_email')
        
        if not old_email:
            return {"status": "error", "message": "Old email is required."}

        # Fetch User document based on the old email
        users = frappe.get_all("User", filters={"email": old_email}, limit=1)
        if not users:
            return {"status": "error", "message": "User not found."}

        user = frappe.get_doc("User", users[0]["name"])

        if not user.enabled:
            return {"status": "error", "message": f"User {old_email} is disabled. Please contact your System Manager."}

        if old_email != new_email:
            user.first_name = user_data.get('first_name', user.first_name)
            user.last_name = user_data.get('last_name', user.last_name)
            user.full_name = user_data.get('full_name', user.full_name)
            user.phone = user_data.get('phone', user.phone)
            user.gender = user_data.get('gender', user.gender)
            user.birth_date = user_data.get('birth_date', user.birth_date)
            user.location = user_data.get('location', user.location)
            user.save()
            
               # Check for carpenter document and update it similarly
            if user.mobile_no:
                carpenter = frappe.get_all(
                    "Customer", 
                    filters={"mobile_number": user.mobile_no}, 
                    fields=["name"]
                )

                if carpenter:
                    carpenter_doc = frappe.get_doc("Customer", carpenter[0]["name"])
                    carpenter_doc.first_name = user.first_name
                    carpenter_doc.last_name = user.last_name
                    carpenter_doc.full_name = user.full_name
                    carpenter_doc.city = user.location
                    carpenter_doc.email = new_email
                    carpenter_doc.gender = user.gender
                    carpenter_doc.birth_date = user.birth_date

                    if user_data.get('user_image'):
                        carpenter_doc.image = user_data.get('user_image')
                    
                    carpenter_doc.save()

            # Rename the User document and update the email
            frappe.rename_doc("User", old_email, new_email)
            user.email = new_email
            
            
            login_user(new_email)
            

            user.save()
            
            # Return response to trigger reload and cache clear on the frontend
            return {
                "status": "success", 
                "message": "Email changed, reload required.", 
                "reload_required": False,
                "username": user.name
               
            }
        
        # If emails match, just update user details
        user.first_name = user_data.get('first_name', user.first_name)
        user.last_name = user_data.get('last_name', user.last_name)
        user.full_name = user_data.get('full_name', user.full_name)
        user.phone = user_data.get('phone', user.phone)
        user.gender = user_data.get('gender', user.gender)
        user.birth_date = user_data.get('birth_date', user.birth_date)
        user.location = user_data.get('location', user.location)
        user.save()

        # Check for carpenter document and update it similarly
        if user.mobile_no:
            carpenter = frappe.get_all(
                "Customer", 
                filters={"mobile_number": user.mobile_no}, 
                fields=["name"]
            )

            if carpenter:
                carpenter_doc = frappe.get_doc("Customer", carpenter[0]["name"])
                carpenter_doc.first_name = user.first_name
                carpenter_doc.last_name = user.last_name
                carpenter_doc.full_name = user.full_name
                carpenter_doc.city = user.location
                carpenter_doc.gender = user.gender
                carpenter_doc.birth_date = user.birth_date

                if user_data.get('user_image'):
                    carpenter_doc.image = user_data.get('user_image')
                
                carpenter_doc.save()

        return {"status": "success", "message": "User and Carpenter details updated successfully."}

    except frappe.DoesNotExistError:
        frappe.log_error(frappe.get_traceback(), _("User Not Found Error"))
        return {"status": "error", "message": "User not found."}

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), _("API Error"))
        return {"status": "error", "message": str(e)}


# login with new user email--
def login_user(user):
    number = frappe.db.get_value("User", user, ['phone'])
    frappe.local.login_manager.user = user
    frappe.local.login_manager.post_login()
    frappe.db.commit()

    login_token = frappe.generate_hash(length=32)
    frappe.cache().set_value(
        f"login_token:{login_token}", frappe.local.session.sid, expires_in_sec=120
    )
    # print("\n\n login token", login_token, "\n\n")
    # return login_token
    return login_via_token(login_token, number)

#  generate new user csrf token and manage cookies and sid ---
@frappe.whitelist(allow_guest=True)
def login_via_token(login_token: str, number):
    sid = frappe.cache().get_value(f"login_token:{login_token}", expires=True)
    print("api login_via_token", sid)
    if not sid:
        frappe.respond_as_web_page(_("Invalid Request"), _(
            "Invalid Login Token"), http_status_code=417)
        return

    frappe.local.form_dict.sid = sid
    if number:
        frappe.local.cookie_manager = CookieManager()
        frappe.local.cookie_manager.set_cookie("number", number)
    frappe.local.login_manager = LoginManager()
   
    # frappe.utils.set_cookie("my_cookie_name", '7845795655', expires=None)
    return True

  
# get logged carpenter data-------------  
    
@frappe.whitelist()
def get_customer_details():
    logged_in_user = frappe.session.user
    user_info = frappe.get_doc("User", logged_in_user)
    user_mobile_no = user_info.mobile_no
    # Fetch Customer document based on the email
    customer = frappe.get_all("Customer", filters={"mobile_number": user_mobile_no}, fields=["name", "mobile_number","city","first_name","full_name","last_name","gender","birth_date","email","image"])
    if customer:
        return customer[0]  # Return the first match
    else:
        frappe.throw(_("Customer not found for this email"))
        

@frappe.whitelist(allow_guest=True)
def update_user_image(name, new_image_url):
    try:
        # Fetch User document based on name
        user = frappe.get_doc("User", {"name": name})

        # Update user image field
        user.user_image = new_image_url

        # Save User document changes
        user.save()

        # Now fetch and update the corresponding Carpenter document using the existing mobile_no
        if user.mobile_no:
            carpenter = frappe.get_all(
                "Customer", 
                filters={"mobile_number": user.mobile_no}, 
                fields=["name"]
            )

            if carpenter:
                carpenter_doc = frappe.get_doc("Customer", carpenter[0]["name"])

                # Update Carpenter's image field (assuming 'image' is the field name for the image in Carpenter)
                carpenter_doc.image = new_image_url

                # Save Carpenter document changes
                carpenter_doc.save()

        return {"status": "success", "message": "User and Carpenter image updated successfully."}

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), _("API Error"))
        return {"status": "error", "message": str(e)}

        
    
# Remove user Profile 
@frappe.whitelist(allow_guest=True)
def remove_user_image(name):
    try:
        # Fetch User document based on name
        user = frappe.get_doc("User", {"name": name})

        # Reset or remove user's image
        user.user_image = None  # Assuming 'user_image' is the field name for image in User doctype

        # Save User document changes
        user.save()

        # Now fetch and update the corresponding Carpenter document using the existing mobile_no
        if user.mobile_no:
            carpenter = frappe.get_all(
                "Customer", 
                filters={"mobile_number": user.mobile_no}, 
                fields=["name"]
            )

            if carpenter:
                carpenter_doc = frappe.get_doc("Customer", carpenter[0]["name"])

                # Reset or remove Carpenter's image field (assuming 'image' is the field name for image in Carpenter)
                carpenter_doc.image = None

                # Save Carpenter document changes
                carpenter_doc.save()

        return {"status": "success", "message": "User and Carpenter image removed successfully."}

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
        
        
        

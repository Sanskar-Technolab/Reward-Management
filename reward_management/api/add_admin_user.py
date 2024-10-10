import frappe
from frappe import _
@frappe.whitelist()
def get_users():
    # Query to get users with Admin role
    users_with_admin_role = frappe.get_all(
        "Has Role",
        filters={"role": "Admin"},
        fields=["parent as user"]
    )
    
    # Extract user IDs
    user_ids = [user['user'] for user in users_with_admin_role]

    if user_ids:
        users = frappe.get_all(
            "User",
            filters={"name": ["in", user_ids]},
            fields=["first_name", "last_name", "username", "email", "mobile_no"]
        )
    else:
        users = []

    return users



# create new user-------
@frappe.whitelist(allow_guest=True)
def create_admin_user(first_name, last_name, email, mobile_number, password):
    if not frappe.get_all("User", filters={"email": email}):
        user = frappe.get_doc({
            "doctype": "User",
            "first_name": first_name,
            "last_name": last_name,
            "email": email,
            "mobile_no": mobile_number,
            "send_welcome_email": 0,
            "role_profile_name": "Admin",
            "new_password": password
        })
        user.insert(ignore_permissions=True)
        return {"status": "success", "message": _("User created successfully.")}
    else:
        return {"status": "error", "message": _("Email already exists.")}

                      
                      
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
                "name":user.get("name"),
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

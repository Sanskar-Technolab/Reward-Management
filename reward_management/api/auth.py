import frappe


# ? API FOR LOGIN WITH AUTH TOKEN AND ALL
# ! /pdt.api.auth.login
@frappe.whitelist(allow_guest=1)
def login(usr, pwd):
    try:
        # ? SETUP THE LOGIN MANAGER
        login_manager = frappe.auth.LoginManager()
        login_manager.authenticate(user=usr, pwd=pwd)
        login_manager.post_login()

        # ? GET USER DETAILS AND GENERATE API KEY AND SECRET IF NEEDED
        user = frappe.get_doc("User", frappe.session.user)

        # ? CHECK IF EMPLOYEE EXISTS FOR THE USER
        loguser = frappe.db.get_value("User", {"name": user.name}, "name")
        if not loguser:
            frappe.throw(
                "User record not created for this user.",
                frappe.DoesNotExistError,
            )

        # ? GET SESSION DETAILS
        sid = frappe.session.sid
        csrf_token = frappe.sessions.get_csrf_token()
        api_secret = (
            user.get_password("api_secret")
            if user.get("api_secret")
            else generate_keys(user)
        )
        api_key = user.get("api_key")
        username = user.get("username")
        email = user.get("email")

        # ? IF ANY DATA IS MISSING, RAISE ERROR
        if not all([sid, csrf_token, api_key, api_secret, username, email, loguser]):
            frappe.throw(
                "Oops, Something Went Wrong!",
                frappe.DoesNotExistError,
            )

    except frappe.DoesNotExistError as e:
        # ? HANDLE DOES NOT EXIST ERROR
        frappe.log_error("API Login DoesNotExistError", str(e))
        frappe.clear_messages()
        frappe.local.response["message"] = {
            "success": False,
            "message": str(e),
        }

    except frappe.exceptions.AuthenticationError as e:
        # ? HANDLE AUTHENTICATION ERROR
        frappe.log_error("API Login AuthenticationError", str(e))
        frappe.clear_messages()
        frappe.local.response["message"] = {
            "success": False,
            "message": "Invalid Email Or Password. Please Try Again.",
        }

    else:
        # ? LOGIN SUCCESSFUL
        frappe.response["message"] = {
            "success": True,
            "message": "Login successful!",
            "data": {
                "sid": sid,
                "csrf_token": csrf_token,
                "api_key": api_key,
                "api_secret": api_secret,
                "username": username,
                "email": email,
                "loguser": loguser,
            },
        }


# ? GENERATE SECRET KEY FOR USER
def generate_keys(user):
    api_secret = frappe.generate_hash(length=15)
    if not user.api_key:
        user.api_key = frappe.generate_hash(length=15)
    user.api_secret = api_secret
    user.save(ignore_permissions=True)
    frappe.db.commit()

    return api_secret




# get session user roles-----------
@frappe.whitelist(allow_guest=False)
def get_user_roles():
    try:
        user = frappe.session.user

        if user == "Guest":
            return {
                "success": False,
                "message": "You are not logged in.",
                "data": {}
            }

        roles = frappe.get_roles(user)

        return {
            "success": True,
            "message": "User roles retrieved successfully.",
            "data": {
                "user": user,
                "roles": roles
            }
        }
    except Exception as e:
        frappe.log_error("API Get User Roles Error", str(e))
        return {
            "success": False,
            "message": f"Failed to get user roles: {str(e)}"
        }


@frappe.whitelist(allow_guest=False)
def get_user_roles(user_id=None):
    """
    Get roles for a specific user
    Args:
        user_id (str): The username to get roles for (defaults to current user)
    Returns:
        dict: Contains user roles and other basic info
    """
    
    # If no user_id provided, use current user
    if not user_id:
        user_id = frappe.session.user
    
    # Validate the requesting user has permission
    if frappe.session.user != user_id and "System Manager" not in frappe.get_roles():
        frappe.throw(("Not permitted"), frappe.PermissionError)
    
    try:
        user = frappe.get_doc("User", user_id)
        
        # Get all roles (including inherited from roles)
        roles = frappe.get_roles(user_id)
        
        return {
            "success": True,
            "data": {
                "username": user_id,
                "full_name": user.full_name,
                "roles": roles,
                "email": user.email
            }
        }
    
    except Exception as e:
        frappe.log_error(f"Failed to get roles for user {user_id}: {str(e)}")
        return {
            "success": False,
            "error": str(e),
            "message": "Failed to fetch user roles"
        }
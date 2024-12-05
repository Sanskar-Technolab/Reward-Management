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
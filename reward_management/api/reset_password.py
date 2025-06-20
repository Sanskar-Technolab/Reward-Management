import frappe
from frappe.core.doctype.user.user import reset_password


@frappe.whitelist(allow_guest=1)
def reset_user_password(user):
    try:
        if not user:
            return{
                "success":False,
                "message":"User is required.",
                "reset_password":None

            }
        users = frappe.get_value("User",user)
        if not users:
            return{
                "success":False,
                "message":"User not found",
                "reset_password":None
            }
        password=reset_password(user)
        return{
            "success":True,
            "reset_password":password,
            "message":"link send to your email."
        }
    except Exception as e:
        frappe.log_error("error",str(e))
        return{
            "success":False,
            "message":str(e),
            "reset_password":None

        }



#reward_management.api.reset_password.reset_user_password
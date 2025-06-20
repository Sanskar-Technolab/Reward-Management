# In reward_management/api/user_roles.py

import frappe
from frappe import _

@frappe.whitelist(allow_guest=True)
def get_user_roles_for_mobile(mobile_number):
    try:
        user = frappe.db.get_value("User", {"mobile_no": mobile_number}, "name")
        if not user:
            return {"success": False, "message": "User not found","data": None}

        roles = frappe.get_roles(user)
        return {"success": True,"message":"roles get successfully", "data": roles}
    except Exception as e:
        frappe.log_error("API Get User Roles Error", str(e))
        return {"success": False, "message": str(e),"data":None}

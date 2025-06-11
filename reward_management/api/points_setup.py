import frappe
from frappe import _

@frappe.whitelist()
def get_redeem_points():
    try:
        current_user = frappe.session.user
        
         # Get current user's roles
        user_roles = frappe.get_roles(current_user)

        # Allow only Administrator or users with "Admin" role
        if current_user != "Administrator" and "Admin" not in user_roles:
            return {"success": False, "message": "Permission denied"}
        # Fetch maximum and minimum points from your custom doctype
        redeem_setup = frappe.get_single('Redeemption Points Setup')  # Replace with your doctype name

        maximum_points = redeem_setup.maximum_points or 0
        minimum_points = redeem_setup.minimum_points or 0

        return {
            'maximum_points': maximum_points,
            'minimum_points': minimum_points
        }
    except Exception as e:
        frappe.log_error("API Get Redeem Points Error", str(e))
        return {
            "success": False,
            "message": str(e)
        }
    
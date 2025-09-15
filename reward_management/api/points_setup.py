import frappe
from frappe import _

@frappe.whitelist()
def get_redeem_points():
    try:
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
    
import frappe
from reward_management.api.sms_setting import send_api_sms


@frappe.whitelist()
def admin_sms_for_new_carpenter_registration(carpenter_mobile_number):
    try:
        # Step 1: Get all users who have specific roles using Has Role table
        allowed_roles = ["Admin", "Administrator", "System Manager"]

        user_roles = frappe.db.get_all(
            "Has Role",
            filters={"role": ["in", allowed_roles]},
            fields=["parent"]  # parent = user name
        )
        user_names = list(set([row.parent for row in user_roles]))

        if not user_names:
            return {"success": False, "message": "No users found with admin roles."}

        # Step 2: Fetch users who have mobile numbers
        admin_users = frappe.db.get_all(
            "User",
            filters={
                "name": ["in", user_names],
                "mobile_no": ["!=", ""],
                "enabled": 1
            },
            fields=["name", "mobile_no"]
        )

        if not admin_users:
            return {"success": False, "message": "No admin users with mobile numbers found."}

        # Step 3: Send SMS
        for user in admin_users:
            send_api_sms(
                mobile_number=user.mobile_no,
                otp=carpenter_mobile_number,
                template_name="customer_registration"
            )

        return {
            "success": True,
            "message": "SMS sent to admin(s) for carpenter registration."
        }

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Admin SMS Error")
        return {
            "success": False,
            "message": f"Error occurred: {e}"
        }


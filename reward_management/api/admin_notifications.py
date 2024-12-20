import frappe
from frappe import _
from datetime import datetime


@frappe.whitelist(allow_guest=True)
def get_notifications_log():
    # Get the current user
    user = frappe.session.user

    # Check if the user is "Administrator"
    if user == "Administrator":
        # Fetch all users with the "Admin" role
        admin_users = frappe.get_all("User", filters={"role_profile_name": "Admin"}, pluck="name")

        if admin_users:
            # Fetch notifications for any of the admin users
            notifications = frappe.get_all(
                "Notification Log",
                filters={"for_user": ["in", admin_users]},  # Filter for any admin user
                fields=["name", "subject", "email_content", "document_type", "for_user", "creation"]
            )
            
            if notifications:
                # Find the first admin user with notifications
                first_admin_with_notifications = next(
                    (admin_user for admin_user in admin_users if any(n['for_user'] == admin_user for n in notifications)),
                    None
                )

                if first_admin_with_notifications:
                    # Fetch notifications specifically for that first admin user
                    notifications = frappe.get_all(
                        "Notification Log",
                        filters={"for_user": first_admin_with_notifications},
                        fields=["name", "subject", "email_content", "document_type", "for_user", "creation"]
                    )
                
                return notifications
            else:
                return []
        else:
            return []
    else:
        # Fetch notifications for the logged-in user
        notifications = frappe.get_all(
            "Notification Log",
            filters={"for_user": user},
            fields=["name", "subject", "email_content", "document_type", "for_user", "creation"]
        )

        return notifications


@frappe.whitelist()
def show_notification_data():
    # Fetch all notifications from the Notification Log doctype
    notifications = frappe.get_all(
        "Notification Log",
        fields=["name", "subject", "email_content", "document_type", "for_user", "creation"]
    )

    return notifications


@frappe.whitelist()
def send_system_notification(doc, method=None):
    # doc is the document that triggered the hook
    user_email = doc.name  # Assuming `doc.name` is the user email or ID

    # Fetch the user document
    user = frappe.get_doc("User", user_email)
    
    # Check if the user has a role profile named "Customer"
    if user.role_profile_name == "Customer":
        username = user.full_name  # Access the username field

        # Create a new notification log entry
        notification = frappe.get_doc({
            'doctype': 'Notification Log',
            'for_user': user_email,
            'type': 'Alert',
            'subject': 'Your Account Has Been Approved',
            'email_content': f'{username}, Your registration request has been approved, and your account has been created successfully.',
            'document_type': 'User',
            'name': 'Welcome Notification'
        })
        notification.insert(ignore_permissions=True)
        frappe.db.commit()

        return "Notification sent successfully"
    
    return "User is not a Customer, notification not sent."



# send notification to customer after product order request accept-------
@frappe.whitelist()
def send_customer_product_order_approved_notification(doc, method=None):
      # Ensure the product order request status is 'Approved'
    if doc.order_status == 'Approved':
        try:
            # Fetch the Product Order document (which contains the customer information)
            customer = frappe.get_doc("Product Order", doc.name)
        except frappe.DoesNotExistError:
            frappe.throw(_("Product Order {0} not found").format(doc.name))

        # Get the customer's mobile number
        customer_mobile = customer.mobile_number
        
        if not customer_mobile:
            frappe.throw(_("Customer does not have a mobile number"))

        # Find the corresponding User by matching the mobile number
        user = frappe.db.get_value("User", {"mobile_no": customer_mobile}, "name")
        
        if not user:
            frappe.throw(_("No user found with mobile number {0}").format(customer_mobile))

        # Create a new notification log entry for the user found via the mobile number
        notification = frappe.get_doc({
            'doctype': 'Notification Log',
            # Send notification to the matched user
            'for_user': user,
            'subject': 'Product Order Request Approved',
            'type': 'Alert',
            'email_content': f"""
                <p>{customer.full_name},</p>
                <p>Your request for <strong>{doc.product_name}</strong> order has been approved!</p>
                <p><strong>{doc.gift_points}</strong> points have been deducted.</p>
            """,
            'document_type': 'Product Order',
            'document_name': doc.name
        })
        notification.insert(ignore_permissions=True)
        frappe.db.commit()

        return "Notification sent successfully to the user"
    else:
        return "Product Order Request not approved, no notification sent"




# send notification to customer after add new reward points-------
@frappe.whitelist()
def send_customer_reward_points_earn_notification(doc, method=None):
    try:
        # Fetch the customer from the related document
        customer = frappe.get_doc("Customer", doc.name)  # Assuming 'customer' field links to the customer
    except frappe.DoesNotExistError:
        frappe.throw(_("Customer {0} not found").format(doc.name))

    # Get the customer's mobile number
    customer_mobile = customer.mobile_number
    
    if not customer_mobile:
        frappe.throw(_("Customer does not have a mobile number"))

    # Access child table records using the 'getattr' method
    point_history_records = getattr(doc, "point_history", [])

    if not point_history_records:
        frappe.throw(_("No point history found for this customer"))

    # Get the last point history record (the most recent one)
    last_point_history = point_history_records[-1]  # Get the last row

    earned_points = last_point_history.get("earned_points")
    earned_amount = last_point_history.get("earned_amount")
    product_name = last_point_history.get("product_name")

    # Only proceed if earned_points is added (i.e., greater than zero)
    if not earned_points or earned_points <= 0:
        return "No points earned, notification not sent."

    # Find the corresponding User by matching the mobile number
    user = frappe.db.get_value("User", {"mobile_no": customer_mobile}, "name")
    
    if not user:
        frappe.throw(_("No user found with mobile number {0}").format(customer_mobile))

    # Create a new notification log entry for the user found via the mobile number
    notification = frappe.get_doc({
        'doctype': 'Notification Log',
        'for_user': user,
        'subject': 'Reward Points Earned',
        'type': 'Alert',
        'email_content': f"""
            <p>{customer.full_name},</p>
            <p>You have earned <strong>{earned_points}</strong> points for the product <strong>{product_name}</strong>!</p>
        """,
        'document_type': 'Customer',
        'document_name': doc.name
    })
    notification.insert(ignore_permissions=True)
    frappe.db.commit()

    return "Notification sent successfully to the user"


 


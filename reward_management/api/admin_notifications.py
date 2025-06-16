import frappe
from frappe import _
from datetime import datetime


@frappe.whitelist()
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
                filters={"for_user": ["in", admin_users],"read": 0},  # Filter for any admin user
                fields=["name", "subject", "email_content", "document_type", "for_user", "creation","read"]
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
                        filters={"for_user": first_admin_with_notifications,"read": 0},
                        fields=["name", "subject", "email_content", "document_type", "for_user", "creation","read"]
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
            filters={"for_user": user,"read": 0},
            fields=["name", "subject", "email_content", "document_type", "for_user", "creation","read"]
        )

        return notifications

# Notification Updatetion for read notifications----
@frappe.whitelist()
def mark_notification_as_read(name, read):
    try:
        # Fetch the Notification Log document by its name (ID)
        notification = frappe.get_doc("Notification Log", name)
        
        # Check if the notification exists
        if notification:
            # Update the 'read' field with the passed value
            notification.read = read
            notification.save() 
            frappe.db.commit()  
            return {"success":True,"status": "success", "message": "Notification marked as read."}
        else:
            return {"success":False,"status": "error", "message": "Notification not found."}
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Error marking notification as read")
        return {"success":False,"status": "error", "message": str(e)}
    
# show notifications----
@frappe.whitelist()
def show_notification_data():
    # Fetch all notifications from the Notification Log doctype
    notifications = frappe.get_all(
        "Notification Log",
        fields=["name", "subject", "email_content", "document_type", "for_user", "creation"]
    )

    return notifications

# send system notification for customer account approved
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

        return{
            "success":True,
            "message": "Notification sent successfully"
        }
    
    return {
        "success":False,
        "message":"User is not a Customer, notification not sent."
    }



# send notification to customer after product order request accept-------
@frappe.whitelist()
def send_customer_product_order_approved_notification(doc, method=None):
      # Ensure the product order request status is 'Approved'
    if doc.order_status == 'Approved':
        try:
            # Fetch the Product Order document (which contains the customer information)
            customer = frappe.get_doc("Product Order", doc.name)
        except frappe.DoesNotExistError:
            return{
                "success":False,
                "message":"Product Order {0} not found"
            }
            # frappe.throw(_("Product Order {0} not found").format(doc.name))

        # Get the customer's mobile number
        customer_mobile = customer.mobile_number
        
        if not customer_mobile:
            return{
                "success":False,
                "message":"Customer does not have a mobile number"
            }
            # frappe.throw(_("Customer does not have a mobile number"))

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
            {customer.full_name},</br>
            Your request for <strong>{doc.product_name}</strong> order has been approved!</br>
            <strong>{doc.gift_points}</strong> points have been deducted.
            """,
            'document_type': 'Product Order',
            'document_name': doc.name
        })
        notification.insert(ignore_permissions=False)
        frappe.db.commit()

        return {
            "success":True,
            "message":"Notification sent successfully to the user"}
    else:
        return {
            "success":False,
           "message":"Product Order Request not approved, no notification sent"}




# send notification to customer after add new reward points-------
# @frappe.whitelist()
# def send_customer_reward_points_earn_notification(doc, method=None):
#     try:
#         # Fetch the customer from the related document
#         customer = frappe.get_doc("Customer", doc.name)  # Assuming 'customer' field links to the customer
#     except frappe.DoesNotExistError:
#         # frappe.throw(_("Customer {0} not found").format(doc.name))
#         return{
#             "success":False,
#             "message":"Customer {0} not found"
#         }

#     # Get the customer's mobile number
#     customer_mobile = customer.mobile_number
    
#     if not customer_mobile:
#         # frappe.throw(_("Customer does not have a mobile number"))
#         return{
#             "success":False,
#             "message":"Customer does not have a mobile number"
#         }

#     # Access child table records using the 'getattr' method
#     point_history_records = getattr(doc, "point_history", [])

#     if not point_history_records:
#         return{
#               "success":False,
#               "message": "No point history found. Notification not sent."} 

#     # Get the last point history record (the most recent one)
#     last_point_history = point_history_records[-1]  # Get the last row

#     earned_points = last_point_history.get("earned_points")
#     earned_amount = last_point_history.get("earned_amount")
#     product_name = last_point_history.get("product_name")

#     # Only proceed if earned_points is added (i.e., greater than zero)
#     if not earned_points or earned_points <= 0:
#         return {
#             "success":False,
#             "message":"No points earned, notification not sent."}

#     # Find the corresponding User by matching the mobile number
#     user = frappe.db.get_value("User", {"mobile_no": customer_mobile}, "name")
    
#     if not user:
#         # frappe.throw(_("No user found with mobile number {0}").format(customer_mobile))
#         return {
#             "success":False,
#             "message":"No user found with mobile number {0}"}

#     # Create a new notification log entry for the user found via the mobile number
#     notification = frappe.get_doc({
#         'doctype': 'Notification Log',
#         'for_user': user,
#         'subject': 'Reward Points Earned',
#         'type': 'Alert',
#         'email_content': f"""
#         {customer.full_name},</br>
#         You have earned <strong>{earned_points}</strong> points for the product <strong>{product_name}</strong>!
#         """,
#         'document_type': 'Customer',
#         'document_name': doc.name
#     })
#     notification.insert(ignore_permissions=True)
#     frappe.db.commit()

#     return {
#         "success":True,
#         "message":"Notification sent successfully to the user"}


 
# send system notification to customer for earned reward points-------
@frappe.whitelist()
def send_customer_reward_points_earn_notification(doc, method=None):
    try:
        # Fetch the customer from the related document
        customer = frappe.get_doc("Customer", doc.name)
    except frappe.DoesNotExistError:
        return {
            "success": False,
            "message": f"Customer {doc.name} not found"
        }

    # Get the customer's mobile number
    customer_mobile = customer.mobile_number

    if not customer_mobile:
        return {
            "success": False,
            "message": "Customer does not have a mobile number"
        }

    # Access child table records
    point_history_records = getattr(doc, "point_history", [])

    if not point_history_records:
        return {
            "success": False,
            "message": "No point history found. Notification not sent."
        }

    # Identify the last row in the child table
     # Get the last row
    last_point_history = point_history_records[-1] 

    # Check if `earned_points` is added in the last row
    earned_points = last_point_history.get("earned_points")
    time_added = last_point_history.get("time")
    date = last_point_history.get("date")

    if not earned_points or earned_points <= 0:
        return {
            "success": False,
            "message": "No points earned in the last row. Notification not sent."
        }

    # Ensure the `time` is newly added (e.g., recent compared to a threshold)
    from datetime import datetime, timedelta

    try:
        current_time = datetime.now()
        row_time = datetime.strptime(time_added, "%H:%M:%S").time()
        row_datetime = datetime.combine(current_time.date(), row_time)

        # Assume "newly added" is within the last 5 minutes
        if (current_time - row_datetime) > timedelta(minutes=1):
            return {
                "success": False,
                "message": "Time for the last row is not recent. Notification not sent."
            }
    except Exception as e:
        return {
            "success": False,
            "message": f"Error in parsing time for the last row: {str(e)}"
        }

    # Get other details from the last row
    earned_amount = last_point_history.get("earned_amount")
    product_name = last_point_history.get("product_name")

    # Find the corresponding User by matching the mobile number
    user = frappe.db.get_value("User", {"mobile_no": customer_mobile}, "name")

    if not user:
        return {
            "success": False,
            "message": f"No user found with mobile number {customer_mobile}"
        }

    # Create a new notification log entry
    notification = frappe.get_doc({
        'doctype': 'Notification Log',
        'for_user': user,
        'subject': 'Reward Points Earned',
        'type': 'Alert',
        'email_content': f"""
        {customer.full_name},</br>
        You have earned <strong>{earned_points}</strong> points for the product <strong>{product_name}</strong>""",
        'document_type': 'Customer',
        'document_name': doc.name
    })
    notification.insert(ignore_permissions=False)
    frappe.db.commit()

    return {
        "success": True,
        "message": "Notification sent successfully to the user"
    }

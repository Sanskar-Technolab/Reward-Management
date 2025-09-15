import frappe
from frappe import _

#total redemptions count 
@frappe.whitelist()
def count_redemptions():
    # Fetch count of customers from database
    total_redemptions = frappe.db.count("Redeem Request", filters={"request_status": "Approved"})

    return total_redemptions

#total redeem request count 
@frappe.whitelist()
def count_redeem_request():
    # Fetch count of customers from database
    total_redeem_request = frappe.db.count("Redeem Request", filters={"request_status": "Pending"})

    return total_redeem_request


# count total qr code points------
@frappe.whitelist()
def total_points_of_qr_code():
    # Fetch fields from the Product QR document
    qr_docs = frappe.get_all("Product QR", fields=["name", "product_name", "quantity"])

    total_points = 0  # Initialize total points counter

    # Fetch child table data linked with qr_table field for each Product QR document
    for qr_doc in qr_docs:
        qr_doc = frappe.get_all("QR Data",
                                                 filters={"product_qr": qr_doc.name},
                                                 fields=["product_table_name", "qr_code_image", "product_qr_id", "points", "generated_date"])
        
        # Calculate the total points for this Product QR document
        for row in qr_doc:
            total_points += row.get('points', 0)

    # Return the QR docs and total points
    return {
        "qr_docs": qr_docs,
        "total_points": total_points
    }


# count total scanned point for all over carpainters----
@frappe.whitelist()
def get_total_points_data():
    try:
        carpainters = frappe.get_list(
            "Customer",
            fields=["name", "first_name", "full_name", "last_name", "city", "total_points", "mobile_number", "current_points", "redeem_points", "email"],
        )

        # Calculate the total points and redeem points and available points for all carpainters
        total_points = sum(carpainter.get("total_points", 0) for carpainter in carpainters)
        total_redeem_points = sum(carpainter.get("redeem_points", 0) for carpainter in carpainters)
        total_available_points = sum(carpainter.get("current_points", 0) for carpainter in carpainters)

        return {
            "status": "success",
            "data": carpainters,
            "total_points": total_points,
            "total_redeem_points": total_redeem_points,
            "total_available_points":total_available_points,
            
        }

    except Exception as e:
        frappe.logger().error(f"Error fetching Carpainter Registrations: {str(e)}")
        return {"status": "failed", "message": str(e)}



#count total registered customer   
@frappe.whitelist()
def count_total_customers():
    # Fetch count of customers from database with status "Approved"
    total_customers = frappe.db.count("Customer Registration", filters={"status": "Approved"})
    return total_customers


# Product total count 
@frappe.whitelist()
def total_product():
    # Fetch count of customers from database
    total_products = frappe.db.count("Product")

    return total_products


# top 10 carpenter based on total points-------

@frappe.whitelist()
def top_ten_customers():
    try:
        # Get all users with role profile "Carpenter"
        users = frappe.get_all(
            "User",
            filters={"role_profile_name": "Customer"},
            fields=["mobile_no"]
        )

        # Extract mobile numbers from users
        user_mobile_numbers = [u.mobile_no for u in users if u.mobile_no]

        if not user_mobile_numbers:
            return {
                "success":False,
                "message":"user not found",
                "data":None
            }

        # Get matching customers with total_points
        customers = frappe.get_all(
            "Customer",
            filters={"mobile_number": ["in", user_mobile_numbers]},
            fields=["name", "full_name", "mobile_number", "total_points","city"],
            order_by="total_points desc",
            limit_page_length=10
        )

        return {
            "success":True,
            "message":"top 10 customers get successfully.",
            "data":customers
        }
    except Exception as e:
        frappe.log_error("error",str(e))
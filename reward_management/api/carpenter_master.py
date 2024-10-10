from __future__ import unicode_literals
import frappe
from frappe import _
from datetime import datetime
from frappe.utils import nowdate



# get carpainter data with child table------

@frappe.whitelist(allow_guest=True)
def get_carpainter_data():
    try:
        logged_in_user = frappe.session.user
        user_info = frappe.get_doc("User", logged_in_user)
        user_mobile_no = user_info.mobile_no
        
        if not user_mobile_no:
            return {"status": "failed", "message": "Mobile number not found for logged-in user."}

        carpainters = frappe.get_list(
            "Customer",
            filters={"mobile_number": user_mobile_no},
            fields=["name", "first_name", "full_name", "last_name", "city", "total_points", "mobile_number", "current_points", "redeem_points", "email"]
        )

        for carpainter in carpainters:
            # Fetch child table data for each Carpainter
            point_history = frappe.get_all(
                "Customer Product Detail",
                filters={"parent": carpainter["name"]}, 
                fields=["earned_points", "date", "product_name", "product", "product_category"],
                order_by="creation desc"
            )
            
            # Format the date for each entry in point_history
            for point in point_history:
                if point.get('date'):
                    point['date'] = frappe.utils.formatdate(point['date'], 'dd-MM-yyyy')
            
            carpainter["point_history"] = point_history

        return {"status": "success", "data": carpainters}
    
    except Exception as e:
        frappe.logger().error(f"Error fetching Carpainter Registrations: {str(e)}")
        return {"status": "failed", "message": str(e)}
  
  
    
# Show Total Points and Available Points------ 
@frappe.whitelist(allow_guest=True)
def show_total_points():
    try:
        # Get logged-in user's email
        logged_in_user = frappe.session.user
        user_info = frappe.get_doc("User", logged_in_user)
        user_mobile_no = user_info.mobile_no

        # Fetch Carpainter document based on logged-in user's mobile number
        carpainter = frappe.get_all("Customer", filters={"mobile_number": user_mobile_no}, 
                                    fields=["name", "total_points", "redeem_points","current_points"])

        if carpainter:
            return carpainter[0]  # Return the first match
        else:
            frappe.throw(_("Carpainter not found for this user"))
    except Exception as e:
        frappe.log_error(f"Error in show_total_points: {str(e)}")
        return {"error": str(e)}
  
  
    
# get logged carpenter data-------------  
    
@frappe.whitelist()
def get_customer_details():
    logged_in_user = frappe.session.user
    user_info = frappe.get_doc("User", logged_in_user)
    user_mobile_no = user_info.mobile_no
    # Fetch Customer document based on the email
    customer = frappe.get_all("Customer", filters={"mobile_number": user_mobile_no}, fields=["name", "total_points","mobile_number","current_points","redeem_points","city","first_name","full_name","last_name"])
    if customer:
        return customer[0]  # Return the first match
    else:
        frappe.throw(_("Customer not found for this email"))
        
        
        
        

# update carpainter points-----------
@frappe.whitelist()
def update_customer_points(points):
    logged_in_user = frappe.session.user
    user_info = frappe.get_doc("User", logged_in_user)
    user_mobile_no = user_info.mobile_no

    try:
        # Convert points to integer
        points = int(points)
    except ValueError:
        frappe.throw(_("Invalid points value"))

    # Fetch the customer record using the mobile number
    customer = frappe.get_list("Customer", filters={'mobile_number': user_mobile_no}, fields=['name', 'total_points','current_points'])
    if not customer:
        frappe.throw(_("Customer not found"))

    # Assuming there's only one customer with this mobile number
    customer_doc = frappe.get_doc("Customer", customer[0].name)

    # Update the total points
    customer_doc.total_points  += points
    customer_doc.current_points += points
    customer_doc.save()

    return {"success": True}



# update carpainter product table ----- 

@frappe.whitelist()
def update_carpainter_points(product_name, points):
    try:
        logged_in_user = frappe.session.user
        user_info = frappe.get_doc("User", logged_in_user)
        user_mobile_no = user_info.mobile_no

        # Fetch the Carpainter record using the mobile number
        carpainter = frappe.get_list("Customer", filters={'mobile_number': user_mobile_no}, fields=['name'])

        if not carpainter:
            frappe.throw(_("Carpainter not found"))

        # Assuming there's only one Carpainter with this mobile number
        carpainter_doc = frappe.get_doc("Customer", carpainter[0].name)

        # Add points to point_history child table
        carpainter_doc.append("point_history", {
            "doctype": "Carpainter Product Detail",
            "product_name": product_name,
            "earned_points": points,
            "date": nowdate()
        })

        # Save the Carpainter document
        carpainter_doc.save()

        return {"success": True}

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), f"Error in update_carpainter_points: {e}")
        return {"error": f"Server error: {e}"}


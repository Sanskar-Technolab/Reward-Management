from __future__ import unicode_literals
import frappe
from frappe import _
from datetime import datetime
from frappe.utils import nowdate



# get carpainter data with child table------
# @frappe.whitelist(allow_guest=True)
# def get_carpainter_data():
#     try:
#         logged_in_user = frappe.session.user
#         user_info = frappe.get_doc("User", logged_in_user)
#         user_mobile_no = user_info.mobile_no
        
#         if not user_mobile_no:
#             return {"status": "failed", "message": "Mobile number not found for logged-in user."}

#         carpainters = frappe.get_list(
#             "Customer",
#             filters={"mobile_number": user_mobile_no},
#             fields=["name", "first_name", "full_name", "last_name", "city", "total_points", "mobile_number", "current_points", "redeem_points", "email"]
#         )

#         for carpainter in carpainters:
#             # Fetch child table data for each Carpainter
#             point_history = frappe.get_all(
#                 "Customer Product Detail",
#                 filters={"parent": carpainter["name"]}, 
#                 fields=["earned_points", "date", "product_name", "product", "product_category","product_image","gift_id","gift_product_name","deduct_gift_points"],
#                 order_by="creation desc"
#             )
            
#             # Format the date for each entry in point_history
#             for point in point_history:
#                 if point.get('date'):
#                     point['date'] = frappe.utils.formatdate(point['date'], 'dd-MM-yyyy')
            
#             carpainter["point_history"] = point_history

#         return {"status": "success", "data": carpainters}
    
#     except Exception as e:
#         frappe.logger().error(f"Error fetching Carpainter Registrations: {str(e)}")
#         return {"status": "failed", "message": str(e)}


#  show carpenter data with seprate earned points and product image 
@frappe.whitelist()
def get_carpainter_data(user):
    try:
        user_info = frappe.get_doc("User", user)

        if not user_info:
            return {"success": False, "status": "failed", "message": "User not found."}

        user_data = {
            "name": user_info.name,
            "email": user_info.email,
            "full_name": user_info.full_name,
            "mobile_no": user_info.mobile_no,
            "role": [role.role for role in user_info.roles]
        }

        user_mobile_no = user_info.mobile_no

        if not user_mobile_no:
            return {"success": False, "status": "failed", "message": "Mobile number not found for user."}

        carpainters = frappe.get_list(
            "Customer",
            filters={"mobile_number": user_mobile_no},
            fields=[
                "name", "first_name", "full_name", "last_name", "city", "total_points",
                "mobile_number", "current_points", "redeem_points", "email"
            ]
        )

        carpainter_data = []

        for carpainter in carpainters:
            carpainter_fields = {
                "name": carpainter["name"],
                "first_name": carpainter["first_name"],
                "full_name": carpainter["full_name"],
                "last_name": carpainter["last_name"],
                "city": carpainter["city"],
                "total_points": carpainter["total_points"],
                "mobile_number": carpainter["mobile_number"],
                "current_points": carpainter["current_points"],
                "redeem_points": carpainter["redeem_points"],
                "email": carpainter["email"],
            }

            # Full point history
            point_history = frappe.get_all(
                "Customer Product Detail",
                filters={"parent": carpainter["name"]}, 
                fields=[
                    "earned_points", "date", "time", "product_name", "product", "product_category",
                    "product_image", "gift_id", "gift_product_name", "deduct_gift_points"
                ],
                order_by="creation desc"
            )

            # Format date
            for point in point_history:
                if point.get('date'):
                    point['date'] = frappe.utils.formatdate(point['date'], 'dd-MM-yyyy')

            # Filtered point history: Only records where earned_points, product_image, and product are not null
            # point_details = [
            #     {
            #         "earned_points": p["earned_points"],
            #         "product": p["product"],
            #         "product_image": p["product_image"]
            #     }
            #     for p in point_history
            #     if p.get("earned_points") and p.get("product_image") and p.get("product")
            # ]
            point_details = []

            for point in point_history:
                if point.get("earned_points") or point.get("product_image") or point.get("product"):
                    point_details.append({
                        "earned_points": point["earned_points"],
                        "product": point["product"],
                        "product_image": point["product_image"]
                    })

            carpainter_fields["point_history"] = point_history
            carpainter_fields["point_details"] = point_details

            carpainter_data.append(carpainter_fields)

        return {
            "success": True,
            "status": "success",
            "login_user_data": user_data,
            "carpainter_data": carpainter_data
        }

    except Exception as e:
        frappe.logger().error(f"Error in carpenter data: {str(e)}")
        return {"success": False, "status": "failed", "message": str(e)}

  
# @frappe.whitelist()
# def get_carpainter_data(user):
#     try:
#         # Fetch user information
#         user_info = frappe.get_doc("User", user)

#         if not user_info:
#             return {"success":False,"status": "failed", "message": "User not found."}

#         # Prepare user data
#         user_data = {
#             "name": user_info.name,
#             "email": user_info.email,
#             "full_name": user_info.full_name,
#             "mobile_no": user_info.mobile_no,
#             "role": [role.role for role in user_info.roles]  # Extract role names
#         }

#         # Extract mobile number from user
#         user_mobile_no = user_info.mobile_no

#         if not user_mobile_no:
#             return {"success":False,"status": "failed", "message": "Mobile number not found for user."}

#         # Fetch carpainter/customer details
#         carpainters = frappe.get_list(
#             "Customer",
#             filters={"mobile_number": user_mobile_no},
#             fields=[
#                 "name", "first_name", "full_name", "last_name", "city", "total_points",
#                 "mobile_number", "current_points", "redeem_points", "email"
#             ]
#         )

#         carpainter_data = []

#         # Process carpainter data
#         for carpainter in carpainters:
#             carpainter_fields = {
#                 "name": carpainter["name"],
#                 "first_name": carpainter["first_name"],
#                 "full_name": carpainter["full_name"],
#                 "last_name": carpainter["last_name"],
#                 "city": carpainter["city"],
#                 "total_points": carpainter["total_points"],
#                 "mobile_number": carpainter["mobile_number"],
#                 "current_points": carpainter["current_points"],
#                 "redeem_points": carpainter["redeem_points"],
#                 "email": carpainter["email"],
#             }

#             # Fetch child table data (point history)
#             point_history = frappe.get_all(
#                 "Customer Product Detail",
#                 filters={"parent": carpainter["name"]}, 
#                 fields=[
#                     "earned_points", "date","time","product_name", "product", "product_category",
#                     "product_image", "gift_id", "gift_product_name", "deduct_gift_points"
#                 ],
#                 order_by="creation desc"
#             )

#             # Format date in point history
#             for point in point_history:
#                 if point.get('date'):
#                     point['date'] = frappe.utils.formatdate(point['date'], 'dd-MM-yyyy')

#             carpainter_fields["point_history"] = point_history
#             carpainter_data.append(carpainter_fields)

#         # Return combined response
#         return {
#             "success":True,
#             "status": "success",
#             "login_user_data": user_data,
#             "carpainter_data": carpainter_data
#         }

#     except Exception as e:
#         frappe.logger().error(f"Error in carpenter data: {str(e)}")
#         return {"success":False,"status": "failed", "message": str(e)}

    
# Show Total Points and Available Points------ 
@frappe.whitelist()
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
            carpenter_data =carpainter[0]
            return {
                "success":True,
                "message":carpenter_data}
        else:
            return {"success":False,"message":"Customer not found for this user"}

            # frappe.throw(_("Carpainter not found for this user"))
    except Exception as e:
        frappe.log_error(f"Error in show_total_points: {str(e)}")
        return {"success":False,"error": str(e)}
  
  
    
# get logged carpenter data-------------  
@frappe.whitelist()
def get_customer_details():
    logged_in_user = frappe.session.user
    user_info = frappe.get_doc("User", logged_in_user)
    user_mobile_no = user_info.mobile_no
    
    # Fetch Customer document based on the mobile number
    customer = frappe.get_all(
        "Customer",
        filters={"mobile_number": user_mobile_no},
        fields=["name", "total_points", "mobile_number", "current_points", 
                "redeem_points", "city", "first_name", "full_name", "last_name"]
    )
    
    if customer:
        customer_data = customer[0]  # Get the first match
        return {
            "success":True,
            "name": customer_data.get("name"),
            "total_points": customer_data.get("total_points"),
            "mobile_number": customer_data.get("mobile_number"),
            "current_points": customer_data.get("current_points"),
            "redeem_points": customer_data.get("redeem_points"),
            "city": customer_data.get("city"),
            "first_name": customer_data.get("first_name"),
            "full_name": customer_data.get("full_name"),
            "last_name": customer_data.get("last_name"),
        }
    else:
        return {"success": False, "message": "Customer not found for this mobile number"}

    
# @frappe.whitelist(allow_guest=True)
# def get_customer_details():
#     logged_in_user = frappe.session.user
#     user_info = frappe.get_doc("User", logged_in_user)
#     user_mobile_no = user_info.mobile_no
#     # Fetch Customer document based on the email
#     customer = frappe.get_all("Customer", filters={"mobile_number": user_mobile_no}, fields=["name", "total_points","mobile_number","current_points","redeem_points","city","first_name","full_name","last_name"])
#     if customer:
#         return customer[0]  # Return the first match
#     else:
#         return {"success": False,"message":"Customer not found for this email"}

        # frappe.throw(_("Customer not found for this email"))
        
        
        
        
        
        

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
            return {"success": False,"message":"Invalid points value"}

        # frappe.throw(_("Invalid points value"))

    # Fetch the customer record using the mobile number
    customer = frappe.get_list("Customer", filters={'mobile_number': user_mobile_no}, fields=['name', 'total_points','current_points'])
    if not customer:
         return {"success": False,"message":"Customer not found"}
        # frappe.throw(_("Customer not found"))

    # Assuming there's only one customer with this mobile number
    customer_doc = frappe.get_doc("Customer", customer[0].name)

    # Update the total points
    customer_doc.total_points  += points
    customer_doc.current_points += points
    customer_doc.save()

    return {"success": True,
            "message":"update customer points successfully."
            }



# update customer points into the point history table ----- 

@frappe.whitelist()
def update_carpainter_points(product_name, points,earned_amount):
    try:
        logged_in_user = frappe.session.user
        user_info = frappe.get_doc("User", logged_in_user)
        user_mobile_no = user_info.mobile_no
        
           # Ensure points and earned_amount are of correct type (int or float)
        points = float(points)  # or float(points) depending on your needs
        earned_amount = float(earned_amount)

        # Fetch the Carpainter record using the mobile number
        carpainter = frappe.get_list("Customer", filters={'mobile_number': user_mobile_no}, fields=['name'])

        if not carpainter:
            return {"success": False,"message":"Customer not found"}

            # frappe.throw(_("Carpainter not found"))

        # Assuming there's only one Carpainter with this mobile number
        carpainter_doc = frappe.get_doc("Customer", carpainter[0].name)

        # Add points to point_history child table
        carpainter_doc.append("point_history", {
            "doctype": "Carpainter Product Detail",
            "product_name": product_name,
            "earned_points": points,
            "earned_amount":earned_amount,
            "date": nowdate(),
            "time":frappe.utils.now_datetime().strftime('%H:%M:%S'),
        })

        # Save the Carpainter document
        carpainter_doc.save()

        return {"success": True,
                "message":"Customer Point Update Successfully."}

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), f"Error in Updating Customer Points: {e}")
        return {"success":False,"error": f"Server error: {e}"}


from __future__ import unicode_literals
import frappe
from frappe import _
from datetime import datetime
from frappe.utils import now, format_datetime,now_datetime




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
# @frappe.whitelist()
# def get_carpainter_data(user):
#     try:
#         user_info = frappe.get_doc("User", user)

#         if not user_info:
#             return {"success": False, "status": "failed", "message": "User not found."}

#         user_data = {
#             "name": user_info.name,
#             "email": user_info.email,
#             "full_name": user_info.full_name,
#             "mobile_no": user_info.mobile_no,
#             "role": [role.role for role in user_info.roles]
#         }

#         user_mobile_no = user_info.mobile_no

#         if not user_mobile_no:
#             return {"success": False, "status": "failed", "message": "Mobile number not found for user."}

#         carpainters = frappe.get_list(
#             "Customer",
#             filters={"mobile_number": user_mobile_no},
#             fields=[
#                 "name", "first_name", "full_name", "last_name", "city", "total_points",
#                 "mobile_number", "current_points", "redeem_points", "email"
#             ]
#         )

#         carpainter_data = []

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

#             # Full point history
#             point_history = frappe.get_all(
#                 "Customer Product Detail",
#                 filters={"parent": carpainter["name"]}, 
#                 fields=[
#                     "earned_points", "date", "time", "product_name", "product", "product_category",
#                     "product_image", "gift_id", "gift_product_name", "deduct_gift_points"
#                 ],
#                 order_by="creation desc"
#             )

#             # Format date
#             for point in point_history:
#                 if point.get('date'):
#                     point['date'] = frappe.utils.formatdate(point['date'], 'dd-MM-yyyy')

#             # Filtered point history: Only records where earned_points, product_image, and product are not null
#             # point_details = [
#             #     {
#             #         "earned_points": p["earned_points"],
#             #         "product": p["product"],
#             #         "product_image": p["product_image"]
#             #     }
#             #     for p in point_history
#             #     if p.get("earned_points") and p.get("product_image") and p.get("product")
#             # ]
#             point_details = []

#             for point in point_history:
#                 if point.get("earned_points") or point.get("product_image") or point.get("product"):
#                     point_details.append({
#                         "earned_points": point["earned_points"],
#                         "product": point["product"],
#                         "product_image": point["product_image"]
#                     })

#             carpainter_fields["point_history"] = point_history
#             carpainter_fields["point_details"] = point_details

#             carpainter_data.append(carpainter_fields)

#         return {
#             "success": True,
#             "status": "success",
#             "login_user_data": user_data,
#             "carpainter_data": carpainter_data
#         }

#     except Exception as e:
#         frappe.logger().error(f"Error in carpenter data: {str(e)}")
#         return {"success": False, "status": "failed", "message": str(e)}

  
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
            customer_id = carpainter["name"]
            carpainter_fields = carpainter.copy()

            # Fetch Customer Product Point Detail
            product_point_history = frappe.get_all(
                "Customer Product Point Detail",
                filters={"customer_id": customer_id},
                fields=[
                    "earned_points", "date", "time", "product_name", "product_id", "product_category", "product_image"
                ],
                order_by="creation desc"
            )

            for point in product_point_history:
                point["date"] = frappe.utils.formatdate(point.get("date"), "dd-MM-yyyy") if point.get("date") else None
                point["type"] = "product"

            # Fetch Customer Gift Point Details
            gift_point_history = frappe.get_all(
                "Customer Gift Point Details",
                filters={"customer_id": customer_id},
                fields=[
                    "deduct_gift_points", "date", "time", "gift_product_name", "gift_id","notes"
                ],
                order_by="creation desc"
            )

            for point in gift_point_history:
                point["date"] = frappe.utils.formatdate(point.get("date"), "dd-MM-yyyy") if point.get("date") else None
                point["type"] = "gift"

            # Combine both point histories
            point_history = []

            for point in product_point_history:
                point_history.append({
                    "type": "product",
                    "earned_points": point["earned_points"],
                    "product_name": point["product_name"],
                    "product_id": point["product_id"],
                    "product_category": point["product_category"],
                    "product_image": point["product_image"],
                    "date": point["date"],
                    "time": point["time"]
                })

            for point in gift_point_history:
                point_history.append({
                    "type": "gift",
                    "deduct_gift_points": point["deduct_gift_points"],
                    "gift_product_name": point["gift_product_name"],
                    "gift_id": point["gift_id"],
                    "date": point["date"],
                    "time": point["time"],
                    "notes": point["notes"]  # Include notes if available
                })

            # Optional: sort combined point history by date and time
            point_history.sort(key=lambda x: (x.get("date") or "", x.get("time") or ""), reverse=True)

            # Attach to carpainter data
            carpainter_fields["point_history"] = point_history
            carpainter_fields["point_details"] = product_point_history

            carpainter_data.append(carpainter_fields)

        return {
            "success": True,
            "status": "success",
            "login_user_data": user_data,
            "carpainter_data": carpainter_data
        }

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Error in get_carpainter_data")
        return {"success": False, "status": "failed", "message": str(e)}


    
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

# @frappe.whitelist()
# def update_carpainter_points(product_name, points,earned_amount):
#     try:
#         logged_in_user = frappe.session.user
#         user_info = frappe.get_doc("User", logged_in_user)
#         user_mobile_no = user_info.mobile_no
        
#            # Ensure points and earned_amount are of correct type (int or float)
#         points = float(points)  # or float(points) depending on your needs
#         earned_amount = float(earned_amount)

#         # Fetch the Carpainter record using the mobile number
#         carpainter = frappe.get_list("Customer", filters={'mobile_number': user_mobile_no}, fields=['name'])

#         if not carpainter:
#             return {"success": False,"message":"Customer not found"}

#             # frappe.throw(_("Carpainter not found"))

#         # Assuming there's only one Carpainter with this mobile number
#         carpainter_doc = frappe.get_doc("Customer", carpainter[0].name)

#         # Add points to point_history child table
#         carpainter_doc.append("point_history", {
#             "doctype": "Carpainter Product Detail",
#             "product_name": product_name,
#             "earned_points": points,
#             "earned_amount":earned_amount,
#             "date": nowdate(),
#             "time":frappe.utils.now_datetime().strftime('%H:%M:%S'),
#         })

#         # Save the Carpainter document
#         carpainter_doc.save()

#         return {"success": True,
#                 "message":"Customer Point Update Successfully."}

#     except Exception as e:
#         frappe.log_error(frappe.get_traceback(), f"Error in Updating Customer Points: {e}")
#         return {"success":False,"error": f"Server error: {e}"}


# update customer point with create new customer point detail document----------------
@frappe.whitelist()
def update_carpainter_points(product_name, points, earned_amount):
    try:
        logged_in_user = frappe.session.user
        user_info = frappe.get_doc("User", logged_in_user)
        user_mobile_no = user_info.mobile_no

        # Convert to float to ensure valid numeric values
        points = float(points)
        earned_amount = float(earned_amount)

        # Fetch the Customer (Carpainter) record using the mobile number
        carpainter = frappe.get_list("Customer", filters={'mobile_number': user_mobile_no}, fields=['name'])

        if not carpainter:
            return {"success": False, "message": "Customer not found"}

        customer_id = carpainter[0].name

        # Create a new Customer Product Point Detail document
        new_point_doc = frappe.get_doc({
            "doctype": "Customer Product Point Detail",
            "customer_id": customer_id,
            "product_id": product_name,
            "earned_points": points,
            "earned_amount": earned_amount,
            "date": frappe.utils.nowdate(),
            "time": frappe.utils.now_datetime().strftime('%H:%M:%S'),
        })

        new_point_doc.insert(ignore_permissions=True) 

        return {
            "success": True,
            "message": "Customer Point Updated Successfully."
        }

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), f"Error in Updating Customer Points: {e}")
        return {"success": False, "error": f"Server error: {e}"}



# # create new customer product point details from point history table----------------
# @frappe.whitelist(allow_guest=False)
# def create_customer_product_point_details(docname):
#     try:
#         customer = frappe.get_doc("Customer", docname)
#         created_docs = []
#         now = frappe.utils.now_datetime()

#         for row in customer.point_history:
#             if not row.product_name:
#                 continue

#             doc = frappe.get_doc({
#                 "doctype": "Customer Product Point Detail",
#                 "customer_id": customer.name,
#                 "product_id": row.product_name,
#                 "product_name": row.product,
#                 "product_image": row.product_image,
#                 "earned_points": row.earned_points,
#                 "earned_amount": row.earned_amount,
#                 "date": row.date,
#                 "time": row.time ,
#                 "product_category": row.product_category
#             })

#             doc.insert(ignore_permissions=True)
#             created_docs.append(doc.name)

#         return {
#             "success": True,
#             "message": f"{len(created_docs)} Customer Product Point Detail document(s) created.",
#             "created_docs": created_docs
#         }

#     except Exception as e:
#         frappe.log_error(frappe.get_traceback(), "Customer Product Point Detail Creation Error")
#         return {
#             "success": False,
#             "message": f"Error: {str(e)}"
#         }


# # Create new Customer Gift Point Details from point_history table
# @frappe.whitelist(allow_guest=False)
# def create_customer_gift_product_point_details(docname):
#     try:
#         customer = frappe.get_doc("Customer", docname)
#         created_docs = []

#         for row in customer.point_history:
#             if not row.gift_id:
#                 continue  # Skip the row instead of breaking the loop

#             doc = frappe.get_doc({
#                 "doctype": "Customer Gift Point Details",
#                 "customer_id": customer.name,
#                 "gift_id": row.gift_id,
#                 "gift_product_name": row.gift_product_name,
#                 "deduct_gift_points": row.deduct_gift_points,
#                 "date": row.date,
#                 "time": row.time,
#                 "gift_image": row.gift_image
#             })

#             doc.insert(ignore_permissions=True)
#             created_docs.append(doc.name)

#         return {
#             "success": True,
#             "message": f"{len(created_docs)} Customer Gift Product Point Detail document(s) created.",
#             "created_docs": created_docs
#         }

#     except Exception as e:
#         frappe.log_error(frappe.get_traceback(), "Customer Gift Product Point Detail Creation Error")
#         return {
#             "success": False,
#             "message": f"Error: {str(e)}"
#         }

# Create new Customer Product and Gift Point Details from point_history table
@frappe.whitelist(allow_guest=False)
def create_customer_point_details(docname):
    try:
        customer = frappe.get_doc("Customer", docname)
        product_point_docs = []
        gift_point_docs = []

        for row in customer.point_history:
            # Create Customer Product Point Detail if product info is present
            if row.product_name:
                product_doc = frappe.get_doc({
                    "doctype": "Customer Product Point Detail",
                    "customer_id": customer.name,
                    "product_id": row.product_name,
                    "product_name": row.product,
                    "product_image": row.product_image,
                    "earned_points": row.earned_points,
                    "earned_amount": row.earned_amount,
                    "date": row.date,
                    "time": row.time,
                    "product_category": row.product_category
                })
                product_doc.insert(ignore_permissions=True)
                product_point_docs.append(product_doc.name)

            # Create Customer Gift Point Detail if gift info is present
            if row.gift_id:
                gift_doc = frappe.get_doc({
                    "doctype": "Customer Gift Point Details",
                    "customer_id": customer.name,
                    "gift_id": row.gift_id,
                    "gift_product_name": row.gift_product_name,
                    "deduct_gift_points": row.deduct_gift_points,
                    "date": row.date,
                    "time": row.time,
                    "gift_image": row.gift_image
                })
                gift_doc.insert(ignore_permissions=True)
                gift_point_docs.append(gift_doc.name)

        return {
            "success": True,
            "message": f"{len(product_point_docs)} Product Point Detail(s) and {len(gift_point_docs)} Gift Point Detail(s) created.",
            "product_docs": product_point_docs,
            "gift_docs": gift_point_docs
        }

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Customer Point Detail Creation Error")
        return {
            "success": False,
            "message": f"Error: {str(e)}"
        }

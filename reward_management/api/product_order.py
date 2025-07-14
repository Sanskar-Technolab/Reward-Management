import frappe
from frappe.model.document import Document
from frappe import _ 
# from datetime import datetime
from frappe.utils import now_datetime,nowdate



# Create New Product Order --------------

# Create New Product Order --------------
@frappe.whitelist()
def create_new_product_order(product_name, fullname, city, mobile, pincode, address, email):
    if not mobile and not fullname:
        return {
            "success": False,
            "message": "Mobile number and full name are required."
        }
    
    try:
        # Fetch product_id from product_name
        product = frappe.get_value(
            "Gift Product", 
            {"gift_product_name": product_name}, 
            ["name", "points"], 
            as_dict=True
        )
    
        if not product:
            frappe.log_error("Product not found for the given name.")
            return {
                "success": False,
                "message": "Product not found for the given name."
            }
            
        product_id = product.name
        product_points = float(product.points or 0)
        
        # Fetch customer using mobile number
        customer = frappe.get_value(
            "Customer", 
            {"mobile_number": mobile}, 
            ["name", "total_points", "total_pending_order_points"], 
            as_dict=True
        )
        
        if not customer:
            frappe.log_error("Customer not found for the given mobile number.")
            return {
                "success": False,
                "message": "Customer not found for the given mobile number."
            }
            
        # Load full Customer document
        customer_doc = frappe.get_doc("Customer", customer.name)
        current_points = float(customer_doc.current_points or 0)
        current_pending_points = float(customer_doc.total_pending_order_points or 0)
        
        # Check if customer has enough available points
        available_points = current_points - current_pending_points

        if available_points < product_points:
            return {
                "success": False,
                "message": "Insufficient available points. Your pending request points and current request points together exceed your total available points."
            }
            
        # Get all pending product orders for the customer
        pending_orders = frappe.get_all(
            "Product Order",
            filters={
                "customer_id": customer.name, 
                "order_status": "Pending"
            },
            fields=["gift_points"]
        )
        
        # Calculate total points from pending orders
        total_pending_points = sum(float(order.get("gift_points", 0)) for order in pending_orders) if pending_orders else 0
        
        if (total_pending_points + product_points) > current_points:
            return {
                "success": False,
                "message": "Cannot order this product. Your pending request points and current request points together exceed your total available points."
            }
            
       
        
        # Create a new Product Order
        product_order = frappe.new_doc("Product Order")
        product_order.customer_id = customer.name
        product_order.product_id = product_id
        product_order.product_name = product_name
        product_order.full_name = fullname
        product_order.city = city
        product_order.mobile_number = mobile
        product_order.pincode = pincode
        product_order.address = address
        product_order.customer_email = email
        product_order.gift_points = product_points
        
        # Set received_date to the current datetime
        current_datetime = now_datetime()
        product_order.order_date = current_datetime.date()
        product_order.order_time = current_datetime.time().strftime('%H:%M:%S')
        product_order.order_status = "Pending"
        product_order.approved_time = ""
        
        # Save the document
        product_order.insert(ignore_permissions=True)

        # Update customer's pending points
        customer_doc.total_pending_order_points = current_pending_points + product_points
        customer_doc.save(ignore_permissions=True)
        
        # Return success message
        return {
            "status": "success", 
            "message": "Product Order created successfully.",
            "success": True
        }
    
    except Exception as e:
        # Log error and raise exception
        frappe.log_error(f"Error creating product order: {str(e)}", "Product Order Creation Error")
        return {
            "success": False,
            "status": "error", 
            "message": "Failed to create product order. Please try again later."
        }

# @frappe.whitelist()
# def create_new_product_order(product_name, fullname, city, mobile, pincode, address, email):
#     if not mobile and not fullname:
#         return{
#             "success": False,
#             "message": "Mobile number and full name are required."
#         }
#     try:
#         # Fetch product_id from product_name
    
#         product = frappe.db.get_value("Gift Product", {"gift_product_name": product_name}, ["name", "points"], as_dict=True)
    
#         if not product:
#             frappe.log_error("Product not found for the given name.")
#             return{
#                 "success": False,
#                 "message": "Product not found for the given name."
#             }
            
            
#         product_id = product.name
#         product_points =float(product.points or 0) 
           
        
#         # Fetch customer_id using mobile number (assumes customer exists)
        
#         customer_id = frappe.get_value("Customer", {"mobile_number": mobile}, ["name", "total_points", "total_pending_order_points"], as_dict=True)
#         if not customer_id:
#             frappe.log_error("Customer not found for the given mobile number.")
#             return {
#                 "success": False,
#                 "message": "Customer not found for the given mobile number."
#             }
            
#         # customer_id = customer.name
#         # current_pending_points = customer.total_pending_order_points or 0
        
#         # Load full Customer document
#         customer_doc = frappe.get_doc("Customer", customer_id)
#         current_points = float(customer_doc.current_points or 0)
#         current_pending_points = float(customer_doc.total_pending_order_points or 0)
        
#          # Check if customer has enough available points
#         available_points = current_points - current_pending_points

#         if available_points < product_points:
#             return {
#                 "success": False,
#                 "message": "Can not order this product. Your pending request points and current request points together exceed your total available points."
#             }
            
#         customer_doc.total_pending_order_points = current_pending_points + product_points
#         customer_doc.save(ignore_permissions=True)
        
#         product_order = frappe.get_value("Product Order",{"customer_id":customer_id.name, "order_status": "Pending"}, ["name","gift_points"])
        
#         total_order_points = sum(product_order, key=lambda x: x.get('gift_points', 0)) if product_order else 0
#         total_order_points = float(total_order_points)
        
#         if total_order_points > customer_id.current_points:
#             return {
#                 "success": False,
#                 "message": "Can not order this product. Your pending request points and current request points together exceed your total available points."
#             }

        
#         # Create a new instance of the Product Order document
#         product_order = frappe.new_doc("Product Order")
        
#         # Set values for the fields of the document
#         product_order.customer_id = customer_id.name
#         product_order.product_id = product_id
#         product_order.product_name = product_name
#         product_order.full_name = fullname
#         product_order.city = city
#         product_order.mobile_number = mobile
#         product_order.pincode = pincode
#         product_order.address = address
#         product_order.customer_email = email
#         # Set received_date to the current datetime
#         current_datetime = now_datetime()
#         product_order.order_date = current_datetime.date()
#         product_order.order_time = current_datetime.time().strftime('%H:%M:%S')
#         product_order.order_status = "Pending"
#         product_order.approved_time = ""
        

        
#         # Save the document
#         product_order.insert(ignore_permissions=True)
        
#         # Return success message
#         return {"status": "success", "message": ("Product Order created successfully.")}
    
#     except Exception as e:
#         # Log error and raise exception
#         frappe.log_error(f"Error creating product order: {str(e)}")
#         return {"success":False,"status": "error", "message": ("Failed to create product order. Please try again later.")}



# Update Product Order And Deduct Points from Customer Account amd Add Product Order History into Point History Table-----

@frappe.whitelist()
def update_product_order(product_name, order_status, name, gift_points, notes):
    try:
        current_user = frappe.session.user
        
        # Get current user's roles
        user_roles = frappe.get_roles(current_user)

        # Allow only Administrator or users with "Admin" role
        if current_user != "Administrator" and "Admin" not in user_roles:
            return error("Permission denied.")
            # return {"success": False, "message": "Permission denied"}
        
        # Fetch product order to ensure it exists
        order = frappe.get_doc("Product Order", name)
        if not order:
            return error("Product Order not found.")
            # return {"success": False, "status": "error", "message": "Product Order not found"}
        
        # Store previous status for status change checks
        previous_status = order.order_status
        print("previous_status\n\n\n\n\\n\n", previous_status)

        customer = frappe.get_doc("Customer", order.customer_id)
        current_points = float(customer.current_points or 0)
        gift_points = float(gift_points)

        # Set received_date to the current datetime
        current_datetime = now_datetime()

        # === Helpers ===
        def update_order_fields():
            order.product_name = product_name
            order.order_status = order_status
            order.gift_points = gift_points
            order.notes = notes
            order.approved_date = current_datetime.date()
            order.approved_time = current_datetime.strftime('%H:%M:%S')
            order.save()

        def create_gift_point_entry():
            entry = frappe.new_doc("Customer Gift Point Details")
            entry.update({
                "customer_id": order.customer_id,
                "customer_name": order.full_name,
                "gift_id": order.product_id,
                "gift_product_name": product_name,
                "deduct_gift_points": gift_points,
                "notes": notes,
                "date": nowdate(),
                "time": current_datetime.strftime('%H:%M:%S')
            })
            entry.save(ignore_permissions=False)

        def save_customer():
            customer.save(ignore_permissions=True)
            frappe.db.commit()


        # 1. Condition: Changing from Cancel to Approved---
        if order_status == "Approved" and previous_status == "Cancel":
            if gift_points > current_points: 
                return error("Customer Current Point Balance is not sufficient to approve this order.")

            
            # Deduct points from customer
            customer.current_points = float(customer.current_points or 0) - gift_points
            customer.redeem_points = float(customer.redeem_points or 0) + gift_points
            
            # Create gift point details record
            update_order_fields()
            create_gift_point_entry()
            # Save customer
            save_customer()
            # customer.save(ignore_permissions=False)
          

            return success("Product order approved successfully after cancellation.")
           

        # 2. Condition: Changing from Approved to Cancel
        elif order_status == "Cancel" and previous_status == "Approved":
            # Refund points to customer
            customer.current_points = float(customer.current_points or 0) + gift_points
            customer.redeem_points = float(customer.redeem_points or 0) - gift_points
            update_order_fields()
            save_customer()
            return success("Approved Product Order cancelled and points refunded successfully.")

        # 4. Condition: if alrerady Approved and trying to approve again 
        elif order_status == "Approved" and previous_status == "Approved":
            return error("Product Order is already approved.")

        # 5. Condition: For Approved Order----
            
        # Rest of your conditions (Approved and Cancel from Pending)...
        elif order_status == "Approved":
            if gift_points > current_points:
                return error("Customer Current Point Balance is not sufficient to approve this order.") 
               
            # Update pending points if they exist
            if customer.total_pending_order_points and customer.total_pending_order_points > 0:
                customer.total_pending_order_points = float(customer.total_pending_order_points or 0) - gift_points
            
            # Deduct points and add to redeemed
            customer.current_points = float(customer.current_points or 0) - gift_points
            customer.redeem_points = float(customer.redeem_points or 0) + gift_points
            
            # Create gift point details
            update_order_fields()
            create_gift_point_entry()
            save_customer()
            return success("Product Order approved successfully.")

        # 3. Condition: if alrerday Cancelled and trying to cancel again
        elif order_status == "Cancel" and previous_status == "Cancel":
            return error ("Product Order is already cancelled.")    

        # 6. Condition: For Cancelled Order----
        elif order_status == "Cancel":
            customer = frappe.get_doc("Customer", order.customer_id)
            if customer.total_pending_order_points and customer.total_pending_order_points > 0:
                customer.total_pending_order_points = float((customer.total_pending_order_points) - gift_points)
                update_order_fields()
                save_customer()
                return success("Product Order cancelled successfully.")
            else:
                return success("Product Order cancelled.")
               
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "update_product_order Error")
        return error(str(e))

# === Reusable Response Helpers ====
def success(message):
    return {"success": True, "status": "success", "message": message}

def error(message):
    return {"success": False, "status": "error", "message": message}

# @frappe.whitelist()
# def update_product_order(product_name, order_status, name, gift_points,notes):
#     try:
#         current_user = frappe.session.user
        
#          # Get current user's roles
#         user_roles = frappe.get_roles(current_user)

#         # Allow only Administrator or users with "Admin" role
#         if current_user != "Administrator" and "Admin" not in user_roles:
#             return {"success": False, "message": "Permission denied"}
#         # Fetch product order to ensure it exists
#         order = frappe.get_doc("Product Order", name)
#          # Store previous status for status change checks
#         previous_status = order.order_status
#         print("previous_status\n\n\n\n\\n\n", previous_status)

#         if not order:
#             return {"success":False,"status": "error", "message": "Product Order not found"}
        
#         customer = frappe.get_doc("Customer", order.customer_id)
#         current_points = float(customer.current_points or 0)
#         # get_customer_product_orders = frappe.get_list("Product Order", filters={"customer_id": order.customer_id, "order_status": ["Pending", "Cancel"]}, fields=["gift_points"])

#         # Convert gift_points to float for comparison
#         gift_points = float(gift_points)

       

#         # Set received_date to the current datetime
#         current_datetime = now_datetime()

#         # Update the Product Order with the new values
#         order.product_name = product_name
#         order.order_status = order_status
#         order.gift_points = gift_points
#         order.notes = notes
#         order.approved_date = current_datetime.date()  
#         order.approved_time = current_datetime.strftime('%H:%M:%S')  

         

#         # If order is approved, update the customer's points
#         if order_status == "Approved":
#             if gift_points > current_points: 
#                 return {"success":False, "status": "error", "message": "Customer Current Point Balance is not sufficient for approved this order."}
#             # Fetch the Customer record associated with the order
#             customer = frappe.get_doc("Customer", order.customer_id)

#             # Deduct points from the customer's current points and add to redeemed points
#             if customer.total_pending_order_points and customer.total_pending_order_points > 0:
#                 customer.total_pending_order_points = float((customer.total_pending_order_points or 0) - gift_points)
#             customer.current_points = customer.current_points - gift_points
#             customer.redeem_points = (customer.redeem_points or 0) + gift_points
            
#             # # Add points to point_history child table
#             # customer.append("point_history", {
#             #     "gift_id":order.product_id ,
#             #     "gift_product_name": order.product_name,
#             #     "deduct_gift_points": order.gift_points,
#             #     "date": nowdate(),
#             #     "time":frappe.utils.now_datetime().strftime('%H:%M:%S'),

#             # })
            
#             # create new gift point details record
#             gift_point_details = frappe.new_doc("Customer Gift Point Details")
#             gift_point_details.customer_id = order.customer_id
#             gift_point_details.customer_name = order.full_name
#             gift_point_details.gift_id = order.product_id
#             gift_point_details.gift_product_name = order.product_name
#             gift_point_details.deduct_gift_points = order.gift_points
#             gift_point_details.notes =  order.notes
#             gift_point_details.date = nowdate()
#             gift_point_details.time = current_datetime.strftime('%H:%M:%S')
#             gift_point_details.save(ignore_permissions=True)
#             # Add a message to indicate successful approval
#             message = f"Product Order approved successfully."



#             # Save the customer record
#             customer.save(ignore_permissions=False)

#             # Commit the transaction
#             frappe.db.commit()

#         elif order_status == "Cancel":
#             customer = frappe.get_doc("Customer", order.customer_id)
#             if customer.total_pending_order_points and customer.total_pending_order_points > 0:
#                 customer.total_pending_order_points = float((customer.total_pending_order_points) - gift_points)
#                 customer.save(ignore_permissions=True)
#                 frappe.db.commit()
#                 message = f"Product Order cancelled successfully."
#             else:
#                 message = "Product Order cancelled."

#          # Save the updated Product Order
#         order.save()


#         return {"success":True,"status": "success", "message":message}

#     except Exception as e:
#         frappe.log_error(frappe.get_traceback(), "update_product_order Error")
#         return {"success":False,"status": "error", "message": str(e)}



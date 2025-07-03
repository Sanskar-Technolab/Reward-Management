import frappe
from frappe.model.document import Document
from frappe import _ 
# from datetime import datetime
from frappe.utils import now_datetime,nowdate



# Create New Product Order --------------
@frappe.whitelist()
def create_new_product_order(product_name, fullname, city, mobile, pincode, address, email):
    if not mobile and not fullname:
        return{
            "success": False,
            "message": "Mobile number and full name are required."
        }
    try:
        # Fetch product_id from product_name
    
        product = frappe.db.get_value("Gift Product", {"gift_product_name": product_name}, ["name", "points"], as_dict=True)
    
        if not product:
            frappe.log_error(("Product not found for the given name."))
            return{
                "success": False,
                "message": "Product not found for the given name."
            }
            
            
        product_id = product.name
        product_points =float(product.points or 0) 
           
        
        # Fetch customer_id using mobile number (assumes customer exists)
        
        customer_id = frappe.get_value("Customer", {"mobile_number": mobile}, ["name", "total_points", "total_pending_order_points"], as_dict=True)
        if not customer_id:
            frappe.log_error("Customer not found for the given mobile number.")
            return {
                "success": False,
                "message": "Customer not found for the given mobile number."
            }
            
        # customer_id = customer.name
        # current_pending_points = customer.total_pending_order_points or 0
        
        # Load full Customer document
        customer_doc = frappe.get_doc("Customer", customer_id)
        current_points = float(customer_doc.current_points or 0)
        current_pending_points = float(customer_doc.total_pending_order_points or 0)
        
         # Check if customer has enough available points
        available_points = current_points - current_pending_points

        if available_points < product_points:
            return {
                "success": False,
                "message": "Can not order this product. Your pending request points and current request points together exceed your total available points."
            }
            
        customer_doc.total_pending_order_points = current_pending_points + product_points
        customer_doc.save(ignore_permissions=True)

        
        # Create a new instance of the Product Order document
        product_order = frappe.new_doc("Product Order")
        
        # Set values for the fields of the document
        product_order.customer_id = customer_id.name
        product_order.product_id = product_id
        product_order.product_name = product_name
        product_order.full_name = fullname
        product_order.city = city
        product_order.mobile_number = mobile
        product_order.pincode = pincode
        product_order.address = address
        product_order.customer_email = email
        # Set received_date to the current datetime
        current_datetime = now_datetime()
        product_order.order_date = current_datetime.date()
        product_order.order_time = current_datetime.time().strftime('%H:%M:%S')
        product_order.order_status = "Pending"
        product_order.approved_time = ""
        

        
        # Save the document
        product_order.insert(ignore_permissions=True)
        
        # Return success message
        return {"status": "success", "message": ("Product Order created successfully.")}
    
    except Exception as e:
        # Log error and raise exception
        frappe.log_error(f"Error creating product order: {str(e)}")
        return {"success":False,"status": "error", "message": ("Failed to create product order. Please try again later.")}



# Update Product Order And Deduct Points from Customer Account amd Add Product Order History into Point History Table-----
@frappe.whitelist()
def update_product_order(product_name, order_status, name, gift_points,notes):
    try:
        current_user = frappe.session.user
        
         # Get current user's roles
        user_roles = frappe.get_roles(current_user)

        # Allow only Administrator or users with "Admin" role
        if current_user != "Administrator" and "Admin" not in user_roles:
            return {"success": False, "message": "Permission denied"}
        # Fetch product order to ensure it exists
        order = frappe.get_doc("Product Order", name)

        if not order:
            return {"success":False,"status": "error", "message": "Product Order not found"}
        
        customer = frappe.get_doc("Customer", order.customer_id)
        current_points = float(customer.current_points or 0)
        # get_customer_product_orders = frappe.get_list("Product Order", filters={"customer_id": order.customer_id, "order_status": ["Pending", "Cancel"]}, fields=["gift_points"])

        # total_order_points = sum(get_customer_product_orders, key=lambda x: x.get('gift_points', 0))
        
        if order.gift_points > current_points:
            return {"success":False, "status": "error", "message": "Customer Current Point Balance is not sufficient for approved this order."}

        # Set received_date to the current datetime
        current_datetime = now_datetime()

        # Update the Product Order with the new values
        order.product_name = product_name
        order.order_status = order_status
        order.gift_points = gift_points
        order.notes = notes
        order.approved_date = current_datetime.date()  
        order.approved_time = current_datetime.strftime('%H:%M:%S')  

        # Save the updated Product Order
        order.save()

        # If order is approved, update the customer's points
        if order_status == "Approved":
            # Fetch the Customer record associated with the order
            customer = frappe.get_doc("Customer", order.customer_id)

            # Deduct points from the customer's current points and add to redeemed points
            customer.total_pending_order_points = (customer.total_pending_order_points or 0) - gift_points
            customer.current_points = customer.current_points - gift_points
            customer.redeem_points = (customer.redeem_points or 0) + gift_points
            
            # # Add points to point_history child table
            # customer.append("point_history", {
            #     "gift_id":order.product_id ,
            #     "gift_product_name": order.product_name,
            #     "deduct_gift_points": order.gift_points,
            #     "date": nowdate(),
            #     "time":frappe.utils.now_datetime().strftime('%H:%M:%S'),

            # })
            
            # create new gift point details record
            gift_point_details = frappe.new_doc("Customer Gift Point Details")
            gift_point_details.customer_id = order.customer_id
            gift_point_details.customer_name = order.full_name
            gift_point_details.gift_id = order.product_id
            gift_point_details.gift_product_name = order.product_name
            gift_point_details.deduct_gift_points = order.gift_points
            gift_point_details.notes =  order.notes
            gift_point_details.date = nowdate()
            gift_point_details.time = current_datetime.strftime('%H:%M:%S')
            gift_point_details.save(ignore_permissions=True)
            # Add a message to indicate successful approval
            message = f"Product Order approved successfully."



            # Save the customer record
            customer.save(ignore_permissions=True)

            # Commit the transaction
            frappe.db.commit()
        elif order_status == "Cancel":
            customer.total_pending_order_points = (customer.total_pending_order_points or 0) - gift_points
            frappe.db.commit()
            message = f"Product Order cancelled successfully."
            

        return {"success":True,"status": "success", "message":message}

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "update_product_order Error")
        return {"success":False,"status": "error", "message": str(e)}



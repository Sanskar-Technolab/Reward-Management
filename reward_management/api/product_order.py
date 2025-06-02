import frappe
from frappe.model.document import Document
from frappe import _ 
# from datetime import datetime
# from frappe.utils import nowdate
from frappe.utils import now_datetime
from frappe.utils import nowdate



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
        product_id = frappe.db.get_value("Gift Product", {"gift_product_name": product_name}, "name")
        
        if not product_id:
            frappe.throw(_("Product not found for the given name."))
        
        # Fetch customer_id using mobile number (assumes customer exists)
        customer_id = frappe.db.get_value("Customer", {"mobile_number": mobile}, "name")
        
        if not customer_id:
            frappe.throw(_("Customer not found for the given mobile number."))
        
        # Create a new instance of the Product Order document
        product_order = frappe.new_doc("Product Order")
        
        # Set values for the fields of the document
        product_order.customer_id = customer_id
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
        return {"status": "success", "message": _("Product Order created successfully.")}
    
    except Exception as e:
        # Log error and raise exception
        frappe.log_error(f"Error creating product order: {str(e)}")
        return {"status": "error", "message": _("Failed to create product order. Please try again later.")}



# Update Product Order And Deduct Points from Customer Account amd Add Product Order History into Point History Table-----
@frappe.whitelist()
def update_product_order(product_name, order_status, name, gift_points):
    try:
        # Fetch product order to ensure it exists
        order = frappe.get_doc("Product Order", name)

        if not order:
            return {"status": "error", "message": "Product Order not found"}

        # Set received_date to the current datetime
        current_datetime = now_datetime()

        # Update the Product Order with the new values
        order.product_name = product_name
        order.order_status = order_status
        order.gift_points = gift_points
        order.approved_date = current_datetime.date()  # Extract date
        order.approved_time = current_datetime.strftime('%H:%M:%S')  # Extract time in HH:MM:SS format

        # Save the updated Product Order
        order.save()

        # If order is approved, update the customer's points
        if order_status == "Approved":
            # Fetch the Customer record associated with the order
            customer = frappe.get_doc("Customer", order.customer_id)

            # Deduct points from the customer's current points and add to redeemed points
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
            frappe.db.commit()
            message = f"Product Order cancelled successfully."
            

        return {"status": "success", "message":message}

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "update_product_order Error")
        return {"status": "error", "message": str(e)}



import frappe
from frappe.model.document import Document
from frappe import _ 
from datetime import datetime
from frappe.utils import nowdate


# Create New Product Order --------------
@frappe.whitelist(allow_guest=True)
def create_new_product_order(product_name, fullname, city, mobile, pincode, address, email):
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
        product_order.order_date = nowdate()
        
        # Save the document
        product_order.insert(ignore_permissions=True)
        
        # Return success message
        return {"status": "success", "message": _("Product Order created successfully.")}
    
    except Exception as e:
        # Log error and raise exception
        frappe.log_error(f"Error creating product order: {str(e)}")
        return {"status": "error", "message": _("Failed to create product order. Please try again later.")}

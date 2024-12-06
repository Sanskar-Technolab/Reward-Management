import frappe
from frappe.model.document import Document
# Create New Product Order --------------
@frappe.whitelist(allow_guest=True)
def create_new_product_order():
     # Check if the Product Order already exists
     pass

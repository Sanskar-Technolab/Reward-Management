import frappe
from frappe.model.document import Document

@frappe.whitelist(allow_guest=True)
def get_gift_products():
    try:
        # Fetch all gift products
        gift_products = frappe.get_all(
            "Gift Product", 
            fields=["name", "gift_product_name", "points", "gift_detail","description","gift_specification"]
        )
        
        if gift_products:
            all_gift_products = []
            
            for product in gift_products:
                # Fetch related child table records
                gift_product_images = frappe.get_all(
                    "Product Gift Child Table", 
                    filters={"parent": product.get("name")}, 
                    fields=["gift_product_image"]
                )
                
                # Add the child table data to the product dictionary
                product["gift_product_images"] = gift_product_images
                
                # Append to the result list
                all_gift_products.append(product)
            
            # Return the complete data
            return {
                "status": "success", 
                "data": all_gift_products  # Include all fetched data in the response
            }
        else:
            return {
                "status": "success", 
                "data": [], 
                "message": "No gift products found"
            }
    except Exception as e:
        # Log error for debugging in Frappe error logs
        frappe.log_error(frappe.get_traceback(), "Get Gift Products Error")
        
        # Return error response
        return {
            "status": "error", 
            "message": str(e)
        }

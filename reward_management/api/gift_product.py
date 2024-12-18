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

# Add New Gift Product-------------
@frappe.whitelist(allow_guest=True)
def add_gift_product(new_image_url, giftproductName, giftproductDetails, giftproductDescription, points, giftproductSpecificaton):
    # Ensure the input is a list for new_image_url
    if not isinstance(new_image_url, list):
        frappe.throw(_("The 'new_image_url' parameter must be an array of image URLs."))

    # Create a new Gift Product document
    gift_doc = frappe.get_doc({
        "doctype": "Gift Product",
        "gift_product_name": giftproductName,
        "gift_detail": giftproductDetails,
        "description": giftproductDescription,
        "points": points,
        "gift_specification": giftproductSpecificaton
    })

    # Append images to the gift_product_image child table
    for image_url in new_image_url:
        gift_doc.append("gift_product_image", {
            "gift_product_image": image_url
        })

    # Save the document
    gift_doc.insert()  # Insert a new document if it doesn't exist
    frappe.db.commit()

    return {
        "status": "success",
        "message": "Gift product added successfully",
        "gift_product_name": giftproductName,
        "updated_images": new_image_url
    }


# gert match url gift details------
@frappe.whitelist(allow_guest=True)
def get_url_gift_products(url_name):
    try:
        # Fetch gift product where `name` matches `url_name`
        gift_products = frappe.get_all(
            "Gift Product", 
            filters={"name": url_name},  # Match `name` field with `url_name`
            fields=["name", "gift_product_name", "points", "gift_detail", "description", "gift_specification"]
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
                "data": all_gift_products
            }
        else:
            return {
                "status": "success", 
                "data": [], 
                "message": "No gift product found matching the given name"
            }
    except Exception as e:
        # Log error for debugging in Frappe error logs
        frappe.log_error(frappe.get_traceback(), "Get Gift Products Error")
        
        # Return error response
        return {
            "status": "error", 
            "message": str(e)
        }

import frappe
from frappe import _


@frappe.whitelist(allow_guest=True)
def get_all_products():
    try:
        # Fetch all products
        products = frappe.get_all("Product",
            fields=["name", "product_name", "reward_points", "discription", "qr_code" ,"product_image","category","product_price"],
            order_by="creation desc"
        )

        if products:
            all_products = []

            for product in products:
                # Fetch child table data (Product Image)
                product_images = frappe.get_all("Product Image",
                    filters={"parent": product.get("name")},  # Filter by parent product name
                    fields=["image"]  # Retrieve the image field from Product Image
                )

                # Prepare product details including child table data
                product_details = {
                    "product_id": product.get("name"),
                    "product_name": product.get("product_name"),
                    "reward_points": product.get("reward_points"),
                    "product_price":product.get("product_price"),
                    "discription": product.get("discription"),
                    "category":product.get("category"),
                    "qr_code": product.get("qr_code"),
                    "product_images": product.get("product_image")  # Initialize an empty list for images
                }

                # Append images from Product Image child table
                for image in product_images:
                    product_details["product_image"].append(image.get("image"))

                all_products.append(product_details)

            return all_products
        else:
            frappe.throw(_("No products found."))

    except Exception as e:
        frappe.throw(_("Error fetching products: {0}").format(str(e)))
        
        
        
# show product details and images 
@frappe.whitelist(allow_guest=True)
def get_all_products_data():
    try:
        # Fetch all products
        products = frappe.get_all("Product",
            fields=["name", "product_name", "reward_points", "discription", "product_image", "category","product_price"],
            order_by="creation desc"
        )

        if products:
            all_products = []

            for product in products:
                # Prepare product details including child table data
                product_details = {
                    "product_id": product.get("name"),
                    "product_name": product.get("product_name"),
                    "reward_points": product.get("reward_points"),
                    "product_price":product.get("product_price"),
                    "discription": product.get("discription"),
                    "category": product.get("category"),
                    "product_image": product.get("product_image")  # Initialize an empty list for images
                }

                all_products.append(product_details)

            return all_products  # Return the list of products

        else:
            frappe.throw(_("No products found."))

    except Exception as e:
        frappe.throw(_("Error fetching products: {0}").format(str(e)))


@frappe.whitelist(allow_guest=True)
def update_product(product_id, product_name, reward_points):
    try:
        # Fetch the product by its name (which is the `name` field)
        product = frappe.get_doc("Product", product_id)
        
        # Update fields of the product
        product.product_name = product_name
        product.reward_points = reward_points
        
        # Save the updated product
        product.save()
        frappe.db.commit()
        
        return {"status": "success", "message": "Product updated successfully"}
    
    except Exception as e:
        return {"status": "error", "message": f"Error updating product: {str(e)}"}
    
    
    
# Product total count 
@frappe.whitelist(allow_guest=True)
def total_product():
    # Fetch count of customers from database
    total_products = frappe.db.count("Product")

    return total_products

# five new product details

@frappe.whitelist(allow_guest=True)
def get_five_new_products():
    try:
        # Fetch all products
        products = frappe.get_all("Product",
            fields=["name", "product_name", "reward_points", "discription", "qr_code" ,"product_image","category"],
            order_by="creation desc", limit=5
        )

        if products:
            all_products = []

            for product in products:
                # Fetch child table data (Product Image)
                product_images = frappe.get_all("Product Image",
                    filters={"parent": product.get("name")},  # Filter by parent product name
                    fields=["image"]  # Retrieve the image field from Product Image
                )

                # Prepare product details including child table data
                product_details = {
                    "product_id": product.get("name"),
                    "product_name": product.get("product_name"),
                    "category":product.get("category"),
                    "reward_points": product.get("reward_points"),
                    "discription": product.get("discription"),
                    "qr_code": product.get("qr_code"),
                    "product_images": product.get("product_image")  # Initialize an empty list for images
                }

                # Append images from Product Image child table
                for image in product_images:
                    product_details["product_image"].append(image.get("image"))

                all_products.append(product_details)

            return all_products
        else:
            frappe.throw(_("No products found."))

    except Exception as e:
        frappe.throw(_("Error fetching products: {0}").format(str(e)))
        
        
        
        
        

# find match product_name product qr list----
@frappe.whitelist(allow_guest=True)
def get_all_product_qr():
    # Fetch all Product QR documents
    product_qr_docs = frappe.get_all("Product QR", fields=["name", "product_name"])
    return product_qr_docs

@frappe.whitelist(allow_guest=True)
def get_product_details(product_id):
    if not product_id:
        frappe.throw(_("Product ID is required"))

    product = frappe.get_doc("Product", product_id)

    if not product:
        frappe.throw(_("Product not found"))

    product_details = {
        "product_id": product.name,
        "product_name": product.product_name,
        "category": product.category,
        "description": product.discription,
        "product_images": product.product_image
    }

    return {"message": product_details}

# Add New Category ------
@frappe.whitelist(allow_guest=True)
def add_category(productCategory):
    try:
        productcategory=frappe.new_doc("Product Category")
        productcategory.category_name = productCategory
        
           # Save the Product document
        productcategory.insert(ignore_permissions=True)

        # Return success message
        return {"success": True, "message": _("Product Category added successfully.")}

    except Exception as e:
        # Log error and raise exception
        frappe.log_error(f"Error adding product category: {str(e)}")
        frappe.throw(_("Failed to add product category. Please try again later."))

# Add New Product--------
@frappe.whitelist(allow_guest=True)
def add_product(productName, productPrice, rewardPoints, discription, productCategory,productImage=None):
    try:
        # Create a new instance of the Product document
        product = frappe.new_doc("Product")
        product.product_name = productName
        product.reward_points = rewardPoints
        product.product_price=productPrice
        product.discription = discription
        product.category=productCategory

        # If product image file is provided, save it as an attachment
        if productImage:
            product.product_image = productImage  # Attach file_url to product_image field

        # Save the Product document
        product.insert(ignore_permissions=True)

        # Return success message
        return {"success": True, "message": _("Product added successfully.")}

    except Exception as e:
        # Log error and raise exception
        frappe.log_error(f"Error adding product: {str(e)}")
        frappe.throw(_("Failed to add product. Please try again later."))


@frappe.whitelist(allow_guest=True)
def upload_file():
    try:
        # Example: Retrieving file from FormData
        file = frappe.request.files.get('file')
        if not file:
            frappe.throw('No file attached.')

        # Example: Saving file using save_file function
        file_url = save_file(file.filename, file.stream, 'reward_management', 'Product')

        # Return success response with file_url
        return {
            'status': 'OK',
            'message': {
                'file_url': file_url
            }
        }

    except Exception as e:
        frappe.log_error(f'Error uploading file: {str(e)}')
        frappe.throw('Failed to upload file. Please try again later.')




@frappe.whitelist(allow_guest=True)
def get_tableproduct_detail(product_id=None):
    if not product_id:
        frappe.throw(_("Product ID is required"))

    try:
        product = frappe.get_doc("Product", product_id)
        frappe.log_error(frappe.as_json(product.as_dict()), "Product Details")
        
        return {
            "message": {
                "product_id": product.name,
                "product_name": product.product_name,
                "category": getattr(product, 'category', ''),
                "discription": getattr(product, 'discription', ''),
                "reward_points": getattr(product, 'reward_points', 0),
                "product_price":getattr(product,'product_price',0),
                "product_image": getattr(product, 'product_image', '')
            }
        }
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "get_tableproduct_detail Error")
        frappe.throw(_("An error occurred while fetching product details."))
        
        
        
        
# customer product details cards-----------
# Edit Product Details API-------
@frappe.whitelist(allow_guest=True)
def get_product_detail(product_id):
    if not product_id:
        frappe.throw(_("Product ID is required"))

    product = frappe.get_doc("Product", product_id)

    if not product:
        frappe.throw(_("Product not found"))

    product_details = {
        "product_id": product.name,
        "product_name": product.product_name,
        "category": product.category,
        "description": product.discription,
        "reward_points":product.reward_points,
        "product_price":product.product_price,
        "product_images": product.product_image
    }

    return {"message": product_details}

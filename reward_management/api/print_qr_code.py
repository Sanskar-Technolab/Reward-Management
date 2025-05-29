import frappe
from frappe.utils import now, format_datetime,now_datetime
from frappe.model.document import Document, bulk_insert
from frappe.utils.file_manager import remove_file
import requests
from io import BytesIO
from PIL import Image
import hashlib
from datetime import datetime
import time


# @frappe.whitelist()
# def print_qr_code():
#     # Fetch fields from the Product QR document
#     qr_docs = frappe.get_all("Product QR", fields=["name", "product_name", "quantity"])

#     # Fetch child table data linked with qr_table field for each Product QR document
#     for qr_doc in qr_docs:
#         qr_doc['qr_table_data'] = frappe.get_all("Product QR Table",
#                                                  filters={"parent": qr_doc['name']},
#                                                  fields=["product_table_name", "qr_code_image", "product_qr_id", "points","generated_date","generated_time","scanned","product_qr_name","carpenter_id","redeem_date"])
#         # Format date fields as dd-MM-yyyy
#         for qr_data in qr_doc['qr_table_data']:
#             if qr_data.get('generated_date'):
#                 qr_data['generated_date'] = frappe.utils.formatdate(qr_data['generated_date'], 'dd-MM-yyyy')
#             if qr_data.get('redeem_date'):
#                 qr_data['redeem_date'] = frappe.utils.formatdate(qr_data['redeem_date'], 'dd-MM-yyyy')

#     return qr_docs

@frappe.whitelist()
def print_qr_code_data(limit_start=None, limit_page_length=None):
    # Fetch fields from the Product QR document
    qr_docs = frappe.get_all("QR Data", fields=["name","product_qr", "product_table_name", "qr_code_image", "product_qr_id", "points","generated_date","generated_time","scanned","product_qr_name","carpenter_id","redeem_date"],
    limit_start=limit_start,
    limit_page_length=limit_page_length)
    for qr_data in qr_docs:
            if qr_data.get('generated_date'):
                qr_data['generated_date'] = frappe.utils.formatdate(qr_data['generated_date'], 'dd-MM-yyyy')
            if qr_data.get('redeem_date'):
                qr_data['redeem_date'] = frappe.utils.formatdate(qr_data['redeem_date'], 'dd-MM-yyyy')

    return qr_docs



# @frappe.whitelist()
# def create_product_qr(product_name, quantity):
#     try:
#         quantity = int(quantity)
#         # Check if a Product QR document already exists for the given product_name
#         existing_product_qr = frappe.db.exists("Product QR", {"product_name": product_name})

#         if existing_product_qr:
#             # If a document already exists, retrieve it
#             product_qr_doc = frappe.get_doc("Product QR", existing_product_qr)
#         else:
#             # Otherwise, create a new Product QR document
#             product_qr_doc = frappe.new_doc("Product QR")
#             product_qr_doc.product_name = product_name
#             product_qr_doc.quantity = quantity
#             product_qr_doc.insert()
#             product_qr_doc.reload()

#         # Get the current date and time using frappe.utils.now()
#         current_datetime = now()
#         current_datetime_obj = datetime.strptime(current_datetime, "%Y-%m-%d %H:%M:%S.%f")

#         # Get the timestamp value from the datetime object
#         timestamp_value = current_datetime_obj.timestamp()
#         current_date = format_datetime(current_datetime, "yyyy-MM-dd") 
#         current_time = format_datetime(current_datetime, "HH:mm:ss")
        
#         # Fetch reward_points from Product master
#         # Assuming product_name is the unique identifier
#         product_details = frappe.get_doc("Product", product_name)  
#         # Default to 0 if not found
#         reward_points = product_details.reward_points if product_details else 0  
        
#         # Add new rows based on the quantity requested
#         for i in range(quantity):
#             child_row = product_qr_doc.append("qr_table", {})

#             # # Generate a unique 8-digit numeric hash value
            
#             # Generate a unique numeric hash value
                    
#             hash_input = f"{timestamp_value}_{product_name}_{i}"
#             product_qr_id = int(hashlib.md5(hash_input.encode()).hexdigest(), 16) % 100000000

#             # Ensure the hash does not start with zero
#             while str(product_qr_id).startswith("0"):
#                 # Regenerate the hash by modifying the input
#                 hash_input += "_1"
#                 product_qr_id = int(hashlib.md5(hash_input.encode()).hexdigest(), 16) % 100000000

#             # Assign the QR ID directly (without leading zeroes or spaces)
#             child_row.product_qr_id = str(product_qr_id)  # Direct assignment as a string
#             child_row.product_table_name = product_name
#             child_row.generated_date = current_date
#             child_row.generated_time = current_time

#             # Set the points value from the Product master
#             child_row.points = reward_points  

#             # Generate QR code using the API with product_name and product_qr_id concatenated
#             qr_content = f"{product_qr_doc.name}_{product_name}_{child_row.product_qr_id}"
#             qr_api_url = f"https://api.qrserver.com/v1/create-qr-code/?data={qr_content}&size=100x75"
#             # qr_api_url = f"https://api.qrserver.com/v1/create-qr-code/?data={qr_content}&size=30x30"

#             response = requests.get(qr_api_url)

#             if response.status_code == 200:
#                 # Save QR code image to File Manager
#                 file_name = f"{child_row.product_qr_id}.png"
#                 qr_image_bytes = BytesIO(response.content)
#                 qr_image = Image.open(qr_image_bytes)

#                 # Save the image to File Manager
#                 file_doc = frappe.get_doc({
#                     "doctype": "File",
#                     "file_name": file_name,
#                     "attached_to_doctype": "Product QR",
#                     "attached_to_name": product_qr_doc.name,
#                     "file_url": "/files/" + file_name,
#                     "content": qr_image_bytes.getvalue(),
#                     "is_private": 0  # Set to 1 if you want it private
#                 })
#                 file_doc.insert(ignore_permissions=True)

#                 # Update qr_code_image field in child table row
#                 child_row.qr_code_image = "/files/" + file_name  # Update with file URL

#             else:
#                 print(f"Failed to generate QR code for 'product_qr_id: {child_row.product_qr_id}'")

#             # Set qr_content value into product_qr_name
#             child_row.product_qr_name = qr_content

#         # Update the quantity field with the new count
#         product_qr_doc.quantity = len(product_qr_doc.qr_table)

#         # Save the product QR document with all its child rows
#         product_qr_doc.save(ignore_permissions=True)
#         frappe.db.commit()

#         return {
#             "success": True,
#             "message": f"Product QR created successfully with name: {product_qr_doc.name}"
#         }
#     except Exception as e:
#         frappe.log_error(frappe.get_traceback(), "create_product_qr")
#         return {
#             "success": False,
#             "message": str(e)
#         }

@frappe.whitelist()
def create_product_qr(product_name, quantity):
    try:
        
        quantity = int(quantity)
        current_datetime = now()
        current_datetime_obj = datetime.strptime(current_datetime, "%Y-%m-%d %H:%M:%S.%f")
        current_date = format_datetime(current_datetime, "yyyy-MM-dd")
        current_time = format_datetime(current_datetime, "HH:mm:ss")

        # Get reward points from Product
        product_doc = frappe.get_doc("Product", product_name)
        reward_points = product_doc.reward_points if product_doc else 0

        # Reuse existing Product QR if exists
        existing_qr = frappe.get_all(
            "Product QR",
            filters={"product_name": product_name},
            fields=["name"],
            order_by="creation desc",
            limit=1
        )

        if existing_qr:
            product_qr_doc = frappe.get_doc("Product QR", existing_qr[0].name)
            product_qr_doc.quantity += quantity
            product_qr_doc.save(ignore_permissions=True)
        else:
            product_qr_doc = frappe.new_doc("Product QR")
            product_qr_doc.product_name = product_name
            product_qr_doc.quantity = quantity
            product_qr_doc.insert()
            product_qr_doc.reload()

        for i in range(quantity):
            # Ensure uniqueness of product_qr_id
            unique = False
            attempt = 0
            product_qr_id = None

            while not unique:
                hash_input = f"{time.time_ns()}_{product_name}_{product_qr_doc.name}_{i}_{attempt}"
                hash_value = hashlib.md5(hash_input.encode()).hexdigest()
                product_qr_id = int(hash_value, 16) % 100000000  # 8-digit numeric ID

                # Ensure ID doesn't start with 0 and is unique in DB
                if not str(product_qr_id).startswith("0") and not frappe.db.exists("QR Data", {"product_qr_id": str(product_qr_id)}):
                    unique = True
                else:
                    attempt += 1

            # Build QR content
            qr_content = f"{product_qr_doc.name}_{product_name}_{product_qr_id}"
            qr_api_url = f"https://api.qrserver.com/v1/create-qr-code/?data={qr_content}&size=100x75"

            # Fetch QR image
            response = requests.get(qr_api_url)
            file_url = ""
            if response.status_code == 200:
                file_name = f"{product_qr_id}.png"
                qr_image_bytes = BytesIO(response.content)
                file_doc = frappe.get_doc({
                    "doctype": "File",
                    "file_name": file_name,
                    "attached_to_doctype": "QR Data",
                    "attached_to_name": qr_content,
                    "file_url": f"/files/{file_name}",
                    "content": qr_image_bytes.getvalue(),
                    "is_private": 0
                })
                file_doc.insert(ignore_permissions=True)
                file_url = f"/files/{file_name}"

            # Create QR Data entry
            qr_data_doc = frappe.new_doc("QR Data")
            qr_data_doc.product_qr = product_qr_doc.name
            qr_data_doc.product_qr_id = str(product_qr_id)
            qr_data_doc.product_table_name = product_name
            qr_data_doc.generated_date = current_date
            qr_data_doc.generated_time = current_time
            qr_data_doc.points = reward_points
            qr_data_doc.qr_code_image = file_url
            qr_data_doc.product_qr_name = qr_content
            qr_data_doc.insert()

        frappe.db.commit()

        return {
            "success": True,
            "message": f"{quantity} QR codes generated for product: {product_name}"
        }

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "create_product_qr")
        return {
            "success": False,
            "message": str(e)
        }

        
# qr code with child table rows limitation-----------------------------
# @frappe.whitelist()
# def create_product_qr(product_name, quantity):
#     try:
#         current_datetime = now()
#         current_datetime_obj = datetime.strptime(current_datetime, "%Y-%m-%d %H:%M:%S.%f")
#         timestamp_value = current_datetime_obj.timestamp()
#         current_date = format_datetime(current_datetime, "yyyy-MM-dd")
#         current_time = format_datetime(current_datetime, "HH:mm:ss")

#         # Get reward points from Product
#         product_doc = frappe.get_doc("Product", product_name)
#         reward_points = product_doc.reward_points if product_doc else 0

#         # Check for existing Product QR with same product_name
#         existing_qr_docs = frappe.get_all(
#             "Product QR",
#             filters={"product_name": product_name},
#             fields=["name"],
#             order_by="creation desc"
#         )

#         product_qr_doc = None
#         current_count = 0

#         if existing_qr_docs:
#             existing_name = existing_qr_docs[0].name
#             doc = frappe.get_doc("Product QR", existing_name)
#             current_count = len(doc.qr_table)
#             if current_count < 10:
#                 product_qr_doc = doc  # Use existing doc if child table is < 100

#         # If no doc or full, create new
#         if not product_qr_doc:
#             product_qr_doc = frappe.new_doc("Product QR")
#             product_qr_doc.product_name = product_name
#             product_qr_doc.quantity = 0
#             product_qr_doc.insert()
#             product_qr_doc.reload()

#         for i in range(quantity):
#             if len(product_qr_doc.qr_table) >= 100:
#                 # Save current full doc and create a new one
#                 product_qr_doc.quantity = len(product_qr_doc.qr_table)
#                 product_qr_doc.save(ignore_permissions=True)

#                 product_qr_doc = frappe.new_doc("Product QR")
#                 product_qr_doc.product_name = product_name
#                 product_qr_doc.quantity = 0
#                 product_qr_doc.insert()
#                 product_qr_doc.reload()

#             child_row = product_qr_doc.append("qr_table", {})

#             hash_input = f"{timestamp_value}_{product_name}_{product_qr_doc.name}_{i}"
#             product_qr_id = int(hashlib.md5(hash_input.encode()).hexdigest(), 16) % 100000000
#             while str(product_qr_id).startswith("0"):
#                 hash_input += "_1"
#                 product_qr_id = int(hashlib.md5(hash_input.encode()).hexdigest(), 16) % 100000000

#             qr_content = f"{product_qr_doc.name}_{product_name}_{product_qr_id}"
#             qr_api_url = f"https://api.qrserver.com/v1/create-qr-code/?data={qr_content}&size=100x75"

#             response = requests.get(qr_api_url)
#             file_url = ""
#             if response.status_code == 200:
#                 file_name = f"{product_qr_id}.png"
#                 qr_image_bytes = BytesIO(response.content)
#                 file_doc = frappe.get_doc({
#                     "doctype": "File",
#                     "file_name": file_name,
#                     "attached_to_doctype": "Product QR",
#                     "attached_to_name": product_qr_doc.name,
#                     "file_url": "/files/" + file_name,
#                     "content": qr_image_bytes.getvalue(),
#                     "is_private": 0
#                 })
#                 file_doc.insert(ignore_permissions=True)
#                 file_url = "/files/" + file_name

#             child_row.product_qr_id = str(product_qr_id)
#             child_row.product_table_name = product_name
#             child_row.generated_date = current_date
#             child_row.generated_time = current_time
#             child_row.points = reward_points
#             child_row.qr_code_image = file_url
#             child_row.product_qr_name = qr_content

#         # Final save of the last doc
#         product_qr_doc.quantity = len(product_qr_doc.qr_table)
#         product_qr_doc.save(ignore_permissions=True)

#         frappe.db.commit()

#         return {
#             "success": True,
#             "message": f"{quantity} QR codes generated for product: {product_name}"
#         }

#     except Exception as e:
#         frappe.log_error(frappe.get_traceback(), "create_product_qr")
#         return {
#             "success": False,
#             "message": str(e)
#         }

        
# show qr-code-images------- 
@frappe.whitelist()
def print_qr_code_images(product_name):
    try:
        qr_images = []

        # Fetch Product QR documents matching the product_name
        qr_docs = frappe.get_all("Product QR", filters={"product_name": product_name},
                                 fields=["name", "product_name", "quantity"])

        # Fetch child table data linked with qr_table field for each Product QR document
        for qr_doc in qr_docs:
            qr_table_data = frappe.get_all("Product QR Table", filters={"parent": qr_doc['name']},
                                           fields=["product_table_name", "qr_code_image", "product_qr_id", "points"])

            # Append QR code image URLs to qr_images list
            for row in qr_table_data:
                file_url = frappe.utils.get_files_path(row.qr_code_image)  
                qr_images.append({
                    "product_id": qr_doc.get("product_id"),  # Assuming product_id exists in Product QR
                    "qr_code_image": row.qr_code_image
                })

        return qr_images

    except Exception as e:
        frappe.log_error(f"Error fetching QR code images: {e}")
        return []
    


# # count total qr code points-------
# @frappe.whitelist(allow_guest=True)
# def total_points_of_qr_code():
#     # Fetch fields from the Product QR document
#     qr_docs = frappe.get_all("Product QR", fields=["name", "product_name", "quantity"])

#     total_points = 0  # Initialize total points counter

#     # Fetch child table data linked with qr_table field for each Product QR document
#     for qr_doc in qr_docs:
#         qr_doc['qr_table_data'] = frappe.get_all("Product QR Table",
#                                                  filters={"parent": qr_doc['name']},
#                                                  fields=["product_table_name", "qr_code_image", "product_qr_id", "points", "generated_date"])
        
#         # Calculate the total points for this Product QR document
#         for row in qr_doc['qr_table_data']:
#             total_points += row.get('points', 0)

#     # Return the QR docs and total points
#     return {
#         "qr_docs": qr_docs,
#         "total_points": total_points
#     }



@frappe.whitelist()
def get_product_by_name(productName):
    if not productName:
        return {"message": "Product name is required."}

    # Fetch Product QR documents by product name
    product_qr_docs = frappe.get_all("Product QR", filters={"product_name": productName}, fields=["name", "product_name"])

    if not product_qr_docs:
        return {"message": "No products found with the given name."}

    # Initialize dictionaries to store counts and data by date and time
    counts_by_date_time = {}
    qr_data_by_date_time = {}

    # Fetch child table data linked with qr_table field for each Product QR document
    for product_qr_doc in product_qr_docs:
        qr_table_data = frappe.get_all("Product QR Table",
                                       filters={"parent": product_qr_doc['name']},
                                       fields=["product_table_name", "qr_code_image", "product_qr_id", "points", "generated_date", "generated_time"],
                                       order_by="generated_date desc, generated_time desc")

        # Ensure qr_table_data is populated
        product_qr_doc['qr_table_data'] = qr_table_data

        # Format date fields as dd-MM-yyyy
        for qr_data in qr_table_data:
            if qr_data.get('generated_date'):
                formatted_date = frappe.utils.formatdate(qr_data['generated_date'], 'dd-MM-yyyy')
                
                # Extract hour and minute from generated_time (which is timedelta)
                generated_time = qr_data['generated_time']
                if generated_time:
                    # Calculate total seconds to extract hours and minutes
                    total_seconds = int(generated_time.total_seconds())
                    hours, remainder = divmod(total_seconds, 3600)
                    minutes, _ = divmod(remainder, 60)
                    formatted_time = f"{hours:02}:{minutes:02}"  # Format as HH:MM
                else:
                    continue  # Skip if time is not available

                # Create a combined key for counts based on formatted date and only hour and minute
                date_time_key = f"{formatted_date} {formatted_time}"

                # Count QR codes by generated date and time
                if date_time_key in counts_by_date_time:
                    counts_by_date_time[date_time_key] += 1
                else:
                    counts_by_date_time[date_time_key] = 1

                # Group QR data by generated date and time
                if date_time_key in qr_data_by_date_time:
                    qr_data_by_date_time[date_time_key].append({
                        "product_name": product_qr_doc['product_name'],
                        "qr_code_image": qr_data['qr_code_image'],
                        "points": qr_data['points']
                    })
                else:
                    qr_data_by_date_time[date_time_key] = [{
                        "product_name": product_qr_doc['product_name'],
                        "qr_code_image": qr_data['qr_code_image'],
                        "points": qr_data['points']
                    }]

    # Prepare formatted data with unique date-time keys, total counts, and QR code images
    formatted_data = []
    for date_time_key, qr_data_list in qr_data_by_date_time.items():
        total_count = counts_by_date_time.get(date_time_key, 0)
        formatted_date, formatted_time = date_time_key.split(' ', 1) 
        formatted_data.append({
            "generated_date": formatted_date,
            "generated_time": formatted_time,
            "total_product": total_count,
            "qr_code_images": qr_data_list
        })

    return {"message": formatted_data}





@frappe.whitelist()
def get_product_qr_by_name(productName):
    if not productName:
        return {"message": "Product name is required."}

    # Fetch QR Data documents filtered by product_table_name
    qr_data_list = frappe.get_all(
        "QR Data",
        filters={"product_table_name": productName},
        fields=[
            "name", "product_qr", "product_table_name", "qr_code_image",
            "product_qr_id", "points", "generated_date", "generated_time"
        ],
        order_by="generated_date desc, generated_time desc"
    )

    if not qr_data_list:
        return {"message": "No QR data found for the given product name."}

    # Initialize dictionaries
    counts_by_date_time = {}
    qr_data_by_date_time = {}

    for qr_data in qr_data_list:
        if qr_data.get('generated_date'):
            formatted_date = frappe.utils.formatdate(qr_data['generated_date'], 'dd-MM-yyyy')

            generated_time = qr_data.get('generated_time')
            if generated_time:
                total_seconds = int(generated_time.total_seconds())
                hours, remainder = divmod(total_seconds, 3600)
                minutes, _ = divmod(remainder, 60)
                formatted_time = f"{hours:02}:{minutes:02}"
            else:
                continue  # Skip if time is not available

            date_time_key = f"{formatted_date} {formatted_time}"

            # Count QR codes by date and time
            counts_by_date_time[date_time_key] = counts_by_date_time.get(date_time_key, 0) + 1

            # Group QR data
            qr_entry = {
                "product_name": qr_data['product_table_name'],
                "qr_code_image": qr_data['qr_code_image'],
                "points": qr_data['points']
            }

            if date_time_key in qr_data_by_date_time:
                qr_data_by_date_time[date_time_key].append(qr_entry)
            else:
                qr_data_by_date_time[date_time_key] = [qr_entry]

    # Prepare final structured response
    formatted_data = []
    for date_time_key, qr_items in qr_data_by_date_time.items():
        total_count = counts_by_date_time.get(date_time_key, 0)
        formatted_date, formatted_time = date_time_key.split(' ', 1)
        formatted_data.append({
            "generated_date": formatted_date,
            "generated_time": formatted_time,
            "total_product": total_count,
            "qr_code_images": qr_items
        })

    return {"message": formatted_data}



# delete product qr doctype and child table records----------
# delete qr code records-------


@frappe.whitelist(allow_guest=True)
def delete_product_qr_child_records(docname):
    try:
        doc = frappe.get_doc("Product QR", docname)

        # Clear the 'qr_tabl' child table
        doc.qr_table = []

        # Save the document
        doc.save(ignore_permissions=True)
        # frappe.delete_doc("Product QR", docname, ignore_permissions=True)
        # frappe.db.delete("Product QR",docname, ignore_permissions=True)

        return {
            "status": "success",
            "message": f"Deleted all child records from 'qr_table' in {docname}"
        }
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Delete Product QR Child Records Error")
        return {
            "status": "error",
            "message": str(e)
        }
        
        
        

 
 # delete doctype---- 
@frappe.whitelist()
def delete_data(docname=None ,doctype=None):
    try:
        frappe.db.delete(doctype, docname)

        return {
            "status": "success",
            "message": f"Document '{docname}' has been deleted successfully."
        }
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Delete Product QR Error")
        return {
            "status": "error",
            "message": str(e)
        }

@frappe.whitelist(allow_guest=False)
def create_qr_data_from_qr_table(docname):
    try:
        product_qr = frappe.get_doc("Product QR", docname)
        created_qr_data = []
        now = now_datetime()

        bulk_values = []
        fields = [
            "name", "product_qr_name", "product_table_name", "product_qr_id", "qr_code_image",
            "points", "earned_amount", "generated_date", "generated_time", "carpenter_id",
            "redeem_date", "scanned", "product_qr",  "creation", "modified",
            "owner", "docstatus", "idx"
        ]

        for row in product_qr.qr_table:
            prefix = f"{row.product_qr_id}-"
            series_number = frappe.model.naming.getseries(prefix, 5)
            new_name = f"{prefix}{int(series_number):05d}"
            created_qr_data.append(new_name)

            bulk_values.append([
                new_name,
                row.product_qr_name,
                row.product_table_name,
                row.product_qr_id,
                row.qr_code_image,
                row.points,
                row.earned_amount,
                row.generated_date,
                row.generated_time,
                row.carpenter_id,
                row.redeem_date,
                row.scanned,
                product_qr.name,
                now,
                now,
                frappe.session.user,
                0,   # docstatus
                0    # idx
            ])

        if bulk_values:
            frappe.db.bulk_insert("QR Data", fields, bulk_values)

        return {
            "success": True,
            "message": f"{len(created_qr_data)} QR Data documents created.",
            "qr_data_created": created_qr_data
        }

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Create QR Data From QR Table Error")
        return {
            "success": False,
            "message": str(e)
        }

# @frappe.whitelist(allow_guest=False)
# def create_qr_data_from_qr_table(docname):
#     try:
#         product_qr = frappe.get_doc("Product QR", docname)
#         created_qr_data = []

#         for row in product_qr.qr_table:
#             qr_data = frappe.new_doc("QR Data")

#             # Copy fields from child table row
#             qr_data.product_qr_name = row.product_qr_name
#             qr_data.product_table_name = row.product_table_name
#             qr_data.product_qr_id = row.product_qr_id
#             qr_data.qr_code_image = row.qr_code_image
#             qr_data.points = row.points
#             qr_data.earned_amount = row.earned_amount
#             qr_data.generated_date = row.generated_date
#             qr_data.generated_time = row.generated_time
#             qr_data.carpenter_id = row.carpenter_id
#             qr_data.redeem_date = row.redeem_date
#             qr_data.scanned = row.scanned

#             # Additional fields
#             qr_data.product_qr = product_qr.name  # Link to parent Product QR
#             qr_data.product_name = product_qr.product_name  # From parent

#             qr_data.insert(ignore_permissions=True)
#             created_qr_data.append(qr_data.name)

#         frappe.db.commit()
#         return {
#             "success": True,
#             "message": f"{len(created_qr_data)} QR Data documents created.",
#             "qr_data_created": created_qr_data
#         }

#     except Exception as e:
#         frappe.log_error(frappe.get_traceback(), "Create QR Data From QR Table Error")
#         return {
#             "success": False,
#             "message": str(e)
#         }
    
    
    
@frappe.whitelist(allow_guest=False)
def get_duplicate_qr_table_entries(docname):
    from collections import defaultdict

    # Dictionary to count occurrences of each product_qr_id
    qr_id_count = defaultdict(list)

    # Fetch the child table records (qr_table) for the given Product QR docname
    children = frappe.get_all(
        "Product QR Table",  # Ensure this is your correct child table doctype name
        filters={"parent": docname, "parenttype": "Product QR"},
        fields=["name", "product_qr_id"]
    )

    # Iterate over child records and count occurrences of each product_qr_id
    for child in children:
        if child.product_qr_id:
            qr_id_count[child.product_qr_id].append(child.name)

    # Filter out product_qr_id values that appear more than once (duplicates)
    duplicates = {
        qr_id: entries
        for qr_id, entries in qr_id_count.items()
        if len(entries) > 1
    }

    return duplicates



@frappe.whitelist(allow_guest=False)
def get_duplicate_qr_data_table_entries():
    from collections import defaultdict

    # Dictionary to collect all entries per product_qr_id
    qr_id_count = defaultdict(list)

    # Fetch all QR Data records with name, product_qr_id, and product_table_name
    children = frappe.get_all(
        "QR Data",
        fields=["name", "product_qr_id", "product_table_name"],
    )

    # Map product_qr_id to their record details (name and product_table_name)
    for child in children:
        if child.product_qr_id:
            qr_id_count[child.product_qr_id].append({
                "name": child.name,
                "product_table_name": child.product_table_name
            })

    # Keep only those IDs that have more than one record (duplicates)
    duplicates = {
        qr_id: entries
        for qr_id, entries in qr_id_count.items()
        if len(entries) > 1
    }

    return duplicates




@frappe.whitelist()
def delete_product_qr_comments(reference_name):
    """
    Delete all comments for a specific Product QR document
    Args:
        reference_name (str): The Product QR document name (e.g., 'Product-QR--2024-00005')
    Returns:
        dict: Operation status and message
    """
    try:
        # Validate input
        if not reference_name or not isinstance(reference_name, str):
            return {
                "success": False,
                "message": "Invalid reference name provided"
            }

        # Verify document exists
        if not frappe.db.exists("Product QR", reference_name):
            return {
                "success": False,
                "message": f"Product QR document {reference_name} not found"
            }

        # Get count before deletion for reporting
        comment_count = frappe.db.count("Comment", {
            "reference_doctype": "Product QR",
            "reference_name": reference_name
        })

        if comment_count == 0:
            return {
                "success": True,
                "message": "No comments found to delete",
                "deleted_count": 0
            }

        # Perform deletion
        frappe.db.sql("""
            DELETE FROM `tabComment`
            WHERE `reference_doctype` = 'Product QR'
            AND `reference_name` = %s
        """, reference_name)

        frappe.db.commit()

        return {
            "success": True,
            "message": f"Successfully deleted {comment_count} comments",
            "deleted_count": comment_count
        }

    except Exception as e:
        frappe.db.rollback()
        frappe.log_error(
            title="Delete Product QR Comments Error",
            message=f"Error deleting comments for {reference_name}\n\n{frappe.get_traceback()}"
        )
        return {
            "success": False,
            "message": f"Failed to delete comments: {str(e)}"
        }
        
        
# delete attached files from product qr doctype
@frappe.whitelist()
def delete_attached_files(attached_to_name):
    try:
        if not frappe.db.exists("Product QR", attached_to_name):
            return {"success": False, "message": f"Product QR {attached_to_name} not found"}

        # Get file URLs before raw delete
        files = frappe.get_all("File", filters={
            "attached_to_doctype": "Product QR",
            "attached_to_name": attached_to_name
        }, fields=["name", "file_url", "is_private"])

        if not files:
            return {"success": True, "message": "No attached files found", "deleted_count": 0}

        # Delete physical files
        for file in files:
            try:
                remove_file(file.file_url, file.is_private)
            except Exception:
                frappe.log_error(frappe.get_traceback(), f"Failed to delete file: {file.file_url}")

        # Bulk raw delete
        file_names = [file.name for file in files]
        frappe.db.sql(
            "DELETE FROM `tabFile` WHERE name IN (%s)" % (", ".join(["%s"] * len(file_names))),
            tuple(file_names)
        )

        frappe.db.commit()
        return {
            "success": True,
            "message": f"Deleted {len(file_names)} attached files via raw SQL",
            "deleted_count": len(file_names)
        }

    except Exception as e:
        frappe.db.rollback()
        frappe.log_error(frappe.get_traceback(), "Delete Attached Files Error")
        return {"success": False, "message": f"Error: {str(e)}"}


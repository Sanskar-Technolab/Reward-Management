from __future__ import unicode_literals
import frappe
from datetime import datetime

# # Get Scanned QR From QR Images Details------
# @frappe.whitelist()
# def get_product_details_from_qr(decode_text):
#     try:
#         components = decode_text.strip().split('_')

#         if len(components) < 3:
#             return {"error": "Invalid QR code format"}
        
#         name = components[0]
#         product_table_name = components[1]
#         product_qr_id = components[2]

#         product_qr = frappe.get_doc("Product QR", name)
#         print(f"Retrieved Product QR Document: {product_qr}")

#         if not product_qr:
#             return {"success":False,"error": "No Product QR details found for the given QR"}

#         matched_row = None
#         row_number = 0  # Initialize row number

#         print("QR Table Data:")
#         for row in product_qr.qr_table:
#             row_number += 1
#             row_product_table_name = row.product_table_name  # Assuming this is a string
#             row_product_qr_id = row.product_qr_id  # Assuming this is an int

#             print(f"Checking row {row_number} (idx: {row.idx}): {row_product_table_name}, {row_product_qr_id}")

#             # Log the values being compared for debugging
#             print(f"Comparing '{row_product_table_name}' with '{product_table_name}' and '{row_product_qr_id}' with '{product_qr_id}'")
            
#             # Match the product_table_name and product_qr_id
#             # Convert row_product_qr_id to string for comparison
#             if row_product_table_name == product_table_name and str(row_product_qr_id) == product_qr_id:
#                 matched_row = row
#                 print(f"Match found in row number: {row_number}, idx: {row.idx}")  # Print matched row number
#                 break

#         if matched_row:
#             if matched_row.scanned:
#                 return {"success":False,"error": "This QR code already scanned."}

#             # Fetch the product_name
#             product_name = frappe.get_value("Product", {"name": matched_row.product_table_name}, "product_name")
#             if not product_name:
#                 return {"success": False,"error": "No Product QR details found for the given QR id"}

#             # Fetch payout_amount and reward_point from Reward Point Conversion Rate using product_name
#             reward_point_conversion_rate = frappe.get_all(
#                 "Reward Point Canversion Table",
#                 filters={"product_name": product_name},  # Match with product_name
#                 fields=["payout_amount", "reward_point", "from_date"],
#                 order_by="idx desc",
#                 limit=1
#             )

#             payout_amount = None
#             reward_point = None
#             earned_amount = None

#             # Only calculate reward-related data if conversion rate is found
#             if reward_point_conversion_rate:
#                 payout_amount = reward_point_conversion_rate[-1].payout_amount
#                 reward_point = reward_point_conversion_rate[-1].reward_point

#                 # Calculate earned_amount if payout_amount and reward_point are available
#                 if reward_point and payout_amount:
#                     earned_amount = (float(matched_row.points) / float(reward_point)) * float(payout_amount)
#                 else:
#                     earned_amount = 0

#             # Return details including matching row data, even if reward point conversion rate is not found
#             return {
#                 "message": "QR code scanned successfully",
#                 "success": True,
#                 "product_name": product_name,
#                 "product_table_name": matched_row.product_table_name,
#                 "product_qr_id": matched_row.product_qr_id,
#                 "points": matched_row.points,
#                 "qr_code_image": matched_row.qr_code_image,
#                 "scanned": matched_row.scanned,
#                 "row_number": row_number,
#                 "row_idx": matched_row.idx,
#                 "payout_amount": payout_amount,
#                 "reward_point": reward_point,
#                 "earned_amount": earned_amount
#             }

#         else:
#             return {"success": False,"error": "No Product QR details found for the given QR id"}

#     except Exception as e:
#         frappe.log_error(frappe.get_traceback(), f"No Product QR details found for the given QR id: {e}")
#         return {"success":False,"error": f"Server error: {e}"}

@frappe.whitelist()
def get_product_details_from_qr(decode_text):
    try:
        components = decode_text.strip().split('_')

        if len(components) < 3:
            return {"success": False, "error": "Invalid QR code format"}

        product_qr_name = components[0]
        product_table_name = components[1]
        qr_data_name = components[2]

        # Step 1: Check if Product QR document exists
        if not frappe.db.exists("Product QR", product_qr_name):
            return {"success": False, "error": "Product QR document not found"}

        # Step 2: Find the QR Data entry that matches both product_qr and name
        qr_data = frappe.get_all(
            "QR Data",
            filters={
                "product_qr_id": qr_data_name,
                "product_qr": product_qr_name
            },
            fields=[
                "name", "product_qr", "product_table_name", "product_qr_id",
                "points", "qr_code_image", "scanned", "carpenter_id",
                "redeem_date", "generated_date", "generated_time"
            ],
            order_by="generated_date desc, generated_time desc",
            limit=1
        )

        if not qr_data:
            return {"success": False, "error": "No matching QR Data found"}

        qr_data = qr_data[0]
        if qr_data.scanned:
            return {"success": False, "error": "This QR code is already scanned."}
        
        

        # Fetch the product_name using product_table_name
        product_name = frappe.get_value("Product", {"name": qr_data.product_table_name}, "product_name")
        if not product_name:
            return {"success": False, "error": "Product name not found"}

        # Get reward point conversion details
        reward_point_conversion = frappe.get_all(
            "Reward Point Canversion Table",
            filters={"product_name": product_name},
            fields=["payout_amount", "reward_point"],
            order_by="from_date desc",
            limit=1
        )

        payout_amount = reward_point = earned_amount = 0

        if reward_point_conversion:
            payout_amount = reward_point_conversion[0].payout_amount or 0
            reward_point = reward_point_conversion[0].reward_point or 0

            if float(payout_amount) > 0 and float(reward_point) > 0:
                earned_amount = (float(qr_data.points) / float(reward_point)) * float(payout_amount)
            else:
                earned_amount = 0

        return {
            "message": "QR code scanned successfully",
            "success": True,
            "product_name": product_name,
            "product_table_name": qr_data.product_table_name,
            "product_qr_id": qr_data.product_qr_id,
            "points": qr_data.points,
            "qr_code_image": qr_data.qr_code_image,
            "scanned": qr_data.scanned,
            "carpenter_id": qr_data.carpenter_id,
            "redeem_date": qr_data.redeem_date,
            "generated_date": qr_data.generated_date,
            "generated_time": qr_data.generated_time,
            "payout_amount": payout_amount,
            "reward_point": reward_point,
            "earned_amount": earned_amount
        }

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), f"QR Data Lookup Failed: {e}")
        return {"success": False, "error": f"Server error: {e}"}


# Update Product QR Scanned Table----------------

@frappe.whitelist()
def update_scanned_status(product_table_name, product_qr_id, carpenter_id):
    try:
        # Validate QR Data existence with correct linkage to Product QR
        qr_data = frappe.get_doc("QR Data", {'product_qr_id':product_qr_id})

        if not qr_data:
            return {"success": False, "error": "QR Data entry not found."}

        # Check if linked Product QR exists
        if not frappe.db.exists("Product QR", qr_data.product_qr):
            return {"success": False, "error": "Linked Product QR not found."}

        # Check if already scanned
        if qr_data.scanned:
            return {"success": False, "error": "This QR code has already been scanned."}

        # Check product_table_name match (optional for added verification)
        if qr_data.product_table_name != product_table_name:
            return {"success": False, "error": "Product table name mismatch."}

        # Fetch product_name from Product doctype
        product_name = frappe.get_value("Product", {"name": product_table_name}, "product_name")
        if not product_name:
            return {"success": False, "error": "Product not found."}

        # Fetch latest Reward Point Conversion Rate
        reward_point_conversion = frappe.get_all(
            "Reward Point Canversion Table",
            filters={"product_name": product_name},
            fields=["payout_amount", "reward_point"],
            order_by="from_date desc",
            limit=1
        )

        payout_amount = reward_point = earned_amount = None

        if reward_point_conversion:
            payout_amount = reward_point_conversion[0].payout_amount
            reward_point = reward_point_conversion[0].reward_point

        # Calculate earned amount
        if reward_point and payout_amount:
            earned_amount = (float(qr_data.points) / float(reward_point)) * float(payout_amount)

        # Update QR Data record
        qr_data.db_set("scanned", 1)
        qr_data.db_set("carpenter_id", carpenter_id)
        qr_data.db_set("redeem_date", frappe.utils.nowdate())

        if earned_amount is not None:
            qr_data.db_set("earned_amount", earned_amount)

        frappe.db.commit()

        return {
            "message": "QR code scanned and updated successfully.",
            "status": "updated successfully",
            "success": True,
            "earned_amount": earned_amount
        }

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), f"Error in Update QR Data Status: {e}")
        return {"success": False, "error": f"Server error: {e}"}

# @frappe.whitelist()
# def update_scanned_status(product_table_name, product_qr_id, carpenter_id):
#     try:
#         # Fetch all Product QR documents
#         product_qrs = frappe.get_all("Product QR", fields=["name"])

#         if product_qrs:
#             for product_qr in product_qrs:
#                 # Fetch child table data (qr_table) for each Product QR document
#                 qr_table_data = frappe.get_all("Product QR Table",
#                                                filters={"parent": product_qr.name,
#                                                         "product_table_name": product_table_name,
#                                                         "product_qr_id": product_qr_id},
#                                                fields=["name", "scanned", "carpenter_id", "redeem_date", "points"])

#                 if qr_table_data:
#                     # Assuming there's only one matching row, but you should handle multiple rows if needed
#                     row = qr_table_data[0]
                    
#                     # Check if QR code has already been scanned
#                     if row.get('scanned'):
#                         return {"success": False,"error": "This QR code has already been scanned."}
                    
#                     # Fetch product_name from Product document based on product_table_name
#                     product_name = frappe.get_value("Product", {"name": product_table_name}, "product_name")
#                     if not product_name:
#                         return {"success": False,"error": "Product not found for the given Product QR ID"}

#                     # Fetch Reward Point Conversion Rate (including from_date)
#                     reward_point_conversion_rate = frappe.get_all(
#                         "Reward Point Canversion Table",
#                         filters={"product_name": product_name},  # Match with product_name
#                         fields=["payout_amount", "reward_point", "from_date"],
#                         order_by="idx desc",
#                         limit=1
#                     )

#                     if reward_point_conversion_rate:
#                         payout_amount = reward_point_conversion_rate[-1].payout_amount
#                         reward_point = reward_point_conversion_rate[-1].reward_point
                       
#                     else:
#                         payout_amount = None
#                         reward_point = None
                        

#                     # Ensure redeem_date is not greater than from_date
#                     current_date = frappe.utils.nowdate()
#                     # Update scanned status, carpenter_id, and redeem_date
#                     frappe.db.set_value("Product QR Table", row['name'], "scanned", 1)
#                     frappe.db.set_value("Product QR Table", row['name'], "carpenter_id", carpenter_id)
#                     frappe.db.set_value("Product QR Table", row['name'], "redeem_date", current_date)

#                     # Calculate earned_amount
#                     if reward_point and payout_amount:
#                         earned_amount = (float(row['points']) / float(reward_point)) * float(payout_amount)
#                         frappe.db.set_value("Product QR Table", row['name'], "earned_amount", earned_amount)
#                     else:
#                         earned_amount = None

#                     frappe.db.commit()

#                     return {
#                         "message": " QR code scanned successfully.",
#                         "status":"update successfully",
#                         "success": True,
#                         "earned_amount": earned_amount  # Return earned amount
#                     }
#                 else:
#                     # If no matching row found in qr_table for this particular Product QR document
#                     continue

#             # If no matching Product QR document found
#             return {"success": False,"error": "No Product QR details found for the given QR id"}

#         else:
#             # If no Product QR documents found
#             return {"success": False,"error": "No Product QR details found for the given QR id"}

#     except Exception as e:
#         # Handle any exceptions and log errors
#         frappe.log_error(frappe.get_traceback(), f"Error in Update Product QR Status: {e}")
#         return {"error": f"Server error: {e}"}

# @frappe.whitelist()
# def get_product_details_from_qr_id(product_qr_id):
#     try:
#         if not product_qr_id:
#             return {"error": "Product QR ID is required."}
        
#         # Use Frappe ORM to find the matching row in the child table
#         product_qr_row = frappe.get_all(
#             "Product QR Table",
#             filters={"product_qr_id": product_qr_id},
#             fields=["parent", "product_table_name", "product_qr_id", "points", "qr_code_image", "scanned", "idx"],
#             limit=1
#         )
        
#         if not product_qr_row:
#             return {"error": "No Product QR details found for the given product_qr_id."}
        
#         matched_row = product_qr_row[0]

#         # Check if already scanned
#         if matched_row.get("scanned"):
#             return {"message": "This Product QR has already been scanned."}

#         # Fetch the Product QR document name
#         product_qr_doc_name = matched_row.get("parent")

#         # Fetch the product name
#         product_name = frappe.get_value("Product", {"name": matched_row["product_table_name"]}, "product_name")
#         if not product_name:
#             return {"error": "Product not found for the given product_table_name"}

#         # Fetch payout_amount and reward_point from Reward Point Conversion Rate
#         reward_point_conversion_rate = frappe.get_all(
#             "Reward Point Canversion Table",
#             filters={"product_name": product_name},
#             fields=["payout_amount", "reward_point", "from_date"],
#             order_by="idx desc",
#             limit=1
#         )
        
#         if not reward_point_conversion_rate:
#             return {"error": "No reward point conversion rate found for this product"}

#         payout_amount = reward_point_conversion_rate[-1]["payout_amount"]
#         reward_point = reward_point_conversion_rate[-1]["reward_point"]

#         # Calculate earned_amount
#         if reward_point and payout_amount:
#             earned_amount = (float(matched_row["points"]) / float(reward_point)) * float(payout_amount)
#         else:
#             earned_amount = None

#         # Return details
#         return {
#             "product_qr_doc_name": product_qr_doc_name,
#             "product_name": product_name,
#             "product_table_name": matched_row["product_table_name"],
#             "product_qr_id": matched_row["product_qr_id"],
#             "points": matched_row["points"],
#             "qr_code_image": matched_row["qr_code_image"],
#             "scanned": matched_row["scanned"],
#             "row_idx": matched_row["idx"],
#             "payout_amount": payout_amount,
#             "reward_point": reward_point,
#             "earned_amount": earned_amount
#         }

#     except Exception as e:
#         frappe.log_error(frappe.get_traceback(), f"Error in get_product_details_from_qr_id: {e}")
#         return {"error": f"Server error: {e}"}




# # Get QR Details From QR Code Number and if not added payment amount or payment amount table------------
@frappe.whitelist()
def get_product_details_from_qr_id(product_qr_id):
    try:
        if not product_qr_id:
            return {"success": False, "error": "Product QR ID is required."}

        # Fetch all QR Data records with the given product_qr_id
        qr_data_list = frappe.get_all(
            "QR Data",
            filters={"product_qr_id": product_qr_id},
            fields=["name", "product_qr", "product_table_name", "points", "qr_code_image",
                    "scanned", "carpenter_id", "redeem_date", "generated_date", "generated_time", "idx"],
            order_by="creation asc"
        )

        if not qr_data_list:
            return {"success": False, "error": "QR Code not found for the given QR ID."}

        # More than one entry found – handle duplicates
        if len(qr_data_list) > 1:
            unscanned = [qr for qr in qr_data_list if not qr.scanned]

            if not unscanned:
                return {"success": False, "message": "All Product QRs with this ID have already been scanned."}

            # Sort unscanned by creation (oldest first) and select the oldest unscanned
            qr_data = unscanned[0]

            # Check if the oldest one is the first created one
            if qr_data["name"] != qr_data_list[0]["name"]:
                return {
                    "success": False,
                    "message": "Please scan the older QR code first ."
                }
        else:
            qr_data = qr_data_list[0]
            if qr_data["scanned"]:
                return {"success": False, "message": "This Product QR has already been scanned."}

        # Ensure linked Product QR exists
        if not frappe.db.exists("Product QR", qr_data["product_qr"]):
            return {"success": False, "error": "Product QR not found."}

        # Get product name from Product doctype
        product_name = frappe.get_value("Product", {"name": qr_data["product_table_name"]}, "product_name")
        if not product_name:
            return {"success": False, "error": "Product not found for the given QR ID."}

        # Fetch the latest reward conversion rate
        reward_conversion = frappe.get_all(
            "Reward Point Canversion Table",
            filters={"product_name": product_name},
            fields=["payout_amount", "reward_point"],
            order_by="idx desc",
            limit=1
        )

        payout_amount = reward_point = earned_amount = 0

        if reward_conversion:
            payout_amount = reward_conversion[0].payout_amount or 0
            reward_point = reward_conversion[0].reward_point or 0

            if float(payout_amount) > 0 and float(reward_point) > 0:
                earned_amount = (float(qr_data["points"]) / float(reward_point)) * float(payout_amount)
            else:
                earned_amount = 0.0

        return {
            "success": True,
            "message": "Successfully retrieved QR Code details.",
            "product_qr_doc_name": qr_data["product_qr"],
            "product_name": product_name,
            "product_table_name": qr_data["product_table_name"],
            "product_qr_id": qr_data["name"],
            "points": qr_data["points"],
            "qr_code_image": qr_data["qr_code_image"],
            "scanned": qr_data["scanned"],
            "carpenter_id": qr_data["carpenter_id"],
            "redeem_date": qr_data["redeem_date"],
            "generated_date": qr_data["generated_date"],
            "generated_time": qr_data["generated_time"],
            "row_idx": qr_data["idx"],
            "payout_amount": payout_amount,
            "reward_point": reward_point,
            "earned_amount": earned_amount
        }

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), f"Error in Product QR ID Lookup: {e}")
        return {"success": False, "error": f"Server error: {e}"}


# @frappe.whitelist()
# def get_product_details_from_qr_id(product_qr_id):
#     try:
#         if not product_qr_id:
#             return {"success": False, "error": "Product QR ID is required."}

#         # Fetch QR Data record by its name (primary key)
#         qr_data = frappe.get_doc("QR Data", {'product_qr_id':product_qr_id} )

#         if not qr_data:
#             return {"success": False, "error": "QR Data not found for the given QR ID."}

#         # Check if already scanned
#         if qr_data.scanned:
#             return {"success": False, "message": "This Product QR has already been scanned."}

#         # Ensure the linked Product QR exists
#         if not frappe.db.exists("Product QR", qr_data.product_qr):
#             return {"success": False, "error": "Linked Product QR document not found."}

#         # Get product name from Product doctype
#         product_name = frappe.get_value("Product", {"name": qr_data.product_table_name}, "product_name")
#         if not product_name:
#             return {"success": False, "error": "Product not found for the given QR ID."}

#         # Fetch the latest reward conversion rate
#         reward_conversion = frappe.get_all(
#             "Reward Point Canversion Table",
#             filters={"product_name": product_name},
#             fields=["payout_amount", "reward_point"],
#             order_by="from_date desc",
#             limit=1
#         )

#         payout_amount = reward_point = earned_amount = None

#         if reward_conversion:
#             payout_amount = reward_conversion[0].payout_amount
#             reward_point = reward_conversion[0].reward_point

#             # Calculate earned amount
#             if payout_amount and reward_point:
#                 earned_amount = (float(qr_data.points) / float(reward_point)) * float(payout_amount)
#             else:
#                 earned_amount = 0.0

#         return {
#             "success": True,
#             "message": "Successfully retrieved QR Code details.",
#             "product_qr_doc_name": qr_data.product_qr,
#             "product_name": product_name,
#             "product_table_name": qr_data.product_table_name,
#             "product_qr_id": qr_data.name,
#             "points": qr_data.points,
#             "qr_code_image": qr_data.qr_code_image,
#             "scanned": qr_data.scanned,
#             "row_idx": qr_data.idx,
#             "payout_amount": payout_amount,
#             "reward_point": reward_point,
#             "earned_amount": earned_amount
#         }

#     except Exception as e:
#         frappe.log_error(frappe.get_traceback(), f"Error in Product QR ID Lookup: {e}")
#         return {"success": False, "error": f"Server error: {e}"}

# @frappe.whitelist()
# def get_product_details_from_qr_id(product_qr_id):
#     try:
#         if not product_qr_id:
#             return {"success":False,"error": "Product QR ID is required."}
        
#         # Use Frappe ORM to find the matching row in the child table
#         product_qr_row = frappe.get_all(
#             "Product QR Table",
#             filters={"product_qr_id": product_qr_id},
#             fields=["parent", "product_table_name", "product_qr_id", "points", "qr_code_image", "scanned", "idx"],
#             limit=1
#         )
        
#         if not product_qr_row:
#             return {"success": False,"error": "No Product QR details found for the given QR Id."}
        
#         matched_row = product_qr_row[0]

#         # Check if already scanned
#         if matched_row.get("scanned"):
#             return {"success": False,"message": "This Product QR has already been scanned."}

#         # Fetch the Product QR document name
#         product_qr_doc_name = matched_row.get("parent")

#         # Fetch the product name
#         product_name = frappe.get_value("Product", {"name": matched_row["product_table_name"]}, "product_name")
#         if not product_name:
#             return {"success": False,"error": "Product not found for the given QR Id"}

#         # Fetch payout_amount and reward_point from Reward Point Conversion Rate
#         reward_point_conversion_rate = frappe.get_all(
#             "Reward Point Canversion Table",
#             filters={"product_name": product_name},
#             fields=["payout_amount", "reward_point", "from_date"],
#             order_by="idx desc",
#             limit=1
#         )
        
#         payout_amount = None
#         reward_point = None
#         earned_amount = None

#         # Only calculate reward-related data if conversion rate is found
#         if reward_point_conversion_rate:
#             payout_amount = reward_point_conversion_rate[-1].payout_amount
#             reward_point = reward_point_conversion_rate[-1].reward_point
#             # payout_amount = reward_point_conversion_rate[-1]["payout_amount"]
#             # reward_point = reward_point_conversion_rate[-1]["reward_point"]

#             # Calculate earned_amount if payout_amount and reward_point are available
#             if payout_amount and reward_point:
#                 earned_amount =(float(matched_row['points']) / float(reward_point)) * float(payout_amount) 
#                 # (float(matched_row["points"]) / float(reward_point)) * float(payout_amount)
#             else:
#                 earned_amount = 0.0

#         # Return details including matching row data
#         return {
#             "success": True,
#             "message": "Succesfully Get QR Code Details",
#             "product_qr_doc_name": product_qr_doc_name,
#             "product_name": product_name,
#             "product_table_name": matched_row["product_table_name"],
#             "product_qr_id": matched_row["product_qr_id"],
#             "points": matched_row["points"],
#             "qr_code_image": matched_row["qr_code_image"],
#             "scanned": matched_row["scanned"],
#             "row_idx": matched_row["idx"],
#             "payout_amount": payout_amount,
#             "reward_point": reward_point,
#             "earned_amount": earned_amount
#         }

#     except Exception as e:
#         frappe.log_error(frappe.get_traceback(), f"Error in Product QR Id: {e}")
#         return {"success":False,"error": f"Server error: {e}"}

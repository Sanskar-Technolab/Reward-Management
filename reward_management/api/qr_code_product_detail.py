from __future__ import unicode_literals
import frappe
from datetime import datetime

# Get Product QR Details from QR Images----------
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
#             return {"error": "Product QR document not found"}

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
#                 return {"error": "This QR code has already been scanned."}

#             # Fetch the product_name
#             product_name = frappe.get_value("Product", {"name": matched_row.product_table_name}, "product_name")
#             if not product_name:
#                 return {"error": "Product not found for the given product_table_name"}

#             # Fetch payout_amount and reward_point from Reward Point Conversion Rate using product_name
#             reward_point_conversion_rate = frappe.get_all(
#                 "Reward Point Canversion Table",
#                 filters={"product_name": product_name},  # Match with product_name
#                 fields=["payout_amount", "reward_point", "from_date"],
#                 order_by="idx desc",
#                 limit=1
#             )
            
#             if not reward_point_conversion_rate:
#                 return {"error": "No reward point conversion rate found for this product"}

#             payout_amount = reward_point_conversion_rate[-1].payout_amount
#             reward_point = reward_point_conversion_rate[-1].reward_point
#             # from_date = reward_point_conversion_rate[-1].from_date
            
#             # current_date_str = frappe.utils.nowdate()
#             # current_date = datetime.strptime(current_date_str, "%Y-%m-%d").date()  


#             # Check if the current date is greater than from_date
#             # if current_date > from_date:
#             #     return {"error": "Reward points covertion rate for this product have expired"}

#             # Calculate earned_amount
#             if reward_point and payout_amount:
#                 earned_amount = (float(matched_row.points) / float(reward_point)) * float(payout_amount)
#             else:
#                 earned_amount = None

#             # Return details only if the current date is not greater than from_date
#             return {
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
#             return {"error": "No matching product_table_name and product_qr_id found in the Product QR document"}

#     except Exception as e:
#         frappe.log_error(frappe.get_traceback(), f"Error in get_product_details_from_qr: {e}")
#         return {"error": f"Server error: {e}"}





# Get Scanned QR Details------
@frappe.whitelist()
def get_product_details_from_qr(decode_text):
    try:
        components = decode_text.strip().split('_')

        if len(components) < 3:
            return {"error": "Invalid QR code format"}
        
        name = components[0]
        product_table_name = components[1]
        product_qr_id = components[2]

        product_qr = frappe.get_doc("Product QR", name)
        print(f"Retrieved Product QR Document: {product_qr}")

        if not product_qr:
            return {"success":False,"error": "No Product QR details found for the given QR"}

        matched_row = None
        row_number = 0  # Initialize row number

        print("QR Table Data:")
        for row in product_qr.qr_table:
            row_number += 1
            row_product_table_name = row.product_table_name  # Assuming this is a string
            row_product_qr_id = row.product_qr_id  # Assuming this is an int

            print(f"Checking row {row_number} (idx: {row.idx}): {row_product_table_name}, {row_product_qr_id}")

            # Log the values being compared for debugging
            print(f"Comparing '{row_product_table_name}' with '{product_table_name}' and '{row_product_qr_id}' with '{product_qr_id}'")
            
            # Match the product_table_name and product_qr_id
            # Convert row_product_qr_id to string for comparison
            if row_product_table_name == product_table_name and str(row_product_qr_id) == product_qr_id:
                matched_row = row
                print(f"Match found in row number: {row_number}, idx: {row.idx}")  # Print matched row number
                break

        if matched_row:
            if matched_row.scanned:
                return {"success":False,"error": "This QR code has already been scanned."}

            # Fetch the product_name
            product_name = frappe.get_value("Product", {"name": matched_row.product_table_name}, "product_name")
            if not product_name:
                return {"success": False,"error": "No Product QR details found for the given QR id"}

            # Fetch payout_amount and reward_point from Reward Point Conversion Rate using product_name
            reward_point_conversion_rate = frappe.get_all(
                "Reward Point Canversion Table",
                filters={"product_name": product_name},  # Match with product_name
                fields=["payout_amount", "reward_point", "from_date"],
                order_by="idx desc",
                limit=1
            )

            payout_amount = None
            reward_point = None
            earned_amount = None

            # Only calculate reward-related data if conversion rate is found
            if reward_point_conversion_rate:
                payout_amount = reward_point_conversion_rate[-1].payout_amount
                reward_point = reward_point_conversion_rate[-1].reward_point

                # Calculate earned_amount if payout_amount and reward_point are available
                if reward_point and payout_amount:
                    earned_amount = (float(matched_row.points) / float(reward_point)) * float(payout_amount)
                else:
                    earned_amount = 0

            # Return details including matching row data, even if reward point conversion rate is not found
            return {
                "message": "QR code scanned successfully",
                "success": True,
                "product_name": product_name,
                "product_table_name": matched_row.product_table_name,
                "product_qr_id": matched_row.product_qr_id,
                "points": matched_row.points,
                "qr_code_image": matched_row.qr_code_image,
                "scanned": matched_row.scanned,
                "row_number": row_number,
                "row_idx": matched_row.idx,
                "payout_amount": payout_amount,
                "reward_point": reward_point,
                "earned_amount": earned_amount
            }

        else:
            return {"success": False,"error": "No Product QR details found for the given QR id"}

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), f"No Product QR details found for the given QR id: {e}")
        return {"success":False,"error": f"Server error: {e}"}



# Update Product QR Scanned Table----------------
@frappe.whitelist()
def update_scanned_status(product_table_name, product_qr_id, carpenter_id):
    try:
        # Fetch all Product QR documents
        product_qrs = frappe.get_all("Product QR", fields=["name"])

        if product_qrs:
            for product_qr in product_qrs:
                # Fetch child table data (qr_table) for each Product QR document
                qr_table_data = frappe.get_all("Product QR Table",
                                               filters={"parent": product_qr.name,
                                                        "product_table_name": product_table_name,
                                                        "product_qr_id": product_qr_id},
                                               fields=["name", "scanned", "carpenter_id", "redeem_date", "points"])

                if qr_table_data:
                    # Assuming there's only one matching row, but you should handle multiple rows if needed
                    row = qr_table_data[0]
                    
                    # Check if QR code has already been scanned
                    if row.get('scanned'):
                        return {"success": False,"error": "This QR code has already been scanned."}
                    
                    # Fetch product_name from Product document based on product_table_name
                    product_name = frappe.get_value("Product", {"name": product_table_name}, "product_name")
                    if not product_name:
                        return {"success": False,"error": "Product not found for the given Product QR ID"}

                    # Fetch Reward Point Conversion Rate (including from_date)
                    reward_point_conversion_rate = frappe.get_all(
                        "Reward Point Canversion Table",
                        filters={"product_name": product_name},  # Match with product_name
                        fields=["payout_amount", "reward_point", "from_date"],
                        order_by="idx desc",
                        limit=1
                    )

                    if reward_point_conversion_rate:
                        payout_amount = reward_point_conversion_rate[-1].payout_amount
                        reward_point = reward_point_conversion_rate[-1].reward_point
                       
                    else:
                        payout_amount = None
                        reward_point = None
                        

                    # Ensure redeem_date is not greater than from_date
                    current_date = frappe.utils.nowdate()
                    # Update scanned status, carpenter_id, and redeem_date
                    frappe.db.set_value("Product QR Table", row['name'], "scanned", 1)
                    frappe.db.set_value("Product QR Table", row['name'], "carpenter_id", carpenter_id)
                    frappe.db.set_value("Product QR Table", row['name'], "redeem_date", current_date)

                    # Calculate earned_amount
                    if reward_point and payout_amount:
                        earned_amount = (float(row['points']) / float(reward_point)) * float(payout_amount)
                        frappe.db.set_value("Product QR Table", row['name'], "earned_amount", earned_amount)
                    else:
                        earned_amount = None

                    frappe.db.commit()

                    return {
                        "message": " QR code scanned successfully.",
                        "status":"update successfully",
                        "success": True,
                        "earned_amount": earned_amount  # Return earned amount
                    }
                else:
                    # If no matching row found in qr_table for this particular Product QR document
                    continue

            # If no matching Product QR document found
            return {"success": False,"error": "No Product QR details found for the given QR id"}

        else:
            # If no Product QR documents found
            return {"success": False,"error": "No Product QR details found for the given QR id"}

    except Exception as e:
        # Handle any exceptions and log errors
        frappe.log_error(frappe.get_traceback(), f"Error in Update Product QR Status: {e}")
        return {"error": f"Server error: {e}"}

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




# Get QR Details From QE Code Number and if not added payment amount or payment amount table------------
@frappe.whitelist()
def get_product_details_from_qr_id(product_qr_id):
    try:
        if not product_qr_id:
            return {"success":False,"error": "Product QR ID is required."}
        
        # Use Frappe ORM to find the matching row in the child table
        product_qr_row = frappe.get_all(
            "Product QR Table",
            filters={"product_qr_id": product_qr_id},
            fields=["parent", "product_table_name", "product_qr_id", "points", "qr_code_image", "scanned", "idx"],
            limit=1
        )
        
        if not product_qr_row:
            return {"success": False,"error": "No Product QR details found for the given QR Id."}
        
        matched_row = product_qr_row[0]

        # Check if already scanned
        if matched_row.get("scanned"):
            return {"success": False,"message": "This Product QR has already been scanned."}

        # Fetch the Product QR document name
        product_qr_doc_name = matched_row.get("parent")

        # Fetch the product name
        product_name = frappe.get_value("Product", {"name": matched_row["product_table_name"]}, "product_name")
        if not product_name:
            return {"success": False,"error": "Product not found for the given QR Id"}

        # Fetch payout_amount and reward_point from Reward Point Conversion Rate
        reward_point_conversion_rate = frappe.get_all(
            "Reward Point Canversion Table",
            filters={"product_name": product_name},
            fields=["payout_amount", "reward_point", "from_date"],
            order_by="idx desc",
            limit=1
        )
        
        payout_amount = None
        reward_point = None
        earned_amount = None

        # Only calculate reward-related data if conversion rate is found
        if reward_point_conversion_rate:
            payout_amount = reward_point_conversion_rate[-1]["payout_amount"]
            reward_point = reward_point_conversion_rate[-1]["reward_point"]

            # Calculate earned_amount if payout_amount and reward_point are available
            if payout_amount and reward_point:
                earned_amount = (float(matched_row["points"]) / float(reward_point)) * float(payout_amount)
            else:
                earned_amount = 0

        # Return details including matching row data
        return {
            "success": True,
            "message": "Succesfully Get QR Code Details",
            "product_qr_doc_name": product_qr_doc_name,
            "product_name": product_name,
            "product_table_name": matched_row["product_table_name"],
            "product_qr_id": matched_row["product_qr_id"],
            "points": matched_row["points"],
            "qr_code_image": matched_row["qr_code_image"],
            "scanned": matched_row["scanned"],
            "row_idx": matched_row["idx"],
            "payout_amount": payout_amount,
            "reward_point": reward_point,
            "earned_amount": earned_amount
        }

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), f"Error in Product QR Id: {e}")
        return {"success":False,"error": f"Server error: {e}"}

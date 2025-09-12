from __future__ import unicode_literals
import frappe
from datetime import datetime

# # Get Scanned QR From QR Images Details------

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
        
        
        return{
            "success":False,
            "message":"To scan the QR code, please update the app to the latest version."
        }

        # Step 2: Find the QR Data entry that matches both product_qr and name
        # qr_data = frappe.get_all(
        #     "QR Data",
        #     filters={
        #         "product_qr_id": qr_data_name,
        #         "product_qr": product_qr_name
        #     },
        #     fields=[
        #         "name", "product_qr", "product_table_name", "product_qr_id",
        #         "points", "qr_code_image", "scanned", "carpenter_id",
        #         "redeem_date", "generated_date", "generated_time"
        #     ],
        #     order_by="generated_date desc, generated_time desc",
        #     limit=1
        # )

        # if not qr_data:
        #     return {"success": False, "error": "No matching QR Data found"}

        # qr_data = qr_data[0]
        # if qr_data.scanned:
        #     return {"success": False, "error": "This QR code is already scanned."}
        
        

        # # Fetch the product_name using product_table_name
        # product_name = frappe.get_value("Product", {"name": qr_data.product_table_name}, "product_name")
        # if not product_name:
        #     return {"success": False, "error": "Product name not found"}

        # # Get reward point conversion details
        # reward_point_conversion = frappe.get_all(
        #     "Reward Point Canversion Table",
        #     filters={"product_name": product_name},
        #     fields=["payout_amount", "reward_point"],
        #     order_by="from_date desc",
        #     limit=1
        # )

        # payout_amount = reward_point = earned_amount = 0

        # if reward_point_conversion:
        #     payout_amount = reward_point_conversion[0].payout_amount or 0
        #     reward_point = reward_point_conversion[0].reward_point or 0

        #     if float(payout_amount) > 0 and float(reward_point) > 0:
        #         earned_amount = (float(qr_data.points) / float(reward_point)) * float(payout_amount)
        #     else:
        #         earned_amount = 0

        # return {
        #     "message": "QR code scanned successfully",
        #     "success": True,
        #     "product_name": product_name,
        #     "product_table_name": qr_data.product_table_name,
        #     "product_qr_id": qr_data.product_qr_id,
        #     "points": qr_data.points,
        #     "qr_code_image": qr_data.qr_code_image,
        #     "scanned": qr_data.scanned,
        #     "carpenter_id": qr_data.carpenter_id,
        #     "redeem_date": qr_data.redeem_date,
        #     "generated_date": qr_data.generated_date,
        #     "generated_time": qr_data.generated_time,
        #     "payout_amount": payout_amount,
        #     "reward_point": reward_point,
        #     "earned_amount": earned_amount
        # }

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), f"QR Data Lookup Failed: {e}")
        return {"success": False, "error": f"Server error: {e}"}


# Update Product QR Scanned Table----------------

@frappe.whitelist()
def update_scanned_status(product_table_name, product_qr_id, carpenter_id):
    try:
        
        return{
            "success":False,
            "message":"To scan the QR code, please update the app to the latest version."
        }
        # Validate QR Data existence with correct linkage to Product QR
        # qr_data = frappe.get_doc("QR Data", {'product_qr_id':product_qr_id})

        # if not qr_data:
        #     return {"success": False, "error": "QR Data entry not found."}

        # # Check if linked Product QR exists
        # if not frappe.db.exists("Product QR", qr_data.product_qr):
        #     return {"success": False, "error": "Linked Product QR not found."}

        # # Check if already scanned
        # if qr_data.scanned:
        #     return {"success": False, "error": "This QR code has already been scanned."}

        # # Check product_table_name match (optional for added verification)
        # if qr_data.product_table_name != product_table_name:
        #     return {"success": False, "error": "Product table name mismatch."}

        # # Fetch product_name from Product doctype
        # product_name = frappe.get_value("Product", {"name": product_table_name}, "product_name")
        # if not product_name:
        #     return {"success": False, "error": "Product not found."}

        # # Fetch latest Reward Point Conversion Rate
        # reward_point_conversion = frappe.get_all(
        #     "Reward Point Canversion Table",
        #     filters={"product_name": product_name},
        #     fields=["payout_amount", "reward_point"],
        #     order_by="from_date desc",
        #     limit=1
        # )

        # payout_amount = reward_point = earned_amount = None

        # if reward_point_conversion:
        #     payout_amount = reward_point_conversion[0].payout_amount
        #     reward_point = reward_point_conversion[0].reward_point

        # # Calculate earned amount
        # if reward_point and payout_amount:
        #     earned_amount = (float(qr_data.points) / float(reward_point)) * float(payout_amount)

        # # Update QR Data record
        # qr_data.db_set("scanned", 1)
        # qr_data.db_set("carpenter_id", carpenter_id)
        # qr_data.db_set("redeem_date", frappe.utils.nowdate())

        # if earned_amount is not None:
        #     qr_data.db_set("earned_amount", earned_amount)

        # frappe.db.commit()

        # return {
        #     "message": "QR code scanned and updated successfully.",
        #     "status": "updated successfully",
        #     "success": True,
        #     "earned_amount": earned_amount
        # }

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), f"Error in Update QR Data Status: {e}")
        return {"success": False, "error": f"Server error: {e}"}



# # Get QR Details From QR Code Number and if not added payment amount or payment amount table------------
@frappe.whitelist()
def get_product_details_from_qr_id(product_qr_id):
    try:
        if not product_qr_id:
            return {"success": False, "error": "Product QR ID is required."}
        
        return{
            "success":False,
            "message":"To scan the QR code, please update the app to the latest version."
        }

        # Fetch all QR Data records with the given product_qr_id
        # qr_data_list = frappe.get_all(
        #     "QR Data",
        #     filters={"product_qr_id": product_qr_id},
        #     fields=["name", "product_qr", "product_table_name", "points", "qr_code_image",
        #             "scanned", "carpenter_id", "redeem_date", "generated_date", "generated_time", "idx"],
        #     order_by="creation asc"
        # )

        # if not qr_data_list:
        #     return {"success": False, "error": "QR Code not found for the given QR ID."}

        # # More than one entry found – handle duplicates
        # if len(qr_data_list) > 1:
        #     unscanned = [qr for qr in qr_data_list if not qr.scanned]

        #     if not unscanned:
        #         return {"success": False, "message": "All Product QRs with this ID have already been scanned."}

        #     # Sort unscanned by creation (oldest first) and select the oldest unscanned
        #     qr_data = unscanned[0]

        #     # Check if the oldest one is the first created one
        #     if qr_data["name"] != qr_data_list[0]["name"]:
        #         return {
        #             "success": False,
        #             "message": "Please scan the older QR code first ."
        #         }
        # else:
        #     qr_data = qr_data_list[0]
        #     if qr_data["scanned"]:
        #         return {"success": False, "message": "This Product QR has already been scanned."}

        # # Ensure linked Product QR exists
        # if not frappe.db.exists("Product QR", qr_data["product_qr"]):
        #     return {"success": False, "error": "Product QR not found."}

        # # Get product name from Product doctype
        # product_name = frappe.get_value("Product", {"name": qr_data["product_table_name"]}, "product_name")
        # if not product_name:
        #     return {"success": False, "error": "Product not found for the given QR ID."}

        # # Fetch the latest reward conversion rate
        # reward_conversion = frappe.get_all(
        #     "Reward Point Canversion Table",
        #     filters={"product_name": product_name},
        #     fields=["payout_amount", "reward_point"],
        #     order_by="idx desc",
        #     limit=1
        # )

        # payout_amount = reward_point = earned_amount = 0

        # if reward_conversion:
        #     payout_amount = reward_conversion[0].payout_amount or 0
        #     reward_point = reward_conversion[0].reward_point or 0

        #     if float(payout_amount) > 0 and float(reward_point) > 0:
        #         earned_amount = (float(qr_data["points"]) / float(reward_point)) * float(payout_amount)
        #     else:
        #         earned_amount = 0.0

        # return {
        #     "success": True,
        #     "message": "Successfully retrieved QR Code details.",
        #     "product_qr_doc_name": qr_data["product_qr"],
        #     "product_name": product_name,
        #     "product_table_name": qr_data["product_table_name"],
        #     "product_qr_id": qr_data["name"],
        #     "points": qr_data["points"],
        #     "qr_code_image": qr_data["qr_code_image"],
        #     "scanned": qr_data["scanned"],
        #     "carpenter_id": qr_data["carpenter_id"],
        #     "redeem_date": qr_data["redeem_date"],
        #     "generated_date": qr_data["generated_date"],
        #     "generated_time": qr_data["generated_time"],
        #     "row_idx": qr_data["idx"],
        #     "payout_amount": payout_amount,
        #     "reward_point": reward_point,
        #     "earned_amount": earned_amount
        # }

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), f"Error in Product QR ID Lookup: {e}")
        return {"success": False, "error": f"Server error: {e}"}


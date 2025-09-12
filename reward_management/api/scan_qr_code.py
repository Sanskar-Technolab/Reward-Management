import frappe

# get qr code data from the qr images-----------------
@frappe.whitelist()
def get_product_details_from_qr_image(decode_text):
    try:
        if not decode_text:
            return {"success": False, "message": "No QR code provided"}

        components = decode_text.strip().split('_')
        if len(components) < 3:
            return {"success": False, "message": "Invalid QR code format"}

        product_qr_name, product_table_name, qr_data_name = components[:3]

        # Step 1: Validate Product QR
        product_qr_doc = frappe.get_value("Product QR", product_qr_name, "name")
        if not product_qr_doc:
            return {"success": False, "message": "Product QR document not found"}
        # if not frappe.db.exists("Product QR", product_qr_name):
        #     return {"success": False, "message": "Product QR not found"}

        # Step 2: Fetch latest matching QR Data
        qr_data = frappe.get_all(
            "QR Data",
            filters={"product_qr_id": qr_data_name, "product_qr": product_qr_name},
            fields=[
                "name", "product_qr", "product_table_name", "product_qr_id",
                "points", "qr_code_image", "scanned", "carpenter_id",
                "redeem_date", "generated_date", "generated_time"
            ],
            order_by="generated_date desc, generated_time desc",
            limit=1
        )

        if not qr_data:
            return {"success": False, "message": "QR Data not found"}

        qr_data = qr_data[0]

        # ✅ Check if already scanned (no DB update)
        if qr_data.get("scanned"):
            frappe.log_error(
                "QR Code Already Scanned",
                f"QR Code {qr_data_name} already scanned by {qr_data.get('carpenter_id')} on {qr_data.get('redeem_date')}"
            )
            return {"success": False, "message": "QR Code already scanned and points added successfully."}

        # Step 3: Get product name
        product_name = frappe.get_value("Product", qr_data.get("product_table_name"), "product_name")
        if not product_name:
            return {"success": False, "message": "Product not found"}

        # Step 4: Fetch reward conversion details (if any)
        reward = frappe.get_all(
            "Reward Point Canversion Table",
            filters={"product_name": product_name},
            fields=["payout_amount", "reward_point"],
            order_by="from_date desc",
            limit=1
        )
        
        payout_amount = reward_point = earned_amount = 0
        if reward:
            payout_amount = float(reward[0].payout_amount or 0)
            reward_point = float(reward[0].reward_point or 0)

            if reward_point > 0 and payout_amount > 0:
                earned_amount = (float(qr_data.get("points") or 0) / reward_point) * payout_amount
            else:
                earned_amount = 0

        # payout_amount = reward_point = earned_amount = 0
        # if reward and reward[0].payout_amount and reward[0].reward_point:
        #     payout_amount = reward[0].payout_amount
        #     reward_point = reward[0].reward_point
        #     earned_amount = (float(qr_data.get("points") or 0) / float(reward_point)) * float(payout_amount)

        # ✅ Return only data (no DB writes)
        return {
            "success": True,
            "message": "QR code scanned successfully. Continue to collect points.",
            "product_name": product_name,
            "product_table_name": qr_data.get("product_table_name"),
            "product_qr_id": qr_data.get("product_qr_id"),
            "points": qr_data.get("points"),
            "qr_code_image": qr_data.get("qr_code_image"),
            "scanned": qr_data.get("scanned"),
            "carpenter_id": qr_data.get("carpenter_id"),
            "redeem_date": qr_data.get("redeem_date"),
            "generated_date": qr_data.get("generated_date"),
            "generated_time": qr_data.get("generated_time"),
            "payout_amount": payout_amount,
            "reward_point": reward_point,
            "earned_amount": earned_amount
        }

    except Exception as e:
        frappe.log_error("Get QR Data from Image Failed", str(e))
        return {"success": False, "message": str(e)}
    

    
# scanned qr code from the image and rollback data if any of one process is not working ----------------

@frappe.whitelist()
def scan_qr_code_image(decode_text):
    try:
        if not decode_text:
            return {"success": False, "message": "No QR code provided"}

        components = decode_text.strip().split('_')
        if len(components) < 3:
            return {"success": False, "message": "Invalid QR code format"}

        product_qr_name, product_table_name, qr_data_name = components

        # Step 1: Validate Product QR
        if not frappe.get_list("Product QR", filters={"name": product_qr_name}):
            return {"success": False, "message": "Product QR document not found"}

        # Step 2: Get QR Data
        qr_data_list = frappe.get_list(
            "QR Data",
            filters={"product_qr_id": qr_data_name, "product_qr": product_qr_name},
            fields=["name"],
            limit=1
        )
        if not qr_data_list:
            return {"success": False, "message": "No matching QR Data found"}

        qr_doc = frappe.get_doc("QR Data", qr_data_list[0].name)

        # Step 3: Already scanned check
        if qr_doc.scanned:
            return {
                "success": False,
                "already_scanned": True,
                "message": "QR Code already scanned. Points already added successfully.",
                "carpenter_id": qr_doc.carpenter_id
            }

        # Step 4: Get product name
        product = frappe.get_doc("Product", qr_doc.product_table_name)
        product_name = product.product_name

        # Step 5: Reward conversion
        conversion = frappe.get_all(
            "Reward Point Canversion Table",
            filters={"product_name": product_name},
            fields=["payout_amount", "reward_point"],
            order_by="from_date desc",
            limit=1
        )
        earned_amount = 0
        if conversion:
            payout_amount, reward_point = conversion[0].payout_amount, conversion[0].reward_point
            if payout_amount and reward_point and float(reward_point) > 0:
                earned_amount = (float(qr_doc.points) / float(reward_point)) * float(payout_amount)

        # Step 6: Get logged-in customer
        user_info = frappe.get_doc("User", frappe.session.user)
        carpenter_list = frappe.get_list("Customer", filters={'mobile_number': user_info.mobile_no}, fields=['name'])
        if not carpenter_list:
            return {"success": False, "message": "Customer not found"}
        customer_id = carpenter_list[0].name
        customer_doc = frappe.get_doc("Customer", customer_id)

        # ---------------- Transactional Flow ----------------
        try:
            frappe.db.begin()

            # ✅ Step 1: Mark as scanned
            qr_doc.scanned = 1
            qr_doc.carpenter_id = customer_id
            qr_doc.redeem_date = frappe.utils.nowdate()
            qr_doc.earned_amount = earned_amount
            qr_doc.save(ignore_permissions=True)

            # ✅ Step 2: Create point history
            point_history_doc = frappe.get_doc({
                "doctype": "Customer Product Point Detail",
                "customer_id": customer_id,
                "product_id": product_name,
                "earned_points": qr_doc.points,
                "earned_amount": earned_amount,
                "date": frappe.utils.nowdate(),
                "time": frappe.utils.now_datetime().strftime('%H:%M:%S'),
            })
            point_history_doc.insert(ignore_permissions=True)

            # mark point_history_added only if inserted successfully
            qr_doc.point_history_added = 1
            qr_doc.save(ignore_permissions=True)

            # ✅ Step 3: Add points to customer
            customer_doc.total_points = (customer_doc.total_points or 0) + float(qr_doc.points)
            customer_doc.current_points = (customer_doc.current_points or 0) + float(qr_doc.points)
            customer_doc.save(ignore_permissions=True)

            # mark points_added only if updated successfully
            qr_doc.points_added = 1
            qr_doc.save(ignore_permissions=True)
            
            
               # ---------------- Step 4: Reconciliation ----------------
            qr_points_sum = sum([q.points for q in frappe.get_all(
                "QR Data",
                filters={"carpenter_id": customer_id, "scanned": 1},
                fields=["points"]
            )])

            earned_points_sum = sum([h.earned_points for h in frappe.get_all(
                "Customer Product Point Detail",
                filters={"customer_id": customer_id},
                fields=["earned_points"]
            )])

            if customer_doc.total_points != qr_points_sum or customer_doc.total_points != earned_points_sum:
                customer_doc.total_points = qr_points_sum
                customer_doc.current_points = qr_points_sum
                customer_doc.save(ignore_permissions=True)

            frappe.db.commit()

            return {
                "success": True,
                "already_scanned": False,
                "message": "QR code scanned and points added successfully.",
                "carpenter_id": customer_id,
                "total_points": customer_doc.total_points,
                "current_points": customer_doc.current_points
            }

        except Exception as inner_e:
            frappe.db.rollback()
            frappe.log_error("QR image Scan Transaction Error", str(inner_e))
            return {"success": False, "message": "Something went wrong. Transaction rolled back."}

    except Exception as e:
        frappe.log_error("QR image Scan Outer Error", str(e))
        return {"success": False, "message": str(e)}

# @frappe.whitelist()
# def scan_qr_code_image(decode_text):
#     try:
#         if not decode_text:
#             return {"success": False, "message": "No QR code provided"}

#         components = decode_text.strip().split('_')
#         if len(components) < 3:
#             return {"success": False, "message": "Invalid QR code format"}

#         product_qr_name, product_table_name, qr_data_name = components

#         # Step 1: Validate Product QR
#         if not frappe.get_list("Product QR", filters={"name": product_qr_name}):
#             return {"success": False, "message": "Product QR document not found"}

#         # Step 2: Get QR Data
#         qr_data_list = frappe.get_list(
#             "QR Data",
#             filters={"product_qr_id": qr_data_name, "product_qr": product_qr_name},
#             fields=["name"],
#             limit=1
#         )
#         if not qr_data_list:
#             return {"success": False, "message": "No matching QR Data found"}

#         qr_doc = frappe.get_doc("QR Data", qr_data_list[0].name)

#         # Step 3: Already scanned check
#         if qr_doc.scanned:
#             return {
#                 "success": False,
#                 "already_scanned": True,
#                 "message": "This QR code is already scanned.",
#                 "carpenter_id": qr_doc.carpenter_id
#             }

#         # Step 4: Get product name
#         product = frappe.get_doc("Product", qr_doc.product_table_name)
#         product_name = product.product_name

#         # Step 5: Reward conversion
#         conversion = frappe.get_all(
#             "Reward Point Canversion Table",
#             filters={"product_name": product_name},
#             fields=["payout_amount", "reward_point"],
#             order_by="from_date desc",
#             limit=1
#         )
#         earned_amount = 0
#         if conversion:
#             payout_amount, reward_point = conversion[0].payout_amount, conversion[0].reward_point
#             if payout_amount and reward_point:
#                 earned_amount = (float(qr_doc.points) / float(reward_point)) * float(payout_amount)

#         # Step 6: Get logged-in customer
#         user_info = frappe.get_doc("User", frappe.session.user)
#         carpenter_list = frappe.get_list("Customer", filters={'mobile_number': user_info.mobile_no}, fields=['name'])
#         if not carpenter_list:
#             return {"success": False, "message": "Customer not found"}
#         customer_id = carpenter_list[0].name
#         customer_doc = frappe.get_doc("Customer", customer_id)

#         # ---------------- Transaction Simulation ----------------
#         new_point_doc = None
#         try:
#             # Step 7: Mark scanned
#             qr_doc.scanned = 1
#             qr_doc.carpenter_id = customer_id
#             qr_doc.redeem_date = frappe.utils.nowdate()
#             qr_doc.earned_amount = earned_amount
#             qr_doc.save(ignore_permissions=True)

#             # Step 8: Add points to customer
#             customer_doc.total_points = (customer_doc.total_points or 0) + float(qr_doc.points)
#             customer_doc.current_points = (customer_doc.current_points or 0) + float(qr_doc.points)
#             customer_doc.save(ignore_permissions=True)

#             # Step 9: Mark points_added
#             qr_doc.points_added = 1
#             qr_doc.save(ignore_permissions=True)

#             # Step 10: Create point history
#             new_point_doc = frappe.get_doc({
#                 "doctype": "Customer Product Point Detail",
#                 "customer_id": customer_id,
#                 "product_id": product_name,
#                 "earned_points": qr_doc.points,
#                 "earned_amount": earned_amount,
#                 "date": frappe.utils.nowdate(),
#                 "time": frappe.utils.now_datetime().strftime('%H:%M:%S'),
#             })
#             new_point_doc.insert(ignore_permissions=True)

#             # Step 11: Mark point_history_added
#             qr_doc.point_history_added = 1
#             qr_doc.save(ignore_permissions=True)

#             return {
#                 "success": True,
#                 "already_scanned": False,
#                 "message": "QR code scanned and points added successfully.",
#                 "carpenter_id": customer_id
#             }

#         except Exception as inner_e:
#             frappe.log_error("QR Scan Rollback Error", str(inner_e))

#             # Rollback manually
#             if new_point_doc and new_point_doc.name:
#                 frappe.delete_doc("Customer Product Point Detail", new_point_doc.name, ignore_permissions=True)

#             if qr_doc:
#                 qr_doc.scanned = 0
#                 qr_doc.points_added = 0
#                 qr_doc.point_history_added = 0
#                 qr_doc.carpenter_id = None
#                 qr_doc.redeem_date = None
#                 qr_doc.earned_amount = 0
#                 qr_doc.save(ignore_permissions=True)

#             if customer_doc:
#                 customer_doc.total_points = (customer_doc.total_points or 0) - float(qr_doc.points)
#                 customer_doc.current_points = (customer_doc.current_points or 0) - float(qr_doc.points)
#                 customer_doc.save(ignore_permissions=True)

#             return {"success": False, "message": "Something went wrong, rolled back changes."}

#     except Exception as e:
#         frappe.log_error("QR Scan Outer Error", str(e))
#         return {"success": False, "message": str(e)}



    
# get qr code details from the qr code number 
@frappe.whitelist()
def get_product_details_from_qr_number(product_qr_id):
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
            return {"success": False, "message": "QR Code not found for the given QR ID."}

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
            return {"success": False, "message": "Product QR not found."}

        # Get product name from Product doctype
        product_name = frappe.get_value("Product", {"name": qr_data["product_table_name"]}, "product_name")
        if not product_name:
            return {"success": False, "message": "Product not found for the given QR ID."}

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
            "message": "QR code scanned successfully. Continue to collect points.",
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
        frappe.log_error("QR CODE NUMBER DETAILS ERROR",str(e))
        return {"success": False, "message": str(e)}


# update qr code status and add point to the customer account after scanning the qr code from the qe code number ------

# scann qr code from the qr code number and rollback if any of process is not running ----------------------
@frappe.whitelist()
# def scan_and_update_qr_number(product_qr_id):
#     try:
#         if not product_qr_id:
#             return {"success": False, "message": "Product QR ID is required."}

#         # ---------------------------
#         # STEP 1: Fetch QR Data record
#         # ---------------------------
#         qr_data_list = frappe.get_all(
#             "QR Data",
#             filters={"product_qr_id": product_qr_id},
#             fields=["name", "product_qr", "product_table_name", "points", "scanned"],
#             order_by="creation asc"
#         )
#         if not qr_data_list:
#             return {"success": False, "message": "QR Code not found."}

#         # Handle duplicate QR entries
#         if len(qr_data_list) > 1:
#             qr_data = next((qr for qr in qr_data_list if not qr.scanned), None)
#             if not qr_data:
#                 return {"success": False, "message": "All QRs with this ID are already scanned."}
#             if qr_data["name"] != qr_data_list[0]["name"]:
#                 return {"success": False, "message": "Please scan the older QR code first."}
#         else:
#             qr_data = qr_data_list[0]
#             if qr_data["scanned"]:
#                 return {"success": False, "message": "This QR has already been scanned."}

#         # --------------------------------------
#         # STEP 2: Validate linked Product & Reward
#         # --------------------------------------
#         if not frappe.db.exists("Product QR", qr_data["product_qr"]):
#             return {"success": False, "message": "Linked Product QR not found."}

#         product_name = frappe.db.get_value("Product", qr_data["product_table_name"], "product_name")
#         if not product_name:
#             return {"success": False, "message": "Product not found."}

#         reward = frappe.get_all(
#             "Reward Point Canversion Table",
#             filters={"product_name": product_name},
#             fields=["payout_amount", "reward_point"],
#             order_by="from_date desc",
#             limit=1
#         )

#         payout_amount = reward_point = earned_amount = 0
#         if reward:
#             payout_amount = reward[0].payout_amount or 0
#             reward_point = reward[0].reward_point or 0

#             if float(payout_amount) > 0 and float(reward_point) > 0:
#                 earned_amount = (float(qr_data["points"]) / float(reward_point)) * float(payout_amount)

#         # ---------------------------
#         # STEP 3: Identify Customer
#         # ---------------------------
#         logged_in_user = frappe.session.user
#         user_mobile_no = frappe.db.get_value("User", logged_in_user, "mobile_no")
#         customer_id = frappe.db.get_value("Customer", {"mobile_number": user_mobile_no}, "name")

#         if not customer_id:
#             return {"success": False, "message": "Customer not found."}

#         # ---------------------------
#         # STEP 4–6 wrapped in transaction-like try/except
#         # ---------------------------
#         new_point_doc = None
#         qr_doc = frappe.get_doc("QR Data", qr_data["name"])
#         customer_doc = frappe.get_doc("Customer", customer_id)

#         try:
#             # Step 4: Update QR Data
#             qr_doc.scanned = 1
#             qr_doc.carpenter_id = customer_id
#             qr_doc.redeem_date = frappe.utils.nowdate()
#             qr_doc.earned_amount = earned_amount
#             qr_doc.points_added = 1
#             qr_doc.save(ignore_permissions=True)

#             # Step 5: Update Customer Points
#             customer_doc.total_points = (customer_doc.total_points or 0) + float(qr_data["points"])
#             customer_doc.current_points = (customer_doc.current_points or 0) + float(qr_data["points"])
#             customer_doc.save(ignore_permissions=True)

#             # Step 6: Insert Point History
#             new_point_doc = frappe.get_doc({
#                 "doctype": "Customer Product Point Detail",
#                 "customer_id": customer_id,
#                 "product_id": product_name,
#                 "earned_points": float(qr_data["points"]),
#                 "earned_amount": earned_amount,
#                 "date": frappe.utils.nowdate(),
#                 "time": frappe.utils.now_datetime().strftime('%H:%M:%S'),
#             })
#             new_point_doc.insert(ignore_permissions=True)

#             qr_doc.point_history_added = 1
#             qr_doc.save(ignore_permissions=True)

#             return {
#                 "success": True,
#                 "already_scanned": False,
#                 "message": "QR Code scanned and points added successfully.",
#                 "product_name": product_name,
#                 "product_qr_doc_name": qr_data["product_qr"],
#                 "product_qr_id": qr_data["name"],
#                 "points": qr_data["points"],
#                 "earned_amount": earned_amount,
#                 "payout_amount": payout_amount,
#                 "reward_point": reward_point,
#                 "customer_id": customer_id,
#                 "total_points": customer_doc.total_points,
#                 "current_points": customer_doc.current_points
#             }

#         except Exception as inner_e:
#             frappe.log_error("QR number Scan Rollback Error", str(inner_e))

#             # Rollback manually
#             if new_point_doc and new_point_doc.name:
#                 frappe.delete_doc("Customer Product Point Detail", new_point_doc.name, ignore_permissions=True)

#             if qr_doc:
#                 qr_doc.scanned = 0
#                 qr_doc.points_added = 0
#                 qr_doc.point_history_added = 0
#                 qr_doc.carpenter_id = None
#                 qr_doc.redeem_date = None
#                 qr_doc.earned_amount = 0
#                 qr_doc.save(ignore_permissions=True)

#             if customer_doc:
#                 customer_doc.total_points = (customer_doc.total_points or 0) - float(qr_data["points"])
#                 customer_doc.current_points = (customer_doc.current_points or 0) - float(qr_data["points"])
#                 customer_doc.save(ignore_permissions=True)

#             return {"success": False, "message": "Something went wrong, rolled back changes."}

#     except Exception as e:
#         frappe.log_error("QR number Scan Outer Error", str(e))
#         return {"success": False, "message": str(e)}

@frappe.whitelist()
def scan_and_update_qr_number(product_qr_id):
    try:
        # ---------------------------
        # STEP 0: Validate input
        # ---------------------------
        if not product_qr_id:
            return {"success": False, "message": "Product QR ID is required."}

        # ---------------------------
        # STEP 1: Fetch QR Data record
        # ---------------------------
        qr_data_list = frappe.get_all(
            "QR Data",
            filters={"product_qr_id": product_qr_id},
            fields=["name", "product_qr", "product_table_name", "points", "scanned"],
            order_by="creation asc"
        )
        if not qr_data_list:
            return {"success": False, "message": "QR Code not found."}
        
        # Always get the first unscanned QR
        qr_data = next((qr for qr in qr_data_list if not bool(qr.get("scanned"))), None)

        if not qr_data:
            # No unscanned QR found
            return {"success": False, "message": "This QR Number has already been scanned."}

        # If multiple QR records exist, enforce scanning older QR first
        if len(qr_data_list) > 1:
            oldest_unscanned = next((qr for qr in qr_data_list if not bool(qr.get("scanned"))), None)
            if oldest_unscanned and qr_data["name"] != oldest_unscanned["name"]:
                return {"success": False, "message": "Please scan the older QR code first."}

        # # Handle duplicate QR entries
        # if len(qr_data_list) > 1:
        #     qr_data = next((qr for qr in qr_data_list if not qr.scanned), None)
        #     if not qr_data:
        #         return {"success": False, "message": "All QRs with this ID are already scanned."}
        #     if qr_data["name"] != qr_data_list[0]["name"]:
        #         return {"success": False, "message": "Please scan the older QR code first."}
        # else:
        #     qr_data = qr_data_list[0]
        #     if qr_data["scanned"]:
        #         return {"success": False, "message": "This QR Number has already been scanned."}

        # ---------------------------
        # STEP 2: Validate Product & Reward
        # ---------------------------
        product_list = frappe.get_all("Product QR", filters={"name": qr_data["product_qr"]}, fields=["name"])
        if not product_list:
            return {"success": False, "message": "Linked Product QR not found."}

        product_docs = frappe.get_all("Product", filters={"name": qr_data["product_table_name"]}, fields=["product_name"])
        if not product_docs:
            return {"success": False, "message": "Product not found."}
        product_name = product_docs[0].product_name

        reward = frappe.get_all(
            "Reward Point Canversion Table",
            filters={"product_name": product_name},
            fields=["payout_amount", "reward_point"],
            order_by="from_date desc",
            limit=1
        )

        payout_amount = reward_point = earned_amount = 0
        if reward:
            payout_amount = reward[0].payout_amount or 0
            reward_point = reward[0].reward_point or 0
            if float(payout_amount) > 0 and float(reward_point) > 0:
                earned_amount = (float(qr_data["points"]) / float(reward_point)) * float(payout_amount)

        # ---------------------------
        # STEP 3: Identify Customer
        # ---------------------------
        user = frappe.session.user
        user_doc = frappe.get_doc("User", user)
        customers = frappe.get_all("Customer", filters={"mobile_number": user_doc.mobile_no}, fields=["name"])
        if not customers:
            return {"success": False, "message": "Customer not found."}
        customer_id = customers[0].name

        # ---------------------------
        # TRANSACTION START
        # ---------------------------
        frappe.db.begin()
        qr_doc = frappe.get_doc("QR Data", qr_data["name"])
        customer_doc = frappe.get_doc("Customer", customer_id)

        # Step 1: Mark QR scanned
        qr_doc.scanned = 1
        qr_doc.carpenter_id = customer_id
        qr_doc.redeem_date = frappe.utils.nowdate()
        qr_doc.earned_amount = earned_amount
        qr_doc.save(ignore_permissions=True)

        # Step 2: Create Point History
        point_history_doc = frappe.get_doc({
            "doctype": "Customer Product Point Detail",
            "customer_id": customer_id,
            "product_id": product_name,
            "earned_points": float(qr_data["points"]),
            "earned_amount": earned_amount,
            "date": frappe.utils.nowdate(),
            "time": frappe.utils.now_datetime().strftime("%H:%M:%S")
        })
        point_history_doc.insert(ignore_permissions=True)

        qr_doc.point_history_added = 1
        qr_doc.save(ignore_permissions=True)

        # Step 3: Update Customer Points
        customer_doc.total_points = (customer_doc.total_points or 0) + float(qr_data["points"])
        customer_doc.current_points = (customer_doc.current_points or 0) + float(qr_data["points"])
        customer_doc.save(ignore_permissions=True)

        qr_doc.points_added = 1
        qr_doc.save(ignore_permissions=True)

        # ---------------------------
        # STEP 4: Reconciliation
        # ---------------------------
        qr_points_sum = sum([q.points for q in frappe.get_all(
            "QR Data",
            filters={"carpenter_id": customer_id, "scanned": 1},
            fields=["points"]
        )])

        earned_points_sum = sum([h.earned_points for h in frappe.get_all(
            "Customer Product Point Detail",
            filters={"customer_id": customer_id},
            fields=["earned_points"]
        )])

        if customer_doc.total_points != qr_points_sum or customer_doc.total_points != earned_points_sum:
            customer_doc.total_points = qr_points_sum
            customer_doc.current_points = qr_points_sum
            customer_doc.save(ignore_permissions=True)

        frappe.db.commit()

        return {
            "success": True,
            "already_scanned": False,
            "message": "QR Code scanned and points added successfully.",
            "product_name": product_name,
            "product_qr_doc_name": qr_data["product_qr"],
            "product_qr_id": qr_data["name"],
            "points": qr_data["points"],
            "earned_amount": earned_amount,
            "payout_amount": payout_amount,
            "reward_point": reward_point,
            "customer_id": customer_id,
            "total_points": customer_doc.total_points,
            "current_points": customer_doc.current_points,
            "total_qr_points": qr_points_sum,
            "total_earned_points": earned_points_sum
        }

    except Exception as e:
        frappe.db.rollback()
        frappe.log_error("QR Number Scan Transaction Error", str(e))
        return {"success": False, "message": f"Transaction failed: {str(e)}"}

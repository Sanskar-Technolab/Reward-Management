import frappe
from frappe import _

@frappe.whitelist(allow_guest=True) 
def get_bank_history_details():
    try:
        logged_in_user = frappe.session.user
        user_info = frappe.get_doc("User", logged_in_user)
        user_mobile_no = user_info.mobile_no
        customer = frappe.get_doc("Customer", {"mobile_number": user_mobile_no})
        
        if customer:
            bank_history = frappe.get_list("Bank Balance",
                                           filters={"carpainter_id": customer.name},
                                           fields=["name", "transaction_id", "transfer_date", "transfer_time", "amount", "mobile_number", "redeem_request_id", "carpainter_id"])
            
            # Format dates in bank_history
            for entry in bank_history:
                if entry.get('transfer_date'):
                    entry['transfer_date'] = frappe.utils.formatdate(entry['transfer_date'], 'dd-MM-yyyy')
                
            return {"data": bank_history}
        else:
            return {"data": [], "error": "Customer not found"}
    except Exception as e:
        return {"data": [], "error": str(e)}

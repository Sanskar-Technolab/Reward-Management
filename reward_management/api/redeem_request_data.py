import frappe
from frappe import _

@frappe.whitelist()
def get_redeem_request_details():
    try:
        logged_in_user = frappe.session.user
        user_info = frappe.get_doc("User", logged_in_user)
        user_mobile_no = user_info.mobile_no
        customer = frappe.get_doc("Customer", {"mobile_number": user_mobile_no})
        
        if customer:
            redeem_requests = frappe.get_list("Redeem Request",
                                              filters={"customer_id": customer.name},
                                              fields=["name", "received_date", "received_time", "redeemed_points", "request_status", "approved_on", "approve_time", "current_point_status", "total_points"])
            
            # Format dates in redeem_requests
            for request in redeem_requests:
                if request.get('received_date'):
                    request['received_date'] = frappe.utils.formatdate(request['received_date'], 'dd-MM-yyyy')
                if request.get('approved_on'):
                    request['approved_on'] = frappe.utils.formatdate(request['approved_on'], 'dd-MM-yyyy')
            
            return {"message": redeem_requests}
        else:
            return {"message": [], "error": "Customer not found"}
    except Exception as e:
        return {"message": [], "error": str(e)}

    

# Copyright (c) 2025, Palak Padalia and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class QRData(Document):
	pass



@frappe.whitelist()
def view_follow_up_enquiry(docname, limit_page_length=None, limit_start=None ):
    # Get paginated results
    qr_data = frappe.get_list(
        'QR Data',
        filters={'product_qr': docname},
        fields=['name', 'product_qr', 'product_table_name', 'product_qr_id', 
               'points', 'generated_date', 'generated_time', 'product_qr_name',
               'carpenter_id', 'qr_code_image', 'scanned', 'redeem_date', 'earned_amount'],
        limit_page_length=int(limit_page_length),
        limit_start=int(limit_start),
        order_by='creation'  # Important for consistent pagination
    )
    
    # Get total count for pagination
    total_count = frappe.db.count('QR Data', {'product_qr': docname})
    
    return {
        'data': qr_data,
        'total_count': total_count,
        'page_size': int(limit_page_length),
        'current_page': (int(limit_start) // int(limit_page_length)) + 1
    }
# Copyright (c) 2025, Palak Padalia and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class CustomerGiftPointDetails(Document):
	pass
@frappe.whitelist()
def view_gift_point_details(docname, limit_page_length=None, limit_start=None ):
    # Get paginated results
    gift_point_data = frappe.get_list(
        'Customer Gift Point Details',
        filters={'customer_id': docname},
        fields=['name', 'gift_id', 'gift_product_name', 'deduct_gift_points', 
                'date', 'customer_name','customer_id', 'time'],
        limit_page_length=int(limit_page_length),
        limit_start=int(limit_start),
        order_by='creation'  # Important for consistent pagination
    )
    
    # Get total count for pagination
    total_count = frappe.db.count('Customer Gift Point Details', {'customer_id': docname})
    
    return {
        'data': gift_point_data,
        'total_count': total_count,
        'page_size': int(limit_page_length),
        'current_page': (int(limit_start) // int(limit_page_length)) + 1
    }
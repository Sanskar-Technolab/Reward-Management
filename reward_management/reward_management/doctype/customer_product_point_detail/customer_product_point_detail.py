# Copyright (c) 2025, Palak Padalia and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class CustomerProductPointDetail(Document):
	pass

@frappe.whitelist()
def view_product_point_details(docname, limit_page_length=None, limit_start=None ):
    # Get paginated results
    product_point_data = frappe.get_list(
        'Customer Product Point Detail',
        filters={'customer_id': docname},
        fields=['name', 'product_id', 'product_name', 'earned_points', 
               'earned_amount', 'date', 'product_image', 'customer_full_name','product_category',
               'customer_id', 'time'],
        limit_page_length=int(limit_page_length),
        limit_start=int(limit_start),
        order_by='creation'  # Important for consistent pagination
    )
    
    # Get total count for pagination
    total_count = frappe.db.count('Customer Product Point Detail', {'customer_id': docname})
    
    return {
        'data': product_point_data,
        'total_count': total_count,
        'page_size': int(limit_page_length),
        'current_page': (int(limit_start) // int(limit_page_length)) + 1
    }
import frappe
from frappe.model.document import Document

@frappe.whitelist(allow_guest=True)
def get_company_address():
    # Fetch fields from the single doctype
    company_address = frappe.db.get_single_value("Company Address", "address")
    company_email = frappe.db.get_single_value("Company Address", "email")
    company_website = frappe.db.get_single_value("Company Address", "website")
    
    # Fetch child table data
    company_mobile_data = frappe.get_all(
        "Company Mobile Child", 
        filters={"parent": "Company Address"},
        fields=["mobile_number"]
    )
    
    # Prepare the response dictionary
    response = {
        "address": company_address,
        "email": company_email,
        "website": company_website,
        "mobile_numbers": [entry["mobile_number"] for entry in company_mobile_data]
    }
    
    return response

   

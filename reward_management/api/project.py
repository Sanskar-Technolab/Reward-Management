import frappe
from frappe.model.document import Document
@frappe.whitelist(allow_guest=True)
def get_project():
    
    # Fetch child table data
    project_image_data = frappe.get_all(
        "Project Image", 
        filters={"parent": "Project"},
        fields=["image"]
    )
    
    # Prepare the response dictionary
    response = {
        "images": [entry["image"] for entry in project_image_data]
    }
    
    return response
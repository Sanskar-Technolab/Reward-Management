import frappe
from frappe.model.document import Document

# @frappe.whitelist(allow_guest=True)
# def get_instructions():
#     try:
#         # Fetch all Login Guide records
#         login_guide = frappe.get_all(
#             "Login Guide", 
#             fields=["name", "instruction_name","image","description"]
#         )
        
#         if login_guide:
#             all_guide_instruction = []
            
#             # Loop through each guide to get its child table data
#             for guide_list in login_guide:
#                 # Fetch related Login Instruction Guide records
#                 login_guide_image_description = frappe.get_all(
#                     "Login Instruction Guide", 
#                     filters={"parent": guide_list.get("name")}, 
#                     fields=["guide_image", "image_description"]
#                 )
                
#                 # Add the fetched child table data to the guide record
#                 guide_list["guide_image"] = login_guide_image_description
                
#                 # Append the complete guide to the result list
#                 all_guide_instruction.append(guide_list)
            
#             # Return the complete data in JSON format
#             return {
#                 "status": "success", 
#                 "data": all_guide_instruction  # Include all fetched data in the response
#             }
#         else:
#             # If no guides are found, return an empty data array
#             return {
#                 "status": "success", 
#                 "data": [], 
#                 "message": "No Guide Instruction found"
#             }
#     except Exception as e:
#         # Log the error for debugging purposes in the Frappe error logs
#         frappe.log_error(frappe.get_traceback(), "Get Guide Instruction Error")
        
#         # Return an error response in JSON format
#         return {
#             "status": "error", 
#             "message": str(e)
#         }
@frappe.whitelist(allow_guest=True)
def get_instructions():
    try:
        # Fetch all Login Guide records with specified fields
        login_guide = frappe.get_all(
            "Login Guide", 
            fields=["name", "instruction_name", "image", "description"]
        )
       
        # Return the fetched data
        return {
            "status": "success", 
            "data": login_guide  # Include all fetched records in the response
        }
    except Exception as e:
        # Log the error for debugging purposes in the Frappe error logs
        frappe.log_error(frappe.get_traceback(), "Get Guide Instruction Error")
        
        # Return an error response in JSON format
        return {
            "status": "error", 
            "message": str(e)
        }

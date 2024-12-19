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


# @frappe.whitelist(allow_guest=True)
# def get_instructions():
#     try:
#         # Fetch all Login Guide records with specified fields
#         login_guide = frappe.get_all(
#             "Login Guide", 
#             fields=["name", "instruction_name", "image", "description"]
#         )
       
#         # Return the fetched data
#         return {
#             "status": "success", 
#             "data": login_guide  # Include all fetched records in the response
#         }
#     except Exception as e:
#         # Log the error for debugging purposes in the Frappe error logs
#         frappe.log_error(frappe.get_traceback(), "Get Guide Instruction Error")
        
#         # Return an error response in JSON format
#         return {
#             "status": "error", 
#             "message": str(e)
#         }

# get all instruction guide single doctype--------
@frappe.whitelist(allow_guest=True)
def get_instructions():
    # Fetch child table data
    instruction_data = frappe.get_all(
        "Login Instruction Guide", 
        filters={"parenttype": "Login Instruction"},  # Correct parent filter
        fields=["guide_image", "image_description"]
    )
    
    # Prepare the response dictionary
    response = {
        "instructions": [
            {"guide_image": entry["guide_image"], "image_description": entry["image_description"]}
            for entry in instruction_data
        ]
    }
    
    return response


# ADD or UPDATE INSTRUCTIONS--------
@frappe.whitelist(allow_guest=True)
def add_update_instructions(new_image_url, image_description):
    # Ensure the inputs are lists
    if not isinstance(new_image_url, list):
        frappe.throw("The 'new_image_url' parameter must be an array of image URLs.")
    
    if not isinstance(image_description, list):
        frappe.throw("The 'image_description' parameter must be an array of descriptions.")

    # Ensure the lists have the same length
    if len(new_image_url) != len(image_description):
        frappe.throw("The number of image URLs must match the number of descriptions.")

    # Fetch the parent document
    try:
        instruction_doc = frappe.get_doc("Login Instruction", "Login Instruction")
    except frappe.DoesNotExistError:
        frappe.throw("The 'Login Instruction' document does not exist.")

    # Clear existing child table rows
    instruction_doc.set("instruction_table", [])  # Reset the child table

    # Append new rows to the child table
    for image_url, description in zip(new_image_url, image_description):
        instruction_doc.append("instruction_table", {
            "guide_image": image_url,
            "image_description": description
        })

    # Save the updated document
    instruction_doc.save()
    frappe.db.commit()

    return {
        "status": "success",
        "message": "Instruction images and descriptions updated successfully",
        "updated_images": new_image_url,
        "updated_descriptions": image_description
    }

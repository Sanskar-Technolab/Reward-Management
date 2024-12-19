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


# # ADD or UPDATE INSTRUCTIONS--------
@frappe.whitelist(allow_guest=True)
def add_new_instruction(new_image_url, image_description):
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

    # Append new rows to the child table without clearing the existing ones
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
        "message": "New instruction images and descriptions added successfully",
        "added_images": new_image_url,
        "added_descriptions": image_description
    }


@frappe.whitelist(allow_guest=True)
def add_update_instructions(selected_images, selected_descriptions):
    # Validate inputs
    if not isinstance(selected_images, list):
        frappe.throw("The 'selected_images' parameter must be a list of image URLs.")
    
    if not isinstance(selected_descriptions, list):
        frappe.throw("The 'selected_descriptions' parameter must be a list of descriptions.")

    if len(selected_images) != len(selected_descriptions):
        frappe.throw("The number of images and descriptions must match.")

    # Fetch the parent document
    instruction_doc = frappe.get_doc("Login Instruction", "Login Instruction")
    
    # Update only selected images and descriptions
    for idx, (image_url, description) in enumerate(zip(selected_images, selected_descriptions)):
        if idx < len(instruction_doc.instruction_table):
            # Update existing child rows
            instruction_doc.instruction_table[idx].update({
                "guide_image": image_url,
                "image_description": description
            })
        else:
            # Append new rows if more data is provided
            instruction_doc.append("instruction_table", {
                "guide_image": image_url,
                "image_description": description
            })

    # Save changes
    instruction_doc.save(ignore_permissions=True)
    frappe.db.commit()

    return {
        "status": "success",
        "message": "Selected instructions updated successfully",
        "updated_images": selected_images,
        "updated_descriptions": selected_descriptions
    }

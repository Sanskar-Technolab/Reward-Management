import frappe
from frappe.model.document import Document



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
@frappe.whitelist(allow_guest=False)
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

# updated selected slider ------
@frappe.whitelist()
def add_update_instructions(image_url, new_image_url=None, new_image_description=None):
    if not image_url or not new_image_url:
        return {
            "success": False,
            "message": "Image URL or new image URL is missing."
        }

    instruction_doc = frappe.get_single("Login Instruction")

    found = False
    for idx, row in enumerate(instruction_doc.instruction_table):
        if row.guide_image == image_url:
            # Update the existing row
            instruction_doc.instruction_table[idx].guide_image = new_image_url
            instruction_doc.instruction_table[idx].image_description = new_image_description
            found = True
            break

    if not found:
        # Add new row if not found (optional)
        new_row = instruction_doc.append('instruction_table', {})
        new_row.guide_image = new_image_url
        new_row.image_description = new_image_description

    instruction_doc.save()
    return {
        "status": "success",
        "message": "Instruction updated successfully"
    }
# @frappe.whitelist(allow_guest=False)
# def add_update_instructions(selected_images, selected_descriptions):
#     # Validate inputs
#     if not isinstance(selected_images, list):
#         frappe.throw("The 'selected_images' parameter must be a list of image URLs.")
    
#     if not isinstance(selected_descriptions, list):
#         frappe.throw("The 'selected_descriptions' parameter must be a list of descriptions.")

#     if len(selected_images) != len(selected_descriptions):
#         frappe.throw("The number of images and descriptions must match.")

#     # Fetch the parent document
#     instruction_doc = frappe.get_doc("Login Instruction", "Login Instruction")
    
#     # Update only selected images and descriptions
#     for idx, (image_url, description) in enumerate(zip(selected_images, selected_descriptions)):
#         if idx < len(instruction_doc.instruction_table):
#             # Update existing child rows
#             instruction_doc.instruction_table[idx].update({
#                 "guide_image": image_url,
#                 "image_description": description
#             })
#         else:
#             # Append new rows if more data is provided
#             instruction_doc.append("instruction_table", {
#                 "guide_image": image_url,
#                 "image_description": description
#             })

#     # Save changes
#     instruction_doc.save(ignore_permissions=True)
#     frappe.db.commit()

#     return {
#         "status": "success",
#         "message": "Selected instructions updated successfully",
#         "updated_images": selected_images,
#         "updated_descriptions": selected_descriptions
#     }


# delete selected slider image
@frappe.whitelist()
def delete_selected_instruction(image_name,description):
    if not image_name:
        return {
            "success": False,
            "message": "Image name is required."
        }
    
    # Fetch the single Project doc
    instruction_doc = frappe.get_single("Login Instruction")

    # Find and remove the matching row from the child table
    found = False
    for row in instruction_doc.instruction_table:
        if row.guide_image == image_name:
            instruction_doc.remove(row)
            found = True
            break
        if row.image_description == description:
            instruction_doc.remove(row)
            found = True
            break
    

    if not found:
        frappe.throw(f"No image found with name: {image_name}")

    # Save changes and commit
    instruction_doc.save()
    frappe.db.commit()

    return {
        "status": "success",
        "message": "Project image deleted successfully"
    }



# delete all project
@frappe.whitelist()
def delete_all_instructions():
    # Fetch the single Project doc
    project_doc = frappe.get_single("Login Instruction")

    # Clear all rows in the child table
    project_doc.set("instruction_table", [])
    project_doc.save()
    frappe.db.commit()
    return {
        "status": "success",
        "message": "All Instructions deleted successfully"
    }





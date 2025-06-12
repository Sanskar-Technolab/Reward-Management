import frappe
from frappe.model.document import Document


# get current project details
@frappe.whitelist()
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

# # update or add new project------
# @frappe.whitelist(allow_guest=True)
# def add_project(new_image_url):
#     if not isinstance(new_image_url, list):
#         frappe.throw(_("The new_image_url must be an array."))

#     # Fetch existing child table rows
#     project_images = frappe.get_all(
#         "Project Image",
#         filters={"parent": "Project"},
#         fields=["name", "image"],
#         order_by="idx"
#     )

#     # Load the parent document
#     project_doc = frappe.get_doc("Project", "Project")

#     # Update existing rows or add new rows
#     for idx, image_url in enumerate(new_image_url):
#         if idx < len(project_images):
#             # Update existing row
#             project_images[idx]["image"] = image_url
#             project_doc.update({
#                 "project_image": project_images
#             })
#         else:
#             # Add a new row if not enough existing rows
#             project_doc.append("project_image", {"image": image_url})

#     # Save the updated document
#     project_doc.save()
#     frappe.db.commit()

#     return {"status": "success", "message": "Project images updated successfully"}


@frappe.whitelist()
def add_project(new_image_url):
    try:
        current_user = frappe.session.user
        
         # Get current user's roles
        user_roles = frappe.get_roles(current_user)

        # Allow only Administrator or users with "Admin" role
        if current_user != "Administrator" and "Admin" not in user_roles:
            return {"success": False, "message": "Permission denied"}
    # Ensure the input is a list
        if not isinstance(new_image_url, list):
            frappe.throw(("The 'new_image_url' parameter must be an array of image URLs."))

        # Fetch the parent document
        try:
            project_doc = frappe.get_doc("Project", "Project")
        except frappe.DoesNotExistError:
            frappe.throw(("The 'Project' document does not exist."))

        # Clear existing child table rows
        project_doc.set("project_image", [])  # Reset the child table

        # Append new rows to the child table
        for image_url in new_image_url:
            project_doc.append("project_image", {
                "image": image_url
            })

        # Save the updated document
        project_doc.save()
        frappe.db.commit()

        return {
            "status": "success",
            "message": "Project images updated successfully",
            "updated_images": new_image_url
        }
    except Exception as e:
        frappe.log_error("API Add Project Error", str(e))
        return {
            "success": False,
            "status": "failed",
            "message": str(e)
        }


# update selected slider image
@frappe.whitelist()
def update_selected_project_image(image_name, new_image_url):
    try:
        current_user = frappe.session.user
        
         # Get current user's roles
        user_roles = frappe.get_roles(current_user)

        # Allow only Administrator or users with "Admin" role
        if current_user != "Administrator" and "Admin" not in user_roles:
            return {"success": False, "message": "Permission denied"}
        if not image_name or not new_image_url:
            return {
                "success": False,
                "message": "Image name or new image URL is missing."
            }

        project_doc = frappe.get_single("Project")

        found = False
        for idx, row in enumerate(project_doc.project_image):
            if row.image == image_name:
                # Directly update the child row's field
                project_doc.project_image[idx].image = new_image_url
                found = True
                break

        if not found:
            return {
                "success": False,
                "message": f"No image found with name: {image_name}"
            }

        project_doc.save(ignore_version=True)  # Optional: skip versioning if not needed
        return {
            "status": "success",
            "message": "Project image updated successfully"
        }
    except Exception as e:
        frappe.log_error("API Update Project Image Error", str(e))
        return {
            "success": False,
            "status": "failed",
            "message": str(e)
        }




# delete selected slider image
@frappe.whitelist()
def delete_project_image(image_name):
    try:
        current_user = frappe.session.user
        
         # Get current user's roles
        user_roles = frappe.get_roles(current_user)

        # Allow only Administrator or users with "Admin" role
        if current_user != "Administrator" and "Admin" not in user_roles:
            return {"success": False, "message": "Permission denied"}
        if not image_name:
            return {
                "success": False,
                "message": "Image name is required."
            }
        
        # Fetch the single Project doc
        project_doc = frappe.get_single("Project")

        # Find and remove the matching row from the child table
        found = False
        for row in project_doc.project_image:
            if row.image == image_name:
                project_doc.remove(row)
                found = True
                break

        if not found:
            frappe.throw(f"No image found with name: {image_name}")

        # Save changes and commit
        project_doc.save()
        frappe.db.commit()

        return {
            "status": "success",
            "message": "Project image deleted successfully"
        }
    except Exception as e:
        frappe.log_error("API Delete Project Image Error", str(e))
        return {
            "success": False,
            "status": "failed",
            "message": str(e)
        }


# delete all project
@frappe.whitelist()
def delete_all_project():
    try:
        current_user = frappe.session.user
        
         # Get current user's roles
        user_roles = frappe.get_roles(current_user)

        # Allow only Administrator or users with "Admin" role
        if current_user != "Administrator" and "Admin" not in user_roles:
            return {"success": False, "message": "Permission denied"}
        # Fetch the single Project doc
        project_doc = frappe.get_single("Project")

        # Clear all rows in the child table
        project_doc.set("project_image", [])
        project_doc.save()
        frappe.db.commit()
        return {
            "status": "success",
            "message": "All project images deleted successfully"
        }
    except Exception as e:
        frappe.log_error("API Delete All Project Images Error", str(e))
        return {
            "success": False,
            "status": "failed",
            "message": str(e)
        }




# add new slider image------------------------
@frappe.whitelist()
def add_new_slider(image_url):
    if not image_url:
        return {
            "success": False,
            "message":"Image is not found."
        }
    try:
        current_user = frappe.session.user
        
         # Get current user's roles
        user_roles = frappe.get_roles(current_user)

        # Allow only Administrator or users with "Admin" role
        if current_user != "Administrator" and "Admin" not in user_roles:
            return {"success": False, "message": "Permission denied"}
        project_doc = frappe.get_single("Project")
        # Append the new image URL to the child table
        new_image_row = project_doc.append("project_image")
        new_image_row.image = image_url
        # Save the updated document
        project_doc.save()
        frappe.db.commit()
        return {
            "status": "success",
            "message": "Project image added successfully",
            "image_url": image_url
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"Error adding image: {str(e)}"
        }
        
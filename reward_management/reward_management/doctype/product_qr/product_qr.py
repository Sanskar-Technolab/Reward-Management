# Copyright (c) 2024, Palak Padalia and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class ProductQR(Document):
	pass


@frappe.whitelist()
def delete_product_qr_attachments(docname, enqueue=False):
    """
    Delete all file attachments linked to a Product QR document
    Args:
        docname (str): Name of the Product QR document
        enqueue (bool): Whether to run in background (default False)
    Returns:
        dict: Status and message
    """
    try:
        # Verify document exists
        if not frappe.db.exists("Product QR", docname):
            return {
                "status": "error",
                "message": f"Product QR {docname} not found"
            }

        if enqueue:
            # Enqueue the deletion job in background
            frappe.enqueue(
                method=_delete_attachments_background,
                queue='long',
                job_name=f"Delete Attachments for {docname}",
                timeout=600,  # 10 minutes timeout
                docname=docname,
                now=False
            )
            
            return {
                "status": "queued",
                "message": f"Attachment deletion for Product QR {docname} has been queued in background"
            }
        else:
            # Run immediately (for small/sync operations)
            return _delete_attachments_immediately(docname)

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Delete Product QR Attachments Error")
        return {
            "status": "error",
            "message": str(e)
        }

def _delete_attachments_background(docname):
    """Background job to delete attachments"""
    try:
        result = _delete_attachments_immediately(docname)
        if result.get("status") == "success":
            frappe.publish_realtime('attachment_deletion_complete', {
                'docname': docname,
                'status': 'success',
                'message': result.get("message")
            })
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Background Attachment Deletion Error")
        frappe.publish_realtime('attachment_deletion_complete', {
            'docname': docname,
            'status': 'error',
            'message': str(e)
        })

def _delete_attachments_immediately(docname):
    """Immediate deletion of attachments"""
    attachments = frappe.get_all("File", 
        filters={
            "attached_to_doctype": "Product QR",
            "attached_to_name": docname
        },
        fields=["name"]
    )

    if not attachments:
        return {
            "status": "success",
            "message": f"No attachments found for Product QR {docname}"
        }

    deleted_files = []
    for file in attachments:
        frappe.delete_doc("File", file.name, ignore_permissions=True)
        deleted_files.append(file.name)

    return {
        "status": "success",
        "message": f"Deleted {len(deleted_files)} attachments from Product QR {docname}",
        "deleted_files": deleted_files
    }
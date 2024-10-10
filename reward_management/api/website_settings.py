# reward_management/api.py

import frappe
from frappe import _

@frappe.whitelist(allow_guest=True)
def get_website_settings():
    try:
        # Fetch the Website Settings doctype
        website_settings = frappe.get_single('Website Settings')  # Assuming 'Website Settings' doctype

        if website_settings:
            # Include the banner_image field and other fields you want to fetch
            settings_data = {
                "home_page": website_settings.home_page,
                "brand_html": website_settings.brand_html,
                "banner_image": website_settings.banner_image, 
                "favicon": website_settings.favicon
                
            }
            return {"status": "success", "data": settings_data}
        else:
            return {"status": "error", "message": _("Website Settings not found")}
    except Exception as e:
        return {"status": "error", "message": str(e)}

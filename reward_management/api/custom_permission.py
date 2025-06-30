
# import frappe

# def get_permission_query_conditions(user):
#     if not user:
#         user = frappe.session.user
        
#     try:
#         # Check for Administrator or any role containing "Admin"
#         if user == "Administrator" or any("Admin" in role for role in frappe.get_roles(user)):
#             return ""
    
#         if "Customer" in frappe.get_roles(user):
#             return f"`tabCustomer`.`email` = {frappe.db.escape(frappe.session.user)}"
        
#         if "Customer" in frappe.get_roles(user):
#             return f"`tabCustomer Gift Point Details`.`email` = {frappe.db.escape(frappe.session.user)}""
    
#         return ""
#     except Exception as e:
#         frappe.log_error("Permission Query Error", str(e))
#         return ""


import frappe

def get_permission_query_conditions(user):
    if not user:
        user = frappe.session.user
        
    try:
        # Check for Administrator or any admin role
        if user == "Administrator" or any("Admin" in role for role in frappe.get_roles(user)):
            return ""
    
        if "Customer" in frappe.get_roles(user):
            # Get mobile number once (optimized query)
            mobile_no = frappe.db.get_value("User", user, "mobile_no")
            
            # Get doctype from request
            doctype = frappe.form_dict.get('doctype') or frappe.request.args.get('doctype')
            
            if doctype == "Customer":
                return f"`tabCustomer`.`email` = {frappe.db.escape(user)}"
            elif doctype == "Customer Gift Point Details":
                return f"`tabCustomer Gift Point Details`.`email` = {frappe.db.escape(user)}"
            elif doctype == "Customer Registration":
                if mobile_no:
                    return f"`tabCustomer Registration`.`mobile_number` = {frappe.db.escape(mobile_no)}"
                return "1=0"  # Return false condition if no mobile number
            elif doctype =="User":
                return f"`tabUser`.`email` = {frappe.db.escape(user)}"
            elif doctype == "Bank Balance":
                return f"`tabBank Balance`.`mobile_number` = {frappe.db.escape(mobile_no)}"
          
    
        return ""
    except Exception as e:
        frappe.log_error(f"Permission Query Error for user {user}", str(e))
        return ""
    
    
    

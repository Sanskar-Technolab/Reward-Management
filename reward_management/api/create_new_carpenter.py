import frappe
from frappe.model.document import Document

@frappe.whitelist(allow_guest=True)
def create_new_carpainters(firstname, lastname, city, mobile):
    try:
        # Check if the Carpainter already exists
        carpainter_by_mobile = frappe.db.exists("Customer", {"mobile_number": mobile})

        if carpainter_by_mobile:
            return {"status": "failed", "message": "Customer already exists. Please login into your account."}

        # Create full_name by combining first_name and last_name
        full_name = f"{firstname} {lastname}"

        # Create a new Carpainter
        carpenter = frappe.get_doc({
            "doctype": "Customer",
            "first_name": firstname,
            "last_name": lastname,
            "full_name": full_name,  # Set full_name here
            "city": city,
            "mobile_number": mobile,
            # "naming_series": "Carpainter.-.{full_name}.-.YYYY.-.#####",  # Adjust as per your naming convention
            "status": "Pending"  # Set status to "Pending"
        })
        carpenter.insert()

        # Log the details of the newly created Carpainter
        carpainter_dict = carpenter.as_dict()
        carpainter_details = "\n".join([f"{key}: {value}" for key, value in carpainter_dict.items()])
        frappe.logger().info(f"New Customer Details:\n{carpainter_details}")

        # Create a new Carpainter Registration with carpainter_id set to the name of the created Carpainter
        carpainter_registration = frappe.get_doc({
            "doctype": "Customer Registration",
            "carpainter_id": carpenter.name,  # Set carpainter_id to the name of the Carpainter
            "carpainter_name": full_name,
            "mobile_number": mobile,
            "status": "Pending",  # Set status to "Pending"
            "registration_date": frappe.utils.now_datetime().strftime('%Y-%m-%d'),  # Set registration_date to the current date
            "registration_time": frappe.utils.now_datetime().strftime('%H:%M:%S'),# Set registration_date to the current datetime
            "approved_time": ""
        })
        carpainter_registration.insert()

        # Call function to create users for all Approved Carpainters
        create_users_for_approved_carpainters()

        return {"status": "success", "message": "Customer and Customer Registration created successfully"}
    except Exception as e:
        frappe.logger().error(f"Error creating Customer or Customer Registration: {str(e)}")
        return {"status": "failed", "message": str(e)}


@frappe.whitelist(allow_guest=True)
def check_carpainter_registration(mobile_no):
    try:
        # Check if the Carpainter with the provided mobile number already exists
        carpainter_by_mobile = frappe.db.exists("Customer", {"mobile_number": mobile_no})

        if carpainter_by_mobile:
            return {"is_registered": True, "message": "Customer already exists. Please login into your account."}
        else:
            return {"is_registered": False}
    except Exception as e:
        return {"is_registered": False, "message": str(e)}
    
    
    
@frappe.whitelist(allow_guest=True)

def create_users_for_approved_carpainters():
    try:
        # Fetch all Carpainters with status "Approved"
        approved_carpainters = frappe.get_all("Customer", filters={"status": "Approved"})

        for carpenter in approved_carpainters:
            firstname = carpenter.get("first_name")
            lastname = carpenter.get("last_name")
            city = carpenter.get("city")
            mobile_no = carpenter.get("mobile_number")
            full_name = f"{firstname} {lastname}"
            email = f"{mobile_no}@gmail.com"
            username = f"{firstname}_{lastname}"  # Adjust as per your naming convention for username

            # Create a new user
            user = frappe.get_doc({
                "doctype": "User",
                "email": email,
                "mobile_no": mobile_no,
                "username": username,
                "first_name": full_name,
                "role_profile_name": "Customer",  # Assigning role as Carpainter
                "send_welcome_email": True  # Optionally send welcome email
            })

            user.insert(ignore_permissions=True)

            # Log the details of the newly created user
            user_dict = user.as_dict()
            user_details = "\n".join([f"{key}: {value}" for key, value in user_dict.items()])
            frappe.logger().info(f"New User Details:\n{user_details}")

        frappe.logger().info("Created users for all approved Customer.")

    except Exception as e:
        frappe.logger().error(f"Error creating users for approved Customer: {str(e)}")

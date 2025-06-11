# import frappe
# import requests

# @frappe.whitelist()
# def send_otp_sms(mobile_number, otp):
#     sms_settings = frappe.get_single('SMS Settings')
    
#     # 1. Print SMS Settings basic fields
#     print("\n--- SMS Settings ---")
#     print(f"Gateway URL: {sms_settings.sms_gateway_url}")
#     print(f"Receiver Parameter: {sms_settings.receiver_parameter}")
#     print(f"Message Parameter: {sms_settings.message_parameter}")

#     if not sms_settings.sms_gateway_url:
#         frappe.throw("SMS Gateway URL is not configured in SMS Settings.")

#     url = sms_settings.sms_gateway_url

#     params = {}
#     headers = {}

#     # 2. Print all parameters from Child Table
#     print("\n--- Child Table Parameters ---")
#     if hasattr(sms_settings, "parameters"):
#         for param in sms_settings.parameters:
#             print(f"Param: {param.parameter} = {param.value}, Header: {param.header}")
#             if param.header:
#                 headers[param.parameter] = param.value
#             else:
#                 params[param.parameter] = param.value
#     else:
#         print("⚠️  No 'parameters' field found in SMS Settings.")
    
#     # 3. Add dynamic fields (ph and text)
#     if sms_settings.receiver_parameter:
#         params[sms_settings.receiver_parameter] = mobile_number
#         print(f"Added Receiver: {sms_settings.receiver_parameter} = {mobile_number}")
#     else:
#         print("⚠️  Receiver Parameter missing.")

#     if sms_settings.message_parameter:
#         params[sms_settings.message_parameter] = f"{otp} is the One Time Password (OTP) to log in to your Dekaa App. It’s valid for 2 minutes. Please don’t share with anyone."
#         print(f"Added Message: {sms_settings.message_parameter} = {otp} is the One Time Password (OTP) to log in to your Dekaa App. It’s valid for 2 minutes. Please don’t share with anyone.")
#     else:
#         print("⚠️  Message Parameter missing.")

#     # 4. Print full URL and Params before sending
#     print("\n--- Final SMS Request ---")
#     print(f"URL: {url}")
#     print(f"Params: {params}")
#     print(f"Headers: {headers}")

#     try:
#         response = requests.get(url, params=params, headers=headers, timeout=10)
#         print("\n--- SMS API Response ---")
#         print(response.status_code)
#         print(response.text)
#     except Exception as e:
#         frappe.log_error(f"Failed to send OTP SMS to {mobile_number}: {e}", "OTP SMS Error")
#         print(f"Exception occurred: {e}")



import frappe
import requests

@frappe.whitelist()
def send_api_sms(mobile_number, otp, template_id=None, template_name=None):
    sms_settings = frappe.get_single('SMS Settings')

    if not sms_settings.sms_gateway_url:
        frappe.throw("SMS Gateway URL is not configured in SMS Settings.")
        
        
    url = sms_settings.sms_gateway_url
    params = {}
    headers = {}   

    # Fixed message for place order
    # message_template = (
    #     "Almost done! {VAR} is the One Time Password (OTP) to place your Order on Dekaa App. It’s valid for 2 minutes. Please don’t share with anyone."
    # )
    
    if template_name == "login":
        message_template = (
            "{VAR} is the One Time Password (OTP) to log in to your Dekaa App. It’s valid for 2 minutes. Please don’t share with anyone."
        )
        template_id = "1707174859282095413"
    elif template_name == "place_order": 
        message_template = (
            "Almost done! {VAR} is the One Time Password (OTP) to place your Order on Dekaa App. It’s valid for 2 minutes. Please don’t share with anyone."
        )
        template_id = "1707174858556978097"
    else:
        return{
            "success":False,
            "message": "Invalid or missing template name."
        }
    message = message_template.replace("{VAR}", otp)

   

    # Static parameters from child table
    if hasattr(sms_settings, "parameters"):
        for param in sms_settings.parameters:
            if param.header:
                headers[param.parameter] = param.value
            else:
                params[param.parameter] = param.value

    # Add dynamic parameters for mobile number and message
    if sms_settings.receiver_parameter:
        params[sms_settings.receiver_parameter] = mobile_number
    else:
        frappe.throw("Receiver Parameter is not configured in SMS Settings.")

    if sms_settings.message_parameter:
        params[sms_settings.message_parameter] = message
    else:
        frappe.throw("Message Parameter is not configured in SMS Settings.")

    # Check for pe_id in the child table and add it to params
    for param in sms_settings.parameters:
        if param.parameter == "pe_id":
            # Only add pe_id if it's present in the child table
            params["pe_id"] = param.value
            break

    # Add template_id as an additional parameter, either from the API or a default value
    if template_id:
        params["template_id"] = template_id
    else:
        # Static template_id for place order
        template_id = "1707174858556978097"
        params["template_id"] = template_id

    # Construct the final SMS URL
    sms_url = f"{url}?"
    sms_url += "&".join([f"{key}={value}" for key, value in params.items()])

    try:
        # Send the request using the constructed SMS URL
        response = requests.get(sms_url, headers=headers, timeout=10)
        
        # Log the constructed URL and response
        print(f"Sending SMS via URL: {sms_url}")
        print(f"Response: {response.status_code}, {response.text}")

        return {
            "status": "success",
            "message": "OTP sent successfully.",
            "response_code": response.status_code,
            "response_text": response.text
        }
    except Exception as e:
        frappe.log_error(f"Failed to send place order OTP to {mobile_number}: {e}", "SMS Error")
        return {"status": "failed", "message": f"Exception occurred: {e}"}


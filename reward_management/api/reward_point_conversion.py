import frappe
from frappe import _

@frappe.whitelist(allow_guest=True)
def get_reward_point_to_money():
    # Fetch Reward Points and Payout Amount  from your custom doctype
    points_conversion = frappe.get_single('Reward Points to Money')  

    reward_point = points_conversion.reward_point or 0
    payout_amount = points_conversion.payout_amount or 0

    return {
        'reward_point': reward_point,
        'payout_amount': payout_amount
    }
    
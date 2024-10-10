
export interface RedeemRequest{
	name: string
	creation: string
	modified: string
	owner: string
	modified_by: string
	docstatus: 0 | 1 | 2
	parent?: string
	parentfield?: string
	parenttype?: string
	idx?: number
	/**	Naming Series : Select	*/
	naming_series?: "Redeem-request.-.YYYY.-.#####"
	/**	Customer ID : Link - Carpenter	*/
	customer_id: string
	/**	Redeemed Points : Int	*/
	redeemed_points: number
	/**	Current Points : Int	*/
	current_point_status?: number
	/**	Total Points : Int	*/
	total_points?: number
	/**	Transection ID : Data	*/
	transection_id?: string
	/**	Action : Select	*/
	request_status?: "Pending" | "Cancel" | "Approved"
	/**	Mobile Number : Data	*/
	mobile_number: string
	/**	Received Date : Date	*/
	received_date?: string
	/**	Received Time : Time	*/
	received_time?: string
	/**	Amount : Currency	*/
	amount?: number
	/**	Approved Date : Date	*/
	approved_on?: string
	/**	Approve Time : Time	*/
	approve_time?: string
}
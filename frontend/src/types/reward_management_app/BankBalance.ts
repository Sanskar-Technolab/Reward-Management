
export interface BankBalance{
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
	naming_series?: "Bank-History.-.YYYY.-.MM.-.#####"
	/**	Redeem Request ID : Link - Redeem Request	*/
	redeem_request_id: string
	/**	Carpainter ID : Link - Carpenter	*/
	carpainter_id: string
	/**	Carpainter Name : Data	*/
	carpainter_name: string
	/**	Transfer Time : Time	*/
	transfer_time?: string
	/**	Mobile Number : Data	*/
	mobile_number: string
	/**	Tansaction ID : Data	*/
	transaction_id?: string
	/**	Transfer Date : Date	*/
	transfer_date: string
	/**	Amount : Data	*/
	amount?: string
}
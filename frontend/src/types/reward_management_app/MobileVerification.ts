
export interface MobileVerification{
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
	naming_series?: "MOB.-.{mobile_number}.-."
	/**	Mobile Number : Data	*/
	mobile_number?: string
	/**	OTP : Int	*/
	otp?: number
}
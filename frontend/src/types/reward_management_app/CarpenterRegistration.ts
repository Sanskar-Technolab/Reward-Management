
export interface CarpenterRegistration{
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
	naming_series?: "Carpenter-Registration.-.YYYY.-.MM.-.#####"
	/**	Carpainter ID : Link - Carpenter	*/
	carpainter_id?: string
	/**	Carpainter Name : Data	*/
	carpainter_name?: string
	/**	Mobile Number : Data	*/
	mobile_number?: string
	/**	City : Data	*/
	city?: string
	/**	Status : Select	*/
	status?: "Pending" | "Approved" | "Cancel"
	/**	Registration Date : Date	*/
	registration_date?: string
	/**	Registration Time : Time	*/
	registration_time?: string
	/**	Approved Date : Date	*/
	approved_date?: string
	/**	Approved Time : Time	*/
	approved_time?: string
}

export interface FAQ{
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
	naming_series?: "FAQ.-.MM.-.YYYY.-.#####"
	/**	Question : Data	*/
	question?: string
	/**	Answer : Text Editor	*/
	answer?: string
	/**	Status : Select	*/
	status?: "Active" | "Inactive"
	/**	Created Date : Date	*/
	created_date?: string
}
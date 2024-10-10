
export interface Announcements{
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
	naming_series?: string
	/**	Title : Data	*/
	title: string
	/**	Subject : Text	*/
	subject: string
	/**	Published On : Date	*/
	published_on?: string
	/**	End Date : Date	*/
	end_date?: string
}
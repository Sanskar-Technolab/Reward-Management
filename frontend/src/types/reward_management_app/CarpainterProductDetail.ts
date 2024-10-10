
export interface CarpainterProductDetail{
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
	/**	Product Name : Link - Product	*/
	product_name?: string
	/**	Product : Data	*/
	product?: string
	/**	Product Category : Data	*/
	product_category?: string
	/**	Earned Points : Int	*/
	earned_points?: number
	/**	Date : Date	*/
	date?: string
}
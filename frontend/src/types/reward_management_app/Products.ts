
export interface Products{
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
	naming_series?: "Product.-.{product_name}.-.YYYY.-.#####"
	/**	Product Name : Data	*/
	product_name: string
	/**	Product Image : Attach Image	*/
	product_image?: string
	/**	Category : Data	*/
	category: string
	/**	Reward Points : Int	*/
	reward_points: number
	/**	Discription : Text Editor	*/
	discription?: string
}
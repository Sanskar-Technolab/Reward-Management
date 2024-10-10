import { CarpainterProductDetail } from './CarpainterProductDetail'

export interface Carpainter{
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
	naming_series?: "Carpenter.-.{{full_name}}.-.YYYY.-.#####"
	/**	First Name : Data	*/
	first_name: string
	/**	Last Name : Data	*/
	last_name: string
	/**	Full Name : Data	*/
	full_name?: string
	/**	Mobile Number : Data	*/
	mobile_number: string
	/**	Email : Data	*/
	email?: string
	/**	Total Points : Int	*/
	total_points?: number
	/**	Current Points : Int	*/
	current_points?: number
	/**	Redeem Points : Int	*/
	redeem_points?: number
	/**	City : Data	*/
	city: string
	/**	Point History : Table - Carpainter Product Detail	*/
	point_history?: CarpainterProductDetail[]
}
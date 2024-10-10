
export interface ProductQRTable{
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
	/**	Product QR Name : Data	*/
	product_qr_name?: string
	/**	Product Name : Link - Product	*/
	product_table_name?: string
	/**	Product Qr ID : Int	*/
	product_qr_id?: number
	/**	Carpenter ID : Link - Carpenter	*/
	carpenter_id?: string
	/**	Points : Int	*/
	points?: number
	/**	Generated Date : Date	*/
	generated_date?: string
	/**	Qr Code Image : Attach	*/
	qr_code_image?: string
	/**	Scanned : Check	*/
	scanned?: 0 | 1
	/**	Redeem Date : Date	*/
	redeem_date?: string
}
import { ProductQRTable } from './ProductQRTable'

export interface ProductQR{
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
	naming_series?: "Product-QR-.-.YYYY.-.#####"
	/**	Product Name : Link - Product	*/
	product_name: string
	/**	Quantity : Int	*/
	quantity?: number
	/**	QR Table : Table - Product QR Table	*/
	qr_table?: ProductQRTable[]
}
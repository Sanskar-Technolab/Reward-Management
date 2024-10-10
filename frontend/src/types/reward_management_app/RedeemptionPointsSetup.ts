
export interface RedeemptionPointsSetup{
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
	/**	Maximum Points : Data	*/
	maximum_points?: string
	/**	Minimum Points : Data	*/
	minimum_points?: string
}
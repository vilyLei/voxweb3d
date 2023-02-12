/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
interface Float32Data {
	getCapacity(): number;
	getLocalFS32(): Float32Array;
	getFS32(): Float32Array;
	getFSIndex(): number;
}

export default Float32Data;

/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IAGeomEntity from "./IAGeomEntity";

export default interface ISphere extends IAGeomEntity {
	radius: number;
	setXYZ(px: number, py: number, pz: number): void;
}

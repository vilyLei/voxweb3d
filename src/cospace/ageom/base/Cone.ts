/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../../vox/math/IVector3D";

export default interface IAGeomEntity {
	// unique id
	uid: number;
	position: IVector3D;

	update(): void;
	updateFast(): void;
}
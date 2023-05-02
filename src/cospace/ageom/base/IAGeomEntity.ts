/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../../vox/math/IVector3D";

export default interface IAGeomEntity {

	uid: number;
	/**
	 * a center position or a position
	 */
	pos: IVector3D;
	reset(): void;
	update(): void;
}

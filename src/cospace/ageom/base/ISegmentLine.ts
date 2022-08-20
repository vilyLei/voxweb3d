/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../../vox/math/IVector3D";
import IGeomEntity from "./IGeomEntity";

export default interface ISegmentLine extends IGeomEntity {

	begin: IVector3D;
	end: IVector3D;
	tv: IVector3D;
	length:number;
	radius:number;

	setTo(begin: IVector3D, end: IVector3D): ISegmentLine;
}

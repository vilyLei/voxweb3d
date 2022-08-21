/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../../vox/math/IVector3D";
import IAGeomEntity from "./IAGeomEntity";

export default interface ISegmentLine extends IAGeomEntity {

	begin: IVector3D;
	end: IVector3D;
	tv: IVector3D;
	length:number;
	radius:number;

	setTo(begin: IVector3D, end: IVector3D): ISegmentLine;
}

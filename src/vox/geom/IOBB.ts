/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../vox/math/IVector3D";
interface IOBB {

	version: number;
	radius: number;
	radius2: number;

	
	readonly axis: IVector3D[];
	readonly extent: IVector3D;
	readonly center: IVector3D;

	equals(ab: IOBB): boolean;
	reset(): void;
	update(): void;

}

export default IOBB;
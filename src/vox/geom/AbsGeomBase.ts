/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";

export class AbsGeomBase
{
	constructor()
	{
	}
	static __tV0 = new Vector3D();
	static __tV1 = new Vector3D();
	static __tV2 = new Vector3D();

	// unique id
	id:number = -1;
	position:Vector3D = new Vector3D();
	
	update():void{};
	updateFast():void{};
}

export default AbsGeomBase;
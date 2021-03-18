/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as Vector3DT from "../../vox/math/Vector3D";

import Vector3D = Vector3DT.vox.math.Vector3D;

export namespace vox
{
    export namespace geom
    {
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
			// function
			update():void{};
			updateFast():void{};
		}
	}
}
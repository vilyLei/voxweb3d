/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";

class FollowPathCalc {
	private m_posList: Vector3D[] = [];
	constructor() { }

	addPos(v: Vector3D): void {
		this.m_posList.push(v);
	}
	reset(): void {
		this.m_posList = [];
	}
}
export { FollowPathCalc }
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../math/Vector3D";

class BVH {
	version = -1;
	radius = 50;
	radius2 = 2500;
	constructor() {
		this.reset();
	}
	reset(): void {

	}
	equals(ab: BVH): boolean {
		return true;
	}
	update(): void {

	}
}

export default BVH;
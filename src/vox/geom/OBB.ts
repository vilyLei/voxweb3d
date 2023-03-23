/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import MathConst from "../../vox/math/MathConst";
import Vector3D from "../../vox/math/Vector3D";
import IOBB from "../../vox/geom/IOBB";

class OBB implements IOBB {
	private m_long = 100.0;
	private m_width = 100.0;
	private m_height = 100.0;
	private m_halfLong = 50.0;
	private m_halfWidth = 50.0;
	private m_halfHeight = 50.0;
	private m_tempV = new Vector3D();
	// three axes normalization 3d vectors
	readonly axis= [new Vector3D(), new Vector3D(), new Vector3D()];
	readonly extent = new Vector3D();
	readonly center = new Vector3D();
	
	version = -1;
	radius = 50;
	radius2 = 2500;
	constructor() {
		this.reset();
	}
	reset(): void {

	}
	equals(ab: IOBB): boolean {
		// return this.min.equalsXYZ(ab.min) && this.max.equalsXYZ(ab.max);
		return true;
	}
	update(): void {

	}
}

export default OBB;
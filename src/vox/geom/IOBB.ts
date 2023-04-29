/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../vox/math/IVector3D";
import IAABB from "./IAABB";
import IMatrix4 from "../math/IMatrix4";
import IRenderEntityBase from "../render/IRenderEntityBase";
interface IOBB {

	version: number;
	radius: number;

	readonly axis: IVector3D[];
	readonly extent: IVector3D;
	readonly center: IVector3D;

	equals(ob: IOBB): boolean;
	reset(): void;
	update(): void;

	/**
	 * @param a IOBB intance
	 * @param b IOBB intance, the default value is null
	 */
	intersect(a: IOBB, b?: IOBB): boolean;
	/**
	 * @param entity entity or entity container
	 */
	fromEntity(entity: IRenderEntityBase): void;
	/**
	 * @param ab IAABB instance
	 * @param transform IMatrix4 instance, the default is null
	 */
	fromAABB(ab: IAABB, transform?: IMatrix4): void;
}

export default IOBB;

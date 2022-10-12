/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IMatrix4 from "../../vox/math/IMatrix4";
import IRenderShaderUniform from "./uniform/IRenderShaderUniform";
import IShdProgram from "../../vox/material/IShdProgram";

export default class ROTransPool {
	private static s_transMap: Map<number, IRenderShaderUniform> = new Map();
	// private static s_tcountMap: Map<number, number> = new Map();
	static SetTransUniform(mat: IMatrix4, uniform: IRenderShaderUniform, shdp: IShdProgram): void {
		let k = (mat.getUid() + 1) * 131 + shdp.getUid();
		if(!ROTransPool.s_transMap.has(k)) {
			ROTransPool.s_transMap.set(k, uniform);
			uniform.key = k;
			// let count = ROTransPool.s_tcountMap.get(mat.getUid());
			// ROTransPool.s_tcountMap.set(mat.getUid(), count+1);
		}
		// ROTransPool.s_transMap.set(mat.getUid(), uniform);
	}
	static GetTransUniform(mat: IMatrix4, shdp: IShdProgram): IRenderShaderUniform {
		if (mat.getUid() < 0) {
			throw Error("mat.getUid() < 0");
		}
		let k = (mat.getUid() + 1) * 131 + shdp.getUid();
		if (ROTransPool.s_transMap.has(k)) return ROTransPool.s_transMap.get(k);
		// if (ROTransPool.s_transMap.has(mat.getUid())) return ROTransPool.s_transMap.get(mat.getUid());
		return null;
	}
	static HasTransUniform(mat: IMatrix4, shdp: IShdProgram): boolean {
		let k = (mat.getUid() + 1) * 131 + shdp.getUid();
		return ROTransPool.s_transMap.has(k);
		// return ROTransPool.s_transMap.has(mat.getUid());
	}
	static RemoveTransUniform(key:number): void {
		if (ROTransPool.s_transMap.has(key)){
			console.log("ROTransPool::RemoveTransUniform(), key: ",key);
			ROTransPool.s_transMap.delete(key);
		}
		// ROTransPool.s_transMap.delete(mat.getUid());
	}
}

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
	private m_transMap: Map<number, IRenderShaderUniform> = new Map();
	// private static s_tcountMap: Map<number, number> = new Map();
	setTransUniform(mat: IMatrix4, uniform: IRenderShaderUniform, shdp: IShdProgram): void {
		let k = (mat.getUid() + 1) * 131 + shdp.getUid();
		if(!this.m_transMap.has(k)) {
			this.m_transMap.set(k, uniform);
			uniform.key = k;
			// let count = ROTransPool.s_tcountMap.get(mat.getUid());
			// ROTransPool.s_tcountMap.set(mat.getUid(), count+1);
		}
		// this.m_transMap.set(mat.getUid(), uniform);
	}
	getTransUniform(mat: IMatrix4, shdp: IShdProgram): IRenderShaderUniform {
		if (mat.getUid() < 0) {
			throw Error("mat.getUid() < 0");
		}
		let k = (mat.getUid() + 1) * 131 + shdp.getUid();
		if (this.m_transMap.has(k)) return this.m_transMap.get(k);
		// if (this.m_transMap.has(mat.getUid())) return this.m_transMap.get(mat.getUid());
		return null;
	}
	hasTransUniform(mat: IMatrix4, shdp: IShdProgram): boolean {
		let k = (mat.getUid() + 1) * 131 + shdp.getUid();
		return this.m_transMap.has(k);
		// return this.m_transMap.has(mat.getUid());
	}
	removeTransUniform(key:number): void {
		if (this.m_transMap.has(key)){
			console.log("ROTransPool::RemoveTransUniform(), key: ",key);
			this.m_transMap.delete(key);
		}
		// this.m_transMap.delete(mat.getUid());
	}
	clear(): void {
		this.m_transMap.clear();
	}
}

/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { IMatrix4 } from "../../vox/math/IMatrix4";
import IShaderUniform from "../../vox/material/IShaderUniform";

export default class ROTransPool {
	private static s_transMap: Map<number, IShaderUniform> = new Map();
	static SetTransUniform(mat: IMatrix4, uniform: IShaderUniform): void {
		ROTransPool.s_transMap.set(mat.getUid(), uniform);
	}
	static GetTransUniform(mat: IMatrix4): IShaderUniform {
		if (mat.getUid() < 0) {
			throw Error("mat.getUid() < 0");
		}
		if (ROTransPool.s_transMap.has(mat.getUid())) return ROTransPool.s_transMap.get(mat.getUid());
		return null;
	}
	static HasTransUniform(mat: IMatrix4): boolean {
		return ROTransPool.s_transMap.has(mat.getUid());
	}
	static RemoveTransUniform(mat: IMatrix4): void {
		ROTransPool.s_transMap.delete(mat.getUid());
	}
}

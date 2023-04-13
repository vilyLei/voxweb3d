/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IShaderCodeBuilder from "../code/IShaderCodeBuilder";
import { UniformComp } from "./UniformComp";
import IRenderTexture from "../../render/texture/IRenderTexture";
import Vector3D from "../../math/Vector3D";
import IShaderUniformData from "../IShaderUniformData";
import { IUniformComp } from "./IUniformComp";
/**
 * manage uniform data for the vertex calculation
 */
class VertUniformComp extends UniformComp {
	// uv trans param
	private m_uvs: Float32Array = null;
	// curve move param
	private m_cms: Float32Array = null;
	// displacement param
	private m_dps: Float32Array = null;

	private m_uvTransformParamIndex: number = -1;
	private m_curveMoveParamIndex: number = -1;
	private m_displacementParamIndex: number = -1;

	uvTransformEnabled: boolean = false;
	curveMoveMap: IRenderTexture = null;
	displacementMap: IRenderTexture = null;

	constructor() {
		super();
	}

	initialize(): void {
		if (this.m_params == null) {
			this.m_uniqueNSKeyString = "";
			let paramsTotal: number = 0;
			if (this.uvTransformEnabled) {
				this.m_uvTransformParamIndex = paramsTotal;
				paramsTotal++;
				this.m_uniqueNSKeyString += "UV";
			}
			if (this.curveMoveMap != null) {
				this.m_curveMoveParamIndex = paramsTotal;
				paramsTotal++;
				this.m_uniqueNSKeyString += "CM";
			}
			if (this.displacementMap != null) {
				this.m_displacementParamIndex = paramsTotal;
				paramsTotal++;
				this.m_uniqueNSKeyString += "DC";
			}
			if (paramsTotal > 0) {
				this.m_params = new Float32Array(paramsTotal * 4);
				let i: number = this.m_uvTransformParamIndex;
				if (i >= 0) {
					this.m_uvs = this.m_params.subarray(i * 4, (i + 1) * 4);
					// u scale, v scale, translation u, translation v
					this.m_uvs.set([1.0, 1.0, 0.0, 0.0]);
				}
				i = this.m_curveMoveParamIndex;
				if (i >= 0) {
					this.m_cms = this.m_params.subarray(i * 4, (i + 1) * 4);
				}
				i = this.m_displacementParamIndex;
				if (i >= 0) {
					this.m_dps = this.m_params.subarray(i * 4, (i + 1) * 4);
					// displacement scale, bias, undefined, undefined
					this.m_dps.set([10.0, 0.0, 0.0, 0.0]);
				}
			}
		}
	}
	use(shaderBuilder: IShaderCodeBuilder): void {
		if (this.getParamsTotal() > 0) {
			shaderBuilder.addVertUniform("vec4", "u_vertLocalParams", this.getParamsTotal());

			if (this.m_curveMoveParamIndex >= 0) {
				shaderBuilder.addVertLayout("vec4", "a_vs");
			}

			if (this.m_uvTransformParamIndex >= 0) {
				shaderBuilder.addDefine("VOX_VTX_TRANSFORM_PARAM_INDEX", "" + this.m_uvTransformParamIndex);
			}
		}
	}
	reset(): void {}
	destroy(): void {}

	getTextures(shaderBuilder: IShaderCodeBuilder, outList: IRenderTexture[] = null): IRenderTexture[] {
		if (this.getParamsTotal() > 0) {
			if (outList == null) outList = [];
			if (this.m_curveMoveParamIndex >= 0) {
				outList.push(this.curveMoveMap);
				shaderBuilder.uniform.add2DMap("VTX_CURVE_MOVE_MAP", false, false, true);
				shaderBuilder.addDefine("VOX_VTX_CURVE_MOVE_PARAM_INDEX", "" + this.m_curveMoveParamIndex);
			}
			if (this.m_displacementParamIndex >= 0) {
				outList.push(this.displacementMap);
				shaderBuilder.uniform.addDisplacementMap(this.m_displacementParamIndex);
			}
			return outList;
		}
		return null;
	}
	setCurveMoveParam(texSize: number, posTotal: number): void {
		if (this.m_cms != null) {
			this.m_cms[0] = 1.0 / texSize;
			this.m_cms[2] = posTotal;
		}
	}
	setCurveMoveDistance(index: number): void {
		if (this.m_cms != null) {
			this.m_cms[1] = index;
		}
	}
	setUVScale(uScale: number, vScale: number): void {
		if (this.m_uvs != null) {
			this.m_uvs[0] = uScale;
			this.m_uvs[1] = vScale;
		}
	}
	getUVScale(scaleV: Vector3D): void {
		if (this.m_uvs != null) {
			scaleV.x = this.m_uvs[0];
			scaleV.y = this.m_uvs[1];
		}
	}
	setUVTranslation(tu: number, tv: number): void {
		if (this.m_uvs != null) {
			this.m_uvs[2] = tu;
			this.m_uvs[3] = tv;
		}
	}

	/**
	 * 设置顶点置换贴图参数
	 * @param scale 缩放值
	 * @param bias 偏移量
	 */
	setDisplacementParams(scale: number, bias: number): void {
		if (this.m_dps != null) {
			this.m_dps[0] = scale;
			this.m_dps[1] = bias;
		}
	}
	dataCopyFrom(src: IUniformComp): void {
		let srcU = src as VertUniformComp;

		if (srcU.m_uvs) {
			if (this.m_uvs) {
				this.m_uvs.set(srcU.m_uvs);
			} else {
				this.m_uvs = srcU.m_uvs.slice();
			}
		}
		if (srcU.m_cms) {
			if (this.m_cms) {
				this.m_cms.set(srcU.m_cms);
			} else {
				this.m_cms = srcU.m_cms.slice();
			}
		}
		if (srcU.m_dps) {
			if (this.m_dps) {
				this.m_dps.set(srcU.m_dps);
			} else {
				this.m_dps = srcU.m_dps.slice();
			}
		}
	}
	clone(): UniformComp {
		let u = new VertUniformComp();
		u.uvTransformEnabled = this.uvTransformEnabled;
		u.displacementMap = this.displacementMap;
		u.curveMoveMap = this.curveMoveMap;
		this.dataCopyFrom(this);
		u.m_uvTransformParamIndex = this.m_uvTransformParamIndex;
		u.m_curveMoveParamIndex = this.m_uvTransformParamIndex;
		u.m_displacementParamIndex = this.m_uvTransformParamIndex;
		return u;
	}

	buildShaderUniformData(data: IShaderUniformData): void {
		if (this.getParamsTotal() > 0) {
			data.uniformNameList.push("u_vertLocalParams");
			data.dataList.push(this.getParams());
		}
	}
}
export { VertUniformComp };

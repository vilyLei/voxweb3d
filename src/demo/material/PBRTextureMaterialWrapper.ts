/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderMaterial from "../../vox/render/IRenderMaterial";
import { PBRTexture } from "./shader/PBRTexture";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";
import IShaderMaterial from "../../vox/material/mcase/IShaderMaterial";
import IColor4 from "../../vox/material/IColor4";
import IVector3D from "../../vox/math/IVector3D";
import IShaderCodeBuffer from "../../vox/material/IShaderCodeBuffer";
import ShaderMaterial from "../../vox/material/mcase/ShaderMaterial";

class PBRTextureMaterialWrapper {
	private m_albedo = new Float32Array([0.0, 0.0, 0.0, 0.0]);
	private m_params = new Float32Array([0.0, 0.0, 1.0, 0.0]);
	private m_F0 = new Float32Array([0.0, 0.0, 0.0, 0.0]);
	private m_uvTrans = new Float32Array([0.0, 0.0, 1.0, 1.0]);
	private m_lightPositions = new Float32Array(4 * 4);
	private m_lightColors = new Float32Array(4 * 4);
	private m_material: IShaderMaterial = null;

	envMapEnabled = false;
	diffuseMapEnabled = false;
	normalMapEnabled = false;
	roughnessMapEnabled = false;
	metallicMapEnabled = false;
	aoMapEnabled = false;
	depthFog = false;
	hdrBrnEnabled = false;
	constructor() {}

	setUVOffset(px: number, py: number): void {
		this.m_uvTrans[0] = px;
		this.m_uvTrans[1] = py;
	}
	setUVScale(sx: number, sy: number): void {
		this.m_uvTrans[2] = sx;
		this.m_uvTrans[3] = sy;
	}
	get material(): IRenderMaterial {
		if (this.m_material == null) {
			let uns = "";
			if (this.envMapEnabled) {
				uns += "env_";
			}
			if (this.diffuseMapEnabled) {
				uns += "diff_";
			}
			if (this.normalMapEnabled) {
				uns += "morm_";
			}
			if (this.roughnessMapEnabled) {
				uns += "roug_";
			}
			if (this.metallicMapEnabled) {
				uns += "metal_";
			}
			if (this.aoMapEnabled) {
				uns += "ao_";
			}
			if (this.depthFog) {
				uns += "depthFog_";
			}
			if (this.hdrBrnEnabled) {
				uns += "hrBrn_";
			}
			uns = uns != "" ? "pbr_texture_shader" : "pbr_texture_shader_" + uns;
			let material = new ShaderMaterial(uns);

			material.setShaderBuilder((coderBuilder: IShaderCodeBuffer): void => {
				// VOX_ENV_MAP,
				// VOX_DIFFUSE_MAP,
				// VOX_NORMAL_MAP,
				// VOX_ROUGHNESS_MAP,
				// VOX_METALNESS_MAP,
				// VOX_AO_MAP

				let tex = coderBuilder.getTexture();
				let coder = coderBuilder.getShaderCodeBuilder();
				coder.addVertUniform("vec4", "u_uvTrans");
				coder.addFragUniform("vec4", "u_albedo");
				coder.addFragUniform("vec4", "u_params");
				coder.addFragUniform("vec4", "u_F0");
				coder.addFragUniform("vec4", "u_lightPositions", 4);
				coder.addFragUniform("vec4", "u_lightColors", 4);

				// coder.addVarying("vec2", "v_uv");
				coder.addVertLayout("vec3", "a_nvs");

				// coder.addVarying("vec3", "v_nv");
				coder.addVarying("vec3", "v_worldPos");
				coder.addVarying("vec3", "v_normal");
				coder.addVarying("vec3", "v_camPos");
				coder.addFragOutputHighp("vec4", "FragColor0");

				if (this.hdrBrnEnabled) {
					coder.addDefine("VOX_HDR_BRN", "1");
				}
				if (this.depthFog) {
					coder.addDefine("VOX_DEPTH_FOG");
					coder.addVarying("vec4", "v_fogParam");
					coder.addVertUniform("vec4", "u_frustumParam");
					coder.addFragOutputHighp("vec4", "FragColor1");
				}

				if (this.envMapEnabled) {
					coder.mapLodEnabled = true;
					tex.addSpecularEnvMap();
				}
				if (this.diffuseMapEnabled) {
					tex.addDiffuseMap();
				}
				if (this.normalMapEnabled) {
					tex.addNormalMap();
				}
				if (this.roughnessMapEnabled) {
					tex.addRoughnessMap();
				}
				if (this.metallicMapEnabled) {
					tex.addMetalnessMap();
				}
				if (this.aoMapEnabled) {
					tex.addAOMap();
				}

				coder.addVertHeadCode(PBRTexture.vert_head);
				coder.addVertMainCode(PBRTexture.vert_body);
				coder.addFragHeadCode(PBRTexture.frag_head);
				coder.addFragMainCode(PBRTexture.frag_body);
			});

			material.addUniformDataAt("u_uvTrans", this.m_uvTrans);
			material.addUniformDataAt("u_albedo", this.m_albedo);
			material.addUniformDataAt("u_params", this.m_params);
			material.addUniformDataAt("u_lightPositions", this.m_lightPositions);
			material.addUniformDataAt("u_lightColors", this.m_lightColors);
			material.addUniformDataAt("u_F0", this.m_F0);
			this.m_material = material;
		}

		return this.m_material;
	}
	setTextureList(list: IRenderTexture[]): void {
		let m = this.material;
		m.setTextureList(list);
	}
	setMetallic(metallic: number): void {
		this.m_params[0] = Math.min(Math.max(metallic, 0.05), 1.0);
	}
	setRoughness(roughness: number): void {
		roughness = Math.min(Math.max(roughness, 0.05), 1.0);
		this.m_params[1] = roughness;
	}
	setAO(ao: number): void {
		this.m_params[2] = ao;
	}
	setF0(f0x: number, f0y: number, f0z: number): void {
		this.m_F0[0] = f0x;
		this.m_F0[1] = f0y;
		this.m_F0[2] = f0z;
	}
	setAlbedoColor(color: IColor4): void {
		this.m_albedo[0] = color.r;
		this.m_albedo[1] = color.g;
		this.m_albedo[2] = color.b;
	}
	setLightPosAt(i: number, pv: IVector3D): void {
		if (i < 4) {
			i *= 4;
			this.m_lightPositions[i] = pv.x;
			this.m_lightPositions[i + 1] = pv.y;
			this.m_lightPositions[i + 2] = pv.z;
		}
	}
	setLightColorAt(i: number, color: IColor4): void {
		if (i < 4) {
			i *= 4;
			this.m_lightColors[i] = color.r;
			this.m_lightColors[i + 1] = color.g;
			this.m_lightColors[i + 2] = color.b;
		}
	}
}
export { PBRTextureMaterialWrapper };

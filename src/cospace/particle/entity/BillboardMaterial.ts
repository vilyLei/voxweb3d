import IRenderTexture from "../../../vox/render/texture/IRenderTexture";
import IShaderMaterial from "../../../vox/material/mcase/IShaderMaterial";
import BillboardFragShaderBase from "../shader/BillboardFragShaderBase";
import IShaderCodeBuffer from "../../../vox/material/IShaderCodeBuffer";
import ITransformEntity from "../../../vox/entity/ITransformEntity";
import IVector3D from "../../../vox/math/IVector3D";
import { IBillboard } from "./IBillboard";

import { ICoRScene } from "../../voxengine/ICoRScene";
declare var CoRScene: ICoRScene;

class BillboardMaterial {

	private static s_billFS: BillboardFragShaderBase = new BillboardFragShaderBase();

	material: IShaderMaterial = null;

	fogEnabled: boolean = false;
	brightnessEnabled: boolean = true;
	alphaEnabled: boolean = false;
	rotationEnabled: boolean = false;

	constructor() {}

	private buildShader(shdCodeBuf: IShaderCodeBuffer): void {
		let coder = shdCodeBuf.getShaderCodeBuilder();
		if (this.rotationEnabled) coder.addDefine("VOX_ROTATION");
		if (this.brightnessEnabled) {
			const MT = CoRScene.MaterialPipeType;
			let f: boolean = shdCodeBuf.fogEnabled;
			let pipeline = shdCodeBuf.pipeline;
			if (pipeline != null) {
				f = f || pipeline.hasPipeByType(MT.FOG_EXP2);
				f = f || pipeline.hasPipeByType(MT.FOG);
			}
			shdCodeBuf.brightnessOverlayEnabeld = f;
		}
		let uniform = shdCodeBuf.getUniform();
		uniform.addDiffuseMap();

		coder.addVertLayout("vec2", "a_vs");
		coder.addVertLayout("vec2", "a_uvs");
		coder.addVarying("vec4", "v_colorMult");
		coder.addVarying("vec4", "v_colorOffset");
		coder.addVarying("vec2", "v_uv");
		coder.addVertUniform("vec4", "u_billParam", 3);
		coder.addDefine("FADE_VAR", "fv4");

		let fragCode0: string = `
    vec4 color = VOX_Texture2D(VOX_DIFFUSE_MAP, v_uv);
    vec3 offsetColor = v_colorOffset.rgb;
    vec4 fv4 = v_colorMult.wwww;
`;
		let fadeCode: string = BillboardMaterial.s_billFS.getBrnAndAlphaCode();
		let fragCode2: string = `
    FragColor0 = color;
`;
		coder.addFragMainCode(fragCode0 + fadeCode + fragCode2);

		coder.addVertMainCode(
			`
    vec4 temp = u_billParam[0];
    float cosv = cos(temp.z);
    float sinv = sin(temp.z);
    vec2 vtx = a_vs.xy * temp.xy;
    vec2 vtx_pos = vec2(vtx.x * cosv - vtx.y * sinv, vtx.x * sinv + vtx.y * cosv);
    viewPosition = u_viewMat * u_objMat * vec4(0.0,0.0,0.0,1.0);
    viewPosition.xy += vtx_pos.xy;
    gl_Position =  u_projMat * viewPosition;
    gl_Position.z = ((gl_Position.z / gl_Position.w) + temp.w) * gl_Position.w;
    v_uv = a_uvs;
    v_colorMult = u_billParam[1];
    v_colorOffset = u_billParam[2];
`
		);
	}
	initialize(): void {
		if (this.material == null) {
			let uns = "co_billboard_entity_material";

			if (this.rotationEnabled) uns += "Rot";
			uns += this.brightnessEnabled ? "Brn" : "Alp";
			let material = CoRScene.createShaderMaterial(uns);
			material.fogEnabled = this.fogEnabled;
			material.setShaderBuilder((shdCodeBuf: IShaderCodeBuffer): void => {
				this.buildShader(shdCodeBuf);
			});
			material.initializeByCodeBuf(true);
			this.material = material;
		}
	}
	destroy(): void {
		if(this.material != null) {
			this.material.destroy();
			this.material = null;
		}
	}
}

export { BillboardMaterial }
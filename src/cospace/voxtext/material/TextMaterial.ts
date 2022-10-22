import IRenderTexture from "../../../vox/render/texture/IRenderTexture";
import IShaderCodeBuffer from "../../../vox/material/IShaderCodeBuffer";
import IShaderMaterial from "../../../vox/material/mcase/IShaderMaterial";
import IColor4 from "../../../vox/material/IColor4";

import { ICoRScene } from "../../voxengine/ICoRScene";
declare var CoRScene: ICoRScene;

class TextMaterial {
	
    private m_rz: number = 0;
    private m_data: Float32Array = new Float32Array([1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0]);
    private m_color: IColor4 = null;
    private m_brn: number = 1.0;

	material: IShaderMaterial;
	constructor() {

	}
    destroy() {
        this.material = null;
        this.m_data = null;
    }
    setRGBA4f(pr: number, pg: number, pb: number, pa: number): void {
        this.m_color.r = pr;
        this.m_color.g = pg;
        this.m_color.b = pb;
        //this.m_color.a = pa;
        this.m_data[4] = pr * this.m_brn;
        this.m_data[5] = pg * this.m_brn;
        this.m_data[6] = pb * this.m_brn;
        this.m_data[7] = pa;
    }
    setRGB3f(pr: number, pg: number, pb: number) {
        this.m_color.r = pr;
        this.m_color.g = pg;
        this.m_color.b = pb;
        this.m_data[4] = pr * this.m_brn;
        this.m_data[5] = pg * this.m_brn;
        this.m_data[6] = pb * this.m_brn;
    }
    setAlpha(pa: number): void {
        this.m_data[7] = pa;
    }
    getAlpha(): number {
        return this.m_data[6];
    }
    setBrightness(brighness: number): void {
        this.m_brn = brighness;
        this.m_data[4] = this.m_color.r * brighness;
        this.m_data[5] = this.m_color.g * brighness;
        this.m_data[6] = this.m_color.b * brighness;
    }
    getBrightness(): number {
        return this.m_brn;
    }
    getRotationZ(): number { return this.m_rz; };
    setRotationZ(degrees: number): void {
        this.m_rz = degrees;
        this.m_data[2] = degrees * (Math.PI / 180.0);
    }
    getScaleX(): number { return this.m_data[0]; }
    getScaleY(): number { return this.m_data[1]; }
    setScaleX(p: number): void { this.m_data[0] = p; }
    setScaleY(p: number): void { this.m_data[1] = p; }
    setScaleXY(sx: number, sy: number): void {
        this.m_data[0] = sx;
        this.m_data[1] = sy;
    }
	create(): IShaderMaterial {
		if (this.material == null) {
			this.m_color = CoRScene.createColor4();
			let textureEnabled = true;
			let material = CoRScene.createShaderMaterial("co_3dBill_text_material");
			material.addUniformDataAt("u_params", this.m_data);
			
			material.setShaderBuilder((coderBuilder: IShaderCodeBuffer): void => {

				let coder = coderBuilder.getShaderCodeBuilder();
				coder.uniform.addDiffuseMap();

				coder.addVertLayout("vec2", "a_vs");
				coder.addVertLayout("vec2", "a_uvs");
				coder.addVertUniform("vec4", "u_params", 2);

				coder.addVarying("vec2", "v_texUV");
				coder.addVarying("vec4", "v_colorMult");
				
				coder.addFragOutputHighp("vec4", "FragColor0");

				coder.addFragMainCode(
					`
FragColor0 = vec4(v_colorMult.xyz,v_colorMult.a * texture(u_sampler0, v_texUV).a);
					`
				);
				coder.addVertMainCode(
					`
vec4 temp = u_params[0];
float cosv = cos(temp.z);
float sinv = sin(temp.z);
vec2 vtx = vec2(a_vs.x * temp.x, a_vs.y * temp.y);
vec2 vtx_pos = vec2(vtx.x * cosv - vtx.y * sinv, vtx.x * sinv + vtx.y * cosv);
vec4 pos = u_viewMat * u_objMat * vec4(0.0,0.0,0.0,1.0);
pos.xy += vtx_pos.xy;
gl_Position =  u_projMat * pos;
v_texUV = a_uvs;
v_colorMult = u_params[1];
					`
				);
			});
			material.initializeByCodeBuf(textureEnabled);
			this.material = material;
		}
		return this.material;
	}
}

export { TextMaterial };

import IRenderTexture from "../../../../vox/render/texture/IRenderTexture";
import IShaderCodeBuffer from "../../../../vox/material/IShaderCodeBuffer";
import IShaderMaterial from "../../../../vox/material/mcase/IShaderMaterial";
import { ICoRScene } from "../../../voxengine/ICoRScene";
import IColor4 from "../../../../vox/material/IColor4";

declare var CoRScene: ICoRScene;

class NormalEntityMaterial {
	private m_data: Float32Array = new Float32Array([
		1.0, 1.0, 1.0, 1.0,
		0.0, 0.0, 1.0, 1.0
	]);
	material: IShaderMaterial;
	setNormalScale(s: number): void {
		this.m_data[6] = s;
	}
	setRGB3f(pr: number, pg: number, pb: number): void {
		this.m_data[0] = pr;
		this.m_data[1] = pg;
		this.m_data[2] = pb;
	}
	getRGB3f(color: IColor4): void {
		let ds = this.m_data;
		color.setRGB3f(ds[0], ds[1], ds[2]);
	}
	getRGBA4f(color: IColor4): void {
		color.fromArray4(this.m_data);
	}
	setLength(length: number): void {
		this.m_data[3] = length;
	}
	getLegnth(): number {
		return this.m_data[3];
	}
	setColor(color: IColor4): void {
		color.toArray3(this.m_data);
	}
	getColor(color: IColor4): void {
		color.fromArray3(this.m_data);
	}
	isApplyingLocalNormal(): boolean {
		return this.m_data[7] < 0.5;
	}
	applyLocalNormal(): void {
		// console.log("apply local normal..., dif: ", this.m_data[5]);
		this.m_data[7] = 0.0;
	}
	isApplyingGlobalNormal(): boolean {
		return this.m_data[7] > 0.5;
	}
	applyGlobalNormal(): void {
		// console.log("apply global normal..., dif: ", this.m_data[5]);
		this.m_data[7] = 1.0;
	}
	isApplyingModelColor(): boolean {
		return this.m_data[4] >= 1.0;
	}
	applyModelColor(): void {
		this.m_data[4] = 1.0;
		// console.log("apply model color..., dif: ", this.m_data[5]);
	}
	applyNormalColor(): void {
		this.m_data[4] = 0.0;
		// console.log("apply normal color..., dif: ", this.m_data[5]);
	}
	applyDifference(boo: boolean = true): void {
		this.m_data[5] = boo ? 1.0 : 0.0;
		// console.log("apply diff boo: ", boo);
	}
	/**
	 * @param textureEnabled the default value is false
	 */
	create(): IShaderMaterial {
		if (this.material == null) {
			let textureEnabled = false;
			let material = CoRScene.createShaderMaterial("normal_entity_material");
			material.addUniformDataAt("u_params", this.m_data);
			material.setShaderBuilder((coderBuilder: IShaderCodeBuffer): void => {
				let coder = coderBuilder.getShaderCodeBuilder();

				coder.addVertLayout("vec2", "a_uvs");
				coder.addVertLayout("vec3", "a_nvs");
				coder.addVertLayout("vec3", "a_nvs2");
				coder.addVertUniform("vec4", "u_params", 2);
				coder.addFragUniform("vec4", "u_params", 2);
				coder.addVarying("vec2", "v_uv");
				coder.addVarying("vec4", "v_nv");
				coder.addVarying("vec3", "v_vnv");
				coder.addVarying("vec3", "v_dv");
				coder.addFragOutputHighp("vec4", "FragColor0");

				coder.addFragHeadCode(
					`
				const vec3 gama = vec3(1.0/2.2);
				const vec3 direc0 = normalize(vec3(-0.3,-0.6,0.9));
				const vec3 direc1 = normalize(vec3(0.3,0.6,0.9));
					`
				);

				coder.addFragMainCode(
					`
			bool facing = gl_FrontFacing;
    		vec2 dv = fract(gl_FragCoord.xy/vec2(5.0)) - vec2(0.5);
    		vec2 f2 = sign(dv);
    
    		vec3 nv = normalize(v_nv.xyz);
    		vec3 color = nv;

			float nDotL0 = max(dot(v_vnv.xyz, direc0), 0.1);
			float nDotL1 = max(dot(v_vnv.xyz, direc1), 0.1);
			
			vec3 modelColor = u_params[0].xyz * vec3( 0.7 * (nDotL0 + nDotL1) );
			vec4 param = u_params[1];

    		vec3 frontColor = param.x > 0.5 ? modelColor : color.xyz;
    		vec3 backColor = param.y > 0.5 ? vec3(sign(f2.x * f2.y), 1.0, 1.0) : frontColor;
    		vec3 dstColor = facing ? frontColor : backColor;
			
			frontColor = param.y > 0.5 ? dstColor : modelColor;
			dstColor = param.x > 0.5 ? frontColor : dstColor;
			
			float f = v_dv.x;
			f = f < 0.8 ? 1.0 : 0.0;
			// vec3 diffColor = vec3(1.0, 0.0, 0.0) * f + dstColor * (1.0 - f);
			float s = sign(f2.x * f2.y);
			vec3 diffColor = vec3(1.0, s, s) * f + dstColor * (1.0 - f);
			dstColor = param.y > 0.5 ? diffColor : dstColor;
			
    		FragColor0 = vec4(pow(dstColor, gama), 1.0);
    		// FragColor0 = vec4(u_params[0].xyz, 1.0);
					`
				);
				coder.addVertMainCode(
					`
			mat4 vmat = u_viewMat * u_objMat;
			viewPosition = vmat * vec4(a_vs,1.0);
			v_uv = a_uvs;
			vec3 pnv = u_params[1].zzz * a_nvs;
			v_dv = vec3(dot(normalize(a_nvs2), normalize( pnv )));
			vec4 pv = u_projMat * viewPosition;			
			gl_Position = pv;
			v_vnv = normalize(pnv * inverse(mat3(vmat)));
			pnv = u_params[1].w < 0.5 ? pnv : normalize(pnv * inverse(mat3(u_objMat)));
			v_nv = vec4(pnv, 1.0);
					`
				);
			});
			material.initializeByCodeBuf(textureEnabled);
			this.material = material;
		}
		return this.material;
	}
}

export { NormalEntityMaterial };

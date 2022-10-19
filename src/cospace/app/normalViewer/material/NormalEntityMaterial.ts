import IRenderTexture from "../../../../vox/render/texture/IRenderTexture";
import IShaderCodeBuffer from "../../../../vox/material/IShaderCodeBuffer";
import IShaderMaterial from "../../../../vox/material/mcase/IShaderMaterial";
import { ICoRScene } from "../../../voxengine/ICoRScene";
import IColor4 from "../../../../vox/material/IColor4";

declare var CoRScene: ICoRScene;

class NormalEntityMaterial {
	private m_data: Float32Array = new Float32Array([
		1.0, 1.0, 1.0, 1.0,
		0.0, 0.0, 0.0, 1.0
	]);
	material: IShaderMaterial;

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
		color.fromArray(this.m_data);
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
	applyLocalNormal(): void {
		console.log("apply local normal...");
		this.m_data[7] = 0.0;
		// this.applyDifference(false);
	}
	applyGlobalNormal(): void {
		console.log("apply global normal...");
		this.m_data[7] = 1.0;
		// this.applyDifference(false);
	}
	applyModelColor(): void {
		this.m_data[4] = 1.0;
		console.log("apply model color...");
		// this.applyDifference(false);
	}
	applyNormalColor(): void {
		this.m_data[4] = 0.0;
		// this.applyDifference(false);
		console.log("apply normal color...");
	}
	applyDifference(boo: boolean = true): void {
		this.m_data[5] = boo ? 1.0 : 0.0;
		console.log("apply diff boo: ", boo);
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

				// coder.addVertLayout("vec2", "a_uvs");
				coder.addVertLayout("vec3", "a_uvs");
				coder.addVertLayout("vec3", "a_nvs");
				coder.addVertUniform("vec4", "u_params",2);
				coder.addFragUniform("vec4", "u_params",2);
				coder.addVarying("vec4", "v_nv");
				coder.addVarying("vec3", "v_dv");
				coder.addFragOutputHighp("vec4", "FragColor0");

				coder.addFragHeadCode(
					`
				const vec3 gama = vec3(1.0/2.2);
				const vec3 direc = normalize(vec3(0.3,0.6,0.9));
					`
				);

				coder.addFragMainCode(
					`
			bool facing = gl_FrontFacing;
    		vec2 dv = fract(gl_FragCoord.xy/vec2(5.0)) - vec2(0.5);
    		vec2 f2 = sign(dv);
    
    		vec3 nv = normalize(v_nv.xyz);
    		vec3 color = pow(nv, gama);

			vec4 param = u_params[1];

    		vec3 frontColor = color.xyz;
    		vec3 backColor = param.y > 0.5 ? vec3(sign(f2.x * f2.y), 1.0, 1.0) : frontColor;
    		vec3 dstColor = facing ? frontColor : backColor;
			
			float nDotL = max(dot(v_nv.xyz, direc), 0.0);
			dstColor = param.x > 0.5 ? u_params[0].xyz * vec3(nDotL) : dstColor;
			
			float f = v_dv.x;
			f = f < 0.8 ? 1.0 : 0.0;
			vec3 diffColor = vec3(1.0, 0.0, 0.0) * f + dstColor * (1.0 - f);
			dstColor = param.y > 0.5 ? diffColor : dstColor;

    		FragColor0 = vec4(dstColor, 1.0);
    		// FragColor0 = vec4(u_params[0].xyz, 1.0);
					`
				);
				coder.addVertMainCode(
					`
			viewPosition = u_viewMat * u_objMat * vec4(a_vs,1.0);
			vec3 puvs = a_uvs;
			v_dv = vec3(dot(normalize(a_uvs), normalize(a_nvs)));
			vec4 pv = u_projMat * viewPosition;			
			gl_Position = pv;
			vec3 pnv = u_params[1].w < 0.5 ? a_nvs : normalize(a_nvs * inverse(mat3(u_objMat)));
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

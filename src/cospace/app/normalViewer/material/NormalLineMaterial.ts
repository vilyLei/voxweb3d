import IRenderTexture from "../../../../vox/render/texture/IRenderTexture";
import IShaderCodeBuffer from "../../../../vox/material/IShaderCodeBuffer";
import IShaderMaterial from "../../../../vox/material/mcase/IShaderMaterial";
import { ICoRScene } from "../../../voxengine/ICoRScene";
import IColor4 from "../../../../vox/material/IColor4";

declare var CoRScene: ICoRScene;

class NormalLineMaterial {
	private m_data: Float32Array = new Float32Array([1.0, 1.0, 1.0, 1.0]);
	private m_scale = 1.0;
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
	setScale(s: number): void {
		this.m_scale = s;
	}
	setLength(length: number): void {
		this.m_data[3] = this.m_scale * length;
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
	/**
	 * @param textureEnabled the default value is false
	 */
	create(): IShaderMaterial {
		if (this.material == null) {
			
			let textureEnabled = false;
			let material = CoRScene.createShaderMaterial("normal_dyn_line_material");
			material.addUniformDataAt("u_color", this.m_data);
			material.setShaderBuilder((coderBuilder: IShaderCodeBuffer): void => {
				let coder = coderBuilder.getShaderCodeBuilder();

				coder.addVertLayout("vec2", "a_uvs");
				coder.addVertLayout("vec3", "a_nvs");
				coder.addVertUniform("vec4", "u_color");
				coder.addFragUniform("vec4", "u_color");

				coder.addFragOutputHighp("vec4", "FragColor0");

				coder.addFragMainCode(
					`
			FragColor0 = vec4(u_color.xyz, 1.0);
					`
				);
				coder.addVertMainCode(
					`
			viewPosition = u_viewMat * u_objMat * vec4(a_vs + u_color.www * a_nvs * a_uvs.xxx,1.0);
			vec4 pv = u_projMat * viewPosition;
			
			gl_Position = pv;
					`
				);
			});
			material.initializeByCodeBuf(textureEnabled);
			this.material = material;
		}
		return this.material;
	}
}

export { NormalLineMaterial };

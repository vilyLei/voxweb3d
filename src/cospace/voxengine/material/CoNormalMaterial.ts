import IRenderTexture from "../../../vox/render/texture/IRenderTexture";
import IShaderCodeBuilder from "../../../vox/material/code/IShaderCodeBuilder";
import IShaderMaterial from "../../../vox/material/mcase/IShaderMaterial";
import { ICoRScene } from "../ICoRScene";

declare var CoRScene: ICoRScene;

/**
 * cospace engine material
 */
class CoNormalMaterial {
	material: IShaderMaterial;
	/**
	 * @param textureEnabled the default value is false
	 */
	build(textureEnabled: boolean = false): CoNormalMaterial {
		if (this.material == null) {
			let material = CoRScene.createShaderMaterial("coApp_nv_material");
			material.setShaderBuilder((coder: IShaderCodeBuilder): void => {
				coder.addVertLayout("vec3", "a_nvs");
				coder.addVarying("vec3", "v_worldNormal");
				coder.vertMatrixInverseEnabled = true;
				coder.addVertMainCode(
					`
			localPosition = vec4(a_vs.xyz,1.0);
			worldPosition = u_objMat * localPosition;
			oWorldPosition = worldPosition;
			viewPosition = u_viewMat * worldPosition;
			gl_Position = u_projMat * viewPosition;
			v_worldNormal = normalize( a_nvs.xyz * inverse(mat3(u_objMat)) );

		`
				);
				coder.addFragMainCode(
					`
			FragColor0 = vec4(v_worldNormal.xyz, 1.0);
		`
				);
			});
			// material.setVtxShaderCode( this.m_nv_vertCode );
			// material.setFragShaderCode( this.m_nv_fragCode );
			material.initializeByCodeBuf(textureEnabled);
			this.material = material;
		}
		return this;
	}
	private m_nv_vertCode = `#version 300 es
precision mediump float;
layout(location = 0) in vec3 a_vs;
layout(location = 1) in vec3 a_nvs;
uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
out vec4 v_param;
void main()
{
	vec4 viewPv = u_viewMat * u_objMat * vec4(a_vs, 1.0);
	gl_Position = u_projMat * viewPv;
	vec3 pnv = normalize(a_nvs * inverse(mat3(u_objMat)));
	v_param = vec4(pnv, 1.0);
}
	`;
	private m_nv_fragCode = `#version 300 es
precision mediump float;
const float MATH_PI = 3.14159265;
const float MATH_2PI = 2.0 * MATH_PI;
const float MATH_3PI = 3.0 * MATH_PI;
const float MATH_1PER2PI = 0.5 * MATH_PI;
const float MATH_3PER2PI = 3.0 * MATH_PI * 0.5;

const vec3 gama = vec3(1.0/2.2);
in vec4 v_param;
layout(location = 0) out vec4 FragColor;
void main() {

	bool facing = gl_FrontFacing;
	vec2 dv = fract(gl_FragCoord.xy/vec2(5.0)) - vec2(0.5);
	vec2 f2 = sign(dv);

	vec3 nv = normalize(v_param.xyz);
	vec3 color = pow(nv, gama);

	vec3 frontColor = color.xyz;
	vec3 backColor = vec3(sign(f2.x * f2.y), 1.0, 1.0);
	vec3 dstColor = facing ? frontColor : backColor;

	FragColor = vec4(dstColor, 1.0);
	// FragColor = vec4(color, 1.0);
}
	`;
}

export { CoNormalMaterial };

export default class MaterialConst {
	// for glsl shader auto build
	static readonly ATTRINS_VTX_VS: string = "a_vs";
	static readonly ATTRINS_VTX_UVS: string = "a_uvs";
	static readonly ATTRINS_VTX_NVS: string = "a_nvs";
	static readonly ATTRINS_VTX_CVS: string = "a_cvs";
	//
	static readonly UNIFORMNS_OBJ_MAT_NS: string = "u_objMat";
	static readonly UNIFORMNS_VIEW_MAT_NS: string = "u_viewMat";
	static readonly UNIFORMNS_PROJ_MAT_NS: string = "u_projMat";
	// 取值范围3001(包括3001) 到 3255(包括3255)

	static readonly SHADER_UNDEFINED: number = 3010;

	static readonly SHADER_VEC2: number = 3011;
	static readonly SHADER_VEC3: number = 3012;
	static readonly SHADER_VEC4: number = 3013;
	static readonly SHADER_VEC2FV: number = 3014;
	static readonly SHADER_VEC3FV: number = 3015;
	static readonly SHADER_VEC4FV: number = 3016;
	static readonly SHADER_MAT2: number = 3017;
	static readonly SHADER_MAT3: number = 3018;
	static readonly SHADER_MAT4: number = 3019;
	static readonly SHADER_FLOAT: number = 3020;
	static readonly SHADER_INT: number = 3021;
	static readonly SHADER_MAT2FV: number = 3022;
	static readonly SHADER_MAT3FV: number = 3023;
	static readonly SHADER_MAT4FV: number = 3024;

	static readonly SHADER_SAMPLER2D: number = 3031;
	static readonly SHADER_SAMPLERCUBE: number = 3032;
	static readonly SHADER_SAMPLER3D: number = 3033;
	static readonly SHADER_PRECISION_LOWP: number = 3101;
	static readonly SHADER_PRECISION_MEDIUMP: number = 3111;
	static readonly SHADER_PRECISION_HIGHP: number = 3121;
	// texture uniform name define
	static readonly UNIFORM_TEX_SAMPLER2D: string = "sampler2D";
	static readonly UNIFORM_TEX_SAMPLERCUBE: string = "samplerCube";
	static readonly UNIFORM_TEX_SAMPLER3D: string = "sampler3D";

	static readonly UNIFORMNS_TEX_SAMPLER_0: string = "u_sampler0";
	static readonly UNIFORMNS_TEX_SAMPLER_1: string = "u_sampler1";
	static readonly UNIFORMNS_TEX_SAMPLER_2: string = "u_sampler2";
	static readonly UNIFORMNS_TEX_SAMPLER_3: string = "u_sampler3";
	static readonly UNIFORMNS_TEX_SAMPLER_4: string = "u_sampler4";
	static readonly UNIFORMNS_TEX_SAMPLER_5: string = "u_sampler5";
	static readonly UNIFORMNS_TEX_SAMPLER_6: string = "u_sampler6";
	static readonly UNIFORMNS_TEX_SAMPLER_7: string = "u_sampler7";
	static readonly UNIFORMNS_TEX_SAMPLER_LIST: string[] = [
		MaterialConst.UNIFORMNS_TEX_SAMPLER_0,
		MaterialConst.UNIFORMNS_TEX_SAMPLER_1,
		MaterialConst.UNIFORMNS_TEX_SAMPLER_2,
		MaterialConst.UNIFORMNS_TEX_SAMPLER_3,
		MaterialConst.UNIFORMNS_TEX_SAMPLER_4,
		MaterialConst.UNIFORMNS_TEX_SAMPLER_5,
		MaterialConst.UNIFORMNS_TEX_SAMPLER_6,
		MaterialConst.UNIFORMNS_TEX_SAMPLER_7
	];
	static GetTypeByTypeNS(tns: string): number {
		const mc = MaterialConst;
		switch (tns) {
			case "mat4":
				return mc.SHADER_MAT4;
				break;
			case "mat3":
				return mc.SHADER_MAT3;
				break;
			case "mat2":
				return mc.SHADER_MAT2;
				break;
			case "float":
				return mc.SHADER_FLOAT;
				break;
			case "int":
				return mc.SHADER_INT;
				break;
			case "vec4":
				return mc.SHADER_VEC4;
				break;
			case "vec3":
				return mc.SHADER_VEC3;
				break;
			case "vec2":
				return mc.SHADER_VEC2;
				break;
			case "vec4[]":
				return mc.SHADER_VEC4FV;
				break;
			case "vec3[]":
				return mc.SHADER_VEC3FV;
				break;
			case "vec2[]":
				return mc.SHADER_VEC2FV;
				break;
			case "sampler2D":
				return mc.SHADER_SAMPLER2D;
				break;
			case "sampler3D":
				return mc.SHADER_SAMPLER3D;
				break;
			case "samplerCube":
				return mc.SHADER_SAMPLERCUBE;
				break;
			default:
				break;
		}
		return MaterialConst.SHADER_UNDEFINED;
	}
	static GetTypeNSByType(type: number): string {
		const mc = MaterialConst;
		switch (type) {
			case mc.SHADER_MAT4:
				return "mat4";
				break;
			case mc.SHADER_MAT3:
				return "mat3";
				break;
			case mc.SHADER_MAT2:
				return "mat2";
				break;
			case mc.SHADER_FLOAT:
				return "float";
				break;
			case mc.SHADER_VEC4:
				return "vec4";
			case mc.SHADER_VEC3:
				return "vec3";
				break;
			case mc.SHADER_VEC2:
				return "vec2";
				break;
			case mc.SHADER_SAMPLER2D:
				return "sampler2D";
				break;
			case mc.SHADER_SAMPLER3D:
				return "sampler3D";
				break;
			case mc.SHADER_SAMPLERCUBE:
				return "samplerCube";
				break;
			case mc.SHADER_UNDEFINED:
				return "undefined";
				break;
			default:
				break;
		}
		return "";
	}
}

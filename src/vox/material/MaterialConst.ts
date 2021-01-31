
export namespace vox
{
    export namespace material
    {
        export class MaterialConst
        {
            constructor()
            {
            }
            // for glsl shader auto build
            static ATTRINS_VTX_VS:string = "a_vs";
            static ATTRINS_VTX_UVS:string = "a_uvs";
            static ATTRINS_VTX_NVS:string = "a_nvs";
            static ATTRINS_VTX_CVS:string = "a_cvs";
            //
            static UNIFORMNS_OBJ_MAT_NS:string = "u_objMat";
            static UNIFORMNS_VIEW_MAT_NS:string = "u_viewMat";
            static UNIFORMNS_PROJ_MAT_NS:string = "u_projMat";
            // 取值范围3001(包括3001) 到 3255(包括3255)
            static SHADER_UNDEFINED:number = 3010;
            static SHADER_VEC2:number = 3011;
            static SHADER_VEC3:number = 3012;
            static SHADER_VEC4:number = 3013;
            static SHADER_VEC2FV:number = 3014;
            static SHADER_VEC3FV:number = 3015;
            static SHADER_VEC4FV:number = 3016;
            static SHADER_MAT2:number = 3017;
            static SHADER_MAT3:number = 3018;
            static SHADER_MAT4:number = 3019;
            static SHADER_FLOAT:number = 3020;
            static SHADER_INT:number = 3021;
            static SHADER_MAT2FV:number = 3022;
            static SHADER_MAT3FV:number = 3023;
            static SHADER_MAT4FV:number = 3024;
            static SHADER_SAMPLER2D:number = 3031;
            static SHADER_SAMPLERCUBE:number = 3032;
            static SHADER_SAMPLER3D:number = 3033;
            static SHADER_PRECISION_LOWP:number = 3101;
            static SHADER_PRECISION_MEDIUMP:number = 3111;
            static SHADER_PRECISION_HIGHP:number = 3121;
            // texture uniform name define
            static UNIFORM_TEX_SAMPLER2D:string = "sampler2D";
            static UNIFORM_TEX_SAMPLERCUBE:string = "samplerCube";
            static UNIFORM_TEX_SAMPLER3D:string = "sampler3D";
            //
            static UNIFORMNS_TEX_SAMPLER_0:string = "u_sampler0";
            static UNIFORMNS_TEX_SAMPLER_1:string = "u_sampler1";
            static UNIFORMNS_TEX_SAMPLER_2:string = "u_sampler2";
            static UNIFORMNS_TEX_SAMPLER_3:string = "u_sampler3";
            static UNIFORMNS_TEX_SAMPLER_4:string = "u_sampler4";
            static UNIFORMNS_TEX_SAMPLER_5:string = "u_sampler5";
            static UNIFORMNS_TEX_SAMPLER_6:string = "u_sampler6";
            static UNIFORMNS_TEX_SAMPLER_7:string = "u_sampler7";
            static UNIFORMNS_TEX_SAMPLER_LIST:string[] = [
                MaterialConst.UNIFORMNS_TEX_SAMPLER_0,
                MaterialConst.UNIFORMNS_TEX_SAMPLER_1,
                MaterialConst.UNIFORMNS_TEX_SAMPLER_2,
                MaterialConst.UNIFORMNS_TEX_SAMPLER_3,
                MaterialConst.UNIFORMNS_TEX_SAMPLER_4,
                MaterialConst.UNIFORMNS_TEX_SAMPLER_5,
                MaterialConst.UNIFORMNS_TEX_SAMPLER_6,
                MaterialConst.UNIFORMNS_TEX_SAMPLER_7
            ];
            static GetTypeByTypeNS(tns:string):number
            {
                switch(tns)
                {
                    case "mat4":
                        return MaterialConst.SHADER_MAT4;
                        break;
                    case "mat3":
                        return MaterialConst.SHADER_MAT3;
                        break;
                    case "mat2":
                        return MaterialConst.SHADER_MAT2;
                        break;
                    case "float":
                        return MaterialConst.SHADER_FLOAT;
                        break;
                    case "int":
                        return MaterialConst.SHADER_INT;
                        break;
                    case "vec4":
                        return MaterialConst.SHADER_VEC4;
                        break;
                    case "vec3":
                        return MaterialConst.SHADER_VEC3;
                        break;
                    case "vec2":
                        return MaterialConst.SHADER_VEC2;
                        break;
                    case "vec4[]":
                        return MaterialConst.SHADER_VEC4FV;
                        break;
                    case "vec3[]":
                        return MaterialConst.SHADER_VEC3FV;
                        break;
                    case "vec2[]":            
                        return MaterialConst.SHADER_VEC2FV;
                        break;
                    case "sampler2D":
                        return MaterialConst.SHADER_SAMPLER2D;
                        break;
                    case "sampler3D":
                        return MaterialConst.SHADER_SAMPLER3D;
                        break;
                    case "samplerCube":
                        return MaterialConst.SHADER_SAMPLERCUBE;
                        break;
                    default:
                        break;
                }
                return MaterialConst.SHADER_UNDEFINED;
            }
            static GetTypeNSByType(type:number):string
            {
                switch(type)
                {
                    case MaterialConst.SHADER_MAT4:
                        return "mat4";
                        break;
                    case MaterialConst.SHADER_MAT3:
                        return "mat3";
                        break;
                    case MaterialConst.SHADER_MAT2:
                        return "mat2";
                        break;
                    case MaterialConst.SHADER_FLOAT:
                        return "float";
                        break;
                    case MaterialConst.SHADER_VEC4:
                        return "vec4";
                    case MaterialConst.SHADER_VEC3:
                        return "vec3";
                        break;
                    case MaterialConst.SHADER_VEC2:
                        return "vec2";
                        break;
                    case MaterialConst.SHADER_SAMPLER2D:
                        return "sampler2D";
                        break;
                    case MaterialConst.SHADER_SAMPLER3D:
                        return "sampler3D";
                        break;
                    case MaterialConst.SHADER_SAMPLERCUBE:
                        return "samplerCube";
                        break;
                    case MaterialConst.SHADER_UNDEFINED:
                        return "undefined";
                        break;
                    default:
                        break;
                }
                return "";
            }
        }
    }
}

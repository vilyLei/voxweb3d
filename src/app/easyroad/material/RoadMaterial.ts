/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import MaterialBase from "../../../vox/material/MaterialBase";
import {MaterialPipeType} from "../../../vox/material/pipeline/MaterialPipeType";

class RoadShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static s_instance: RoadShaderBuffer = new RoadShaderBuffer();
    private m_uniqueName: string = "";
    fogEnabled: boolean = true;
    initialize(texEnabled: boolean): void {
        super.initialize(texEnabled);
        //console.log("RoadShaderBuffer::initialize()...,texEnabled: "+texEnabled);
        this.m_uniqueName = "RoadShd";
        if(texEnabled) this.m_uniqueName += "Tex";
        if(this.fogEnabled) this.m_uniqueName += "Fog";
    }
    private buildThisCode(): void {

        let coder = this.m_coder;
        coder.reset();
        coder.addVertLayout("vec3", "a_vs");
        //coder.addVertLayout("vec3", "a_nvs");
        if (this.isTexEanbled()) {
            coder.addVertLayout("vec2", "a_uvs");
            coder.addVarying("vec2", "v_uv");
            coder.addVarying("vec4", "v_wpos");
            // diffuse color
            coder.addTextureSample2D();
            // fog color
            coder.addTextureSample2D();            
        }
        coder.addFragOutput("vec4", "FragColor0");
        
        coder.addFragMainCode(
            `
#ifdef VOX_USE_2D_MAP
    vec4 color = VOX_Texture2D(u_sampler0, v_uv.xy);
    
    #ifdef VOX_USE_FOG
        vec4 color1 = VOX_Texture2D(u_sampler1, (u_envLightParams[3].xy + v_wpos.xz) / u_envLightParams[3].zw);
        fogEnvColor = color1.xyz;
    #else
        vec4 color1 = VOX_Texture2D(u_sampler1, v_uv.xy);
    #endif
    
    FragColor0 = color;
#else
    FragColor0 = u_color;
#endif
            `
                    );
        coder.addVertMainCode(
            `
vec3 localPosition = a_vs;

#ifdef VOX_USE_2D_MAP
    v_uv = a_uvs.xy;
#endif

v_wpos = u_objMat * vec4(localPosition, 1.0);
vec4 viewPos = u_viewMat * v_wpos;
gl_Position = u_projMat * viewPos;
`
        );

        if(this.pipeLine != null) {
            let types: MaterialPipeType[] = [];
            if(this.fogEnabled) {
                types.push( MaterialPipeType.FOG_EXP2 ); 
            }      
            this.pipeLine.build(this.m_coder, types);
        }
    }

    getFragShaderCode(): string {
        this.buildThisCode();
        return this.m_coder.buildFragCode();
    }
    getVtxShaderCode(): string {
        return this.m_coder.buildVertCode();
    }
    getUniqueShaderName(): string {
        //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
        return this.m_uniqueName;
    }
    toString(): string {
        return "[RoadShaderBuffer()]";
    }
    static GetInstance(): RoadShaderBuffer {
        return RoadShaderBuffer.s_instance;
    }
}

export default class RoadMaterial extends MaterialBase {

    fogEnabled: boolean = true;
    constructor() {
        super();
    }

    getCodeBuf(): ShaderCodeBuffer {

        let buf: RoadShaderBuffer = RoadShaderBuffer.GetInstance();
        buf.fogEnabled = this.fogEnabled;
        return buf;
    }

}
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
    // private m_pipeTypes: MaterialPipeType[] = null;
    // private m_keysString: string = "";

    fogEnabled: boolean = true;
    initialize(texEnabled: boolean): void {
        
        super.initialize(texEnabled);
        
        this.m_uniqueName = "RoadShd";
        if(texEnabled) this.m_uniqueName += "Tex";
        if(this.fogEnabled) this.m_uniqueName += "Fog";

        // if(this.pipeline != null) {
        //     this.m_pipeTypes = [];
        //     if(this.fogEnabled) {
        //         this.m_pipeTypes.push( MaterialPipeType.FOG_EXP2 );
        //     }
        //     this.pipeline.createKeys(this.m_pipeTypes);
        //     this.m_keysString = this.pipeline.getKeysString();
        //     this.pipeline.buildSharedUniforms(this.m_pipeTypes);
        // }
    }
    buildShader(): void {

        let coder = this.m_coder;
        
        coder.addVertLayout("vec3", "a_vs");

        if (this.isTexEanbled()) {

            coder.addVertLayout("vec2", "a_uvs");
            coder.addVarying("vec2", "v_uv");
            coder.addVarying("vec4", "v_wpos");

            // diffuse color
            this.m_uniform.addDiffuseMap();
            if(this.fogEnabled) {
                // fog color
                this.m_uniform.addFogColorMap();
            }
        }
        coder.addFragOutput("vec4", "FragColor0");
        
        coder.addFragMainCode(
        `
worldPosition.xyz = v_wpos.xyz;
#ifdef VOX_USE_2D_MAP
    vec4 color = VOX_Texture2D(u_sampler0, v_uv.xy);    
    FragColor0 = color;
#else
    FragColor0 = u_color;
#endif
`
        );
        coder.addVertMainCode(
            `
localPosition.xyz = a_vs.xyz;

#ifdef VOX_USE_2D_MAP
    v_uv = a_uvs.xy;
#endif

worldPosition = u_objMat * localPosition;
viewPosition = u_viewMat * worldPosition;
gl_Position = u_projMat * viewPosition;

v_wpos.xyz = worldPosition.xyz;
`
        );
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
    protected buildBuf(): void {
        let buf: RoadShaderBuffer = RoadShaderBuffer.GetInstance();
        buf.fogEnabled = this.fogEnabled;
    }
    getCodeBuf(): ShaderCodeBuffer {
        return RoadShaderBuffer.GetInstance();;
    }

}
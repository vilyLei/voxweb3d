/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import MaterialBase from "../../../vox/material/MaterialBase";

class Line3DShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static s_instance: Line3DShaderBuffer = null;
    private m_uniqueName: string = "";
    dynColorEnabled: boolean = false;
    initialize(texEnabled: boolean): void {
        
        this.m_uniqueName = "Line3DShd";
        if (this.dynColorEnabled) this.m_uniqueName += "_dynColor";
        
    }
    
    private buildThisCode(): void {

        this.m_coder.addVertLayout("vec3", "a_vs");

        if (this.dynColorEnabled) {
            this.m_coder.addDefine("DYNAMIC_COLOR");
            this.m_coder.addFragUniform("vec4", "u_color");
        }
        else {
            this.m_coder.addVertLayout("vec3", "a_cvs");
            this.m_coder.addVarying("vec3", "v_color");
        }
        
        this.m_coder.addFragOutputHighp("vec4", "FragColor0");

        this.m_coder.addFragMainCode(
            `
void main(){
    #ifndef DYNAMIC_COLOR
        FragColor0 = vec4(v_color, 1.0);
    #else
        FragColor0 = u_color;
    #endif

}
            `
        );
        this.m_coder.addVertMainCode(
            `
void main()
{
    vec4 pv = u_projMat * u_viewMat * u_objMat * vec4(a_vs,1.0);
    // pixels move offset, and no perspective error.
    //  pv.xy = (pv.xy/pv.w - vec2(0.5)) * pv.w;
    #ifndef DYNAMIC_COLOR
        v_color = a_cvs;
    #endif
    gl_Position = pv;
}
            `
        );
        if(this.pipeline != null) {
            
            // let types: MaterialPipeType[] = [];
            // if(this.fogEnabled) {                

            //     types.push( MaterialPipeType.FOG_EXP2 );
            // }       
            // this.pipeline.build(this.m_coder, types);
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
        return "[Line3DShaderBuffer()]";
    }

    static GetInstance(): Line3DShaderBuffer {
        if (Line3DShaderBuffer.s_instance != null) {
            return Line3DShaderBuffer.s_instance;
        }
        Line3DShaderBuffer.s_instance = new Line3DShaderBuffer();
        return Line3DShaderBuffer.s_instance;
    }
}

export default class Line3DMaterial extends MaterialBase {
    private m_dynColorEnabled: boolean = false;
    private m_colorArray: Float32Array = null;
    constructor(dynColorEnabled: boolean = false) {
        super();
        if (dynColorEnabled) {
            this.m_colorArray = new Float32Array([1.0, 1.0, 1.0, 1.0]);
            if (this.m_dynColorEnabled) {
                let oum: ShaderUniformData = new ShaderUniformData();
                oum.uniformNameList = ["u_color"];
                oum.dataList = [this.m_colorArray];
                this.m_shaderUniformData = oum;
            }
        }
        this.m_dynColorEnabled = dynColorEnabled;
    }

    getCodeBuf(): ShaderCodeBuffer {
        Line3DShaderBuffer.GetInstance().dynColorEnabled = this.m_dynColorEnabled;
        return Line3DShaderBuffer.GetInstance();
    }


    setRGB3f(pr: number, pg: number, pb: number) {
        if (this.m_colorArray != null) {
            this.m_colorArray[0] = pr;
            this.m_colorArray[1] = pg;
            this.m_colorArray[2] = pb;
        }
    }
}
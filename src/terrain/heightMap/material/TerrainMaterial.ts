/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import MaterialBase from "../../../vox/material/MaterialBase";

import {MaterialPipeType} from "../../../vox/material/pipeline/MaterialPipeType";

import {TerrainShaderCode} from "./TerrainShaderCode";

class TerrainpShaderBuffer extends ShaderCodeBuffer {

    private static s_instance: TerrainpShaderBuffer = new TerrainpShaderBuffer();
    private m_uniqueName: string = "";

    fogEnabled: boolean = true;

    constructor() {
        super();
    }

    initialize(texEnabled: boolean): void {
        
        super.initialize( texEnabled );
        
        this.m_uniqueName = "TerrainpShd";
        if(texEnabled) this.m_uniqueName += "Tex";
        if(this.fogEnabled) this.m_uniqueName += "Fog";
    }
    private buildThisCode(): void {

        this.m_coder.addVertLayout("vec3", "a_vs");
        this.m_coder.addVertLayout("vec3", "a_nvs");
        if (this.isTexEanbled()) {
            this.m_coder.addVertLayout("vec2", "a_uvs");
            this.m_coder.addVarying("vec4", "v_wpos");
            this.m_coder.addVarying("vec2", "v_uv");
            this.m_coder.addVarying("vec4", "v_param");
            // diffuse color 0
            this.m_coder.addTextureSample2D();
            // diffuse color 1
            this.m_coder.addTextureSample2D();
            
            // displace and color ao
            this.m_coder.addTextureSample2D("VOX_DISPLACEMENT_MAP", true, true, true);
        }

        this.m_coder.addFragOutputHighp("vec4", "FragColor0");
        this.m_coder.addFragUniform("vec4", "u_color");
        this.m_coder.addVertUniform("vec4", "u_displacement");
        
        this.m_coder.addShaderObject( TerrainShaderCode );

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
        return ShaderCodeBuffer.s_coder.buildFragCode();
    }
    getVtxShaderCode(): string {

        return ShaderCodeBuffer.s_coder.buildVertCode();
    }
    getUniqueShaderName(): string {
        //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
        return this.m_uniqueName;
    }
    toString(): string {
        return "[TerrainpShaderBuffer()]";
    }
    static GetInstance(): TerrainpShaderBuffer {
        return TerrainpShaderBuffer.s_instance;
    }
}

export default class TerrainpMaterial extends MaterialBase {

    fogEnabled: boolean = true;

    constructor() {

        super();

        this.m_shaderUniformData = new ShaderUniformData();
        this.m_shaderUniformData.uniformNameList = ["u_color", "u_displacement"];
        this.m_shaderUniformData.dataList = [this.m_colorArray, this.m_displacementArray];
    }

    getCodeBuf(): ShaderCodeBuffer {

        let buf: TerrainpShaderBuffer = TerrainpShaderBuffer.GetInstance();
        buf.fogEnabled = this.fogEnabled;

        return buf;
    }

    private m_colorArray: Float32Array = new Float32Array([1.0, 1.0, 1.0, 1.0]);
    private m_displacementArray: Float32Array = new Float32Array([50.0, 1.0, 0.0, 0.0]);
    setRGB3f(pr: number, pg: number, pb: number): void {
        this.m_colorArray[0] = pr;
        this.m_colorArray[1] = pg;
        this.m_colorArray[2] = pb;
    }
    setRGBA4f(pr: number, pg: number, pb: number, pa: number): void {
        this.m_colorArray[0] = pr;
        this.m_colorArray[1] = pg;
        this.m_colorArray[2] = pb;
        this.m_colorArray[3] = pa;
    }
    setAlpha(pa: number): void {
        this.m_colorArray[3] = pa;
    }
    setDisplacementParams(scale: number, bias: number): void {
        this.m_displacementArray[0] = scale;
        this.m_displacementArray[1] = bias;
    }
}
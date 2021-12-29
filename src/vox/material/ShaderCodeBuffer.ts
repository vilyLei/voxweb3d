/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import {ShaderCodeUUID} from './ShaderCodeUUID';
import IRenderTexture from "../../vox/render/IRenderTexture";
import ShaderCodeBuilder from "../../vox/material/code/ShaderCodeBuilder";
import ShaderCompileInfo from "../../vox/material/code/ShaderCompileInfo";
import IShaderCodeObject from "./IShaderCodeObject";
import { IMaterialPipeline } from "../../vox/material/pipeline/IMaterialPipeline";
import { MaterialPipeType } from "./pipeline/MaterialPipeType";
import { ShaderCodeUniform } from "../../vox/material/code/ShaderCodeUniform";

class ShaderCodeBuffer {

    private static __$s_csBuf: ShaderCodeBuffer = null;
    protected static s_coder: ShaderCodeBuilder;
    protected static s_uniform: ShaderCodeUniform;
    protected m_coder: ShaderCodeBuilder = null;
    protected m_uniform: ShaderCodeUniform;
    protected m_texture: ShaderCodeUniform;
    protected m_shaderCodeObj: IShaderCodeObject = null;

    protected m_texList: IRenderTexture[] = null;
    protected m_texEnabled: boolean = true;

    pipeline: IMaterialPipeline = null;

    vertColorEnabled: boolean = false;
    premultiplyAlpha: boolean = false;
    shadowReceiveEnabled: boolean = false;
    lightEnabled: boolean = false;
    fogEnabled: boolean = false;

    pipeTypes: MaterialPipeType[] = null;
    keysString: string = "";

    /**
     * 是否自适应转换shader版本
     */
    adaptationShaderVersion: boolean = true;
    constructor() {
        if(ShaderCodeBuffer.s_coder == null) {
            ShaderCodeBuffer.s_uniform = new ShaderCodeUniform();
            ShaderCodeBuffer.s_coder = new ShaderCodeBuilder( ShaderCodeBuffer.s_uniform );
            ShaderCodeBuffer.s_uniform.__$setCodeBuilder( ShaderCodeBuffer.s_coder );
        }
    }

    reset(): void {

        this.m_coder = ShaderCodeBuffer.s_coder;
        this.m_uniform = ShaderCodeBuffer.s_uniform;
        this.m_texture = this.m_uniform;
        
        this.m_coder.reset();
        this.m_texList = null;
        this.pipeTypes = null;

        this.vertColorEnabled = false;
        this.premultiplyAlpha = false;
        this.shadowReceiveEnabled = false;
        this.lightEnabled = false;
        this.fogEnabled = false;
    }
    clear(): void {
        this.m_coder = null;
    }
    setShaderCodeObject(obj: IShaderCodeObject): void {
        this.m_shaderCodeObj = obj;
    }
    getShaderCodeObject(): IShaderCodeObject {
        return this.m_shaderCodeObj;
    }
    getShaderCodeObjectUUID(): ShaderCodeUUID {
        return ShaderCodeUUID.None;
    }
    getShaderCodeBuilder(): ShaderCodeBuilder {
        return ShaderCodeBuffer.s_coder;
    }
    static GetPreCompileInfo(): ShaderCompileInfo {
        return ShaderCodeBuffer.s_coder.getPreCompileInfo();
    }

    initialize(texEnabled: boolean): void {

        if (ShaderCodeBuffer.__$s_csBuf != null) {
            if (ShaderCodeBuffer.__$s_csBuf != this) {
                ShaderCodeBuffer.__$s_csBuf.initialize(texEnabled);
            }
        }
        this.m_texEnabled = texEnabled;

        if (this.premultiplyAlpha) this.m_coder.addDefine("VOX_PREMULTIPLY_ALPHA", "1");
        if (this.vertColorEnabled) this.m_coder.addDefine("VOX_USE_VTX_COLOR", "1");

        this.bufInitWithPipeline();
    }

    buildPipelineParams(): void {
        if (this.pipeline != null) {
            if(this.pipeTypes == null) {
                this.pipeTypes = [];
                if (this.lightEnabled) this.pipeTypes.push(MaterialPipeType.GLOBAL_LIGHT);                    
                if (this.shadowReceiveEnabled) this.pipeTypes.push(MaterialPipeType.VSM_SHADOW);
                if (this.fogEnabled) this.pipeTypes.push(MaterialPipeType.FOG_EXP2);
            }
        }
    }
    
    getTexturesFromPipeline(outList: IRenderTexture[]): void {
        if (this.pipeline != null) {
            this.pipeline.getTextures(this.m_coder, outList, this.pipeTypes);
        }
    }
    private bufInitWithPipeline(): void {

        if (this.pipeline != null) {
            this.buildPipelineParams();
            this.pipeline.buildSharedUniforms(this.pipeTypes);
            this.pipeline.createKeys(this.pipeTypes);
            this.keysString = this.pipeline.getKeysString();
        }
    }
    
    isTexEanbled(): boolean {
        return this.m_texEnabled;
    }
    setIRenderTextureList(texList: IRenderTexture[]): void {
        this.m_texList = texList;
    }
    getIRenderTextureList(): IRenderTexture[] {
        return this.m_texList;
    }
    buildShader(): void {
    }
    getFragShaderCode(): string {

        if (ShaderCodeBuffer.__$s_csBuf != this) return ShaderCodeBuffer.__$s_csBuf.getFragShaderCode();
        return this.m_coder.buildFragCode();
    }
    getVertShaderCode(): string {

        if (ShaderCodeBuffer.__$s_csBuf != this) return ShaderCodeBuffer.__$s_csBuf.getVertShaderCode();
        return this.m_coder.buildVertCode();
    }
    getUniqueShaderName(): string {
        if (ShaderCodeBuffer.__$s_csBuf != this) return ShaderCodeBuffer.__$s_csBuf.getUniqueShaderName();
    }
    toString(): string {
        return "[ShaderCodeBuffer()]";
    }
    static UseShaderBuffer(buf: ShaderCodeBuffer): void {
        if (ShaderCodeBuffer.__$s_csBuf != null) {
            ShaderCodeBuffer.__$s_csBuf.clear();
        }
        ShaderCodeBuffer.__$s_csBuf = buf;
    }
}
export default ShaderCodeBuffer;
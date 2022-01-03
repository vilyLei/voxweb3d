/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderData from "../../vox/material/ShaderData";
import MaterialResource from "../../vox/material/MaterialResource";
import ShaderUniformData from "../../vox/material/ShaderUniformData";
import IShaderUniform from "../../vox/material/IShaderUniform";
import ShaderUniform from "../../vox/material/ShaderUniform";

import TextureProxy from '../../vox/texture/TextureProxy';
import ShaderCodeBuffer from "../../vox/material/ShaderCodeBuffer";
import IRenderMaterial from "../../vox/render/IRenderMaterial";

import { MaterialPipeType } from "./pipeline/MaterialPipeType";
import { IMaterialPipeline } from "../../vox/material/pipeline/IMaterialPipeline";

export default class MaterialBase implements IRenderMaterial {

    private static s_codeBuffer: ShaderCodeBuffer = null;
    protected m_sharedUniforms: ShaderUniform[] = null;
    protected m_shaderUniformData: ShaderUniformData = null;
    protected m_pipeLine: IMaterialPipeline = null;
    protected m_uniqueShaderName: string = "";
    constructor() { }

    // use rgb normalize bias enabled
    private m_shduns: string = "";
    private m_shdData: ShaderData = null;
    // tex list unique hash value
    __$troMid: number = -1;
    __$uniform: IShaderUniform = null;
    /**
     * pipes type list for material pipeline
     */
    pipeTypes: MaterialPipeType[] = null;

    setMaterialPipeline(pipeline: IMaterialPipeline): void {
        this.m_pipeLine = pipeline;
    }
    getMaterialPipeline(): IMaterialPipeline {
        return this.m_pipeLine;
    }
    getShdUniqueName(): string {
        return this.m_shduns;
    }
    initializeByUniqueName(shdCode_uniqueName: string) {
        if (this.getShaderData() == null) {
            let shdData: ShaderData = MaterialResource.FindData(shdCode_uniqueName);
            if (shdData != null) this.m_shdData = shdData;
        }
        return this.getShaderData() != null;
    }
    // get a shader code buf instance, for sub class override
    getCodeBuf(): ShaderCodeBuffer {
        if (MaterialBase.s_codeBuffer != null) {
            return MaterialBase.s_codeBuffer;
        }
        MaterialBase.s_codeBuffer = new ShaderCodeBuffer();
        return MaterialBase.s_codeBuffer;
    }
    hasShaderData(): boolean {
        if (this.m_shdData != null) {
            if (this.m_shdData.haveTexture()) {
                return this.texDataEnabled();
            }
            else {
                return true;
            }
        }
        return false;
    }
    initializeByCodeBuf(texEnabled: boolean = false): void {
        if (this.m_shdData == null) {
            let buf: ShaderCodeBuffer = this.getCodeBuf();
            if (buf != null) {
                buf.reset();
                buf.pipeline = this.m_pipeLine;
                buf.pipeTypes = this.pipeTypes;
                if (buf.pipeline != null) buf.pipeline.reset();
                this.buildBuf();

                let shdData: ShaderData;
                let shdCode_uniqueName: string = this.m_uniqueShaderName;
                if(shdCode_uniqueName != "") {
                    shdData = MaterialResource.FindData(shdCode_uniqueName);
                    this.m_shduns = shdCode_uniqueName;
                }
                if(shdData == null) {

                    if (MaterialBase.s_codeBuffer == null) {
                        MaterialBase.s_codeBuffer = new ShaderCodeBuffer();
                    }
                    ShaderCodeBuffer.UseShaderBuffer(buf);
                    texEnabled = texEnabled || this.getTextureTotal() > 0;
                    buf.initialize(texEnabled);
                    shdCode_uniqueName = buf.getUniqueShaderName() + buf.getShaderCodeBuilder().getUniqueNSKeyString();
                    this.m_shduns = shdCode_uniqueName;
                    this.__$initShd(this.m_shduns);
                    shdData = MaterialResource.FindData(shdCode_uniqueName);
                    this.m_uniqueShaderName = this.m_shduns;
                }
                else {
                    ShaderCodeBuffer.UseShaderBuffer(buf);
                    texEnabled = texEnabled || this.getTextureTotal() > 0;
                    buf.initialize(texEnabled);
                }
                if (shdData == null) {
                    buf.buildShader();
                    buf.buildDefine();
                    if (buf.pipeline != null) {
                        if(buf.getShaderCodeObject() != null) {
                            buf.pipeline.addShaderCode(buf.getShaderCodeObject(), false);
                        }
                        else {
                            buf.pipeline.addShaderCodeWithUUID(buf.getShaderCodeObjectUUID(), false);
                        }
                        buf.pipeline.build(buf.getShaderCodeBuilder());
                    }
                    let fshdCode: string = buf.getFragShaderCode();
                    let vshdCode: string = buf.getVertShaderCode();
                    shdData = MaterialResource.CreateShdData(
                        shdCode_uniqueName
                        , vshdCode
                        , fshdCode
                        , buf.adaptationShaderVersion
                        , ShaderCodeBuffer.GetPreCompileInfo()
                    );
                }
                if (this.m_pipeLine != null) {
                    this.m_sharedUniforms = this.m_pipeLine.getSharedUniforms();
                }

                ShaderCodeBuffer.UseShaderBuffer(null);
                this.m_shdData = shdData;
            }
        }
    }

    protected buildBuf(): void {
    }
    protected __$initShd(pshduns: string): void {
    }
    getShaderData(): ShaderData { return this.m_shdData; }

    private m_texList: TextureProxy[] = null;
    private m_texListLen: number = 0;
    private m_texDataEnabled: boolean = false;

    /**
     * set TextuerProxy instances
     * @param texList [tex0,tex1,...]
     */
    setTextureList(texList: TextureProxy[]): void {
        if (this.m_texList != texList) {
            this.m_texDataEnabled = false;
            if (texList != null) {
                this.m_texListLen = texList.length;
            }
            else {
                this.m_texListLen = 0;
            }
            let i: number = 0;
            if (this.m_texList != null) {
                for (; i < this.m_texList.length; ++i) {
                    this.m_texList[i].__$detachThis();
                }
            }
            this.m_texDataEnabled = true;
            this.m_texList = texList;
            if (this.m_texList != null) {
                let key: number = 31;
                for (i = 0; i < this.m_texList.length; ++i) {
                    key = key * 131 + this.m_texList[i].getUid();
                    this.m_texList[i].__$attachThis();
                    if (!this.m_texList[i].isDataEnough()) {
                        this.m_texDataEnabled = false;
                    }
                }
                this.__$troMid = key;
            }
        }
    }
    setTextureAt(index: number, tex: TextureProxy): void {
        if (index >= 0 && tex != null) {
            let texList: TextureProxy[] = this.m_texList;
            let len: number = texList.length;
            if (texList != null && texList[index] != tex && index < len && len > 0) {
                texList = texList.slice(0);
                texList[index].__$detachThis();
                texList[index] = tex;
                this.m_texDataEnabled = tex.isDataEnough();
                tex.__$attachThis();
                let key = 31;
                for (let i: number = 0; i < len; ++i) {
                    key = key * 131 + texList[i].getUid();
                }
                this.__$troMid = key;
                this.m_texList = texList;
            }
        }
    }
    getTextureList(): TextureProxy[] { return this.m_texList; }
    getTextureAt(index: number): TextureProxy { return this.m_texList[index]; }
    getTextureTotal(): number { return this.m_texListLen; }
    getShdTexTotal(): number {
        if (this.m_shdData != null) {
            return this.m_shdData.getTexTotal();
        }
        return 0;
    }
    texDataEnabled(): boolean {
        if (this.m_texList != null) {
            if (this.m_texDataEnabled) {
                return true;
            }
            let boo: boolean = true;
            let texList: TextureProxy[] = this.m_texList;
            for (let i: number = 0; i < this.m_texListLen; ++i) {
                if (!texList[i].isDataEnough()) {
                    boo = false;
                    break;
                }
            }
            this.m_texDataEnabled = boo;
            return boo;
        }
        else {
            if (this.m_shdData != null && this.m_shdData.getTexTotal() > 0) {
                console.warn("this material("+this.m_shdData.getUniqueShaderName()+") texList is null, need " + this.m_shdData.getTexTotal() + " textures.");
            }
        }
        return false;
    }

    createSharedUniforms(): ShaderUniform[] {
        return this.m_sharedUniforms;
    }
    createSharedUniformsData(): ShaderUniformData[] {
        return null;
    }
    createSelfUniformData(): ShaderUniformData {
        return this.m_shaderUniformData;
    }
    //synchronism ubo data or other displayEntity data
    updateSelfData(ro: any): void {
    }
    hasTexture(): boolean {
        return this.m_shdData.haveTexture();
    }
    getBufSortFormat(): number {
        //trace("null != m_shdData: "+(null != m_shdData));
        if (null != this.m_shdData) {
            return this.m_shdData.getLayoutBit();
        }
        return 0x0;
    }
    private m_attachCount: number = 0;
    __$attachThis(): void {
        ++this.m_attachCount;
        //console.log("MaterialBase::__$attachThis() this.m_attachCount: "+this.m_attachCount);
    }
    __$detachThis(): void {
        --this.m_attachCount;
        //console.log("MaterialBase::__$detachThis() this.m_attachCount: "+this.m_attachCount);
        if (this.m_attachCount < 1) {
            this.m_attachCount = 0;
        }
    }
    getAttachCount(): number {
        return this.m_attachCount;
    }
    destroy(): void {

        this.m_sharedUniforms = null;
        this.m_shaderUniformData = null;
        this.pipeTypes = null;
        if (this.getAttachCount() < 1) {
            if (this.m_texList != null) {
                for (let i: number = 0; i < this.m_texList.length; ++i) {
                    this.m_texList[i].__$detachThis();
                }
            }
            this.m_shdData = null;
            this.m_texList = null;
            this.m_texDataEnabled = false;
            this.__$troMid = 0;
            if (this.__$uniform != null) {
                this.__$uniform.destroy();
                this.__$uniform = null;
            }
        }
    }
    toString(): string {
        return "[MaterialBase()]";
    }
}
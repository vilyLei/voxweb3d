/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderData from "../../vox/material/ShaderData";
import MaterialResource from "../../vox/material/MaterialResource";
import IShaderUniformData from "../../vox/material/IShaderUniformData";
import IRenderShaderUniform from "../../vox/render/uniform/IRenderShaderUniform";

import IRenderTexture from "../../vox/render/texture/IRenderTexture";
import ShaderCodeBuffer from "../../vox/material/ShaderCodeBuffer";
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import { IVtxBufRenderData } from "../../vox/render/IVtxBufRenderData";

import { MaterialPipeType } from "./pipeline/MaterialPipeType";
import { IMaterialPipeline } from "../../vox/material/pipeline/IMaterialPipeline";
// import { IStencil } from "../../vox/render/rendering/IStencil";
import { Stencil } from "../../vox/render/rendering/Stencil";
import IVtxDrawingInfo from "../render/vtx/IVtxDrawingInfo";
import VtxDrawingInfo from "../render/vtx/VtxDrawingInfo";

export default class MaterialBase implements IRenderMaterial, IVtxBufRenderData {

    private m_shduns = "";
    private m_shdData: ShaderData = null;
    private m_polygonOffset: number[] = null;

    protected m_sharedUniforms: IRenderShaderUniform[] = null;
    protected m_shaderUniformData: IShaderUniformData = null;
    protected m_pipeLine: IMaterialPipeline = null;
    protected m_uniqueShaderName = "";
    // sub rendering pass
    private m_cases: IRenderMaterial[] = null;
    // tex list unique hash value
    __$troMid = -1;
    __$uniform: IRenderShaderUniform = null;
    /**
     * pipes type list for material pipeline
     */
    pipeTypes: MaterialPipeType[] = null;
    renderState = 0;
    colorMask = 0;
    /**
     * the default value is null
     */
    stencil: Stencil = null;
    multiPass = false;
    readonly vtxInfo: IVtxDrawingInfo = new VtxDrawingInfo();
    constructor() { }

    // for multi - pass
    setCases(ls: IRenderMaterial[]): void {
        this.m_cases = ls;
    }
    getCases(): IRenderMaterial[] {
        return this.m_cases;
    }
    /*
     * specifies the scale factors and units to calculate depth values.
     * @param factor the value is a GLfloat which sets the scale factor for the variable depth offset for each polygon. The default value is 0.
     * @param units the value is a which sets the multiplier by which an implementation-specific value is multiplied with to create a constant depth offset. The default value is 0.
     */
    setPolygonOffset(factor: number, units: number = 0.0): void {
        if (this.m_polygonOffset == null) {
            this.m_polygonOffset = [factor, units];
        }
        else {
            this.m_polygonOffset[0] = factor;
            this.m_polygonOffset[1] = units;
        }
    }
    getPolygonOffset(): number[] {
        return this.m_polygonOffset;
    }
    /**
     * 设置深度偏移量
     * @param offset the value range: [-2.0 -> 2.0]
     */
    setDepthOffset(offset: number): void {
    }
    setMaterialPipeline(pipeline: IMaterialPipeline): void {
        this.m_pipeLine = pipeline;
    }
    getMaterialPipeline(): IMaterialPipeline {
        return this.m_pipeLine;
    }
    getShdUniqueName(): string {
        return this.m_shduns;
    }
    // get a shader code buf instance, for sub class override
    getCodeBuf(): ShaderCodeBuffer {
        throw Error("Illgel operation !!!");
        return null;
    }
    hasShaderData(): boolean {
        if (this.m_shdData) {
            return this.m_shdData.haveTexture() ? this.texDataEnabled() : true;
        }
        return false;
    }
    // initializeByRenderer(texEnabled: boolean = false): void {
    //     this.initializeByCodeBuf(texEnabled);
    // }
    initializeByCodeBuf(texEnabled: boolean = false): void {
        texEnabled = texEnabled || this.getTextureTotal() > 0;
        if (this.m_shdData == null) {
            let buf = this.getCodeBuf();
            if (buf) {
                buf.reset();
                buf.pipeline = this.m_pipeLine;
                buf.pipeTypes = this.pipeTypes;
                if (buf.pipeline != null) buf.pipeline.reset();
                this.buildBuf();

                let shdData: ShaderData;
                let shdCode_uniqueName: string = this.m_uniqueShaderName;
                if (shdCode_uniqueName != "") {
                    shdData = MaterialResource.FindData(shdCode_uniqueName);
                    this.m_shduns = shdCode_uniqueName;
                }
                if (shdData == null) {
                    
                    texEnabled = texEnabled || this.getTextureTotal() > 0;
                    buf.initialize(texEnabled);
                    shdCode_uniqueName = buf.getUniqueShaderName() + buf.keysString + buf.getShaderCodeBuilder().getUniqueNSKeyString();
                    this.m_shduns = shdCode_uniqueName;
                    this.__$initShd(this.m_shduns);
                    shdData = MaterialResource.FindData(shdCode_uniqueName);
                    this.m_uniqueShaderName = this.m_shduns;
                }
                else {
                    texEnabled = texEnabled || this.getTextureTotal() > 0;
                    buf.initialize(texEnabled);
                }
                if (shdData == null) {
                    if (buf.pipeline == null) {
                        if (buf.getShaderCodeObject() != null) {
                            buf.getShaderCodeBuilder().addShaderObject(buf.getShaderCodeObject());
                        }
                    }
                    buf.buildShader();
                    buf.buildDefine();
                    if (buf.pipeline != null) {
                        if (buf.getShaderCodeObject() != null) {
                            buf.pipeline.addShaderCode(buf.getShaderCodeObject(), false);
                        }
                        else {
                            buf.pipeline.addShaderCodeWithUUID(buf.getShaderCodeObjectUUID(), false);
                        }
                        buf.pipeline.build(buf.getShaderCodeBuilder());
                    }
                    let fshd = buf.getFragShaderCode();
                    let vshd = buf.getVertShaderCode();
                    shdData = MaterialResource.CreateShdData(
                        shdCode_uniqueName
                        , vshd
                        , fshd
                        , buf.adaptationShaderVersion
                        , ShaderCodeBuffer.GetPreCompileInfo()
                    );
                }
                
                if (this.m_pipeLine != null) {
                    this.m_sharedUniforms = this.m_pipeLine.getSharedUniforms();
                }

                this.m_shdData = shdData;
            }
        }
    }

    protected buildBuf(): void {
    }
    protected __$initShd(pshduns: string): void {
    }
    getShaderData(): ShaderData { return this.m_shdData; }

    private m_texList: IRenderTexture[] = null;
    private m_texListLen: number = 0;
    private m_texDataEnabled: boolean = false;

    /**
     * set TextuerProxy instances
     * @param texList [tex0,tex1,...]
     */
    setTextureList(texList: IRenderTexture[]): void {
        if (this.m_texList != texList) {
            this.m_texDataEnabled = false;
            if (texList != null) {
                this.m_texListLen = texList.length;
            }
            else {
                this.m_texListLen = 0;
            }
            let i = 0;
            if (this.m_texList != null) {
                for (; i < this.m_texList.length; ++i) {
                    this.m_texList[i].__$detachThis();
                }
            }
            this.m_texDataEnabled = true;
            this.m_texList = texList;
            if (this.m_texList != null) {
                let key = 31;
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
    setTextureAt(index: number, tex: IRenderTexture): void {
        if (index >= 0 && tex != null) {
            let texList = this.m_texList;
            let len = texList.length;
            if (texList != null && texList[index] != tex && index < len && len > 0) {
                texList = texList.slice(0);
                texList[index].__$detachThis();
                texList[index] = tex;
                this.m_texDataEnabled = tex.isDataEnough();
                tex.__$attachThis();
                let key = 31;
                for (let i = 0; i < len; ++i) {
                    key = key * 131 + texList[i].getUid();
                }
                this.__$troMid = key;
                this.m_texList = texList;
            }
        }
    }
    getTextureList(): IRenderTexture[] { return this.m_texList; }
    getTextureAt(index: number): IRenderTexture {
        if(this.m_texList != null && this.m_texList.length > index) return this.m_texList[index];
        return null;
    }
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
            let boo = true;
            let texList = this.m_texList;
            for (let i = 0; i < this.m_texListLen; ++i) {
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
                console.warn("this material(" + this.m_shdData.getUniqueShaderName() + ") texList is null, need " + this.m_shdData.getTexTotal() + " textures.");
            }
        }
        return false;
    }

    createSharedUniforms(): IRenderShaderUniform[] {
        return this.m_sharedUniforms;
    }
    createSharedUniformsData(): IShaderUniformData[] {
        return null;
    }
    createSelfUniformData(): IShaderUniformData {
        return this.m_shaderUniformData;
    }
    //synchronism ubo data or other displayEntity data
    updateSelfData(ro: any): void {
    }
    hasTexture(): boolean {
        return this.m_shdData.haveTexture();
    }
    getBufSortFormat(): number {
        return this.m_shdData != null ? this.m_shdData.getLayoutBit() : 0x0;
    }
    getBufTypeList(): number[] {
        return this.m_shdData != null ? this.m_shdData.getLocationTypes() : null;
    }
    getBufSizeList(): number[] {
        return this.m_shdData != null ? this.m_shdData.getAttriSizeList() : null;
    }
    private m_attachCount: number = 0;
    __$attachThis(): void {
        ++this.m_attachCount;
        // console.log("MaterialBase::__$attachThis() this.m_attachCount: "+this.m_attachCount);
    }
    __$detachThis(): void {
        --this.m_attachCount;
        // console.log("MaterialBase::__$detachThis() this.m_attachCount: "+this.m_attachCount);
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
                for (let i = 0; i < this.m_texList.length; ++i) {
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
        this.vtxInfo
    }
    update(): void {
        
    }
}
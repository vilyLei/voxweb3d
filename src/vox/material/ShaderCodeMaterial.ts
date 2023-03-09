/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../vox/material/ShaderUniformData";
import MaterialBase from "../../vox/material/MaterialBase";
import { IShaderCodeWrapper } from "./IShaderCodeWrapper";

import IRenderShaderUniform from "../../vox/render/uniform/IRenderShaderUniform";

class ShaderCodeShaderBuffer extends ShaderCodeBuffer {

    constructor() {
        super();
    }
    private static s_instance: ShaderCodeShaderBuffer = new ShaderCodeShaderBuffer();

    codeWrapper: IShaderCodeWrapper = null;

    initialize(texEnabled: boolean): void {
        this.adaptationShaderVersion = false;
        this.codeWrapper.initialize();
    }

    getFragShaderCode(): string {

        return this.codeWrapper.getFragShaderCode(this.getShaderCodeBuilder());
    }
    getVertShaderCode(): string {
        return this.codeWrapper.getVertShaderCode(this.getShaderCodeBuilder());
    }
    getUniqueShaderName(): string {
        return this.codeWrapper.getUniqueShaderName();
    }

    static GetInstance(): ShaderCodeShaderBuffer {
        return ShaderCodeShaderBuffer.s_instance;
    }
}
/**
 * 作为用户直接使用创建 shader coce 的 material 类
 * 
 * 只能由渲染器对外提供, 不允许别的模块分离打包
 */
export default class ShaderCodeMaterial extends MaterialBase {

    private m_codeWrapper: IShaderCodeWrapper = null;
    private m_uniformData: ShaderUniformData = null;
    private m_sharedUniformsDataList: ShaderUniformData[] = null;
    constructor() {
        super();
    }
    setShaderCodeWrapper(codeWrapper: IShaderCodeWrapper): void {
        this.m_codeWrapper = codeWrapper;
    }
    protected buildBuf(): void {
        let buf: ShaderCodeShaderBuffer = ShaderCodeShaderBuffer.GetInstance();
        buf.codeWrapper = this.m_codeWrapper;
    }
    getCodeBuf(): ShaderCodeBuffer {
        return ShaderCodeShaderBuffer.GetInstance();
    }
    setSelfUniformData(data: ShaderUniformData): void {
        this.m_uniformData = data;
    }
    createSharedUniforms(): IRenderShaderUniform[] {
        return this.m_codeWrapper.createSharedUniforms();
    }
    setSharedUniformsData(dataList: ShaderUniformData[]): void {
        this.m_sharedUniformsDataList = dataList;
    }
    createSharedUniformsData(): ShaderUniformData[] {
        return this.m_sharedUniformsDataList;
    }
    createSelfUniformData(): ShaderUniformData {
        return this.m_uniformData;
    }
    destroy(): void {
        super.destroy();
        this.m_codeWrapper = null;
        this.m_uniformData = null;
        this.m_sharedUniformsDataList = null;
    }
}
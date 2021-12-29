
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { ShaderCodeUUID } from "../ShaderCodeUUID";
import IShaderCodeObject from "../../../vox/material/IShaderCodeObject";
import { IShaderLib } from "../../../vox/material/IShaderLib";

import IShaderCodeBuilder from "../code/IShaderCodeBuilder";
import { IMaterialPipe } from "./IMaterialPipe";
import { MaterialPipeType } from "./MaterialPipeType";
import { IMaterialPipeline } from "./IMaterialPipeline";

import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import ShaderGlobalUniform from "../../../vox/material/ShaderGlobalUniform";
import IRenderTexture from "../../../vox/render/IRenderTexture";

/**
 * 材质功能组装流水线, 组装符合一个流水线系统设定的材质, 最终形成完整的shader, 以及对应的数据输入
 * 每个流水线是由若干pipe组成的， 每一个 pipe 都有自己的组装能力
 * 组装功能举例: 全局的光照环境shader及数据, 灯光组shader及数据， 雾shader及数据, 等等
 * material pipeline 输出 的控制码，也能控制渲染流程, 也就是 material pipelie 也能配合 render pipeline 一起协作完成渲染过程
 */
class MaterialPipeline implements IMaterialPipeline {

    private static s_uid: number = 0;
    private m_uid: number = MaterialPipeline.s_uid ++;
    private m_shaderCode: IShaderCodeObject = null;
    private m_shaderCodeFlag: boolean = false;
    private m_pipeMap: Map<MaterialPipeType, IMaterialPipe> = new Map();
    private m_keys: string[] = [];
    private m_sharedUniforms: ShaderGlobalUniform[] = null;
    private m_shaderLib: IShaderLib = null;
    private m_pipetypes: MaterialPipeType[] = null;
    private m_appendKeyStr: string = "";
    uuid: string = "";
    constructor(shaderLib: IShaderLib = null) {
        this.m_shaderLib = shaderLib;
    }
    getUid(): number {
        return this.m_uid;
    }
    /**
     * @param shaderCodeUUID IShaderCodeObject instance uuid
     * @param force default value is false
     */
    addShaderCodeWithUUID(shaderCodeUUID: ShaderCodeUUID, force: boolean): void {
        if (this.m_shaderLib != null) {
            this.addShaderCode(this.m_shaderLib.getShaderCodeObjectWithUUID(shaderCodeUUID), force);
        }
    }
    addShaderCode(shaderCode: IShaderCodeObject, force: boolean = false): void {

        this.m_shaderCodeFlag = shaderCode != null;

        if (this.m_shaderCode == null || (shaderCode != null && force)) {
            this.m_shaderCode = shaderCode;
        }
    }
    hasShaderCode(): boolean {
        return this.m_shaderCode != null;
    }
    addPipe(pipe: IMaterialPipe): void {

        let types: MaterialPipeType[] = pipe.getPipeTypes();
        //console.log("#### MaterialPipeline, types: ",types);
        for (let i: number = 0; i < types.length; ++i) {
            if (!this.m_pipeMap.has(types[i])) {
                this.m_pipeMap.set(types[i], pipe);
            }
        }
    }
    getPipeByType(type: MaterialPipeType): IMaterialPipe {
        return this.m_pipeMap.get(type);
    }
    hasPipeByType(type: MaterialPipeType): boolean {
        return this.m_pipeMap.has(type);
    }

    createKeys(pipetypes: MaterialPipeType[]): void {

        //console.log("#### MaterialPipeline::createKeys(), pipetypes: ",pipetypes);
        this.m_keys = [];
        if (pipetypes != null) {

            let pipe: IMaterialPipe;
            let type: MaterialPipeType;
            let types: MaterialPipeType[] = pipetypes;
            for (let i: number = 0; i < types.length; ++i) {
                type = types[i];
                if (this.m_pipeMap.has(type)) {
                    pipe = this.m_pipeMap.get(type);
                    this.m_keys.push(pipe.getPipeKey(type));
                }
            }
        }
    }

    buildSharedUniforms(pipetypes: MaterialPipeType[]): void {

        this.m_sharedUniforms = [];
        this.m_pipetypes = pipetypes;
        if (pipetypes != null) {

            let pipe: IMaterialPipe;
            let type: MaterialPipeType;
            let types: MaterialPipeType[] = pipetypes;
            for (let i: number = 0; i < types.length; ++i) {
                type = types[i];
                if (this.m_pipeMap.has(type)) {
                    pipe = this.m_pipeMap.get(type);
                    this.m_sharedUniforms.push(pipe.getGlobalUinform());
                }
            }
        }
    }
    build(shaderBuilder: IShaderCodeBuilder): void {

        // console.log("#### MaterialPipeline::build(), pipetypes: ",pipetypes,", this.m_shaderCode != null: ",this.m_shaderCode != null);
        if (this.m_shaderCodeFlag && this.m_shaderCode != null) {
            shaderBuilder.addShaderObject(this.m_shaderCode);
        }
        if (this.m_pipetypes != null) {

            let pipe: IMaterialPipe;
            let type: MaterialPipeType;
            let types: MaterialPipeType[] = this.m_pipetypes;
            for (let i: number = 0; i < types.length; ++i) {
                type = types[i];
                if (this.m_pipeMap.has(type)) {
                    pipe = this.m_pipeMap.get(type);
                    pipe.useShaderPipe(shaderBuilder, type);
                }
            }

        }
    }

    getTextures(shaderBuilder: IShaderCodeBuilder, outList: IRenderTexture[]): void {

        if (this.m_pipetypes != null) {

            let pipe: IMaterialPipe;
            let type: MaterialPipeType;
            let types: MaterialPipeType[] = this.m_pipetypes;
            for (let i: number = 0; i < types.length; ++i) {
                type = types[i];
                if (this.m_pipeMap.has(type)) {
                    pipe = this.m_pipeMap.get(type);
                    pipe.getTextures(shaderBuilder, outList);
                }
            }

        }
    }
    getSharedUniforms(): ShaderGlobalUniform[] {

        return this.m_sharedUniforms;
    }
    getSelfUniformData(): ShaderUniformData {
        return null;
    }
    appendKeyString(key: string): void {
        this.m_appendKeyStr += key;
    }
    getKeys(): string[] {
        return this.m_keys;
    }
    getKeysString(): string {
        let str: string = "";
        for (let i: number = 0; i < this.m_keys.length; ++i) {
            str += this.m_keys[i];
        }
        return str + this.m_appendKeyStr;
    }
    reset(): void {
        //this.m_texList = null;
        this.m_appendKeyStr = "";
        this.m_shaderCodeFlag = false;
    }
    clear(): void {
        this.m_pipeMap = new Map();
        this.m_keys = [];
        this.m_sharedUniforms = null;
        this.m_shaderCode = null;
        this.m_shaderLib = null;
        this.m_pipetypes = null;
    }

}

export { MaterialPipeline }
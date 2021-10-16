
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererDevice from "../../../vox/render/RendererDevice";
import IUniformParam from "../../../vox/material/IUniformParam";

import IShaderCodeBuilder from "../code/IShaderCodeBuilder";
import {IMaterialPipe} from "./IMaterialPipe";
import {MaterialPipeType} from "./MaterialPipeType";

import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import ShaderGlobalUniform from "../../../vox/material/ShaderGlobalUniform";

/**
 * 材质功能组装流水线, 组装符合一个流水线系统设定的材质, 最终形成完整的shader, 以及对应的数据输入
 * 每个流水线是由若干pipe组成的， 每一个 pipe 都有自己的组装能力
 * 组装功能举例: 全局的光照环境shader及数据, 灯光组shader及数据， 雾shader及数据, 等等
 * material pipeline 输出 的控制码，也能控制渲染流程, 也就是 material pipelie 也能配合 render pipeline 一起协作完成渲染过程
 */
class MaterialPipeline {

    private m_pipeMap: Map<MaterialPipeType, IMaterialPipe> = new Map();
    private m_keys: string[] = [];
    private m_sharedUniforms: ShaderGlobalUniform[] = null;

    constructor() { }

    addPipe(pipe: IMaterialPipe): void {
        
        let types: MaterialPipeType[] = pipe.getPipeTypes();
        //console.log("#### MaterialPipeline, types: ",types);
        for(let i: number = 0; i < types.length; ++i) {
            if(!this.m_pipeMap.has(types[i])) {
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
    
    createKeys(pipetypes: MaterialPipeType[]):void {

        //console.log("#### MaterialPipeline::createKeys(), pipetypes: ",pipetypes);

        this.m_sharedUniforms = [];
        this.m_keys = [];
        if(pipetypes != null) {

            let pipe: IMaterialPipe;
            let type: MaterialPipeType;
            let types: MaterialPipeType[] = pipetypes;
            for(let i: number = 0; i < types.length; ++i) {
                type = types[i];
                if(this.m_pipeMap.has(type)) {
                    pipe = this.m_pipeMap.get( type );
                    this.m_keys.push( pipe.getPipeKey( type ) );
                }
            }
        }
    }
    build(shaderBuilder: IShaderCodeBuilder, pipetypes: MaterialPipeType[]):void {

        //console.log("#### MaterialPipeline::build(), pipetypes: ",pipetypes);

        this.m_sharedUniforms = [];        
        //this.m_keys = [];
        if(pipetypes != null) {

            let pipe: IMaterialPipe;
            let type: MaterialPipeType;
            let types: MaterialPipeType[] = pipetypes;
            for(let i: number = 0; i < types.length; ++i) {
                type = types[i];
                if(this.m_pipeMap.has(type)) {
                    pipe = this.m_pipeMap.get( type );
                    pipe.useShaderPipe(shaderBuilder, type);
                    //this.m_keys.push( pipe.getPipeKey( type ) );
                    this.m_sharedUniforms.push( pipe.getGlobalUinform() );
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
    getKeys(): string[] {
        return this.m_keys;
    }
    getKeysString(): string {
        let str: string = "";
        for(let i: number = 0; i < this.m_keys.length; ++i) {
            str += this.m_keys[i];
        }
        return str;
    }
    reset(): void {
    }
    
}

export {MaterialPipeline}
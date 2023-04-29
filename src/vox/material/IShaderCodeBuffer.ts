/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import {ShaderCodeUUID} from './ShaderCodeUUID';
import IRenderTexture from "../../vox/render/texture/IRenderTexture";
import IShaderCodeBuilder from "../../vox/material/code/IShaderCodeBuilder";
import IShaderCodeObject from "./IShaderCodeObject";
import { IMaterialPipeline } from "../../vox/material/pipeline/IMaterialPipeline";
import { MaterialPipeType } from "./pipeline/MaterialPipeType";

import { IShaderTextureBuilder } from "../../vox/material/IShaderTextureBuilder";
import { IShaderCodeUniform } from "./code/IShaderCodeUniform";

interface IShaderCodeBuffer {

    pipeline: IMaterialPipeline;

    vertColorEnabled: boolean;
    premultiplyAlpha: boolean;
    shadowReceiveEnabled: boolean;
    lightEnabled: boolean;
    fogEnabled: boolean;
    envAmbientLightEnabled: boolean;
    brightnessOverlayEnabeld: boolean;
    glossinessEnabeld: boolean;
    /**
     * the default value is true;
     */
    codeBuilderEnabled: boolean;
    pipeTypes: MaterialPipeType[];
    keysString: string;

    /**
     * 是否自适应转换shader版本
     */
    adaptationShaderVersion: boolean;

    reset(): void;
    clear(): void;


	getUniform(): IShaderCodeUniform;
	getTexture(): IShaderCodeUniform;
	getTexBuilder(): IShaderTextureBuilder;

    setShaderCodeObject(obj: IShaderCodeObject): void;
    getShaderCodeObject(): IShaderCodeObject;
    getShaderCodeObjectUUID(): ShaderCodeUUID;
    getShaderCodeBuilder(): IShaderCodeBuilder;

    initialize(texEnabled: boolean): void
    buildDefine(): void;
    buildPipelineParams(): void;

    getTexturesFromPipeline(outList: IRenderTexture[]): void;

    isTexEanbled(): boolean;
    setIRenderTextureList(texList: IRenderTexture[]): void;
    getIRenderTextureList(): IRenderTexture[];
    buildShader(): void;
    getFragShaderCode(): string;
    getVertShaderCode(): string;
    getUniqueShaderName(): string;
}
export default IShaderCodeBuffer;

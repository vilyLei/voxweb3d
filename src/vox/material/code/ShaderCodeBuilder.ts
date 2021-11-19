
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererDevice from "../../../vox/render/RendererDevice";
import IUniformParam from "../../../vox/material/IUniformParam";
import IAbstractShader from "../../../vox/material/IAbstractShader";

import IShaderCodeBuilder from "./IShaderCodeBuilder";
import GLSLConverter from "./GLSLConverter";
import ShaderCompileInfo from "./ShaderCompileInfo";
import {ShaderCode, MathShaderCode} from "./ShaderCode";
import { SpecularMode } from "../pipeline/SpecularMode";
import { ShadowMode } from "../pipeline/ShadowMode";

export default class ShaderCodeBuilder implements IShaderCodeBuilder {

    private m_versionDeclare: string =
        `#version 300 es
`;
    private m_preciousCode: string =
        `
precision mediump float;
`;

    private m_fragExt: string[] = [];
    private m_vertExt: string[] = [];

    private m_defineNames: string[] = [];
    private m_defineValues: string[] = [];

    private m_vertLayoutNames: string[] = [];
    private m_vertLayoutTypes: string[] = [];

    private m_fragOutputPrecises: string[] = [];
    private m_fragOutputNames: string[] = [];
    private m_fragOutputTypes: string[] = [];

    private m_vertUniformNames: string[] = [];
    private m_vertUniformTypes: string[] = [];

    private m_fragUniformNames: string[] = [];
    private m_fragUniformTypes: string[] = [];

    private m_varyingNames: string[] = [];
    private m_varyingTypes: string[] = [];


    private m_fragFunctionBlocks: string[] = [];
    private m_vertFunctionBlocks: string[] = [];


    private m_textureSampleTypes: string[] = [];
    private m_texturePrecises: string[] = [];
    private m_textureMacroNames: string[] = [];
    private m_texturePrecise: string = "";
    private m_textureFlags: number[] = [];

    private m_vertObjMat: boolean = false;
    private m_vertViewMat: boolean = false;
    private m_vertProjMat: boolean = false;

    private m_fragObjMat: boolean = false;
    private m_fragViewMat: boolean = false;
    private m_fragProjMat: boolean = false;

    private m_vertHeadCode: string = "";
    private m_vertMainCode: string = "";
    // private m_vertMainCodeAppend: string = "";
    // private m_vertMainCodePrepend: string = "";
    private m_fragHeadCode: string = "";
    private m_fragMainCode: string = "";
    //private m_fragMainCodeAppend: string = "";
    //private m_fragMainCodePrepend: string = "";
    private m_uniqueNSKeyString: string = "";
    private m_uniqueNSKeys: Uint16Array = new Uint16Array(128);
    private m_uniqueNSKeysTotal: number = 8;
    private m_use2DMap: boolean = false;
    /**
     * 记录 shader 预编译信息
     */
    private m_preCompileInfo: ShaderCompileInfo = null;

    // vertColorEnabled: boolean = false;
    // premultiplyAlpha: boolean = false;
    mathDefineEanbled: boolean = true;
    normalEanbled: boolean = false;
    normalMapEanbled: boolean = false;
    mapLodEnabled: boolean = false;
    derivatives: boolean = false;
    vertMatrixInverseEnabled: boolean = false;
    fragMatrixInverseEnabled: boolean = false;

    constructor() { }
    
    getUniqueNSKeyID(): number {
        
        let id: number = 31;
        for(let i: number = 0; i < this.m_uniqueNSKeysTotal; ++i) {
            id = id * 131 + this.m_uniqueNSKeys[i];
        }
        return id;
    }
    getUniqueNSKeyString(): string {
        this.m_uniqueNSKeyString = "[" + this.m_uniqueNSKeys[0];
        for(let i: number = 1; i < this.m_uniqueNSKeysTotal; ++i) {
            this.m_uniqueNSKeyString += "-"+this.m_uniqueNSKeys[i];
        }
        this.m_uniqueNSKeyString += "]";
        return this.m_uniqueNSKeyString;
    }
    reset(): void {
        
        this.m_vertObjMat = true;
        this.m_vertViewMat = true;
        this.m_vertProjMat = true;

        this.m_fragObjMat = false;
        this.m_fragViewMat = false;
        this.m_fragProjMat = false;

        this.m_use2DMap = false;

        this.m_vertHeadCode = "";
        this.m_vertMainCode = "";
        // this.m_vertMainCodeAppend = "";
        // this.m_vertMainCodePrepend = "";
        this.m_fragHeadCode = "";
        this.m_fragMainCode = "";
        //this.m_fragMainCodeAppend = "";
        //this.m_fragMainCodePrepend = "";

        this.m_uniqueNSKeyString = "";

        this.m_vertExt = [];
        this.m_fragExt = [];

        this.m_vertLayoutNames = [];
        this.m_vertLayoutTypes = [];

        this.m_fragOutputPrecises = [];
        this.m_fragOutputNames = [];
        this.m_fragOutputTypes = [];

        this.m_varyingNames = [];
        this.m_varyingTypes = [];

        this.m_vertUniformNames = [];
        this.m_vertUniformTypes = [];

        this.m_fragUniformNames = [];
        this.m_fragUniformTypes = [];

        this.m_fragFunctionBlocks = [];
        this.m_vertFunctionBlocks = [];

        this.m_defineNames = [];
        this.m_defineValues = [];

        this.m_textureSampleTypes = [];
        this.m_texturePrecises = [];
        this.m_textureMacroNames = [];
        this.m_textureFlags = [];
        this.m_texturePrecise = "";

        // this.vertColorEnabled = false;
        // this.premultiplyAlpha = false;
        this.mathDefineEanbled = true;
        this.normalEanbled = false;
        this.normalMapEanbled = false;
        this.mapLodEnabled = false;
        this.vertMatrixInverseEnabled = false;
        this.fragMatrixInverseEnabled = false;

        this.m_preCompileInfo = null;
        for(let i: number = 0; i < this.m_uniqueNSKeysTotal; ++i) {
            this.m_uniqueNSKeys[i] = 0;
        }
    }
    /**
     * 预编译信息
     * @returns 返回预编译信息
     */
    getPreCompileInfo(): ShaderCompileInfo {
        let info = this.m_preCompileInfo;
        this.m_preCompileInfo = null;
        return info;
    }
    useHighPrecious(): void {
        this.m_preciousCode = "precision highp float;";
    }
    useMediumPrecious(): void {
        this.m_preciousCode = "precision mediump float;";
    }
    useLowPrecious(): void {
        this.m_preciousCode = "precision lowp float;";
    }
    addDefine(name: string, value: string = "1"): void {

        if (!this.m_defineNames.includes(name)) {
            this.m_defineNames.push(name);
            this.m_defineValues.push(value);
        }
    }
    addVertLayout(type: string, name: string): void {

        if (!this.m_vertLayoutNames.includes(name)) {
            this.m_vertLayoutNames.push(name);
            this.m_vertLayoutTypes.push(type);
        }
    }
    addFragOutputHighp(type: string, name: string): void {

        if (!this.m_fragOutputNames.includes(name)) {
            this.m_fragOutputPrecises.push("highp");
            this.m_fragOutputNames.push(name);
            this.m_fragOutputTypes.push(type);
        }
    }
    addFragOutput(type: string, name: string): void {

        if (!this.m_fragOutputNames.includes(name)) {
            this.m_fragOutputPrecises.push("");
            this.m_fragOutputNames.push(name);
            this.m_fragOutputTypes.push(type);
        }
    }
    addVarying(type: string, name: string): void {

        if (!this.m_varyingNames.includes(name)) {
            this.m_varyingNames.push(name);
            this.m_varyingTypes.push(type);
        }
    }
    addVertUniform(type: string, name: string, arrayLength: number = 0): void {

        if (!this.m_vertUniformNames.includes(name)) {
            if (arrayLength > 0) {
                this.m_vertUniformNames.push(name + "[" + arrayLength + "]");
            }
            else {
                this.m_vertUniformNames.push(name);
            }
            this.m_vertUniformTypes.push(type);
        }
    }
    addVertUniformParam(unifromParam: IUniformParam): void {
        this.addVertUniform(unifromParam.type, unifromParam.name, unifromParam.arrayLength);
    }
    addFragUniform(type: string, name: string, arrayLength: number = 0): void {
        if (!this.m_fragUniformNames.includes(name)) {
            if (arrayLength > 0) {
                this.m_fragUniformNames.push(name + "[" + arrayLength + "]");
            }
            else {
                this.m_fragUniformNames.push(name);
            }
            this.m_fragUniformTypes.push(type);
        }
    }
    addFragUniformParam(unifromParam: IUniformParam): void {
        this.addFragUniform(unifromParam.type, unifromParam.name, unifromParam.arrayLength);
    }
    addVertAndFragUniform(type: string, name: string, arrayLength: number = 0): void {
        this.addVertUniform(type, name, arrayLength);
        this.addFragUniform(type, name, arrayLength);
    }
    //IUniformParam
    addFragFunction(codeBlock: string): void {
        this.m_fragFunctionBlocks.push(codeBlock);
    }
    addVertFunction(codeBlock: string): void {
        this.m_vertFunctionBlocks.push(codeBlock);
    }
    useTexturePreciseHighp(): void {
        this.m_texturePrecise = "highp";
    }
    /**
     * add diffuse map
     */
    addDiffuseMap(): void {
        this.addTextureSample2D("VOX_DIFFUSE_MAP");
        this.m_uniqueNSKeys[0] = 1;
    }
    /**
     * add normal map
     */
    addNormalMap(): void {
        this.addTextureSample2D("VOX_NORMAL_MAP");
        this.m_uniqueNSKeys[1] = 1;
    }
    /**
     * add parallax map
     */
    addParallaxMap(parallaxParamIndex: number): void {        
        this.addTextureSample2D("VOX_PARALLAX_MAP");
        this.addDefine("VOX_PARALLAX_PARAMS_INDEX", "" + parallaxParamIndex);
        this.m_uniqueNSKeys[2] = 1 + (parallaxParamIndex << 1);
    }
    /**
     * add displacement map
     */
    addDisplacementMap(): void {        
        this.addTextureSample2D("VOX_DISPLACEMENT_MAP", true, false, true);
        this.m_uniqueNSKeys[3] = 1;
    }
    
    /**
     * add ambient occlusion map
     */
    addAOMap(): void {
        this.addTextureSample2D("VOX_AO_MAP");
        this.m_uniqueNSKeys[4] = 1;
    }
    /**
     * add specular map
     */
    addSpecularMap(specularMode: SpecularMode): void {
        this.addTextureSample2D("VOX_SPECULAR_MAP");
        this.addDefine("VOX_SPECULAR_MODE", "" + specularMode);
        this.m_uniqueNSKeys[5] = 1 + (specularMode << 1);
    }
    addShadowMap(shadowMode: ShadowMode = ShadowMode.VSM): void {

        this.addTextureSample2D("VOX_VSM_SHADOW_MAP");
        this.m_uniqueNSKeys[6] = 1 + (shadowMode << 1);
    }
    addTextureSample2D(macroName: string = "", map2DEnabled: boolean = true, fragEnabled: boolean = true, vertEnabled: boolean = false): void {
        if(macroName == "" || !this.m_textureMacroNames.includes(macroName)) {
            this.m_textureSampleTypes.push("sampler2D");
            this.m_textureMacroNames.push(macroName);
            
            this.m_texturePrecises.push(this.m_texturePrecise);
    
            let flag: number = 0;
            if(fragEnabled) flag |= 2;
            if(vertEnabled) flag |= 4;
            this.m_textureFlags.push(flag);
    
            this.m_texturePrecise = "";
            if (map2DEnabled) {
                this.m_use2DMap = true;
            }
        }
    }
    addTextureSampleCube(macroName: string = "", fragEnabled: boolean = true, vertEnabled: boolean = false): void {

        if(macroName == "" || !this.m_textureMacroNames.includes(macroName)) {
            this.m_textureSampleTypes.push("samplerCube");
            this.m_textureMacroNames.push(macroName);
            this.m_texturePrecises.push(this.m_texturePrecise);
            
            let flag: number = 0;
            if(fragEnabled) flag |= 2;
            if(vertEnabled) flag |= 4;
            this.m_textureFlags.push(flag);
            this.m_texturePrecise = "";
        }
    }
    addTextureSample3D(macroName: string = "", fragEnabled: boolean = true, vertEnabled: boolean = false): void {

        if(macroName == "" || !this.m_textureMacroNames.includes(macroName)) {
            this.m_textureSampleTypes.push("sampler3D");
            this.m_textureMacroNames.push(macroName);
            this.m_texturePrecises.push(this.m_texturePrecise);
            let flag: number = 0;
            if(fragEnabled) flag |= 2;
            if(vertEnabled) flag |= 4;
            this.m_textureFlags.push(flag);
            this.m_texturePrecise = "";
        }
    }
    isHaveTexture(): boolean {
        return this.m_textureSampleTypes.length > 0;
    }
    isHaveTexture2D(): boolean {
        return this.m_use2DMap;
    }
    /**
     * vertex shader 使用 空间变换矩阵
     * @param objMatEnabled object space(local space) to wrold space matrix4
     * @param viewMatEnabled world space to view space matrix4
     * @param projMatEnabled view space to projective space matrix4
     */
    useVertSpaceMats(objMatEnabled: boolean = true, viewMatEnabled: boolean = true, projMatEnabled: boolean = true): void {
        this.m_vertObjMat = objMatEnabled;
        this.m_vertViewMat = viewMatEnabled;
        this.m_vertProjMat = projMatEnabled;
    }
    /**
     * fragment shader 使用 空间变换矩阵
     * @param objMatEnabled object space(local space) to wrold space matrix4
     * @param viewMatEnabled world space to view space matrix4
     * @param projMatEnabled view space to projective space matrix4
     */
    useFragSpaceMats(objMatEnabled: boolean = true, viewMatEnabled: boolean = true, projMatEnabled: boolean = true): void {
        this.m_fragObjMat = objMatEnabled;
        this.m_fragViewMat = viewMatEnabled;
        this.m_fragProjMat = projMatEnabled;
    }

    addVertExtend(code: string): void {
        this.m_vertExt.push(code);
    }
    addFragExtend(code: string): void {
        this.m_fragExt.push(code);
    }

    addVertHeadCode(code: string): void {
        if(code != "") this.m_vertHeadCode += "\n" + code;
    }
    addVertMainCode(code: string): void {
        if(code != "") this.m_vertMainCode += "\n" + code;
    }
    addFragHeadCode(code: string): void {
        if(code != "") this.m_fragHeadCode += "\n" + code;
    }
    addFragMainCode(code: string): void {
        if(code != "") this.m_fragMainCode += "\n" + code;
    }

    addShaderObject(shaderObj: IAbstractShader): void {
        this.addFragHeadCode( shaderObj.frag_head );
        this.addFragMainCode( shaderObj.frag_body );
        this.addVertHeadCode( shaderObj.vert_head );
        this.addVertMainCode( shaderObj.vert_body );
    }
    addShaderObjectHead(shaderObj: IAbstractShader): void {
        
        this.addFragHeadCode( shaderObj.frag_head );
        this.addVertMainCode( shaderObj.vert_head );
    }

    private autoBuildHeadCode(): void {

        this.addVertLayout("vec3", "a_vs");
        if(this.m_use2DMap) {
            this.addVertLayout("vec2", "a_uvs");
            this.addVarying("vec2", "v_uv");
        }
        if(this.normalEanbled || this.normalMapEanbled) {
            this.addVertLayout("vec3", "a_nvs");
            this.addVarying("vec3", "v_worldNormal");
            this.addVarying("vec3", "v_worldPosition");
        }
        if(this.m_fragOutputNames.length < 1) {
            this.addFragOutput("vec4", "FragColor0");
        }
    }
    buildFragCode(): string {

        this.autoBuildHeadCode();

        let i: number = 0;
        let len: number = 0;
        let code: string = "";
        if (RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED || RendererDevice.IsMobileWeb()) {
            this.useHighPrecious();
        }
        if (RendererDevice.IsWebGL2()) {
            code += this.m_versionDeclare;
        }

        this.m_preCompileInfo = new ShaderCompileInfo();
        this.m_preCompileInfo.info = "\n//##COMPILE_INFO_BEGIN";
        // complie info, for example: uniform info
        this.m_preCompileInfo.info += "\n//##COMPILE_INFO_END";

        i = 0;
        len = this.m_fragExt.length;
        for (; i < len; i++) {
            code += "\n" + this.m_fragExt[i];
        }

        if (RendererDevice.IsWebGL1()) {
            if (this.m_fragOutputNames.length > 1) {
                code += "\n#extension GL_EXT_draw_buffers: require";
            }
            if (this.normalMapEanbled || this.derivatives) {
                code += "\n#extension GL_OES_standard_derivatives : enable";
            }
            if (this.mapLodEnabled) {
                code += "\n#extension GL_EXT_shader_texture_lod : enable";
            }
        }

        if (RendererDevice.IsMobileWeb()) {
            code += "\nprecision highp float;";
        }
        else {
            code += "\n" + this.m_preciousCode;
        }
        
        if (RendererDevice.IsWebGL2()) {
            code += "\n#define VOX_GLSL_ES3 1";
            code += "\n#define VOX_IN in";
            if (this.mapLodEnabled) {
                code += "\n#define VOX_TextureCubeLod textureLod";
                code += "\n#define VOX_Texture2DLod textureLod";
            }
            code += "\n#define VOX_Texture2D texture";
            code += "\n#define VOX_TextureCube texture";

        }
        else {
            code += "\n#define VOX_GLSL_ES2 1";
            code += "\n#define VOX_IN varying";
            if (this.mapLodEnabled) {
                code += "\n#define VOX_TextureCubeLod textureCubeLodEXT";
                code += "\n#define VOX_Texture2DLod texture2DLodEXT";
            }
            code += "\n#define VOX_TextureCube textureCube";
            code += "\n#define VOX_Texture2D texture2D";
        }
        if(this.mathDefineEanbled) {
            code += MathShaderCode.BasePredefined;
        }
        
        len = this.m_defineNames.length;
        for (i = 0; i < len; i++) {
            if (this.m_defineValues[i] != "") {
                code += "\n#define " + this.m_defineNames[i] + " " + this.m_defineValues[i];
            }
            else {
                code += "\n#define " + this.m_defineNames[i] + " 1";
            }
        }

        i = 0;
        len = this.m_textureMacroNames.length;
        for (; i < len; i++) {

            if (this.m_textureMacroNames[i] != "" && (this.m_textureFlags[i]&2) != 0) {
                code += "\n#define " + this.m_textureMacroNames[i] + " u_sampler" + i + "";
            }
        }
        if (this.m_use2DMap) {
            code += "\n#define VOX_USE_2D_MAP 1";
        }

        i = 0;
        len = this.m_textureSampleTypes.length;
        for (; i < len; i++) {
            if((this.m_textureFlags[i]&2) != 0) {
                if (this.m_texturePrecises[i] == "") {
                    code += "\nuniform " + this.m_textureSampleTypes[i] + " u_sampler" + i + ";";
                } else {
                    code += "\nuniform " + this.m_texturePrecises[i] + " " + this.m_textureSampleTypes[i] + " u_sampler" + i + ";";
                }
            }
        }

        i = 0;
        len = this.m_fragUniformTypes.length;
        for (; i < len; i++) {
            code += "\nuniform " + this.m_fragUniformTypes[i] + " " + this.m_fragUniformNames[i] + ";";
        }
        if (this.m_fragObjMat) code += "\nuniform mat4 u_objMat;";
        if (this.m_fragViewMat) code += "\nuniform mat4 u_viewMat;";
        if (this.m_fragProjMat) code += "\nuniform mat4 u_projMat;";

        len = this.m_varyingNames.length;
        if (RendererDevice.IsWebGL2()) {
            for (i = 0; i < len; i++) {
                code += "\nin " + this.m_varyingTypes[i] + " " + this.m_varyingNames[i] + ";";
            }
        }
        else {
            for (i = 0; i < len; i++) {
                code += "\nvarying " + this.m_varyingTypes[i] + " " + this.m_varyingNames[i] + ";";
            }
        }
        code += ShaderCode.BasePredefined;

        if (this.fragMatrixInverseEnabled && RendererDevice.IsWebGL1()) {
            this.addVertFunction(GLSLConverter.__glslInverseMat3);
            this.addVertFunction(GLSLConverter.__glslInverseMat4);
        }

        code += this.m_fragHeadCode;

        i = 0;
        len = this.m_fragFunctionBlocks.length;
        for (; i < len; i++) {
            code += "\n" + this.m_fragFunctionBlocks[i];
        }

        i = 0;
        len = this.m_fragOutputNames.length;
        if (RendererDevice.IsWebGL2()) {
            for (; i < len; i++) {
                if(this.m_fragOutputPrecises[i] != "") {
                    code += "\nlayout(location = " + i + ") out " +this.m_fragOutputPrecises[i] + " "+ this.m_fragOutputTypes[i] + " " + this.m_fragOutputNames[i] + ";";
                }
                else {
                    code += "\nlayout(location = " + i + ") out " + this.m_fragOutputTypes[i] + " " + this.m_fragOutputNames[i] + ";";
                }
            }
        } else {
            if (len == 1) {
                code += "\n#define " + this.m_fragOutputNames[i] + " gl_FragColor";
            }
        }

        // 检测是否有 main函数
        let haveMainName: boolean = false;
        let index: number = this.m_fragMainCode.indexOf("{");
        if(index > 0) {
            let subStr: string = this.m_fragMainCode.slice(0, index);
            haveMainName = subStr.indexOf(" main") > 0;
            if(!haveMainName) {
                haveMainName = this.m_fragMainCode.indexOf(" main") > 0;
            }
        }
        if(haveMainName) {
            code += this.m_fragMainCode;
        }
        else {
            code += "\nvoid main() {\n";
            code += this.m_fragMainCode;
            code += "\n}\n";
        }
        
        len = this.m_fragOutputNames.length;
        if (RendererDevice.IsWebGL1()) {
            if (len > 1) {
                for (i = 0; i < len; i++) {
                    let tempReg = new RegExp(this.m_fragOutputNames[i], "g");
                    code = code.replace(tempReg, "gl_FragData[" + i + "]");
                }
            }
        }
        return code;
    }
    buildVertCode(): string {
        let i: number = 0;
        let len: number = 0;
        let code: string = "";

        if (RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED) {
            this.useHighPrecious();
        }
        if (RendererDevice.IsWebGL2()) {
            code += this.m_versionDeclare;
        }

        i = 0;
        len = this.m_vertExt.length;
        for (; i < len; i++) {
            code += "\n" + this.m_vertExt[i];
        }
        
        if (RendererDevice.IsMobileWeb()) {
            code += "\nprecision highp float;";
        }
        else {
            code += "\n" + this.m_preciousCode;
        }
        if (RendererDevice.IsWebGL2()) {
            code += "\n#define VOX_GLSL_ES3 1";
            code += "\n#define VOX_IN in";
            if (this.mapLodEnabled) {
                code += "\n#define VOX_TextureCubeLod textureLod";
                code += "\n#define VOX_Texture2DLod textureLod";
            }
            code += "\n#define VOX_Texture2D texture";
            code += "\n#define VOX_TextureCube texture";

        }
        else {
            code += "\n#define VOX_GLSL_ES2 1";
            code += "\n#define VOX_IN varying";
            if (this.mapLodEnabled) {
                code += "\n#define VOX_TextureCubeLod textureCubeLodEXT";
                code += "\n#define VOX_Texture2DLod texture2DLodEXT";
            }
            code += "\n#define VOX_TextureCube textureCube";
            code += "\n#define VOX_Texture2D texture2D";
        }
        if (RendererDevice.IsMobileWeb()) {
            code += "\nprecision highp float;";
        }
        else {
            code += "\n" + this.m_preciousCode;
        }

        if (RendererDevice.IsWebGL2()) {
            code += "\n#define VOX_OUT out";
        }
        else {
            code += "\n#define VOX_OUT varying";
        }
        if(this.mathDefineEanbled) {
            code += MathShaderCode.BasePredefined;
        }

        len = this.m_defineNames.length;
        for (i = 0; i < len; i++) {
            if (this.m_defineValues[i] != "") {
                code += "\n#define " + this.m_defineNames[i] + " " + this.m_defineValues[i];
            }
            else {
                code += "\n#define " + this.m_defineNames[i];
            }
        }

        //if (this.m_use2DMap) {
        //    code += "\n#define VOX_USE_2D_MAP 1";
        //}
        
        i = 0;
        len = this.m_textureMacroNames.length;
        for (; i < len; i++) {

            if (this.m_textureMacroNames[i] != "" && (this.m_textureFlags[i]&4) != 0) {
                code += "\n#define " + this.m_textureMacroNames[i] + " u_sampler" + i + "";
            }
        }
        if (this.m_use2DMap) {
            code += "\n#define VOX_USE_2D_MAP 1";
        }

        i = 0;
        len = this.m_textureSampleTypes.length;
        for (; i < len; i++) {
            if((this.m_textureFlags[i]&4) != 0) {
                if (this.m_texturePrecises[i] == "") {
                    code += "\nuniform " + this.m_textureSampleTypes[i] + " u_sampler" + i + ";";
                } else {
                    code += "\nuniform " + this.m_texturePrecises[i] + " " + this.m_textureSampleTypes[i] + " u_sampler" + i + ";";
                }
            }
        }

        len = this.m_vertLayoutNames.length;
        if (RendererDevice.IsWebGL2()) {
            for (i = 0; i < len; i++) {
                code += "\nlayout(location = " + i + ") in " + this.m_vertLayoutTypes[i] + " " + this.m_vertLayoutNames[i] + ";";
            }
        }
        else {

            for (i = 0; i < len; i++) {
                code += "\nattribute " + this.m_vertLayoutTypes[i] + " " + this.m_vertLayoutNames[i] + ";";
            }
        }

        len = this.m_vertUniformTypes.length;
        for (i = 0; i < len; i++) {
            code += "\nuniform " + this.m_vertUniformTypes[i] + " " + this.m_vertUniformNames[i] + ";";
        }
        if (this.m_vertObjMat) code += "\nuniform mat4 u_objMat;";
        if (this.m_vertViewMat) code += "\nuniform mat4 u_viewMat;";
        if (this.m_vertProjMat) code += "\nuniform mat4 u_projMat;";


        len = this.m_varyingNames.length;
        if (RendererDevice.IsWebGL2()) {
            for (i = 0; i < len; i++) {
                code += "\nout " + this.m_varyingTypes[i] + " " + this.m_varyingNames[i] + ";";
            }
        }
        else {
            for (i = 0; i < len; i++) {
                code += "\nvarying " + this.m_varyingTypes[i] + " " + this.m_varyingNames[i] + ";";
            }
        }

        code += ShaderCode.BasePredefined;
        if (this.vertMatrixInverseEnabled && RendererDevice.IsWebGL1()) {
            this.addVertFunction(GLSLConverter.__glslInverseMat3);
            this.addVertFunction(GLSLConverter.__glslInverseMat4);
        }

        code += this.m_vertHeadCode;

        i = 0;
        len = this.m_vertFunctionBlocks.length;
        for (; i < len; i++) {
            code += "\n" + this.m_vertFunctionBlocks[i];
        }
        // 检测是否有 main函数
        let haveMainName: boolean = false;
        let index: number = this.m_vertMainCode.indexOf("{");
        
        if(index > 0) {
            let subStr: string = this.m_vertMainCode.slice(0, index);
            haveMainName = subStr.indexOf(" main") > 0;
            if(!haveMainName) {
                haveMainName = this.m_vertMainCode.indexOf(" main") > 0;
            }
        }
        
        if(haveMainName) {
            code += this.m_vertMainCode;
        }
        else {
            code += "\nvoid main() {\n";
            code += this.m_vertMainCode;
            code += "\n}\n";
        }
        return code;
    }
}
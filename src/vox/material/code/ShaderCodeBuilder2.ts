
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererDeviece from "../../../vox/render/RendererDeviece";
import IUniformParam from "../../../vox/material/IUniformParam";
import IShaderCodeBuilder from "./IShaderCodeBuilder";

export default class ShaderCodeBuilder2 implements IShaderCodeBuilder {

    private m_versionDeclare: string =
`#version 300 es
`;
    private m_preciousCode: string =
`
precision mediump float;
`;
    private m_mainBeginCode: string =
`
\nvoid main(){
`;
    private m_mainEndCode: string =
        `
}
`;

    private m_fragExt: string[] = [];
    private m_vertExt: string[] = [];

    private m_defineNames: string[] = [];
    private m_defineValues: string[] = [];

    private m_vertLayoutNames: string[] = [];
    private m_vertLayoutTypes: string[] = [];

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

    private m_objMat: boolean = false;
    private m_viewMat: boolean = false;
    private m_projMat: boolean = false;

    private m_vertMainCode: string = "";
    private m_fragMainCode: string = "";

    normalMapEanbled: boolean = false;
    mapLodEnabled: boolean = false;
    constructor() { }

    reset() {
        this.m_objMat = false;
        this.m_viewMat = false;
        this.m_projMat = false;

        this.m_vertMainCode = "";
        this.m_fragMainCode = "";

        this.m_vertExt = [];
        this.m_fragExt = [];

        this.m_vertLayoutNames = [];
        this.m_vertLayoutTypes = [];

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
        this.m_defineNames.push(name);
        this.m_defineValues.push(value);
    }
    addVertLayout(type: string, name: string): void {
        this.m_vertLayoutNames.push(name);
        this.m_vertLayoutTypes.push(type);
    }
    addFragOutput(type: string, name: string): void {
        this.m_fragOutputNames.push(name);
        this.m_fragOutputTypes.push(type);
    }
    addVarying(type: string, name: string): void {
        this.m_varyingNames.push(name);
        this.m_varyingTypes.push(type);
    }
    addVertUniform(type: string, name: string, arrayLength: number = 0): void {
        if(arrayLength > 0) {
            this.m_vertUniformNames.push(name + "["+arrayLength+"]");
        }
        else {
            this.m_vertUniformNames.push(name);
        }
        this.m_vertUniformTypes.push(type);
    }
    addVertUniformParam(unifromParam: IUniformParam): void {        
        this.addVertUniform(unifromParam.type,unifromParam.name, unifromParam.arrayLength);
    }
    addFragUniform(type: string, name: string, arrayLength: number = 0): void {
        if(arrayLength > 0) {
            this.m_fragUniformNames.push(name + "["+arrayLength+"]");
        }
        else {
            this.m_fragUniformNames.push(name);
        }
        this.m_fragUniformTypes.push(type);
    }
    addFragUniformParam(unifromParam: IUniformParam): void {        
        this.addFragUniform(unifromParam.type,unifromParam.name, unifromParam.arrayLength);
    }
    //IUniformParam
    addFragFunction(codeBlock: string): void {
        this.m_fragFunctionBlocks.push(codeBlock);
    }
    addVertFunction(codeBlock: string): void {
        this.m_vertFunctionBlocks.push(codeBlock);
    }
    addTextureSample2D(): void {
        this.m_textureSampleTypes.push("sampler2D");
    }
    addTextureSampleCube(): void {
        this.m_textureSampleTypes.push("samplerCube");
    }
    addTextureSample3D(): void {
        this.m_textureSampleTypes.push("sampler3D");
    }
    useVertSpaceMats(objMatEnabled: boolean, viewMatEnabled: boolean = false, projMatEnabled: boolean = true): void {
        this.m_objMat = objMatEnabled;
        this.m_viewMat = viewMatEnabled;
        this.m_projMat = projMatEnabled;
    }

    addVertExtend(code: string): void {
        this.m_vertExt.push(code);
    }
    addFragExtend(code: string): void {
        this.m_fragExt.push(code);
    }

    addVertMainCode(code: string): void {
        this.m_vertMainCode += code;
    }
    addFragMainCode(code: string): void {
        this.m_fragMainCode += code;
    }

    buildFragCode(): string {
        
        let i: number = 0;
        let len: number = 0;
        let code: string = "";
        if(RendererDeviece.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED) {
            this.useHighPrecious();
        }
        if (RendererDeviece.IsWebGL2()) {
            code += this.m_versionDeclare;
        }

        i = 0;
        len = this.m_fragExt.length;
        for (; i < len; i++) {
            code += "\n" + this.m_fragExt[i];
        }

        if(RendererDeviece.IsWebGL1()) {
            if(this.normalMapEanbled) {
                code += "\n#extension GL_OES_standard_derivatives : enable";
            }
            if(this.mapLodEnabled) {
                code += "\n#extension GL_EXT_shader_texture_lod : enable";
            }
        }
        
        if(RendererDeviece.IsWebGL2()) {
            code += "\n#define VOX_IN in";
            if(this.mapLodEnabled) {
                code += "\n#define VOX_TextureCubeLod textureLod";
                code += "\n#define VOX_Texture2DLod textureLod";
            }
            code += "\n#define VOX_Texture2D texture";
            code += "\n#define VOX_TextureCube texture";
            
        }
        else {
            code += "\n#define VOX_IN varying";
            if(this.mapLodEnabled) {
                code += "\n#define VOX_TextureCubeLod textureCubeLodEXT";
                code += "\n#define VOX_Texture2DLod texture2DLodEXT";
            }
            code += "\n#define VOX_TextureCube textureCube";
            code += "\n#define VOX_Texture2D texture2D";
        }

        code += "\n"+this.m_preciousCode;

        len = this.m_defineNames.length;
        for (i = 0; i < len; i++) {
            if (this.m_defineValues[i] != "") {
                code += "\n#define " + this.m_defineNames[i] + " " + this.m_defineValues[i];
            }
            else {
                code += "\n#define " + this.m_defineNames[i];
            }
        }

        i = 0;
        len = this.m_textureSampleTypes.length;
        for (; i < len; i++) {
            code += "\nuniform " + this.m_textureSampleTypes[i] + " u_sampler" + i + ";";
        }
        i = 0;
        len = this.m_fragUniformTypes.length;
        for (; i < len; i++) {
            code += "\nuniform " + this.m_fragUniformTypes[i] + " " + this.m_fragUniformNames[i] + ";";
        }
        
        len = this.m_varyingNames.length;
        if(RendererDeviece.IsWebGL2()) {
            for (i = 0; i < len; i++) {
                code += "\nin " + this.m_varyingTypes[i] + " " + this.m_varyingNames[i] + ";";
            }
        }
        else {
            for (i = 0; i < len; i++) {
                code += "\nvarying " + this.m_varyingTypes[i] + " " + this.m_varyingNames[i] + ";";
            }
        }

        i = 0;
        len = this.m_fragFunctionBlocks.length;
        for (; i < len; i++) {
            code += "\n" + this.m_fragFunctionBlocks[i];
        }

        i = 0;
        len = this.m_fragOutputNames.length;
        if(RendererDeviece.IsWebGL2()) {
            for (; i < len; i++) {
                code += "\nlayout(location = "+i+") out " + this.m_fragOutputTypes[i] + " " + this.m_fragOutputNames[i] + ";";
            }
        } else {
            if(len == 1) {
                code += "\n#define " + this.m_fragOutputNames[i] + " gl_FragColor";
            }
        }


        //  code += this.m_mainBeginCode;
        code += this.m_fragMainCode;
        //  code += this.m_mainEndCode;
        len = this.m_fragOutputNames.length;
        if(RendererDeviece.IsWebGL1()) {
            if(len > 1) {
                for (i = 0; i < len; i++) {
                    let tempReg = new RegExp(this.m_fragOutputNames[i],"g");
                    code = code.replace(tempReg, "gl_FragData["+i+"]");
                }
            }
        }
        return code;
    }
    buildVertCode(): string {
        let i: number = 0;
        let len: number = 0;
        let code: string = "";

        if(RendererDeviece.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED) {
            this.useHighPrecious();
        }
        if (RendererDeviece.IsWebGL2()) {
            code += this.m_versionDeclare;
        }

        i = 0;
        len = this.m_vertExt.length;
        for (; i < len; i++) {
            code += "\n" + this.m_vertExt[i];
        }

        code += "\n"+this.m_preciousCode;

        if(RendererDeviece.IsWebGL2()) {
            code += "\n#define VOX_OUT out";
        }
        else {
            code += "\n#define VOX_OUT varying";
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

        len = this.m_vertLayoutNames.length;
        if(RendererDeviece.IsWebGL2()) {
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
        if (this.m_objMat) code += "\nuniform mat4 u_objMat;";
        if (this.m_viewMat) code += "\nuniform mat4 u_viewMat;";
        if (this.m_projMat) code += "\nuniform mat4 u_projMat;";

        
        len = this.m_varyingNames.length;
        if(RendererDeviece.IsWebGL2()) {
            for (i = 0; i < len; i++) {
                code += "\nout " + this.m_varyingTypes[i] + " " + this.m_varyingNames[i] + ";";
            }
        }
        else {
            for (i = 0; i < len; i++) {
                code += "\nvarying " + this.m_varyingTypes[i] + " " + this.m_varyingNames[i] + ";";
            }

        }

        i = 0;
        len = this.m_vertFunctionBlocks.length;
        for (; i < len; i++) {
            code += "\n" + this.m_vertFunctionBlocks[i];
        }

        //  code += this.m_mainBeginCode;
        code += this.m_vertMainCode;
        //  code += this.m_mainEndCode;
        return code;
    }
}
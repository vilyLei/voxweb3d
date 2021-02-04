
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as BitConstT from "../../vox/utils/BitConst";
import * as VtxBufConstT from "../../vox/mesh/VtxBufConst";
import * as RendererDevieceT from "../../vox/render/RendererDeviece";
import * as GLSLConverterT from "../../vox/material/code/GLSLConverter";

import * as AttributeLineT from "../../vox/material/code/AttributeLine";
import * as UniformLineT from "../../vox/material/code/UniformLine";
import * as ShaderCodeParserT from "../../vox/material/code/ShaderCodeParser";


import BitConst = BitConstT.vox.utils.BitConst;
import VtxBufConst = VtxBufConstT.vox.mesh.VtxBufConst;
import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import GLSLConverter = GLSLConverterT.vox.material.code.GLSLConverter;

import AttributeLine = AttributeLineT.vox.material.code.AttributeLine;
import UniformLine = UniformLineT.vox.material.code.UniformLine;
import ShaderCodeParser = ShaderCodeParserT.vox.material.code.ShaderCodeParser;

export namespace vox
{
    export namespace material
    {
        export class ShaderData
        {
            private static s_uid:number = 0;

            private static s_codeParser:ShaderCodeParser = new ShaderCodeParser();
            private m_uid:number = -1;
            constructor()
            {
                this.m_uid = ShaderData.s_uid++;
            }
            private m_vshdCode:string = "";
            private m_fshdCode:string = "";
            private m_shdUniqueName:string = "";
            private m_texTotal:number = 0;
            private m_uniforms:UniformLine[] = null;
            // identify use texture
            private m_useTex:boolean = false;
            // web gl 1.0, attribute namestring list
            private m_attriNSList:string[] = null;
            private m_attriSizeList:number[] = null;            
            private m_aLocationTypes:number[] = null;            
            private m_uniformDict:Map<string,UniformLine> = new Map();
            
            private m_haveCommonUniform:boolean = false;
            private m_layoutBit:number = 0x0;
            private m_fragOutputTotal:number = 1;
            private m_texUniformNames:string[] = null;

            getVSCodeStr():string
            {
                return this.m_vshdCode;
            }
            getFSCodeStr():string
            {
                return this.m_fshdCode;
            }
            getLayoutBit():number
            {
                return this.m_layoutBit;
            }
            getFragOutputTotal():number
            {
                return this.m_fragOutputTotal;
            }
            private parseCode(vshdsrc:string,fshdSrc:string):void
            {
                ShaderData.s_codeParser.reset();
                ShaderData.s_codeParser.parseVShaderCode(vshdsrc);
                ShaderData.s_codeParser.parseFShaderCode(fshdSrc);
                this.m_fragOutputTotal = ShaderData.s_codeParser.fragOutputTotal;
                this.m_uniforms = ShaderData.s_codeParser.m_uniforms;
            }
            initialize(unique_ns:string,vshdsrc:string,fshdSrc:string):void
            {
                if(RendererDeviece.IsWebGL1())
                {
                    vshdsrc = GLSLConverter.Es3VtxShaderToES2(vshdsrc);
                    fshdSrc = GLSLConverter.Es3FragShaderToES2(fshdSrc);
                }
                this.parseCode(vshdsrc,fshdSrc);
                let pattributes:AttributeLine[] = ShaderData.s_codeParser.attributes;
 
                let i:number = 0;
                let len:number = pattributes.length;
                let attri:AttributeLine = null;
                this.m_attriNSList = [];
                this.m_attriSizeList = [];

                this.m_layoutBit = 0x0;
            
                while(i < len)
                {
                    attri = pattributes[i];
                    if(attri != null)
                    {
                        this.m_attriNSList.push(attri.name);
                        this.m_attriSizeList.push(attri.typeSize);
                    
                        switch(VtxBufConst.GetVBufTypeByNS(attri.name))
                        {
                            case VtxBufConst.VBUF_VS:
                                
                                this.m_layoutBit |= BitConst.BIT_ONE_0;
                            break;
                            case VtxBufConst.VBUF_UVS:
                                
                                this.m_layoutBit |= BitConst.BIT_ONE_1;
                            break;
                            case VtxBufConst.VBUF_NVS:
                                
                                this.m_layoutBit |= BitConst.BIT_ONE_2;
                            break;
                            case VtxBufConst.VBUF_CVS:
                                
                                this.m_layoutBit |= BitConst.BIT_ONE_3;
                            break;
                            case VtxBufConst.VBUF_TVS:
                                
                                this.m_layoutBit |= BitConst.BIT_ONE_4;
                            break;
                            ///////////////////
                            case VtxBufConst.VBUF_VS2:
                                
                                this.m_layoutBit |= BitConst.BIT_ONE_5;
                            break;
                            case VtxBufConst.VBUF_UVS2:
                                
                                this.m_layoutBit |= BitConst.BIT_ONE_6;
                            break;
                            case VtxBufConst.VBUF_NVS2:
                                
                                this.m_layoutBit |= BitConst.BIT_ONE_7;
                            break;
                            case VtxBufConst.VBUF_CVS2:
                                
                                this.m_layoutBit |= BitConst.BIT_ONE_8;
                            break;
                            case VtxBufConst.VBUF_TVS2:
                                
                                this.m_layoutBit |= BitConst.BIT_ONE_9;
                            break;
                            default:
                                break;
                        }
                    }
                    ++i;
                }
                this.m_texTotal = ShaderData.s_codeParser.texTotal;
                this.m_useTex = this.m_texTotal > 0;
                if(this.m_useTex)
                {
                    this.m_texUniformNames = ShaderData.s_codeParser.texUniformNameListStr.split(",");
                }
                this.m_haveCommonUniform = this.m_texTotal < this.m_uniforms.length;
                this.m_vshdCode = vshdsrc;
                this.m_fshdCode = fshdSrc;
                this.m_shdUniqueName = unique_ns;
            }
            
            getTexUniformNames():string[]
            {
                return this.m_texUniformNames;
            }
            getUniforms():UniformLine[]
            {
                return this.m_uniforms;
            }

            haveCommonUniform():boolean
            {
                return this.m_haveCommonUniform;
            }
            getAttriNSList():string[]
            {
                return this.m_attriNSList;
            }
            getUid():number
            {
                return this.m_uid;
            }
            getTexTotal():number
            {
                return this.m_texTotal;
            }
            // use texture true or false
            haveTexture():boolean
            {
                return this.m_useTex;
            }
            // recode shader uniform including status
            dataUniformEnabled:boolean = false;
            
            getLocationsTotal():number
            {
                return this.m_aLocationTypes.length;
            }
            getUniformTypeNameByNS(ns:string):string
            {
                let uniform:UniformLine = this.m_uniformDict.get( ns );
                if(uniform != null)
                {
                    return uniform.typeName;
                }
                return "";
            }
            getUniformTypeByNS(ns:string):number
            {
                let uniform:UniformLine = this.m_uniformDict.get( ns );
                if(uniform != null)
                {
                    return uniform.type;
                }
                return 0;
            }
            hasUniformByName(ns:string):boolean
            {
                return this.m_uniformDict.has(ns);
            }
            getUniformLengthByNS(ns:string):number
            {
                if(this.m_uniformDict.has(ns))
                {
                    this.m_uniformDict.get(ns).arrLength;
                }
                return 0;
            }
            getUniqueShaderName():string
            {
                return this.m_shdUniqueName;
            }
            destroy():void
            {
                this.m_texTotal = 0;
            }
        }
    }
}

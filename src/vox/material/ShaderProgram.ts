
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
        export class ShaderProgram
        {
            private static __s_uid:number = 0;

            static s_codeParser:ShaderCodeParser = new ShaderCodeParser();
            private m_uid:number = -1;
            constructor()
            {
                this.m_uid = ShaderProgram.__s_uid++;
            }
            private m_program:any = null;
            private m_gl:any = null;
            private m_vshdSrc:string = "";
            private m_fshdSrc:string = "";
            private m_shdUniqueName:string = "";
            private m_texTotal:number = 0;
            private m_uniforms:UniformLine[] = null;
            // identify use texture
            private m_useTex:boolean = false;
            // web gl 1.0, attribute namestring list
            private m_attriNSList:string[] = null;
            private m_attriSizeList:number[] = null;
            // recorde uniform GLUniformLocation id
            private m_aLocations:number[] = null;
            private m_aLocationTypes:number[] = null;
            private m_aLocationSizes:number[] = null;
            private m_uLocations:any[] = null;
            private m_texLocations:any[] = null;
            private m_attribLIndexList:number[] = [-1,-1,-1,-1,-1,-1, -1,-1,-1,-1,-1,-1, -1,-1,-1,-1,-1,-1];
            private m_attribTypeSizeList:number[] = [-1,-1,-1,-1,-1,-1, -1,-1,-1,-1,-1,-1, -1,-1,-1,-1,-1,-1];
            private m_uniformDict:Map<string,UniformLine> = new Map();
            private m_uLocationDict:Map<string,any> = new Map();
            private m_haveCommonUniform:boolean = false;
            private m_layoutBit:number = 0x0;
            private m_fragOutputTotal:number = 1;
            private m_texUniformNames:string[] = null;

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
                ShaderProgram.s_codeParser.reset();
                ShaderProgram.s_codeParser.parseVShaderCode(vshdsrc);
                ShaderProgram.s_codeParser.parseFShaderCode(fshdSrc);
                this.m_fragOutputTotal = ShaderProgram.s_codeParser.fragOutputTotal;
                this.m_uniforms = ShaderProgram.s_codeParser.m_uniforms;
            }
            initialize(unique_ns:string,vshdsrc:string,fshdSrc:string):void
            {
                if(RendererDeviece.IsWebGL1())
                {
                    vshdsrc = GLSLConverter.Es3VtxShaderToES2(vshdsrc);
                    fshdSrc = GLSLConverter.Es3FragShaderToES2(fshdSrc);
                }
                this.parseCode(vshdsrc,fshdSrc);

                let pattributes:AttributeLine[] = ShaderProgram.s_codeParser.attributes;
 
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
                    
                        //type = VtxBufConst.getVBufTypeByNS(attri.name);
                        switch(VtxBufConst.GetVBufTypeByNS(attri.name))
                        {
                            case VtxBufConst.VBUF_VS:
                                //arr[0] = type;
                                this.m_layoutBit |= BitConst.BIT_ONE_0;
                            break;
                            case VtxBufConst.VBUF_UVS:
                                //arr[1] = type;
                                this.m_layoutBit |= BitConst.BIT_ONE_1;
                            break;
                            case VtxBufConst.VBUF_NVS:
                                //arr[2] = type;
                                this.m_layoutBit |= BitConst.BIT_ONE_2;
                            break;
                            case VtxBufConst.VBUF_CVS:
                                //arr[3] = type;
                                this.m_layoutBit |= BitConst.BIT_ONE_3;
                            break;
                            case VtxBufConst.VBUF_TVS:
                                //arr[3] = type;
                                this.m_layoutBit |= BitConst.BIT_ONE_4;
                            break;
                            ///////////////////
                            case VtxBufConst.VBUF_VS2:
                                //arr[4] = type;
                                this.m_layoutBit |= BitConst.BIT_ONE_5;
                            break;
                            case VtxBufConst.VBUF_UVS2:
                                //arr[5] = type;
                                this.m_layoutBit |= BitConst.BIT_ONE_6;
                            break;
                            case VtxBufConst.VBUF_NVS2:
                                //arr[6] = type;
                                this.m_layoutBit |= BitConst.BIT_ONE_7;
                            break;
                            case VtxBufConst.VBUF_CVS2:
                                //arr[7] = type;
                                this.m_layoutBit |= BitConst.BIT_ONE_8;
                            break;
                            case VtxBufConst.VBUF_TVS2:
                                //arr[7] = type;
                                this.m_layoutBit |= BitConst.BIT_ONE_9;
                            break;
                            default:
                                break;
                        }
                    }
                    ++i;
                }
                this.m_texTotal = ShaderProgram.s_codeParser.texTotal;
                this.m_useTex = this.m_texTotal > 0;
                if(this.m_useTex)
                {
                    this.m_texUniformNames = ShaderProgram.s_codeParser.texUniformNameListStr.split(",");
                }
                this.m_haveCommonUniform = this.m_texTotal < this.m_uniforms.length;
                this.m_vshdSrc = vshdsrc;
                this.m_fshdSrc = fshdSrc;
                this.m_shdUniqueName = unique_ns;
            }
            getUid():number
            {
                return this.m_uid;
            }
            getTexTotal():number
            {
                return this.m_texTotal;
            }
            useTexLocation():void
            {
                for(let i:number = 0; i < this.m_texTotal; i++)
                {
                    this.m_gl.uniform1i(this.m_texLocations[i], i);
                }
            }
            // use texture true or false
            haveTexture():boolean
            {
                return this.m_useTex;
            }
            // recode shader uniform including status
            dataUniformEnabled:boolean = false;
            private createLocations():void
            {
                let i:number = 0;
                let len:number = 0;
                if(this.m_attriNSList != null && this.m_attriNSList.length > 0)
                {
                    if(this.m_aLocations == null)
                    {
                        this.dataUniformEnabled = false;
                        this.m_aLocations = [];
                        this.m_aLocationTypes = [];
                        this.m_aLocationSizes = [];
                        len = this.m_attriNSList.length;
                        let type:number = 0;
                        let altI:number = 0;
                        while(i < len)
                        {
                            altI = this.m_gl.getAttribLocation(this.m_program, this.m_attriNSList[i]);
                            this.m_aLocations.push( altI );
                            type = VtxBufConst.GetVBufAttributeTypeByNS(this.m_attriNSList[i]);
                            this.m_aLocationTypes.push( type );
                            this.m_aLocationSizes.push( this.m_attriSizeList[i] );
                            this.m_attribLIndexList[ type ] = altI;
                            this.m_attribTypeSizeList[ type ] = this.m_attriSizeList[i];
                            this.dataUniformEnabled = true;
                            ++i;
                        }
                        if(RendererDeviece.SHADERCODE_TRACE_ENABLED)
                        {
                            console.log("ShaderProgram::createLocations(), attri aLocationTypes: "+this.m_aLocationTypes);
                            console.log("ShaderProgram::createLocations(), attri m_aLocations: "+this.m_aLocations);
                            console.log("ShaderProgram::createLocations(), m_attriNSList: "+this.m_attriNSList);
                            console.log("ShaderProgram::createLocations(), m_attribLIndexList: "+this.m_attribLIndexList);
                        }
                    }
                }
                if(this.m_haveCommonUniform)
                {
                    if(this.m_uLocations == null)
                    {
                        this.m_uLocations = [];
                        len = this.m_uniforms.length;
                        i = 0;
                        let ul:any = null;
                        let uns:string = "";
                        while(i < len)
                        {
                            if(!this.m_uniforms[i].isTex)
                            {
                                uns = this.m_uniforms[i].name;
                                ul = this.m_gl.getUniformLocation(this.m_program, uns);
                                if(RendererDeviece.SHADERCODE_TRACE_ENABLED)
                                {
                                    console.log("ShaderProgram::createLocations() uniform, ul "+ul+", this.m_uniforms["+i+"].name: "+uns);
                                }
                                if(ul != null)
                                {
                                    this.m_uniforms[i].location = ul;
                                    this.m_uniformDict.set( uns, this.m_uniforms[i]);
                                    this.m_uLocationDict.set( uns, ul);
                                    this.m_uLocations.push(ul);
                                    this.dataUniformEnabled = true;
                                }
                                else
                                {
                                    if(RendererDeviece.SHADERCODE_TRACE_ENABLED)
                                    {
                                        console.warn("uniform ",uns," was not used!");
                                    }
                                }
                            }
                            ++i;
                        }
                    }
                }
                if(this.m_texTotal > 0)
                {
                    this.m_texLocations = new Array(this.m_texTotal);
                    for(i = 0; i < this.m_texTotal; ++i)
                    {
                        this.m_texLocations[i] = this.m_gl.getUniformLocation(this.m_program, this.m_texUniformNames[ i ]);
                    }
                }
            }
            getLocationsTotal():number
            {
                return this.m_aLocationTypes.length;
            }
            getLocationTypeByIndex(index:number):number
            {
                return this.m_aLocationTypes[index];
            }
            getLocationSizeByIndex(index:number):number
            {
                return this.m_aLocationSizes[index];
            }
            //m_attribLIndexList
            private m_attrid:number = 0;
            private m_attridIndex:number = 0;
            vertexAttribPointerType(attribType:number,size:number, type:number, normalized:boolean, stride:number, offset:number):void
            {
                this.m_attrid = this.m_attribLIndexList[attribType];
                if(this.m_attrid > -1)
                {
                    this.m_gl.enableVertexAttribArray( this.m_attrid );
                    this.m_gl.vertexAttribPointer(this.m_attrid,this.m_attribTypeSizeList[attribType],type,normalized,stride,offset);
                }
            }
            vertexAttribPointerTypeFloat(attribType:number, stride:number, offset:number):void
            {
                this.m_attrid = this.m_attribLIndexList[attribType];
                if(this.m_attrid > -1)
                {
                    this.m_gl.enableVertexAttribArray( this.m_attrid );
                    this.m_gl.vertexAttribPointer(this.m_attrid,this.m_attribTypeSizeList[attribType],this.m_gl.FLOAT,false,stride,offset);
                }
            }
            testVertexAttribPointerType(attribType:number):boolean
            {
                return this.m_attribLIndexList[attribType] > -1;
            }
            getVertexAttribByTpye(attribType:number):number
            {
                return this.m_attribLIndexList[attribType];
            }
            vertexAttribPointerAt(i:number,size:number, type:number, normalized:boolean, stride:number, offset:number):void
            {
                this.m_attridIndex = i;
                this.m_attrid = this.m_aLocations[i];
                if(this.m_attrid > -1)
                {
                    this.m_gl.enableVertexAttribArray( this.m_attrid );
                    this.m_gl.vertexAttribPointer(this.m_attrid,size,type,normalized,stride,offset);
                }
            }
            vertexAttribPointerNext(size:number, type:number, normalized:boolean, stride:number, offset:number):void
            {
                this.m_attrid = this.m_aLocations[this.m_attridIndex];
                if(this.m_attrid > -1)
                {
                    this.m_gl.enableVertexAttribArray( this.m_attrid );
                    this.m_gl.vertexAttribPointer(this.m_attrid,size,type,normalized,stride,offset);
                }
                this.m_attridIndex ++;
            }
            vertexAttribPointerFirst(size:number, type:number, normalized:boolean, stride:number, offset:number):void
            {
                this.m_attridIndex = 1;
                this.m_attrid = this.m_aLocations[0];
                if(this.m_attrid > -1)
                {
                    this.m_gl.enableVertexAttribArray( this.m_attrid );
                    this.m_gl.vertexAttribPointer(this.m_attrid,size,type,normalized,stride,offset);
                }
            }
            private m_uLc:any = null;
            private m_uIndex:number = 0;
            getUniformLocationAt(i:number):any
            {
                this.m_uIndex = i+1;
                return this.m_uLocations[i];
            }
            getUniformLocationNext():any
            {
                this.m_uLc = this.m_uLocations[this.m_uIndex++];
                return this.m_uLc;
            }
            getUniformLocationFirst():any
            {
                this.m_uIndex = 1;
                return this.m_uLocations[0];
            }
            getUniformLocationByNS(ns:string):any
            {
                return this.m_uLocationDict.get( ns );
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
            private initShaderProgram( vshd_str:string, fshd_str:string ):any
            {
                //console.log("ShaderProgram::initShaderProgram(), this: "+this);
                let pr:RegExp;
                if(RendererDeviece.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED)
                {
                    if(vshd_str.indexOf(" mediump ") >= 0)
                    {
                        pr = new RegExp(" mediump ", "g");
                        vshd_str = vshd_str.replace(pr, " highp ");
                    }
                    if(vshd_str.indexOf(" lowp ") >= 0)
                    {
                        pr = new RegExp(" lowp ", "g");
                        vshd_str = vshd_str.replace(pr, " highp ");
                    }
                }
                if(RendererDeviece.SHADERCODE_TRACE_ENABLED)
                {
                    console.log("vshd_str: \n"+vshd_str);
                }
                let vtxShd:any = this.loadShader(this.m_gl.VERTEX_SHADER, vshd_str);
                
                if(RendererDeviece.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED)
                {
                    if(fshd_str.indexOf(" mediump ") >= 0)
                    {
                        pr = new RegExp(" mediump ", "g");
                        fshd_str = fshd_str.replace(pr, " highp ");
                    }
                    if(fshd_str.indexOf(" lowp ") >= 0)
                    {
                        pr = new RegExp(" lowp ", "g");
                        fshd_str = fshd_str.replace(pr, " highp ");
                    }
                }
                if(RendererDeviece.SHADERCODE_TRACE_ENABLED)
                {
                    console.log("fshd_str: \n"+fshd_str);
                }
                let frgShd:any = this.loadShader(this.m_gl.FRAGMENT_SHADER, fshd_str);
                // Create the shader program      
                let shdProgram:any = this.m_gl.createProgram();
                this.m_gl.attachShader(shdProgram, frgShd);
                this.m_gl.attachShader(shdProgram, vtxShd);
                this.m_gl.linkProgram(shdProgram);
                // If creating the shader program failed, alert
                if (!this.m_gl.getProgramParameter(shdProgram, this.m_gl.LINK_STATUS))
                {
                    if(RendererDeviece.SHADERCODE_TRACE_ENABLED)
                    {
                        console.log('Unable to initialize the shader program: ' + this.m_gl.getProgramInfoLog(shdProgram));
                    }
                    return null;
                }
                return shdProgram;
            };
            //
            private loadShader(type:number, source:string):any
            {
                let shader:any = this.m_gl.createShader(type);
                this.m_gl.shaderSource(shader, source);
                this.m_gl.compileShader(shader);  
                if (!this.m_gl.getShaderParameter(shader, this.m_gl.COMPILE_STATUS))
                {
                    if(RendererDeviece.SHADERCODE_TRACE_ENABLED)
                    {
                        console.log('An error occurred compiling the shaders: ' + this.m_gl.getShaderInfoLog(shader));
                    }
                    this.m_gl.deleteShader(shader);
                    return null;
                }      
                return shader;
            }
        
            getUniqueShaderName():string
            {
                return this.m_shdUniqueName;
            }
            enabled():boolean
            {
                return this.m_program != null;
            }
            upload(gl:any):void
            {
                if(this.m_program == null)
                {
                    this.m_gl = gl;
                    this.m_program = this.initShaderProgram(this.m_vshdSrc,this.m_fshdSrc);
                    if(null != this.m_program) this.createLocations();
                }
            }
            uniformBlockBinding(uniform_block_ns:string,bindingIndex:number):void
            {
                this.m_gl.uniformBlockBinding(this.m_program, this.m_gl.getUniformBlockIndex(this.m_program,uniform_block_ns), bindingIndex);
            }
            toString():string
            {
                return "[ShaderProgram(uniqueName = "+this.m_shdUniqueName+")]";
            }
            getProgram():any
            {
                return this.m_program;
            }
            destroy():void
            {
                this.m_aLocations = null;
                
                if(this.m_texTotal > 0)this.m_texLocations.fill(null);
                this.m_texTotal = 0;
                if(this.m_program != null)
                {
                    this.m_gl.deleteProgram(this.m_program);
                    this.m_program = null;
                }
                this.m_gl = null;
            }
        }
    }
}

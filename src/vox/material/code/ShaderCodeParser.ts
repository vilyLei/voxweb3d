
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as RendererDevieceT from "../../../vox/render/RendererDeviece";
//import * as MaterialConstT from "../../../vox/material/MaterialConst";
import * as AttributeLineT from "../../../vox/material/code/AttributeLine";
import * as UniformLineT from "../../../vox/material/code/UniformLine";

import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
//import MaterialConst = MaterialConstT.vox.material.MaterialConst;
import AttributeLine = AttributeLineT.vox.material.code.AttributeLine;
import UniformLine = UniformLineT.vox.material.code.UniformLine;

export namespace vox
{
    export namespace material
    {
        export namespace code
        {
            
            export class ShaderCodeParser
            {
                constructor()
                {
                }
                // identify use texture
                private m_useTex:boolean = false;
                // web gl 1.0, this.attributes
                m_attriNSList:string[] = null;
                m_attriSizeList:number[] = null;
                // m_uniform name list
                //uniformNameList:string[] = null;
                uniformNameListStr:string = "";
                texUniformNameListStr:string = "";
                attributes:AttributeLine[] = [null,null,null,null, null,null,null,null, null,null,null,null];
                m_uniforms:UniformLine[] = null;
                texTotal:number = 0;
                fragOutputTotal:number = 0;
                reset()
                {
                    this.m_useTex = false;
                    this.m_attriNSList = null;
                    //this.uniformNameList = null;
                    this.uniformNameListStr = "";
                    this.texUniformNameListStr = "";
                    let i:number = 0;
                    for(; i < 12; ++i)
                    {
                        this.attributes[i] = null;
                    }
                    this.m_uniforms = null;
                    this.texTotal = 0;
                }
                parseVShaderCode(vshdsrc:string):void
                {
                    let semicolonReg:RegExp = new RegExp(";", "g");
                    vshdsrc = vshdsrc.replace(semicolonReg, ";\n");
                    vshdsrc = vshdsrc.replace("{", "{\n");
                    vshdsrc = vshdsrc.replace("}", "\n}");
                    //
                    let ENTER:string = "\n";
            		let i:number = vshdsrc.indexOf(ENTER);
            		let j:number = 0;
            		//
                    let codeList:string[] = [];
                    let str:string = "";
                    let subStr:string = "";
                    //trace("-----------------parseVShaderCode begin----------------------");
                    let regSpace = new RegExp(" ", "g");
            		while( i>=0 )
                    {
                        str = vshdsrc.slice(j,i);
                        if(str.length > 0)
                        {
                            subStr = str.replace(regSpace, "");
                            if(subStr.indexOf("//") != 0)
                            {
                                codeList.push(str);
                            }
                        }
                        j = i+1;
                        i = vshdsrc.indexOf(ENTER,j);
                    }
                    str = vshdsrc.slice(j,vshdsrc.length);
                    if(str.length > 0)
                    {
                        subStr = str.replace(regSpace, "");
                        if(subStr.indexOf("//") != 0)
                        {
                            codeList.push(str);
                        }
                    }
                    let UNIFORM:string = "uniform ";
                    let len:number = codeList.length;
                    let attri:AttributeLine = null;
                    i = 0;
                    for(; i < 12; ++i)
                    {
                        this.attributes[i] = null;
                    }
                    this.m_attriNSList = [];
                    this.m_attriSizeList = [];
                    //
                    let uniform:UniformLine = null;
                    if(this.m_uniforms == null)this.m_uniforms = [];
                    //if(this.uniformNameList == null)this.uniformNameList = [];
                    //
                    i = 0;
                    let flagLayout:boolean = false;
                    let flagAttri:boolean = false;
                    while(i < len)
                    {
                        str = codeList[i];
                        flagLayout = str.indexOf( "layout" ) >= 0;
                        flagAttri = str.indexOf( "attribute " ) >= 0;
                        if( (flagLayout && str.indexOf( "location" ) > 0) || flagAttri )
                        {
                            attri = new AttributeLine();
                            attri.layoutEnabled = flagLayout;
                            attri.parseCode( str );
                            //this.attributes.push( attri );
                            this.attributes[attri.attriType] = attri;
                            this.m_attriNSList.push( attri.name );
                            this.m_attriSizeList.push( attri.typeSize );
                        }else if( str.indexOf( UNIFORM ) >= 0 )
                        {
                            uniform = new UniformLine();
                            if(uniform.parseCode(str))
                            {
                                this.m_uniforms.push(uniform);
                                //this.uniformNameList.push( uniform.name );
                                this.uniformNameListStr += uniform.name + ",";
                                if(uniform.isTex)
                                {
                                    console.log("use vtx texture !!!");
                                    this.texUniformNameListStr += uniform.name + ",";
                                    this.texTotal ++;
                                }
                            }
                        }
                        ++i;
                    }        
                    //trace("-----------------parseVShaderCode end----------------------");
                }
                parseFShaderCode(fshdsrc:string):void
                {
                    let semicolonReg:RegExp = new RegExp(";", "g");
                    fshdsrc = fshdsrc.replace(semicolonReg, ";\n");
                    fshdsrc = fshdsrc.replace("{", "{\n");
                    fshdsrc = fshdsrc.replace("}", "\n}");
                    //
                    let ENTER:string = "\n";
            		let i:number = fshdsrc.indexOf(ENTER);
            		let j:number = 0;
            		//
                    let codeList:string[] = [];
                    let str:string = "";
                    let subStr:string = "";
                    //console.log("-----------------parseFShaderCode begin----------------------");
                    let regSpace:RegExp = new RegExp(" ", "g");
            		while( i>=0 )
                    {
                        str = fshdsrc.slice(j,i);
                        if(str.length > 0)
                        {
                            subStr = str.replace(regSpace, "");
                            if(subStr.indexOf("//") != 0)
                            {
                                codeList.push(str);
                            }
                        }
                        j = i+1;
                        i = fshdsrc.indexOf(ENTER,j);
                    }
                    str = fshdsrc.slice(j,fshdsrc.length);
                    if(str.length > 0)
                    {
                        subStr = subStr.replace(regSpace, "");
                        if(subStr.indexOf("//") != 0)
                        {
                            codeList.push(str);
                            //trace(str);
                        }
                    }
                    let UNIFORM = "uniform ";
                    let len:number = codeList.length;
                    let uniform:UniformLine = null;
                    if(this.m_uniforms == null)this.m_uniforms = [];

                    i = 0;
                    while(i < len)
                    {
                        str = codeList[i];
                        if( str.indexOf( UNIFORM ) >= 0 && this.uniformNameListStr.indexOf( UNIFORM ) < 0)
                        {
                            uniform = new UniformLine();
                            if(uniform.parseCode(str))
                            {
                                this.m_uniforms.push(uniform);
                                this.uniformNameListStr += uniform.name + ",";
                                if(uniform.isTex)
                                {
                                    this.texUniformNameListStr += uniform.name + ",";
                                    this.texTotal ++;
                                }else
                                {
                                    //this.uniformNameList.push( uniform.name );
                                }
                            }
                        }
                        ++i;
                    }
                    let outputKey:string = "layout";
                    if(RendererDeviece.IsWebGL1())
                    {
                        outputKey = "gl_FragData";
                    }
                    i = fshdsrc.indexOf(outputKey);
                    this.fragOutputTotal = 0;
                    while(i > 0)
                    {
                        this.fragOutputTotal++;
                        i = fshdsrc.indexOf(outputKey, i + 2);
                    }
                    if(this.fragOutputTotal < 1)
                    {
                        this.fragOutputTotal = 1;
                    }
                    //trace("-----------------parseFShaderCode end----------------------,texTotal: "+texTotal);
                }
            }
        }
    }
}


/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as BitConstT from "../../vox/utils/BitConst";
import * as MaterialConstT from "../../vox/material/MaterialConst";
import * as VtxBufConstT from "../../vox/mesh/VtxBufConst";
import * as RendererDevieceT from "../../vox/render/RendererDeviece";
//import * as RenderProxyT from "../../vox/render/RenderProxy";

import BitConst = BitConstT.vox.utils.BitConst;
import MaterialConst = MaterialConstT.vox.material.MaterialConst;
import VtxBufConst = VtxBufConstT.vox.mesh.VtxBufConst;
import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
//import RenderProxy = RenderProxyT.vox.render.RenderProxy;

export namespace vox
{
    export namespace material
    {
        export class GLSLConverter
        {
            static Es2VtxShderToES3(glslStr:string):string
            {
                let codeStr:string = glslStr;
                //attribute
                const ATTRIBUTE:string = "attribute";
                //const POSY_OUTPUT = "out";
                //const POSY_INPUT = "in";
                const VARYING = "varying ";
                let i:number = codeStr.indexOf(ATTRIBUTE);
                let j:number = 0;
                while( i>=0 )
                {
                    codeStr = codeStr.slice(0,i) + "layout(location="+j+") in"+codeStr.slice(i+9);
                    i = codeStr.indexOf(ATTRIBUTE);
                    j++;
                }
                let regex:RegExp = new RegExp(VARYING, "g");
        		codeStr = codeStr.replace(regex, "out ");
                //i = codeStr.indexOf(ATTRIBUTE);
                return "#version 300 es\n"+codeStr;
            }
            static Es2FragShderToES3(glslStr:string):string
            {
                let codeStr:string = glslStr;
                //attribute
                const GL1_OUTPUT:string = "gl_FragColor";
                const VARYING:string = "varying ";
                let i:number = codeStr.indexOf(GL1_OUTPUT);
                let j:number = 0;
                let outFragColor:string = "FragColorOut_"+j;
                if(i>=0)codeStr = codeStr.slice(0,i) + outFragColor+codeStr.slice(i+12);
            
                i = codeStr.indexOf("void ");
                codeStr = codeStr.slice(0,i) + "out vec4 "+outFragColor+";\n"+codeStr.slice(i);
            
                let regex:RegExp = new RegExp(VARYING, "g");
        		codeStr = codeStr.replace(regex, "in ");
                regex = new RegExp(" texture2D", "g");
                codeStr = codeStr.replace(regex, " texture");
                regex = new RegExp(" textureCube", "g");
                codeStr = codeStr.replace(regex, " texture");
                return "#version 300 es\n"+codeStr;
            }

        	static Es3VtxShaderToES2(codeStr:string):string
        	{
        		const regExp0:RegExp = /^#.+(\bes|core\b)/;
        		codeStr = codeStr.replace(regExp0, "");
        		const regExp1:RegExp = /\blayout\b.+\bin\b/g;
        		codeStr = codeStr.replace(regExp1, "attribute");
                const regExp2:RegExp = /\bout\b/g;
            
                codeStr = codeStr.replace(regExp2, "varying");
            
                if(codeStr.indexOf("#version") >= 0)
                {
                    codeStr = codeStr.replace("#version", "//#version");
                }
                //*
                let j:number = 0;
                let k:number = 0;
                let i:number = codeStr.indexOf("inverse(");
                if(i < 0)
                {
                    i = codeStr.indexOf("inverse (");
                }
                let subStr:string = "";
                let invMat3Boo:boolean = false;
                let invMat4Boo:boolean = false;
                while(i > 3)
                {
                    j = codeStr.indexOf(")",i + 2);
                    //get var name
                    subStr = codeStr.slice(i + 2, j);
                    if(subStr.indexOf("mat3") > 0)
                    {
                        invMat3Boo = true;
                    }
                    else
                    {
                        // 去除空格,得到实际的变量名
                        subStr = subStr.replace(/\s+/g, "");
                        j = subStr.indexOf("(");
                        subStr = subStr.slice(j+1);
                        // 查找第一次定义的地方
                        j = codeStr.indexOf(subStr,1);
                        // 查找在这位置前面的最近的mat or vec字符                
                        k = codeStr.lastIndexOf("mat",j);
                        if(k > 0)
                        {
                            subStr = codeStr.slice(k,j);
                            subStr = subStr.replace(/\s+/g, "");
                            switch(subStr)
                            {
                                case "mat3":
                                    invMat3Boo = true;
                                break;
                                case "mat4":
                                    invMat4Boo = true;
                                break;
                            }
                        }
                    }
                    i = codeStr.indexOf("inverse(", i+5);
                    if(i < 0)
                    {
                        i = codeStr.indexOf("inverse (", i+5);
                    }
                    if(invMat3Boo && invMat4Boo)
                    {
                        break;
                    }
                }
                j = 0;
                i = codeStr.indexOf("transpose(");
                if(i < 0)
                {
                    i = codeStr.indexOf("transpose (");
                }
                subStr = "";
                let trsMat3Boo:boolean = false;
                let trsMat4Boo:boolean = false;
                while(i > 3)
                {
                    j = codeStr.indexOf(")",i + 2);
                    subStr = codeStr.slice(i + 2, j+1);
                    if(subStr.indexOf("mat3") > 0)
                    {
                        trsMat3Boo = true;
                    }
                    else
                    {
                        // 去除空格,得到实际的变量名
                        subStr = subStr.replace(/\s+/g, "");
                        j = subStr.indexOf("(");
                        subStr = subStr.slice(j+1);
                        // 查找第一次定义的地方
                        j = codeStr.indexOf(subStr,1);
                        // 查找在这位置前面的最近的mat or vec字符                
                        k = codeStr.lastIndexOf("mat",j);
                        if(k > 0)
                        {
                            subStr = codeStr.slice(k,j);
                            subStr = subStr.replace(/\s+/g, "");
                            //trace("Var Name B: "+subStr);
                            switch(subStr)
                            {
                                case "mat3":
                                    trsMat3Boo = true;
                                break;
                                case "mat4":
                                    trsMat4Boo = true;
                                break;
                            }
                        }
                    }
                    i = codeStr.indexOf("transpose(", i+5);
                    if(i < 0)
                    {
                        i = codeStr.indexOf("transpose (", i+5);
                    }
                    if(trsMat3Boo && trsMat4Boo)
                    {
                        //trsMat3Boo = trsMat4Boo = true;
                        break;
                    }
                }
                if(invMat3Boo || invMat4Boo)
                {
                    i = codeStr.indexOf("void ");
                    if(i > 10)
                    {
                        if(invMat3Boo && invMat4Boo)
                        {
                            codeStr = codeStr.slice(0,i) + GLSLConverter.__glslInverseMat3 + GLSLConverter.__glslInverseMat4 + codeStr.slice(i);
                        }
                        else if(invMat3Boo)
                        {
                            codeStr = codeStr.slice(0,i) + GLSLConverter.__glslInverseMat3 + codeStr.slice(i);
                        }
                        else if(invMat4Boo)
                        {
                            codeStr = codeStr.slice(0,i) + GLSLConverter.__glslInverseMat4 + codeStr.slice(i);
                        }
                    }
                }
                if(trsMat3Boo || trsMat4Boo)
                {
                    i = codeStr.indexOf("void ");
                    if(i > 10)
                    {
                        if(trsMat3Boo && trsMat4Boo)
                        {
                            codeStr = codeStr.slice(0,i) + GLSLConverter.__glslTransposeMat3 + GLSLConverter.__glslTransposeMat4 + codeStr.slice(i);
                        }
                        else if(trsMat3Boo)
                        {
                            codeStr = codeStr.slice(0,i) + GLSLConverter.__glslTransposeMat3 + codeStr.slice(i);
                        }
                        else if(trsMat4Boo)
                        {
                            codeStr = codeStr.slice(0,i) + GLSLConverter.__glslTransposeMat4 + codeStr.slice(i);
                        }
                    }
                }
                return codeStr;
        	}
        
        	static Es3FragShaderToES2(codeStr:string):string
        	{
        		const regExp0:RegExp = /^#.+(\bes|core\b)/;
                codeStr = codeStr.replace(regExp0, "");
                // 防止函数中的in 被替换
        		//const regExpFuncIn:RegExp = /\b in \b/g;
        		const regExpFuncIn:RegExp = new RegExp(" in ", "g");
                codeStr = codeStr.replace(regExpFuncIn, "_fref_");

        		const regExp1:RegExp = /\bin\b/g;
                codeStr = codeStr.replace(regExp1, "varying");
                // 防止函数中的in 被替换
        		const regExpToFuncIn:RegExp = new RegExp("_fref_", "g");
                codeStr = codeStr.replace(regExpToFuncIn, " in ");
                
                
        		//const regExp1:RegExp = /\bin\b/g;
        		//codeStr = codeStr.replace(regExp1, "varying");

        		const regExp2:RegExp = /\btexture\b/g;
                codeStr = codeStr.replace(regExp2, "texture2D");
                //  trace("XXXXXXXXXXXXXXXXXXXXXXXXXXXX A");
                //  trace(codeStr);
                //  trace("XXXXXXXXXXXXXXXXXXXXXXXXXXXX B");
                const regExp3:RegExp = /" "/g;
                let shaderStr:string = codeStr;
                // 替换 frag (layout) out
                const semicolon:string = ";";
                const out_flag:string = "layout";
                let i:number = shaderStr.indexOf(out_flag);
                let j:number = 0;
                let t:number = 0;
                let subStr:string = "";
                let keyName:string = "";
                let keyIndex:number = 0;
                let tempReg:RegExp = null;
                let keys:string[] = [];
                let indexList:number[] = [];
                while(i >= 0)
                {
                    j = shaderStr.indexOf(semicolon,i+1);
                    subStr = shaderStr.slice(i+1, j);
                    keyName = subStr.slice(subStr.lastIndexOf(" ")+1);
                    keyIndex = subStr.indexOf(")");
                    i = subStr.lastIndexOf("=", keyIndex) + 1;
                    subStr = subStr.slice(i+1, keyIndex);
                    keyIndex = parseInt(subStr.replace(regExp3, ""));
                    keys.push(keyName);
                    indexList.push(keyIndex);
                    i = shaderStr.indexOf(out_flag, j);
                }
                let len:number = keys.length;
                if(len > 0)
                {
                    tempReg = /layout/g;
                    codeStr = codeStr.replace(tempReg, "//layout");
                    if(len > 1)
                    {
                        i = 0
                        while(i < len)
                        {
                            tempReg = new RegExp(keys[i],"g");
                            codeStr = codeStr.replace(tempReg, "gl_FragData["+indexList[i]+"]");
                            ++i;
                        }
                    }
                    else
                    {
                        tempReg = new RegExp(keyName,"g");
                        codeStr = codeStr.replace(tempReg, "gl_FragColor");
                    }
                }
                else
                {
                    i = shaderStr.indexOf("out ");
                    if(i > 0)
                    {
                        j = shaderStr.indexOf(semicolon,i+1);
                        subStr = shaderStr.slice(i+1, j);
                        keyName = subStr.slice(subStr.lastIndexOf(" ")+1);
                        tempReg = new RegExp(keyName,"g");
                        codeStr = codeStr.replace(tempReg, "gl_FragColor");
                        tempReg = new RegExp("out ","g");
                        codeStr = codeStr.replace(tempReg, "//out ");
                    
                    }
                }
                if(len > 1)
                {
                    codeStr = "#extension GL_EXT_draw_buffers: require\n" + codeStr;
                }
                if(codeStr.indexOf("#version") >= 0)
                {
                    codeStr = codeStr.replace("#version", "//#version");
                }
                // correct samplerCube sampler
                i = 0;
                ///*
                for(let k = 0; k < 16; ++k)
                {
                    i = codeStr.indexOf("samplerCube ",i);
                    if(i > 0)
                    {
                        j = codeStr.indexOf(";",i);
                        subStr = shaderStr.slice(i+12, j);
                        keyName = "";
                        let arr:string[] = subStr.split(" ");
                        for(let t = 0; t < 16; ++t)
                        {
                            if(arr[t] != "")
                            {
                                // find samplerCube uniform name
                                keyName = arr[t];
                                break;
                            }
                        }
                        for(len = 0; len < 16; ++len)
                        {
                            j = codeStr.indexOf(keyName,j+1);
                            if(j > 0)
                            {
                                t = codeStr.lastIndexOf("texture2D",j-1);
                                subStr = codeStr.slice(t, j);
                                codeStr = codeStr.slice(0,t) + "textureCube(" + codeStr.slice(j);
                            }
                            else
                            {
                                break;
                            }
                            j+=2;
                        }
                    }
                    else
                    {
                        break;
                    }
                    i += 4;
                }
                //*/
                return codeStr;
            }

            static __glslTransposeMat3:string =
            "\
            mat3 transpose(mat3 m) {\n\
                return mat3(m[0][0],m[1][0],m[2][0],\n\
                    m[0][1],m[1][1],m[2][1],\n\
                    m[0][2],m[1][2],m[2][2]);\n\
            }\n\
            ";
            static __glslTransposeMat4:string =
            "\
            mat4 transpose(mat4 m) {\n\
                return mat4(m[0][0],m[1][0],m[2][0],m[3][0],\n\
                    m[0][1],m[1][1],m[2][1],m[3][1],\n\
                    m[0][2],m[1][2],m[2][2],m[3][2],\n\
                    m[0][3],m[1][3],m[2][3],m[3][3]);\n\
            }\n\
            ";
            static __glslInverseMat3:string =
            "\
            mat3 inverse(mat3 m) {\n\
                float a00 = m[0][0], a01 = m[0][1], a02 = m[0][2];\n\
                float a10 = m[1][0], a11 = m[1][1], a12 = m[1][2];\n\
                float a20 = m[2][0], a21 = m[2][1], a22 = m[2][2];  \n\
                float b01 = a22 * a11 - a12 * a21;\n\
                float b11 = -a22 * a10 + a12 * a20;\n\
                float b21 = a21 * a10 - a11 * a20;  \n\
                float det = a00 * b01 + a01 * b11 + a02 * b21;  \n\
                return mat3(b01, (-a22 * a01 + a02 * a21), (a12 * a01 - a02 * a11),\n\
                            b11, (a22 * a00 - a02 * a20), (-a12 * a00 + a02 * a10),\n\
                            b21, (-a21 * a00 + a01 * a20), (a11 * a00 - a01 * a10)) / det;\n\
            }\n\
            ";
            static __glslInverseMat4:string =
            "\
            mat4 inverse(mat4 m) {\n\
            float\n\
                a00 = m[0][0], a01 = m[0][1], a02 = m[0][2], a03 = m[0][3],\n\
                a10 = m[1][0], a11 = m[1][1], a12 = m[1][2], a13 = m[1][3],\n\
                a20 = m[2][0], a21 = m[2][1], a22 = m[2][2], a23 = m[2][3],\n\
                a30 = m[3][0], a31 = m[3][1], a32 = m[3][2], a33 = m[3][3],\n\
                b00 = a00 * a11 - a01 * a10,\n\
                b01 = a00 * a12 - a02 * a10,\n\
                b02 = a00 * a13 - a03 * a10,\n\
                b03 = a01 * a12 - a02 * a11,\n\
                b04 = a01 * a13 - a03 * a11,\n\
                b05 = a02 * a13 - a03 * a12,\n\
                b06 = a20 * a31 - a21 * a30,\n\
                b07 = a20 * a32 - a22 * a30,\n\
                b08 = a20 * a33 - a23 * a30,\n\
                b09 = a21 * a32 - a22 * a31,\n\
                b10 = a21 * a33 - a23 * a31,\n\
                b11 = a22 * a33 - a23 * a32,\n\
                det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;\n\
            return mat4(\n\
                a11 * b11 - a12 * b10 + a13 * b09,\n\
                a02 * b10 - a01 * b11 - a03 * b09,\n\
                a31 * b05 - a32 * b04 + a33 * b03,\n\
                a22 * b04 - a21 * b05 - a23 * b03,\n\
                a12 * b08 - a10 * b11 - a13 * b07,\n\
                a00 * b11 - a02 * b08 + a03 * b07,\n\
                a32 * b02 - a30 * b05 - a33 * b01,\n\
                a20 * b05 - a22 * b02 + a23 * b01,\n\
                a10 * b10 - a11 * b08 + a13 * b06,\n\
                a01 * b08 - a00 * b10 - a03 * b06,\n\
                a30 * b04 - a31 * b02 + a33 * b00,\n\
                a21 * b02 - a20 * b04 - a23 * b00,\n\
                a11 * b07 - a10 * b09 - a12 * b06,\n\
                a00 * b09 - a01 * b07 + a02 * b06,\n\
                a31 * b01 - a30 * b03 - a32 * b00,\n\
                a20 * b03 - a21 * b01 + a22 * b00) / det;\n\
            }\n\
            ";
        }

        export class AttributeLine
        {
            constructor()
            {
            }
            type:number = -1;
            attriType:number = -1;
            typeSize:number = 3;
            typeName:string = "";
            name:string = "";
            layoutEnabled:boolean = true;
            parseCode(codeStr:string):void
            {
                let SEMICOLON:string = ";";
                let SPACE:string = " ";
                let i:number = codeStr.indexOf(SEMICOLON);
                if(i > 0)codeStr = codeStr.slice(0,i);
                i = codeStr.indexOf(SPACE);
        		let j:number = 0;
        		let str:string = "";
                let arr:string[] = [];
        		while( i>=0 )
                {
                    str = codeStr.slice(j,i);
                    if(str.length > 0){arr.push(str);}
                    j = i+1;
                    i = codeStr.indexOf(SPACE,j);
                }
                str = codeStr.slice(j,codeStr.length);
                if(str.length > 0){arr.push(str);}
                if(this.layoutEnabled)
                {
                    this.typeName = arr[arr.length - 2];
                    this.name = arr[arr.length - 1];
                }else
                {
                    this.typeName = arr[arr.length - 2];
                    this.name = arr[arr.length - 1];
                }
            
                this.type = MaterialConst.GetTypeByTypeNS(this.typeName);
                this.typeSize = parseInt(this.typeName.slice(this.typeName.length - 1));
                this.attriType = VtxBufConst.GetVBufAttributeTypeByNS(this.name);
                //trace("Attribute: >"+this.typeName+"<,>"+this.name+"<,>"+this.type+"<,typeSize: >"+this.typeSize+",attriType: "+this.attriType);
            }
        }
        export class UniformLine
        {
            constructor()
            {
            }
            type:number = -1;
            typeName:string = "";
            name:string = "";
            isArray:boolean = false;
            isTex:boolean = false;
            location:any = null;
            parseCode(codeStr:string):boolean
            {
                const SEMICOLON:string = ";";
                let i:number = codeStr.indexOf(SEMICOLON);
                if(i < 0)
                {
                    return false;
                }
                const SPACE:string = " ";
                if(i > 0)codeStr = codeStr.slice(0,i);
                i = codeStr.indexOf(SPACE);
        		let j:number = 0;
        		let str:string = "";
                let arr:string[] = [];
        		while( i>=0 )
                {
                    str = codeStr.slice(j,i);
                    if(str.length > 0){arr.push(str);}
                    j = i+1;
                    i = codeStr.indexOf(SPACE,j);
                }
                str = codeStr.slice(j,codeStr.length);
                if(str.length > 0){arr.push(str);}
                //
                this.typeName = arr[arr.length - 2];
                this.name = arr[arr.length - 1];
                i = this.name.indexOf("[");
                if(i > 0)
                {
                    this.name = this.name.slice(0,i);
                    this.typeName +="[]";
                }
                this.type = MaterialConst.GetTypeByTypeNS(this.typeName);
                if(this.type < 0)
                {
                    return false;
                }
                this.isTex = this.type == MaterialConst.SHADER_SAMPLER2D || this.type == MaterialConst.SHADER_SAMPLERCUBE || this.type == MaterialConst.SHADER_SAMPLER3D;
                return true;
            }
        }

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
            uniformNameList:string[] = null;
            uniformNameListStr:string = "";
            attributes:AttributeLine[] = [null,null,null,null, null,null,null,null, null,null,null,null];
            m_uniforms:UniformLine[] = null;
            texTotal:number = 0;
            fragOutputTotal:number = 0;
            reset()
            {
                this.m_useTex = false;
                this.m_attriNSList = null;
                this.uniformNameList = null;
                this.uniformNameListStr = "";
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
                        subStr = subStr.replace(regSpace, "");
                        if(subStr.indexOf("//") != 0)
                        {
                            codeList.push(str);
                            //trace("parseVShaderCode line: "+str);
                        }
                    }
                    j = i+1;
                    i = vshdsrc.indexOf(ENTER,j);
                }
                str = vshdsrc.slice(j,vshdsrc.length);
                if(str.length > 0)
                {
                    subStr = subStr.replace(regSpace, "");
                    if(subStr.indexOf("//") != 0)
                    {
                        codeList.push(str);
                        //trace(str);
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
                if(this.uniformNameList == null)this.uniformNameList = [];
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
                            this.uniformNameList.push( uniform.name );
                            this.uniformNameListStr += uniform.name + " ";
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
                //trace("-----------------parseFShaderCode begin----------------------");
                let regSpace:RegExp = new RegExp(" ", "g");
        		while( i>=0 )
                {
                    str = fshdsrc.slice(j,i);
                    if(str.length > 0)
                    {
                        subStr = subStr.replace(regSpace, "");
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
                            this.uniformNameListStr += uniform.name + " ";
                            if(uniform.isTex)
                            {
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

        export class ShaderProgram
        {
            private static __s_uid:number = 0;

            static ___s_codeParser:ShaderCodeParser = new ShaderCodeParser();
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
            private m_texLocations:any[] = [null,null,null,null, null,null,null,null];
            private m_attribLIndexList:number[] = [-1,-1,-1,-1,-1,-1, -1,-1,-1,-1,-1,-1, -1,-1,-1,-1,-1,-1];
            private m_attribTypeSizeList:number[] = [-1,-1,-1,-1,-1,-1, -1,-1,-1,-1,-1,-1, -1,-1,-1,-1,-1,-1];
            private m_uniformDict:Map<string,UniformLine> = new Map();
            private m_uLocationDict:Map<string,any> = new Map();
            private m_haveCommonUniform:boolean = false;
            private m_layoutBit:number = 0x0;
            private m_fragOutputTotal:number = 1;

            getLayoutBit():number
            {
                return this.m_layoutBit;
            }
            getFragOutputTotal():number
            {
                return this.m_fragOutputTotal;
            }
            initialize(unique_ns:string,vshdsrc:string,fshdSrc:string):void
            {
                if(RendererDeviece.IsWebGL1())
                {
                    vshdsrc = GLSLConverter.Es3VtxShaderToES2(vshdsrc);
                    fshdSrc = GLSLConverter.Es3FragShaderToES2(fshdSrc);
                }
                ShaderProgram.___s_codeParser.reset();
                ShaderProgram.___s_codeParser.parseVShaderCode(vshdsrc);
                ShaderProgram.___s_codeParser.parseFShaderCode(fshdSrc);
                this.m_fragOutputTotal = ShaderProgram.___s_codeParser.fragOutputTotal;
                //
                let pattributes:AttributeLine[] = ShaderProgram.___s_codeParser.attributes;
                this.m_uniforms = ShaderProgram.___s_codeParser.m_uniforms;
            
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
                this.m_texTotal = ShaderProgram.___s_codeParser.texTotal;
                this.m_useTex = this.m_texTotal > 0;
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
                for(let i:number = 0; i < this.m_texTotal; ++i)
                {
                    if(this.m_texLocations[i] != null)
                    {
                        //if(RendererDeviece.SHADERCODE_TRACE_ENABLED)trace("useTexLocation(),m_texLocations["+i+"]: "+m_texLocations[i]);
                        this.m_gl.uniform1i(this.m_texLocations[i], i);
                    }
                    else
                    {
                        this.m_texLocations[i] = this.m_gl.getUniformLocation(this.m_program, MaterialConst.UNIFORMNS_TEX_SAMPLER_LIST[ i ]);
                        //if(RendererDeviece.SHADERCODE_TRACE_ENABLED)trace("useTexLocation(),m_texLocations["+i+"]: "+m_texLocations[i]+", MaterialConst.SHDER_UNIFORM_TEX_SAMPLE_LIST[ i ]: "+MaterialConst.UNIFORMNS_TEX_SAMPLER_LIST[ i ]);
                        this.m_gl.uniform1i(this.m_texLocations[i], i);
                    }
                }
            }
            // use texture true or false
            haveTexture():boolean
            {
                return this.m_useTex;
            }
            // recode shader uniform including status
            dataUniformEnabled:boolean = false;
            createLocations():void
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
                        let altI:number=0;
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
                        let j:number = 0;
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
                                        console.log("uniform ",uns," was not used!");
                                    }
                                }
                            }
                            ++i;
                        }
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
                    if(RendererDeviece.SHADERCODE_TRACE_ENABLED)
                    {
                        console.log("ShaderProgram::upload(), this.getUniqueShaderName(): "+this.getUniqueShaderName());
                    }
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
                this.m_texLocations[0] = null;
                this.m_texLocations[1] = null;
                this.m_texLocations[2] = null;
                this.m_texLocations[3] = null;
                this.m_texLocations[4] = null;
                this.m_texLocations[5] = null;
                this.m_texLocations[6] = null;
                this.m_texLocations[7] = null;
                //
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

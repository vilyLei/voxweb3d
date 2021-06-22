
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
export default class GLSLConverter
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
    
        const regExp3:RegExp = /\btexture\b/g;
        codeStr = codeStr.replace(regExp3, "texture2D");
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

        const regExp2:RegExp = /\btexture\b/g;
        codeStr = codeStr.replace(regExp2, "texture2D");
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
                tempReg = /\bout\b/g;    
                codeStr = codeStr.replace(tempReg, "//out");
            
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
                        if(t < 0) {
                            break;
                        }
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
    `
    mat3 transpose(mat3 m) {
        return mat3(m[0][0],m[1][0],m[2][0],
            m[0][1],m[1][1],m[2][1],
            m[0][2],m[1][2],m[2][2]);
    }
    `;
    static __glslTransposeMat4:string =
    `
    mat4 transpose(mat4 m) {
        return mat4(m[0][0],m[1][0],m[2][0],m[3][0],
            m[0][1],m[1][1],m[2][1],m[3][1],
            m[0][2],m[1][2],m[2][2],m[3][2],
            m[0][3],m[1][3],m[2][3],m[3][3]);
    }
    `;
    static __glslInverseMat3:string =
    `
    mat3 inverse(mat3 m) {
        float a00 = m[0][0], a01 = m[0][1], a02 = m[0][2];
        float a10 = m[1][0], a11 = m[1][1], a12 = m[1][2];
        float a20 = m[2][0], a21 = m[2][1], a22 = m[2][2];  
        float b01 = a22 * a11 - a12 * a21;
        float b11 = -a22 * a10 + a12 * a20;
        float b21 = a21 * a10 - a11 * a20;  
        float det = a00 * b01 + a01 * b11 + a02 * b21;  
        return mat3(b01, (-a22 * a01 + a02 * a21), (a12 * a01 - a02 * a11),
                    b11, (a22 * a00 - a02 * a20), (-a12 * a00 + a02 * a10),
                    b21, (-a21 * a00 + a01 * a20), (a11 * a00 - a01 * a10)) / det;
    }
    `;
    static __glslInverseMat4:string =
    `
    mat4 inverse(mat4 m) {
        float
            a00 = m[0][0], a01 = m[0][1], a02 = m[0][2], a03 = m[0][3],
            a10 = m[1][0], a11 = m[1][1], a12 = m[1][2], a13 = m[1][3],
            a20 = m[2][0], a21 = m[2][1], a22 = m[2][2], a23 = m[2][3],
            a30 = m[3][0], a31 = m[3][1], a32 = m[3][2], a33 = m[3][3],
            b00 = a00 * a11 - a01 * a10,
            b01 = a00 * a12 - a02 * a10,
            b02 = a00 * a13 - a03 * a10,
            b03 = a01 * a12 - a02 * a11,
            b04 = a01 * a13 - a03 * a11,
            b05 = a02 * a13 - a03 * a12,
            b06 = a20 * a31 - a21 * a30,
            b07 = a20 * a32 - a22 * a30,
            b08 = a20 * a33 - a23 * a30,
            b09 = a21 * a32 - a22 * a31,
            b10 = a21 * a33 - a23 * a31,
            b11 = a22 * a33 - a23 * a32,
            det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
        return mat4(
            a11 * b11 - a12 * b10 + a13 * b09,
            a02 * b10 - a01 * b11 - a03 * b09,
            a31 * b05 - a32 * b04 + a33 * b03,
            a22 * b04 - a21 * b05 - a23 * b03,
            a12 * b08 - a10 * b11 - a13 * b07,
            a00 * b11 - a02 * b08 + a03 * b07,
            a32 * b02 - a30 * b05 - a33 * b01,
            a20 * b05 - a22 * b02 + a23 * b01,
            a10 * b10 - a11 * b08 + a13 * b06,
            a01 * b08 - a00 * b10 - a03 * b06,
            a30 * b04 - a31 * b02 + a33 * b00,
            a21 * b02 - a20 * b04 - a23 * b00,
            a11 * b07 - a10 * b09 - a12 * b06,
            a00 * b09 - a01 * b07 + a02 * b06,
            a31 * b01 - a30 * b03 - a32 * b00,
            a20 * b03 - a21 * b01 + a22 * b00) / det;
        }
    `;
}
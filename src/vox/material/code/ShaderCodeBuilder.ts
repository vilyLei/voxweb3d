
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererDeviece from "../../../vox/render/RendererDeviece";

export default class ShaderCodeBuilder
{
    
    private m_versionDeclare:string =
`#version 300 es
`;
    private m_preciousCode:string =
`
precision mediump float;
`;
    private m_mainBeginCode:string =
`
\nvoid main(){
`;
    private m_mainEndCode:string =
`
}
`;

private m_vertLayoutNames:string[] = [];
private m_vertLayoutTypes:string[] = [];

private m_fragOutputNames:string[] = [];
private m_fragOutputTypes:string[] = [];

private m_vertUniformNames:string[] = [];
private m_vertUniformTypes:string[] = [];

private m_fragUniformNames:string[] = [];
private m_fragUniformTypes:string[] = [];

private m_varyingNames:string[] = [];
private m_varyingTypes:string[] = [];

private m_defineNames:string[] = [];
private m_defineValues:string[] = [];

private m_textureSampleTypes:string[] = [];

private m_objMat:boolean = false;
private m_viewMat:boolean = false;
private m_projMat:boolean = false;

    private m_vertMainCode:string = "";
    private m_fragMainCode:string = "";

    constructor(){}

    reset()
    {
        this.m_objMat = false;
        this.m_viewMat = false;
        this.m_projMat = false;

        this.m_vertMainCode = "";
        this.m_fragMainCode = "";

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

        this.m_defineNames = [];
        this.m_defineValues = [];

        this.m_textureSampleTypes = [];
    }
    
    addDefine(name:string,value:string = ""):void
    {
        this.m_defineNames.push(name);
        this.m_defineValues.push(value);
    }
    addVertLayout(type:string,name:string):void
    {
        this.m_vertLayoutNames.push(name);
        this.m_vertLayoutTypes.push(type);
    }
    addFragOutput(type:string,name:string):void
    {
        this.m_fragOutputNames.push(name);
        this.m_fragOutputTypes.push(type);
    }
    addVarying(type:string,name:string):void
    {
        this.m_varyingNames.push(name);
        this.m_varyingTypes.push(type);
    }
    addVertUniform(type:string,name:string):void
    {
        this.m_vertUniformNames.push(name);
        this.m_vertUniformTypes.push(type);
    }
    addFragUniform(type:string,name:string):void
    {
        this.m_fragUniformNames.push(name);
        this.m_fragUniformTypes.push(type);
    }
    //m_textureSampleTypes
    addTextureSample2D():void
    {
        this.m_textureSampleTypes.push("sampler2D");
    }
    addTextureSampleCube():void
    {
        this.m_textureSampleTypes.push("samplerCube");
    }
    addTextureSample3D():void
    {
        this.m_textureSampleTypes.push("sampler3D");
    }
    useVertSpaceMats(objMat:boolean,viewMat:boolean = false,projMat:boolean = true):void
    {
        this.m_objMat = true;
        this.m_viewMat = true;
        this.m_projMat = true;
    }

    addVertMainCode(code:string):void
    {
        this.m_vertMainCode += code;
    }
    addFragMainCode(code:string):void
    {
        this.m_fragMainCode += code;
    }
    
    buildFragCode():string
    {
        let code:string = "";
        if(RendererDeviece.IsWebGL2())
        {
            code += this.m_versionDeclare;
        }
        code += this.m_preciousCode;

        
        let i:number = 0;
        let len:number = 0;
        i = 0;
        len = this.m_textureSampleTypes.length;
        for(; i < len; i++)
        {
            code += "\nuniform "+this.m_textureSampleTypes[i] +" u_sampler"+i+";";
        }
        i = 0;
        len = this.m_fragUniformTypes.length;
        for(; i < len; i++)
        {
            code += "\nuniform "+this.m_fragUniformTypes[i] + " " + this.m_fragUniformNames[i]+";";
        }
        i = 0;
        len = this.m_varyingNames.length;
        for(; i < len; i++)
        {
            code += "\nin "+this.m_varyingTypes[i] +" "+this.m_varyingNames[i]+";";
        }

        i = 0;
        len = this.m_fragOutputNames.length;
        for(; i < len; i++)
        {
            code += "\nout "+this.m_fragOutputTypes[i] +" "+this.m_fragOutputNames[i]+";";
        }

        code += this.m_mainBeginCode;

        code += this.m_fragMainCode;

        code += this.m_mainEndCode;
        return code;
    }
    buildVertCode():string
    {
        let i:number = 0;
        let len:number = 0;
        let code:string = "";
        
        if(RendererDeviece.IsWebGL2())
        {
            code += this.m_versionDeclare;
        }
        code += this.m_preciousCode;

        len = this.m_defineNames.length;
        for(i = 0; i < len; i++)
        {
            if(this.m_defineValues[i] != "") {
                code += "\n#define "+this.m_defineNames[i] +" "+this.m_defineValues[i];
            }
            else {
                code += "\n#define "+this.m_defineNames[i];
            }
        }
        
        len = this.m_vertLayoutNames.length;
        for(i = 0; i < len; i++)
        {
            code += "\nlayout(location = "+i+") in "+this.m_vertLayoutTypes[i] +" "+this.m_vertLayoutNames[i]+";";
        }

        len = this.m_vertUniformTypes.length;
        for(i = 0; i < len; i++)
        {
            code += "\nuniform "+this.m_vertUniformTypes[i] +" "+ this.m_vertUniformNames[i]+";";
        }
        if(this.m_objMat) code += "\nuniform mat4 u_objMat;";
        if(this.m_viewMat) code += "\nuniform mat4 u_viewMat;";
        if(this.m_projMat) code += "\nuniform mat4 u_projMat;";

        len = this.m_varyingNames.length;
        for(i = 0; i < len; i++)
        {
            code += "\nout "+this.m_varyingTypes[i] +" "+this.m_varyingNames[i]+";";
        }

        code += this.m_mainBeginCode;

        code += this.m_vertMainCode;

        code += this.m_mainEndCode;
        return code;
    }
}
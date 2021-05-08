
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import MaterialConst from "../../../vox/material/MaterialConst";

export default class UniformLine
{
    constructor(){}
    type:number = -1;
    typeName:string = "";
    name:string = "";
    isArray:boolean = false;
    arrLength:number = 0;
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
        
        this.typeName = arr[arr.length - 2];
        this.name = arr[arr.length - 1];
        i = this.name.indexOf("[");
        this.isArray = i > 0;
        this.arrLength = 0;
        if(this.isArray)
        {
            this.arrLength = parseInt(this.name.slice(i+1,this.name.indexOf("]",i+1)));
            this.name = this.name.slice(0,i);
            this.typeName +="[]";
        }
        this.type = MaterialConst.GetTypeByTypeNS(this.typeName);
        //console.log("#### this.type: ",this.type,", this.typeName: ",this.typeName);
        if(this.type < 0)
        {
            return false;
        }
        this.isTex = this.type == MaterialConst.SHADER_SAMPLER2D || this.type == MaterialConst.SHADER_SAMPLERCUBE || this.type == MaterialConst.SHADER_SAMPLER3D;
        return true;
    }
}
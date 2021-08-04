
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import VtxBufConst from "../../../vox/mesh/VtxBufConst";
import MaterialConst from "../../../vox/material/MaterialConst";

export default class AttributeLine
{
    constructor(){}
    type:number = -1;
    attriType:number = -1;
    typeSize:number = 3;
    typeName:string = "";
    name:string = "";
    layoutEnabled:boolean = true;
    
    parseCode(codeStr:string):void
    {
        const SEMICOLON:string = ";";
        const SPACE:string = " ";
        // 去掉两头的空格
        codeStr = codeStr.replace(/^\s*|\s*$/g,"");
        let i:number = codeStr.indexOf(SEMICOLON);
        if(i > 0)codeStr = codeStr.slice(0,i);
        let arr:string[] = codeStr.split(SPACE);
       
        this.typeName = arr[arr.length - 2];
        this.name = arr[arr.length - 1];
    
        this.type = MaterialConst.GetTypeByTypeNS(this.typeName);
        this.typeSize = parseInt(this.typeName.slice(this.typeName.length - 1));
        this.attriType = VtxBufConst.GetVBufAttributeTypeByNS(this.name);
        //trace("Attribute: >"+this.typeName+"<,>"+this.name+"<,>"+this.type+"<,typeSize: >"+this.typeSize+",attriType: "+this.attriType);
    }
}
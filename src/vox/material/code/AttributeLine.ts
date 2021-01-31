
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as VtxBufConstT from "../../../vox/mesh/VtxBufConst";
import * as MaterialConstT from "../../../vox/material/MaterialConst";

import VtxBufConst = VtxBufConstT.vox.mesh.VtxBufConst;
import MaterialConst = MaterialConstT.vox.material.MaterialConst;

export namespace vox
{
    export namespace material
    {
        export namespace code
        {
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
        }
    }
}

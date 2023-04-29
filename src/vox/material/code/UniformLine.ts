
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import MaterialConst from "../../../vox/material/MaterialConst";
import IUniformLine from "./IUniformLine";

export default class UniformLine implements IUniformLine {
    constructor() { }
    type: number = -1;
    typeName: string = "";
    name: string = "";
    isArray: boolean = false;
    arrLength: number = 0;
    isTex: boolean = false;
    location: any = null;
    parseCode(codeStr: string): boolean {
        const SEMICOLON: string = ";";
        let i: number = codeStr.indexOf(SEMICOLON);
        if (i < 0) {
            return false;
        }
        const SPACE: string = " ";
        codeStr = codeStr.replace(/^\s*|\s*$/g, "");
        if (i > 0) codeStr = codeStr.slice(0, i);
        let arr: string[] = codeStr.split(SPACE);

        this.typeName = arr[arr.length - 2];
        this.name = arr[arr.length - 1];
        i = this.name.indexOf("[");
        this.isArray = i > 0;
        this.arrLength = 0;
        if (this.isArray) {
            this.arrLength = parseInt(this.name.slice(i + 1, this.name.indexOf("]", i + 1)));
            this.name = this.name.slice(0, i);
            this.typeName += "[]";
        }
        this.type = MaterialConst.GetTypeByTypeNS(this.typeName);
        //console.log("#### this.type: ",this.type,", this.typeName: ",this.typeName);
        if (this.type < 0) {
            return false;
        }
        this.isTex = this.type == MaterialConst.SHADER_SAMPLER2D || this.type == MaterialConst.SHADER_SAMPLERCUBE || this.type == MaterialConst.SHADER_SAMPLER3D;
        return true;
    }
}
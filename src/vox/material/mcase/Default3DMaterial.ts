/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as ShaderUniformDataT from "../../../vox/material/ShaderUniformData";
import * as MaterialBaseT from "../../../vox/material/MaterialBase";

import ShaderUniformData = ShaderUniformDataT.vox.material.ShaderUniformData;
import MaterialBase = MaterialBaseT.vox.material.MaterialBase;

export namespace vox
{
    export namespace material
    {
        export namespace mcase
        {
            export class Default3DMaterial extends MaterialBase
            {
                constructor()
                {
                    super();
                }
                private m_colorArray:Float32Array = new Float32Array([1.0,1.0,1.0,1.0]);
                setRGB3f(pr:number,pg:number,pb:number):void
                {
                    this.m_colorArray[0] = pr;
                    this.m_colorArray[1] = pg;
                    this.m_colorArray[2] = pb;
                }
                setRGBA4f(pr:number,pg:number,pb:number,pa:number):void
                {
                    this.m_colorArray[0] = pr;
                    this.m_colorArray[1] = pg;
                    this.m_colorArray[2] = pb;
                    this.m_colorArray[3] = pa;
                }
                createSelfUniformData():ShaderUniformData
                {
                    let oum:ShaderUniformData = new ShaderUniformData();
                    oum.uniformNameList = ["u_color"];
                    oum.dataList = [this.m_colorArray];
                    return oum;
                }

            }
        }
    }
}
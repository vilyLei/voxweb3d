/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as ShaderUniformProbeT from "../../vox/material/ShaderUniformProbe";

import ShaderUniformProbe = ShaderUniformProbeT.vox.material.ShaderUniformProbe;

export namespace vox
{
    export namespace material
    {
        export class UniformVec4Probe extends ShaderUniformProbe
        {
            private m_datafs:Float32Array = new Float32Array(4);
            private m_vec4Total:number = 1;
            constructor(vec4Total:number)
            {
                super();
                
                if(vec4Total < 1) vec4Total = 1;
                this.m_vec4Total = vec4Total;
            }
            bindSlotAt(i:number):void
            {
                super.bindSlotAt(i);
                this.addVec4Data(this.m_datafs,this.m_vec4Total);
            }
            
            destroy():void
            {
                super.destroy();
                this.m_datafs = null;
            }
        }
    }
}

/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as Vector3DT from "../../../vox/geom/Vector3";
import * as Color4T from "../../../vox/material/Color4";
import * as ShaderUniformProbeT from "../../../vox/material/ShaderUniformProbe";

import Vector3D = Vector3DT.vox.geom.Vector3D;
import Color4 = Color4T.vox.material.Color4;
import ShaderUniformProbe = ShaderUniformProbeT.vox.material.ShaderUniformProbe;
export namespace voxvat
{
    export namespace demo
    {
        export namespace light
        {       
            export class ParalLightData
            {
                private static s_lightPosData:Float32Array = new Float32Array(16 * 4);
                private static s_lightRadiusData:Float32Array = new Float32Array(16);
                private static s_lightParamData:Float32Array = new Float32Array(33 * 4);
                private static s_uProbe:ShaderUniformProbe = null;
                private static s_lrk:number = 256.0 / 5.0;
                constructor()
                {
                }
                static getUProbe():ShaderUniformProbe
                {
                    return ParalLightData.s_uProbe;
                }
                
				static CalcLightRadius(linear:number,quadratic:number,lightMax:number = 1.0):number
				{
					let constant:number = 1.0;
					return (-linear + Math.sqrt(linear * linear - 4.0 * quadratic * (constant - ParalLightData.s_lrk * lightMax)))
						/ (2.0 * quadratic);
				}
                //0.5,0.6, 16.0,0.0
                static SetLightFactor(p0:number,p1:number,p2:number, p3:number):void
                {
                    ParalLightData.s_lightParamData[0] = p0;
                    ParalLightData.s_lightParamData[1] = p1;
                    ParalLightData.s_lightParamData[2] = p2;
                    ParalLightData.s_lightParamData[3] = p3;
                }
                
                static SetRadiusAt(pr:number, i:number):void
                {
                    ParalLightData.s_lightRadiusData[i] = pr;
                }
                static SetLightPosAt(px:number,py:number,pz:number, i:number):void
                {
                    i *= 4;
                    ParalLightData.s_lightPosData[i++] = px;
                    ParalLightData.s_lightPosData[i++] = py;
                    ParalLightData.s_lightPosData[i++] = pz;
                    ParalLightData.s_lightPosData[i] = 1.0;
                }
                
                static GetLightPosAt(pv:Vector3D, i:number):void
                {
                    i *= 4;
                    pv.x = ParalLightData.s_lightPosData[i++];
                    pv.y = ParalLightData.s_lightPosData[i++];
                    pv.z = ParalLightData.s_lightPosData[i++];
                }
                static SetLightColorAt(pr:number,pg:number,pb:number, i:number):void
                {
                    i = (i * 2 + 1) * 4;
                    ParalLightData.s_lightParamData[i++] = pr;
                    ParalLightData.s_lightParamData[i++] = pg;
                    ParalLightData.s_lightParamData[i++] = pb;
                    ParalLightData.s_lightParamData[i] = 1.0;
                }
                static GetLightColorAt(color:Color4, i:number):void
                {
                    i = (i * 2 + 1) * 4;
                    color.r = ParalLightData.s_lightParamData[i++];
                    color.g = ParalLightData.s_lightParamData[i++];
                    color.b = ParalLightData.s_lightParamData[i++];
                }
                static SetLightParamAt(p0:number,p1:number,p2:number, i:number):void
                {
                    i = (i * 2 + 2) * 4;
                    ParalLightData.s_lightParamData[i++] = p0;
                    ParalLightData.s_lightParamData[i++] = p1;
                    ParalLightData.s_lightParamData[i++] = p2;
                    ParalLightData.s_lightParamData[i] = 1.0;
                }
                static Update():void
                {
                    if(ParalLightData.s_uProbe == null)
                    {
                        ParalLightData.s_uProbe = new ShaderUniformProbe();
                        ParalLightData.s_uProbe.bindSlotAt( 0 );
                        ParalLightData.s_uProbe.addVec4Data(ParalLightData.s_lightPosData, 16);
                        ParalLightData.s_uProbe.addVec4Data(ParalLightData.s_lightParamData, 33);
                    }
                    ParalLightData.s_uProbe.update();
                }
            }
        }
    }
}
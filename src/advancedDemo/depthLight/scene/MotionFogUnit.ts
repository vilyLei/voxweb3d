/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import * as Vector3DT from "../../../vox/math/Vector3D";
//import * as Color4T from "../../../vox/material/Color4";
import * as FogUnitT from "../../../advancedDemo/depthLight/scene/FogUnit";

import Vector3D = Vector3DT.vox.math.Vector3D;
import FogUnit = FogUnitT.advancedDemo.depthLight.scene.FogUnit;

export namespace advancedDemo
{
    export namespace depthLight
    {
        export namespace scene
        {
            export class MotionFogUnit extends FogUnit
            {
                constructor()
                {
                    super();
                }
                fogFactorM:any = null;
                spdV:Vector3D = new Vector3D(1.0, 0.0, 0.0);
                lifeTime:number = 150.0;
                lifeBase:number = 100.0;
                runBegin():void
                {

                }
                run():void
                {
                    if(this.lifeTime > 0)
                    {
                        this.pos.addBy( this.spdV );
                        
                        --this.lifeTime;
                        if(this.lifeTime < this.lifeBase)
                        {
                            if(this.lifeTime < 0)
                            {
                                this.lifeTime = 0;
                                this.m_isAlive = false;
                            }
                            let k:number = this.lifeTime / this.lifeBase;
                            if(this.fogFactorM != null)
                            {
                                this.fogFactorM.setDensity(k);
                            }
                        }
                    }
                }
            }
        }
    }
}
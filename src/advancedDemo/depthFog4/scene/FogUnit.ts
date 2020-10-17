/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as Vector3DT from "../../../vox/geom/Vector3";
import * as Color4T from "../../../vox/material/Color4";
import * as FogSphGeomFactor2MaterialT from "../../../advancedDemo/depthFog4/material/FogSphGeomFactor2Material";

import Vector3D = Vector3DT.vox.geom.Vector3D;
import Color4 = Color4T.vox.material.Color4;
import FogSphGeomFactor2Material = FogSphGeomFactor2MaterialT.advancedDemo.depthFog4.material.FogSphGeomFactor2Material;

export namespace advancedDemo
{
    export namespace depthFog4
    {
        export namespace scene
        {
        export class FogUnit
        {
            constructor()
            {
            }

            fogFactorM:FogSphGeomFactor2Material;
            factorColor:Color4 = new Color4();
            fogColor:Color4 = new Color4();
            pos:Vector3D = new Vector3D();
            rstate:number = 0;
            radius:number = 1000.0;
            protected m_isAlive:boolean = true;
            isAlive():boolean
            {
                return this.m_isAlive;
            }
            initRandom(baseRadius:number,range:number):void
            {
                this.radius = (0.2 + Math.random()) * baseRadius;
                this.fogColor.randomRGB(2.0);
                this.factorColor.randomRGB(2.0);
                let halfR:number = range * 0.5;
                this.pos.setXYZ(Math.random() * range - halfR,Math.random() * range - halfR,Math.random() * range - halfR);              
            }
            runBegin():void
            {
                
            }
            run():void
            {
                
            }
        }
    }
    }
}
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as MathConstT from "../../vox/math/MathConst";
import * as Vector3T from "../../vox/math/Vector3D";
import * as DisplayEntityT from "../../vox/entity/DisplayEntity";

import MathConst = MathConstT.vox.math.MathConst;
import Vector3D = Vector3T.vox.math.Vector3D;
import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;

export namespace app
{
    export namespace robot
    {
        export class RedRole
        {
            radius:number = 50.0;
            position:Vector3D = new Vector3D();
            dispEntity:DisplayEntity = null;

            private m_changed:boolean = true;

            constructor()
            {
            }
            setPosition(pv:Vector3D):void
            {
                this.position.copyFrom(pv);
                //this.dispEntity.setPosition(this.position);
                this.m_changed = true;
            }
            setPosXYZ(px:number,py:number,pz:number):void
            {
                this.position.setXYZ(px,py,pz);
                //this.dispEntity.setPosition(this.position);
                this.m_changed = true;
            }
            run():void
            {
                if(this.dispEntity != null)
                {
                    if(this.m_changed)
                    {
                        this.dispEntity.setPosition(this.position);
                        this.dispEntity.update();
                        this.m_changed = false;
                    }
                }
            }
        }
    }
}
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as MathConstT from "../../vox/math/MathConst";
import * as Vector3T from "../../vox/math/Vector3D";
import * as DisplayEntityT from "../../vox/entity/DisplayEntity";
import * as IAttackDstT from "../../app/robot/IAttackDst";
import * as CampTypeT from "../../app/robot/Camp";

import MathConst = MathConstT.vox.math.MathConst;
import Vector3D = Vector3T.vox.math.Vector3D;
import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import IAttackDst = IAttackDstT.app.robot.IAttackDst;
import CampType = CampTypeT.app.robot.CampType;

export namespace app
{
    export namespace robot
    {
        export class RedRole implements IAttackDst
        {
            campType:CampType = CampType.Red;
            lifeTime:number = 100;
            radius:number = 50.0;

            attackPosOffset:Vector3D = new Vector3D(0.0,50.0,0.0);
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
            
            attackTest():boolean
            {
                return true;
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
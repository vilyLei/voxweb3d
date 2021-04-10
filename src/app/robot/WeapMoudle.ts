/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as MathConstT from "../../vox/math/MathConst";
import * as Vector3T from "../../vox/math/Vector3D";
import * as RendererSceneT from "../../vox/scene/RendererScene";
import * as BulEntityT from "../../app/robot/BulEntity";
import * as IAttackDstT from "../../app/robot/IAttackDst";
import * as CampTypeT from "../../app/robot/Camp";

import MathConst = MathConstT.vox.math.MathConst;
import Vector3D = Vector3T.vox.math.Vector3D;
import RendererScene = RendererSceneT.vox.scene.RendererScene;
import BulEntity = BulEntityT.app.robot.BulEntity;
import IAttackDst = IAttackDstT.app.robot.IAttackDst;
import CampType = CampTypeT.app.robot.CampType;

export namespace app
{
    export namespace robot
    {
        export class WeapMoudle
        {
            private m_rsc:RendererScene = null;
            private m_freePool:BulEntity[] = [];
            private m_bulList:BulEntity[] = [];
            constructor(rsc:RendererScene)
            {
                this.m_rsc = rsc;
            }
            createAtt(type:number,pos0:Vector3D,pos1:Vector3D,attDst:IAttackDst,campType:CampType):void
            {
                let bul:BulEntity;
                if(this.m_bulList.length > 0)
                {
                    bul = this.m_bulList.pop();
                    bul.reset();
                }
                else
                {
                    bul = new BulEntity(this.m_rsc);
                    bul.initialize(0);
                }
                bul.setPosParam(pos0, pos1, attDst,campType);
                this.m_bulList.push(bul);
            }
            run():void
            {
                let bul:BulEntity;
                for(let i:number = 0, il:number = this.m_bulList.length; i < il; ++i)
                {
                    bul = this.m_bulList[i];
                    bul.run();
                    if(bul.isHiding())
                    {
                        this.m_bulList.splice(i,1);
                        i--;
                        il--;
                        this.m_bulList.push(bul);
                    }
                }
            }
        }
    }
}
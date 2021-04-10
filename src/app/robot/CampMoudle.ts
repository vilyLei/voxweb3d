/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as MathConstT from "../../vox/math/MathConst";
import * as Vector3T from "../../vox/math/Vector3D";
import * as RendererSceneT from "../../vox/scene/RendererScene";
import * as AttackDataPoolT from "../../app/robot/AttackDataPool";
import * as TriggerDataT from "../../app/robot/TriggerData";
import * as CampTypeT from "../../app/robot/Camp";
import * as RedCampT from "../../app/robot/RedCamp";
import * as BlueCampT from "../../app/robot/BlueCamp";
import * as AssetsModuleT from "../../app/robot/assets/AssetsModule";

import * as TextureProxyT from "../../vox/texture/TextureProxy";
import * as EruptionSmokePoolT from "../../particle/effect/EruptionSmokePool";


import MathConst = MathConstT.vox.math.MathConst;
import Vector3D = Vector3T.vox.math.Vector3D;
import RendererScene = RendererSceneT.vox.scene.RendererScene;
import AttackDataPool = AttackDataPoolT.app.robot.AttackDataPool;
import TriggerData = TriggerDataT.app.robot.TriggerData;
import CampType = CampTypeT.app.robot.CampType;
import RedCamp = RedCampT.app.robot.RedCamp;
import BlueCamp = BlueCampT.app.robot.BlueCamp;
import AssetsModule = AssetsModuleT.app.robot.assets.AssetsModule;

import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import EruptionSmokePool = EruptionSmokePoolT.particle.effect.EruptionSmokePool;

export namespace app
{
    export namespace robot
    {
        export class CampMoudle
        {
            private m_rsc:RendererScene = null;
            private m_eff1Pool:EruptionSmokePool = null;

            redCamp:RedCamp = new RedCamp();
            blueCamp:BlueCamp = new BlueCamp();

            constructor(){}

            initialize(rsc:RendererScene):void
            {
                this.m_rsc = rsc;
                
                if(this.m_eff1Pool == null)
                {
                    let texture:TextureProxy = AssetsModule.GetImageTexByUrl("static/assets/xulie_02_07.png");
                    //let colorTexture:TextureProxy = AssetsModule.GetImageTexByUrl("static/assets/stones_02.png");
                    //let colorTexture:TextureProxy = AssetsModule.GetImageTexByUrl("static/assets/warter_01.jpg");
                    //let colorTexture:TextureProxy = AssetsModule.GetImageTexByUrl("static/assets/color_01.jpg");
                    let colorTexture:TextureProxy = AssetsModule.GetImageTexByUrl("static/assets/color_05.jpg");
                    //let colorTexture:TextureProxy = AssetsModule.GetImageTexByUrl("static/assets/color_06.jpg");
                    //let colorTexture:TextureProxy = AssetsModule.GetImageTexByUrl("static/assets/RandomNoiseB.png");
                    this.m_eff1Pool = new EruptionSmokePool();
                    this.m_eff1Pool.initialize(this.m_rsc,1, 10, texture, colorTexture, true);
                    this.m_eff1Pool.appendEffectSrc(20,true);
                    this.m_eff1Pool.appendEffectSrc(8,true);
                    this.m_eff1Pool.appendEffectSrc(10,true);
                    this.m_eff1Pool.appendEffectSrc(10,true);
                    this.m_eff1Pool.appendEffectSrc(10,true);

                    this.m_eff1Pool.appendEffect(null,null);
                    this.m_eff1Pool.appendEffect(null,null);
                    this.m_eff1Pool.appendEffect(null,null);
                    this.m_eff1Pool.appendEffect(null,null);
                    this.m_eff1Pool.appendEffect(null,null);
                }
            }
            run():void
            {
                let tdatas:TriggerData[] = AttackDataPool.GetInstance().dataList;
                let len:number = tdatas.length;
                //console.log("tdatas.length: ",tdatas.length);
                if(len > 0)
                {
                    let tdata:TriggerData;
                    for(;len > 0;)
                    {
                        tdata = tdatas.pop();
                        if(tdata.attackDst != null)
                        {
                            tdata.attackDst.consume(tdata.value);
                        }
                        //console.log("tdata.campType != CampType.Red: ",tdata.campType != CampType.Red);
                        // 可以产生各种效果和相关动作了
                        //console.log("tdata.dstPos: ",tdata.dstPos);
                        this.m_eff1Pool.createEffect(tdata.dstPos);
                        
                        --len;
                    }
                }
                this.m_eff1Pool.run();
            }
        }
    }
}
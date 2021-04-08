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

import * as TextureProxyT from "../../vox/texture/TextureProxy";
import * as TextureConstT from "../../vox/texture/TextureConst";
import * as ImageTextureLoaderT from "../../vox/texture/ImageTextureLoader";
import * as EruptionSmokePoolT from "../../particle/effect/EruptionSmokePool";
import * as Axis3DEntityT from "../../vox/entity/Axis3DEntity";

import MathConst = MathConstT.vox.math.MathConst;
import Vector3D = Vector3T.vox.math.Vector3D;
import RendererScene = RendererSceneT.vox.scene.RendererScene;
import AttackDataPool = AttackDataPoolT.app.robot.AttackDataPool;
import TriggerData = TriggerDataT.app.robot.TriggerData;
import CampType = CampTypeT.app.robot.CampType;
import RedCamp = RedCampT.app.robot.RedCamp;
import BlueCamp = BlueCampT.app.robot.BlueCamp;

import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TextureConst = TextureConstT.vox.texture.TextureConst;
import ImageTextureLoader = ImageTextureLoaderT.vox.texture.ImageTextureLoader;
import EruptionSmokePool = EruptionSmokePoolT.particle.effect.EruptionSmokePool;
import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
export namespace app
{
    export namespace robot
    {
        export class CampMoudle
        {
            private m_rsc:RendererScene = null;
            private m_eff1Pool:EruptionSmokePool = null;

            texLoader:ImageTextureLoader = null;

            redCamp:RedCamp = new RedCamp();
            blueCamp:BlueCamp = new BlueCamp();
            constructor()
            {
                
            }
            getImageTexByUrl(purl:string,wrapRepeat:boolean = true,mipmapEnabled = true):TextureProxy
            {
                let ptex:TextureProxy = this.texLoader.getImageTexByUrl(purl);
                ptex.mipmapEnabled = mipmapEnabled;
                if(wrapRepeat)ptex.setWrap(TextureConst.WRAP_REPEAT);
                return ptex;
            }
            initialize(rsc:RendererScene):void
            {
                this.m_rsc = rsc;

                
                if(this.m_eff1Pool == null)
                {
                    let texture:TextureProxy = this.getImageTexByUrl("static/assets/xulie_02_07.png");
                    //let colorTexture:TextureProxy = this.getImageTexByUrl("static/assets/stones_02.png");
                    //let colorTexture:TextureProxy = this.getImageTexByUrl("static/assets/warter_01.jpg");
                    //let colorTexture:TextureProxy = this.getImageTexByUrl("static/assets/color_01.jpg");
                    //let colorTexture:TextureProxy = this.getImageTexByUrl("static/assets/color_05.jpg");
                    let colorTexture:TextureProxy = this.getImageTexByUrl("static/assets/color_06.jpg");
                    //let colorTexture:TextureProxy = this.getImageTexByUrl("static/assets/RandomNoiseB.png");
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
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererScene from "../../../vox/scene/RendererScene";
import AttackDataPool from "../../../app/robot/scene/AttackDataPool";
import TriggerData from "../../../app/robot/TriggerData";
import RedCamp from "../../../app/robot/camp/RedCamp";
import BlueCamp from "../../../app/robot/camp/BlueCamp";
import AssetsModule from "../../../app/robot/assets/AssetsModule";

import TextureProxy from "../../../vox/texture/TextureProxy";
import EruptionSmokePool from "../../../particle/effect/EruptionSmokePool";
import { MaterialPipeType } from "../../../vox/material/pipeline/MaterialPipeType";

export default class CampMoudle {
    private m_rsc: RendererScene = null;
    private m_eff1Pool: EruptionSmokePool = null;

    redCamp: RedCamp = new RedCamp();
    //blueCamp: BlueCamp = new BlueCamp();

    effectRenderProcessIndex: number = 4;
    constructor() { }

    initialize(rsc: RendererScene): void {
        if (this.m_rsc == null) {
            this.m_rsc = rsc;

            this.redCamp.initialize(rsc);

            let texture: TextureProxy = AssetsModule.GetImageTexByUrl("static/assets/xulie_02_07.png");
            //let colorTexture:TextureProxy = AssetsModule.GetImageTexByUrl("static/assets/stones_02.png");
            //let colorTexture:TextureProxy = AssetsModule.GetImageTexByUrl("static/assets/warter_01.jpg");
            //let colorTexture:TextureProxy = AssetsModule.GetImageTexByUrl("static/assets/color_01.jpg");
            let colorTexture: TextureProxy = AssetsModule.GetImageTexByUrl("static/assets/color_05.jpg");
            //let colorTexture:TextureProxy = AssetsModule.GetImageTexByUrl("static/assets/color_06.jpg");
            //let colorTexture:TextureProxy = AssetsModule.GetImageTexByUrl("static/assets/RandomNoiseB.png");
            this.m_eff1Pool = new EruptionSmokePool();
            this.m_eff1Pool.materialPipeline = AssetsModule.GetMaterialPipeline();
            this.m_eff1Pool.pipeTypes = [ MaterialPipeType.FOG_EXP2 ];
            
            this.m_eff1Pool.initialize(this.m_rsc, this.effectRenderProcessIndex, 10, texture, colorTexture, true);
            this.m_eff1Pool.appendEffectSrc(20, true);
            this.m_eff1Pool.appendEffectSrc(8, true);
            this.m_eff1Pool.appendEffectSrc(10, true);
            this.m_eff1Pool.appendEffectSrc(10, true);
            this.m_eff1Pool.appendEffectSrc(10, true);

            this.m_eff1Pool.appendEffect(null, null);
            this.m_eff1Pool.appendEffect(null, null);
            this.m_eff1Pool.appendEffect(null, null);
            this.m_eff1Pool.appendEffect(null, null);
            this.m_eff1Pool.appendEffect(null, null);
        }
    }
    run(): void {
        if (this.m_eff1Pool != null) {
            let tdatas: TriggerData[] = AttackDataPool.GetInstance().dataList;
            let len: number = tdatas.length;
            //console.log("tdatas.length: ",tdatas.length);
            if (len > 0) {
                let tdata: TriggerData;
                for (; len > 0;) {
                    tdata = tdatas.pop();
                    if (tdata.attackDst != null) {
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
            this.redCamp.run();
        }
    }
}
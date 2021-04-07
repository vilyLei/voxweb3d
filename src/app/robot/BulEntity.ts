/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as MathConstT from "../../vox/math/MathConst";
import * as Vector3T from "../../vox/math/Vector3D";
import * as TextureProxyT from "../../vox/texture/TextureProxy";
import * as TextureConstT from "../../vox/texture/TextureConst";
import * as DisplayEntityT from "../../vox/entity/DisplayEntity";
import * as RendererSceneT from "../../vox/scene/RendererScene";
import * as BillboardLine3DEntityT from "../../vox/entity/BillboardLine3DEntity";
import * as ImageTextureLoaderT from "../../vox/texture/ImageTextureLoader";
import * as IAttackDstT from "../../app/robot/IAttackDst";
import * as TriggerDataT from "../../app/robot/TriggerData";
import * as AttackDataPoolT from "../../app/robot/AttackDataPool";
import * as CampTypeT from "../../app/robot/Camp";

import MathConst = MathConstT.vox.math.MathConst;
import Vector3D = Vector3T.vox.math.Vector3D;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TextureConst = TextureConstT.vox.texture.TextureConst;
import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import RendererScene = RendererSceneT.vox.scene.RendererScene;
import BillboardLine3DEntity = BillboardLine3DEntityT.vox.entity.BillboardLine3DEntity;
import ImageTextureLoader = ImageTextureLoaderT.vox.texture.ImageTextureLoader;
import IAttackDst = IAttackDstT.app.robot.IAttackDst;
import TriggerData = TriggerDataT.app.robot.TriggerData;
import AttackDataPool = AttackDataPoolT.app.robot.AttackDataPool;
import CampType = CampTypeT.app.robot.CampType;

export namespace app
{
    export namespace robot
    {
        export class BulEntity
        {
            private m_entity:BillboardLine3DEntity = null;
            private m_rsc:RendererScene = null;
            private m_fadeFactor:number = 1.1;
            private m_uoffset:number = 0.0;
            private m_beginPos:Vector3D = new Vector3D();
            private m_endPos:Vector3D = new Vector3D();
            private m_triggerData:TriggerData = null;// = new TriggerData();
            //private m_triggerTime:number = 2;
            texLoader:ImageTextureLoader = null;
            constructor(rsc:RendererScene)
            {
                this.m_rsc = rsc;
            }
            private getImageTexByUrl(purl:string,wrapRepeat:boolean = true,mipmapEnabled = true):TextureProxy
            {
                let ptex:TextureProxy = this.texLoader.getImageTexByUrl(purl);
                ptex.mipmapEnabled = mipmapEnabled;
                if(wrapRepeat)ptex.setWrap(TextureConst.WRAP_REPEAT);
                return ptex;
            }
            initialize(type:number):void
            {
                if(this.m_entity == null)
                {
                    let billLine:BillboardLine3DEntity = new BillboardLine3DEntity();
                    billLine.toBrightnessBlend();
                    billLine.initialize([this.getImageTexByUrl("static/assets/flare_core_01.jpg")]);
                    //billLine.initialize([this.getImageTexByUrl("static/assets/color_02.jpg")]);
                    //billLine.setLineWidth(12.0);
                    billLine.setLineWidth(20.0);
                    this.m_rsc.addEntity(billLine,1);
                    this.m_entity = billLine;
                    this.m_uoffset = 0.2;
                    this.m_entity.setUVOffset(this.m_uoffset,0.0);
                }
            }
            setPosParam(pos0:Vector3D,pos1:Vector3D,attDst:IAttackDst,campType:CampType):void
            {
                let billLine:BillboardLine3DEntity = this.m_entity;
                this.m_endPos.subVecsTo(pos1,pos0);
                if(this.m_endPos.getLengthSquared() > 40000.0)
                {
                    this.m_endPos.normalize();
                    this.m_endPos.scaleBy(200.0);
                }
                billLine.setBeginAndEndPos(this.m_beginPos, this.m_endPos);
                billLine.setPosition( pos0 );
                billLine.update();

                if(this.m_triggerData == null)
                {
                    this.m_triggerData = new TriggerData();
                    this.m_triggerData.campType = campType;
                    this.m_triggerData.attackDst = attDst;
                    this.m_triggerData.dstPos.copyFrom(pos1);
                }
            }
            run():void
            {
                if(this.m_entity != null)
                {
                    if(this.m_fadeFactor > 0.1)
                    {
                        this.m_entity.setFadeFactor(this.m_fadeFactor);
                        this.m_fadeFactor -= 0.3;
                        this.m_uoffset += 0.2;
                        this.m_entity.setUVOffset(this.m_uoffset,0.0);
                        if(this.m_fadeFactor < 0.1)
                        {
                            this.m_entity.setVisible(false);
                        }
                        if(this.m_triggerData != null && this.m_triggerData.trigger())
                        {
                            AttackDataPool.GetInstance().addTriggerData(this.m_triggerData);
                            this.m_triggerData = null;
                        }
                    }
                }
            }
            isHiding():boolean
            {
                return this.m_fadeFactor < 0.1;
            }
            reset():void
            {
                //this.m_triggerTime = 2;
                this.m_fadeFactor = 1.1;
                this.m_entity.setVisible(true);
                this.m_uoffset = 0.2;
                this.m_entity.setUVOffset(this.m_uoffset,0.0);
            }
            destroy():void
            {
                this.m_rsc = null;
                this.texLoader = null;
                this.m_entity = null;
            }
        }
    }
}
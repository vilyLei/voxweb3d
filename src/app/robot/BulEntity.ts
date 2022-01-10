/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import RendererScene from "../../vox/scene/RendererScene";
import BillboardLine3DEntity from "../../vox/entity/BillboardLine3DEntity";
import IAttackDst from "../../app/robot/attack/IAttackDst";
import TriggerData from "../../app/robot/TriggerData";
import AttackDataPool from "../../app/robot/scene/AttackDataPool";
import { CampType } from "../../app/robot/camp/Camp";
import AssetsModule from "../../app/robot/assets/AssetsModule";
import { RenderModule } from "./scene/RenderModule";

export default class BulEntity {
    private m_entity: BillboardLine3DEntity = null;
    private m_rsc: RendererScene = null;
    private m_fadeFactor: number = 1.1;
    private m_uoffset: number = 0.0;
    private m_beginPos: Vector3D = new Vector3D();
    private m_endPos: Vector3D = new Vector3D();
    private m_triggerData: TriggerData = null;
    
    constructor(rsc: RendererScene) {
        this.m_rsc = rsc;
    }
    initialize(type: number): void {
        if (this.m_entity == null) {
            
            let billLine: BillboardLine3DEntity = new BillboardLine3DEntity();
            AssetsModule.UseFog(billLine);

            billLine.toBrightnessBlend();
            billLine.initialize([AssetsModule.GetBulTex(type)]);
            //billLine.initialize([this.getImageTexByUrl("static/assets/color_02.jpg")]);
            //billLine.setLineWidth(12.0);
            billLine.setLineWidth(20.0);
            this.m_rsc.addEntity(billLine, RenderModule.GetInstance().particleLayerIndex);
            this.m_entity = billLine;
            this.m_uoffset = 0.2;
            this.m_entity.setUVOffset(this.m_uoffset, 0.0);
        }
    }
    setPosParam(pos0: Vector3D, pos1: Vector3D, attDst: IAttackDst, campType: CampType): void {

        let billLine: BillboardLine3DEntity = this.m_entity;
        this.m_endPos.subVecsTo(pos1, pos0);
        if (this.m_endPos.getLengthSquared() > 40000.0) {
            this.m_endPos.normalize();
            this.m_endPos.scaleBy(200.0);
        }
        billLine.setBeginAndEndPos(this.m_beginPos, this.m_endPos);
        billLine.setPosition(pos0);
        billLine.update();

        if (this.m_triggerData == null) {
            this.m_triggerData = new TriggerData();
            this.m_triggerData.campType = campType;
            this.m_triggerData.attackDst = attDst;
            this.m_triggerData.dstPos.copyFrom(pos1);
        }
        //this.m_entity.setVisible(false);
    }
    run(): void {
        if (this.m_entity != null) {
            if (this.m_fadeFactor > 0.1) {
                this.m_entity.setFadeFactor(this.m_fadeFactor);
                this.m_fadeFactor -= 0.3;
                this.m_uoffset += 0.2;
                this.m_entity.setUVOffset(this.m_uoffset, 0.0);
                if (this.m_fadeFactor < 0.1) {
                    this.m_entity.setVisible(false);
                }
                if (this.m_triggerData != null && this.m_triggerData.trigger()) {
                    AttackDataPool.GetInstance().addTriggerData(this.m_triggerData);
                    this.m_triggerData = null;
                }
            }
        }
    }
    isHiding(): boolean {
        return this.m_fadeFactor < 0.1;
    }
    reset(): void {
        //this.m_triggerTime = 2;
        this.m_fadeFactor = 1.1;
        this.m_entity.setVisible(true);
        this.m_uoffset = 0.2;
        this.m_entity.setUVOffset(this.m_uoffset, 0.0);
    }
    destroy(): void {
        this.m_rsc = null;
        this.m_entity = null;
    }
}
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import Billboard3DFlowEntity from "../../vox/entity/Billboard3DFlowEntity";
import TextureProxy from "../../vox/texture/TextureProxy";
import IParticleEffect from "../../particle/effect/IParticleEffect";
import RendererState from "../../../src/vox/render/RendererState";
import { IMaterialPipeline } from "../../vox/material/pipeline/IMaterialPipeline";
import { MaterialPipeType } from "../../vox/material/pipeline/MaterialPipeType";

export default class EruptionEffect implements IParticleEffect {
    private m_clipMixEnabled: boolean = false;

    flameEntity: Billboard3DFlowEntity = null;
    solidEntity: Billboard3DFlowEntity = null;
    materialPipeline: IMaterialPipeline = null;
    pipeTypes: MaterialPipeType[] = null;
    constructor() { }
    initialize(flameTotal: number, solidTotal: number, flameTexture: TextureProxy, solidTexture: TextureProxy, clipMixEnabled: boolean = false): void {
        if (this.solidEntity == null) {
            this.m_clipMixEnabled = clipMixEnabled;
            this.initFlame(null, flameTotal, flameTexture);
            this.initSolid(null, solidTotal, solidTexture);
        }
    }
    initializeFrom(eruptionEff: EruptionEffect, flameTexture: TextureProxy, solidTexture: TextureProxy, clipMixEnabled: boolean = false): void {
        if (eruptionEff != null && this.solidEntity == null) {
            this.m_clipMixEnabled = clipMixEnabled;
            this.initFlame(eruptionEff.flameEntity, 50, flameTexture);
            this.initSolid(eruptionEff.solidEntity, 50, solidTexture);
        }
    }
    private initSolid(srcSolidEntity: Billboard3DFlowEntity, total: number, tex: TextureProxy): void {
        let size: number = 100;
        let params: number[][] = [
            [0.0, 0.0, 0.5, 0.5],
            [0.5, 0.0, 0.5, 0.5],
            [0.0, 0.5, 0.5, 0.5],
            [0.5, 0.5, 0.5, 0.5]
        ];
        let entity: Billboard3DFlowEntity = new Billboard3DFlowEntity();

        entity.setMaterialPipeline(this.materialPipeline);
        entity.pipeTypes = this.pipeTypes;

        entity.premultiplyAlpha = tex.premultiplyAlpha;
        if (srcSolidEntity != null) {
            entity.copyMeshFrom(srcSolidEntity);
            entity.createGroup(total);
        }
        else {
            entity.createGroup(total);
            let pv: Vector3D = new Vector3D();
            for (let i: number = 0; i < total; ++i) {
                size = Math.random() * Math.random() * Math.random() * 180 + 10.0;
                entity.setSizeAndScaleAt(i, size, size, 0.2, 1.0);
                let uvparam: number[] = params[Math.floor((params.length - 1) * Math.random() + 0.5)];
                entity.setUVRectAt(i, uvparam[0], uvparam[1], uvparam[2], uvparam[3]);
                entity.setTimeAt(i, 50.0 * Math.random() + 150, 0.1, 0.7, Math.random() * 5);
                entity.setBrightnessAt(i, 1.0);
                entity.setTimeSpeedAt(i, Math.random() * 1.0 + 0.5);
                pv.setTo(Math.random() * 50.0 - 25.0, Math.random() * 10.0 + 10.0, Math.random() * 50.0 - 25.0);
                entity.setPositionAt(i, pv.x, pv.y, pv.z);
                entity.setAccelerationAt(i, Math.random() * 0.01 - 0.005, -0.004, 0.0);
                pv.normalize();
                pv.scaleBy((Math.random() * 1.0 + 1.5));
                entity.setVelocityAt(i, pv.x, pv.y, pv.z);
            }
        }
        entity.setPlayParam(true, true, this.m_clipMixEnabled, true);
        entity.initialize(false, true, false, [tex]);
        entity.setSpdScaleMax(4.0, 1.5);
        if (tex.premultiplyAlpha) {
            entity.setRenderState(RendererState.BACK_ALPHA_ADD_ALWAYS_STATE);
        }
        else {
            entity.toTransparentBlend();
        }
        this.solidEntity = entity;
    }

    private initFlame(srcFlameEntity: Billboard3DFlowEntity, total: number, tex: TextureProxy): void {
        let size: number = 100;
        let params: number[][] = [
            [0.0, 0.0, 0.5, 0.5],
            [0.5, 0.0, 0.5, 0.5],
            [0.0, 0.5, 0.5, 0.5],
            [0.5, 0.5, 0.5, 0.5]
        ];

        tex.premultiplyAlpha = tex.premultiplyAlpha;
        let entity: Billboard3DFlowEntity = new Billboard3DFlowEntity();
        entity.setMaterialPipeline(this.materialPipeline);
        entity.pipeTypes = this.pipeTypes;
        entity.premultiplyAlpha = tex.premultiplyAlpha;
        entity.toBrightnessBlend();
        if (srcFlameEntity != null) {
            entity.copyMeshFrom(srcFlameEntity);
            entity.createGroup(total);
        }
        else {
            entity.createGroup(total);
            let pv: Vector3D = new Vector3D();
            for (let i: number = 0; i < total; ++i) {
                size = Math.random() * Math.random() * Math.random() * 180 + 10.0;
                entity.setSizeAndScaleAt(i, size, size, 0.5, 1.0);
                let uvparam: number[] = params[Math.floor((params.length - 1) * Math.random() + 0.5)];
                entity.setUVRectAt(i, uvparam[0], uvparam[1], uvparam[2], uvparam[3]);
                entity.setTimeAt(i, 50.0 * Math.random() + 100, 0.4, 0.6, Math.random() * 10);
                entity.setBrightnessAt(i, 1.0);
                entity.setTimeSpeedAt(i, Math.random() * 1.0 + 0.5); pv.setTo(Math.random() * 60.0 - 30.0, Math.random() * 50.0 + 10.0, Math.random() * 60.0 - 30.0);
                entity.setPositionAt(i, pv.x, pv.y, pv.z);
                entity.setAccelerationAt(i, 0.0, -0.01, 0.0);
                pv.normalize();
                pv.scaleBy((Math.random() * 2.0 + 0.8));
                entity.setVelocityAt(i, pv.x, pv.y, pv.z);
            }
        }
        entity.setPlayParam(true, false, this.m_clipMixEnabled);
        entity.initialize(true, false, false, [tex]);

        this.flameEntity = entity;
    }
    setTime(time: number): void {
        if (this.solidEntity != null) {
            this.solidEntity.setTime(time);
        }
        if (this.flameEntity != null) {
            this.flameEntity.setTime(time);
        }
    }
    updateTime(offsetTime: number): void {
        if (this.solidEntity != null) {
            this.solidEntity.updateTime(offsetTime);
        }
        if (this.flameEntity != null) {
            this.flameEntity.updateTime(offsetTime);
        }
    }
    setRotationXYZ(rx: number, ry: number, rz: number): void {
        if (this.solidEntity != null) {
            this.solidEntity.setRotationXYZ(rx, ry, rz);
        }
        if (this.flameEntity != null) {
            this.flameEntity.setRotationXYZ(rx, ry, rz);
        }
    }
    setXYZ(px: number, py: number, pz: number): void {
        if (this.solidEntity != null) {
            this.solidEntity.setXYZ(px, py, pz);
        }
        if (this.flameEntity != null) {
            this.flameEntity.setXYZ(px, py, pz);
        }
    }
    setPositionScale(scale: number): void {
        if (this.solidEntity != null) {
            this.solidEntity.setScaleXYZ(scale, scale, scale);
        }
        if (this.flameEntity != null) {
            this.flameEntity.setScaleXYZ(scale, scale, scale);
        }
    }
    setSizeScale(scale: number): void {
        if (this.solidEntity != null) {
            this.solidEntity.setScaleXY(scale, scale);
        }
        if (this.flameEntity != null) {
            this.flameEntity.setScaleXY(scale, scale);
        }
    }
    setPosition(position: Vector3D): void {
        if (this.solidEntity != null) {
            this.solidEntity.setPosition(position);
        }
        if (this.flameEntity != null) {
            this.flameEntity.setPosition(position);
        }
    }
    setVisible(visible: boolean): void {
        if (this.solidEntity != null) {
            this.solidEntity.setVisible(visible);
        }
        if (this.flameEntity != null) {
            this.flameEntity.setVisible(visible);
        }
    }
    update(): void {
        if (this.solidEntity != null) {
            this.solidEntity.update();
        }
        if (this.flameEntity != null) {
            this.flameEntity.update();
        }
    }
    isAwake(): boolean {
        if (this.solidEntity != null) {
            return this.solidEntity.isAwake() || (this.flameEntity != null && this.flameEntity.isAwake());
        }
        return false;
    }
    destory(): void {

        this.materialPipeline = null;
        this.pipeTypes = null;
    }
}
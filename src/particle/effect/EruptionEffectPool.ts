/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import TextureProxy from "../../vox/texture/TextureProxy";
import EruptionEffect from "../../particle/effect/EruptionEffect";
import ParticleEffectPool from "../../particle/effect/ParticleEffectPool";
import IRenderer from "../../vox/scene/IRenderer";
import { IMaterialPipeline } from "../../vox/material/pipeline/IMaterialPipeline";
import { MaterialPipeType } from "../../vox/material/pipeline/MaterialPipeType";

export default class EruptionEffectPool extends ParticleEffectPool {
    private m_efSrcList: EruptionEffect[] = [];
    private m_flameTexture: TextureProxy = null;
    private m_solidTexture: TextureProxy = null;
    private m_clipMixEnabled: boolean = false;
    
    materialPipeline: IMaterialPipeline = null;
    pipeTypes: MaterialPipeType[] = null;
    depthOffset: number = 0.0;

    solidPremultiplyAlpha: boolean = false;
    flamePremultiplyAlpha: boolean = false;
    constructor() { super(); }

    initialize(renderer: IRenderer, processIndex: number, flameTotal: number, solidTotal: number, flameTexture: TextureProxy, solidTexture: TextureProxy, clipMixEnabled: boolean = false): void {
        if (this.m_renderer == null) {
            this.m_clipMixEnabled = clipMixEnabled;
            this.m_flameTexture = flameTexture;
            this.m_solidTexture = solidTexture;
            this.m_solidTexture.premultiplyAlpha = this.solidPremultiplyAlpha;
            this.m_flameTexture.premultiplyAlpha = this.flamePremultiplyAlpha;

            this.m_renderer = renderer;
            this.m_renderProcessI = processIndex;

            let efSrc: EruptionEffect = new EruptionEffect();
            efSrc.materialPipeline = this.materialPipeline;
            efSrc.pipeTypes = this.pipeTypes;
            efSrc.initialize(flameTotal, solidTotal, this.m_flameTexture, this.m_solidTexture, this.m_clipMixEnabled);
            efSrc.setDepthOffset( this.depthOffset );
            this.m_efSrcList.push(efSrc);
        }
    }

    appendEffectSrc(flameTotal: number, solidTotal: number, clipMixEnabled: boolean): void {
        let efSrc: EruptionEffect = new EruptionEffect();
        efSrc.materialPipeline = this.materialPipeline;
        efSrc.pipeTypes = this.pipeTypes;
        efSrc.initialize(flameTotal, solidTotal, this.m_flameTexture, this.m_solidTexture, clipMixEnabled);
        efSrc.setDepthOffset( this.depthOffset );
        this.m_efSrcList.push(efSrc);
    }
    appendEffect(flameTexture: TextureProxy, solidTexture: TextureProxy, srcIndex: number = -1): void {
        let eff: EruptionEffect = new EruptionEffect();
        eff.materialPipeline = this.materialPipeline;
        eff.pipeTypes = this.pipeTypes;
        if (flameTexture == null) flameTexture = this.m_flameTexture;
        if (solidTexture == null) solidTexture = this.m_solidTexture;
        let efSrc: EruptionEffect;
        if (srcIndex < 0) {
            efSrc = this.m_efSrcList[Math.floor((this.m_efSrcList.length - 0.5) * Math.random())];
        }
        else {
            srcIndex = srcIndex < this.m_efSrcList.length ? srcIndex : this.m_efSrcList.length - 1;
            efSrc = this.m_efSrcList[srcIndex];
        }
        //eff.initializeFrom(efSrc,texture,colorTexture, this.m_clipMixEnabled);
        efSrc.initializeFrom(efSrc, flameTexture, solidTexture, this.m_clipMixEnabled);
        this.m_freeEffList.push(eff);
        this.m_renderer.addEntity(eff.solidEntity, this.m_renderProcessI, false);
        this.m_renderer.addEntity(eff.flameEntity, this.m_renderProcessI, false);
        eff.setVisible(false);
        eff.setDepthOffset( this.depthOffset );

    }
    createEffect(pv: Vector3D): EruptionEffect {
        return this.createEffectWithTexture(pv, this.m_flameTexture, this.m_solidTexture);
    }
    createEffectWithTexture(pv: Vector3D, flameTexture: TextureProxy, solidTexture: TextureProxy): EruptionEffect {
        let eff: EruptionEffect;
        if (this.m_freeEffList.length < 1) {
            if (flameTexture == null) flameTexture = this.m_flameTexture;
            if (solidTexture == null) solidTexture = this.m_solidTexture;
            let efSrc: EruptionEffect = this.m_efSrcList[Math.floor((this.m_efSrcList.length - 0.5) * Math.random())];
            eff = new EruptionEffect();
            eff.materialPipeline = this.materialPipeline;
            eff.pipeTypes = this.pipeTypes;
            eff.initializeFrom(efSrc, flameTexture, solidTexture, this.m_clipMixEnabled);
            eff.setDepthOffset( this.depthOffset );
            this.m_renderer.addEntity(eff.solidEntity, this.m_renderProcessI, false);
            this.m_renderer.addEntity(eff.flameEntity, this.m_renderProcessI, false);
        }
        else {
            eff = this.m_freeEffList.pop() as EruptionEffect;
        }
        this.m_effList.push(eff);
        let scale: number = 1.0;
        eff.setVisible(true);
        eff.setTime(0.0);
        //  eff.setPositionScale(Math.random() * 0.3 + 0.5);
        //  eff.setSizeScale(0.3);
        eff.setPositionScale(0.5);
        //  eff.solidEntity.setRGBOffset3f(Math.random() * 0.2,Math.random() * 0.2,Math.random() * 0.2);
        eff.solidEntity.setRGB3f(Math.random() + 0.2, Math.random() + 0.2, Math.random() + 0.2);
        if (pv != null) {
            
            eff.setPosition(pv);
            pv.setXYZ(Math.random() + 0.2, Math.random() + 0.2, Math.random() + 0.2);
            pv.normalize();
            pv.scaleBy(2.5);
            
            scale = Math.random() * 0.4 + 0.4;
            eff.solidEntity.setScaleXY(scale, scale);
            eff.solidEntity.setAcceleration(Math.random() * 0.01 - 0.005, -Math.random() * 0.002, Math.random() * 0.01 - 0.005);
            eff.solidEntity.setRotationXYZ(0.0, Math.random() * 360.0, 0.0);
            
            if(eff.flameEntity != null) {
                eff.flameEntity.setRGBOffset3f(Math.random() * 2.0 - 1.0, Math.random() * 2.0 - 1.0, Math.random() * 2.0 - 1.0);
                eff.flameEntity.setRGB3f(pv.x, pv.y, pv.z);
                eff.flameEntity.setAcceleration(Math.random() * 0.01 - 0.005, Math.random() * 0.002 - 0.001, Math.random() * 0.01 - 0.005);
                eff.flameEntity.setRotationXYZ(0.0, Math.random() * 360.0, 0.0);
            }
        }
        eff.update();
        return eff;
    }
    destory(): void {

        this.materialPipeline = null;
        this.pipeTypes = null;
    }
}
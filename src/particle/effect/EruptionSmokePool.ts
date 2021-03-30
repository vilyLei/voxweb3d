/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as Vector3DT from "../../vox/math/Vector3D";
import * as TextureProxyT from "../../vox/texture/TextureProxy";
import * as EruptionSomkeT from "../../particle/effect/EruptionSmoke";
import * as ParticleEffectPoolT from "../../particle/effect/ParticleEffectPool";
import * as IRendererT from "../../vox/scene/IRenderer";

import Vector3D = Vector3DT.vox.math.Vector3D;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import EruptionSomke = EruptionSomkeT.particle.effect.EruptionSmoke;
import ParticleEffectPool = ParticleEffectPoolT.particle.effect.ParticleEffectPool;
import IRenderer = IRendererT.vox.scene.IRenderer;

export namespace particle
{
    export namespace effect
    {
        export class EruptionSmokePool extends ParticleEffectPool
        {
            private m_eruptionEfSrc:EruptionSomke = null;
            private m_texture:TextureProxy = null;
            private m_colorTexture:TextureProxy = null;
            private m_clipMixEnabled:boolean = false;
            constructor(){super();}

            initialize(renderer:IRenderer,processIndex:number,particleTotal:number, texture:TextureProxy,colorTexture:TextureProxy,clipMixEnabled:boolean = false):void
            {
                if(this.m_eruptionEfSrc == null)
                {
                    this.m_clipMixEnabled = clipMixEnabled;
                    this.m_texture = texture;
                    this.m_colorTexture = colorTexture;

                    this.m_renderer = renderer;                    
                    this.m_renderProcessI = processIndex;

                    this.m_eruptionEfSrc = new EruptionSomke();
                    this.m_eruptionEfSrc.initialize(particleTotal,texture,colorTexture);
                }
            }
            
            createEffect(pv:Vector3D):void
            {
                this.createEffectWithTexture(pv, this.m_texture,this.m_colorTexture);
            }
            createEffectWithTexture(pv:Vector3D,texture:TextureProxy,colorTexture:TextureProxy):void
            {
                let eff:EruptionSomke;
                if(this.m_freeEffList.length < 1)
                {
                    eff = new EruptionSomke();
                    eff.initializeFrom(this.m_eruptionEfSrc,texture,colorTexture, this.m_clipMixEnabled);
                    this.m_renderer.addEntity(eff.smokeEntity, this.m_renderProcessI, false);
                }
                else
                {
                    eff = this.m_freeEffList.pop() as EruptionSomke;
                }
                this.m_effList.push(eff);
                eff.setVisible(true);
                eff.setTime(0.0);
                //          eff.smokeEntity.setRGB3f(Math.random() + 0.2,Math.random() + 0.2,Math.random() + 0.2);
                if(pv != null)
                {
                    eff.setPosition(pv);
                    //  let scale:number = 1.0;
                    //  pv.setXYZ(Math.random() + 0.2,Math.random() + 0.2,Math.random() + 0.2);
                    //  pv.normalize();
                    //  pv.scaleBy(2.5);
                    //  eff.smokeEntity.setRGBOffset3f(Math.random() * 2.0 - 1.0,Math.random() * 2.0 - 1.0,Math.random() * 2.0 - 1.0);
                    //  scale = Math.random() * 0.4 + 0.4;
                    //  eff.smokeEntity.setScaleXY(scale,scale);
                    //  eff.smokeEntity.setAcceleration(Math.random() * 0.01 - 0.005,-Math.random() * 0.002,Math.random() * 0.01 - 0.005);
                    //  eff.smokeEntity.setRotationXYZ(0.0,Math.random() * 360.0,0.0);
                }
                eff.update();
            }
        }
    }
}
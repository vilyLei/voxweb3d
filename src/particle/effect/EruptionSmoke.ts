/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as Vector3DT from "../../vox/math/Vector3D";
import * as Billboard3DFlowEntityT from "../../vox/entity/Billboard3DFlowEntity";
import * as TextureProxyT from "../../vox/texture/TextureProxy";
import * as TextureConstT from "../../vox/texture/TextureConst";
import * as IParticleEffectT from "../../particle/effect/IParticleEffect";

import Vector3D = Vector3DT.vox.math.Vector3D;
import Billboard3DFlowEntity = Billboard3DFlowEntityT.vox.entity.Billboard3DFlowEntity;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TextureConst = TextureConstT.vox.texture.TextureConst;
import IParticleEffect = IParticleEffectT.particle.effect.IParticleEffect;


export namespace particle
{
    export namespace effect
    {
        export class EruptionSmoke implements IParticleEffect
        {
            private m_clipMixEnabled:boolean = false;
            smokeEntity:Billboard3DFlowEntity = null;
            constructor(){}
            initialize(particleTotal:number, texture:TextureProxy,colorTexture:TextureProxy,clipMixEnabled:boolean = false):void
            {
                if(this.smokeEntity == null && particleTotal > 0)
                {
                    this.m_clipMixEnabled = clipMixEnabled;
                    this.initSmoke(null,particleTotal,texture,colorTexture);
                }
            }
            initializeFrom(effect:EruptionSmoke, texture:TextureProxy,colorTexture:TextureProxy,clipMixEnabled:boolean = false):void
            {
                if(effect != null && this.smokeEntity == null)
                {
                    this.m_clipMixEnabled = clipMixEnabled;
                    this.initSmoke(effect.smokeEntity, 50,texture,colorTexture);
                }
            }
            private initSmoke(srcEntity:Billboard3DFlowEntity,total:number,tex:TextureProxy,offsetColorTex:TextureProxy):void
            {
                let entity:Billboard3DFlowEntity = new Billboard3DFlowEntity();
                if(srcEntity != null)
                {
                    entity.copyMeshFrom(srcEntity);
                    entity.createGroup(total);
                }
                else
                {
                    let size:number = 100;
                    entity.createGroup(total);
                    let pv:Vector3D = new Vector3D();
                    let uvparam:number[] = [0.0, 0.0, 1.0, 1.0];
                    for(let i:number = 0; i < total; ++i)
                    {
                        size = Math.random() * Math.random() * Math.random() * 180 + 10.0;
                        //entity.setSizeAndScaleAt(i,size,size,0.5,3.0);
                        entity.setSizeAndScaleAt(i,size,size,2.0,1.0);
                        entity.setUVRectAt(i, uvparam[0],uvparam[1],uvparam[2],uvparam[3]);
                        //entity.setTimeAt(i, 200.0 * Math.random() + 100, 0.4,0.6, i * 10);
                        //entity.setTimeAt(i, 100, 0.01,0.99, 0);
                        entity.setTimeAt(i, 50.0 * Math.random() + 80, 0.01,0.95, 0);
                        //entity.setTimeAt(i, 100, 0.4,0.6, 1.0);
                        //entity.setBrightnessAt(i,Math.random() * 0.8 + 0.8);
                        entity.setBrightnessAt(i,1.0);
                        entity.setTimeSpeedAt(i,Math.random() * 1.0 + 0.5);
                        //entity.setPositionAt(i,100.0,0.0,100.0);
                        //entity.setPositionAt(i, Math.random() * 500.0 - 250.0,Math.random() * 500.0 - 250.0, Math.random() * 500.0 - 250.0);
                        pv.setTo(Math.random() * 100.0 - 50.0,Math.random() * 50.0 + 50.0, Math.random() * 100.0 - 50.0);
                        pv.scaleBy(0.2);
                        entity.setPositionAt(i, pv.x,pv.y,pv.z);
                        //entity.setAccelerationAt(i,0.003,-0.004,0.0);
                        entity.setAccelerationAt(i,Math.random() * 0.006 - 0.003,-0.004,Math.random() * 0.006 - 0.003);
                        entity.setVelocityAt(i,0.0,Math.random() * 1.5 + 0.5,0.0);
                        pv.normalize();
                        pv.scaleBy((Math.random() * 2.0 + 0.2) * 1.0);
                        //entity.setVelocityAt(i,pv.x,pv.y,pv.z);
                    }
                }
                entity.setPlayParam(true,false,this.m_clipMixEnabled);
                entity.initialize(true,false,true,[tex,offsetColorTex]);
                entity.setRGBOffset3f(Math.random() * 2.0 - 1.0,Math.random() * 2.0 - 1.0,Math.random() * 2.0 - 1.0);
                entity.setRGB3f(0.1,0.1,0.1);
                //entity.setUVParam(3,9,0.33,0.33);
                entity.setClipUVParam(4,16,0.25,0.25);
                this.smokeEntity = entity;
            }
            setTime(time:number):void
            {
                if(this.smokeEntity != null)
                {
                    this.smokeEntity.setTime(time);
                }
            }
            updateTime(offsetTime:number):void
            {
                if(this.smokeEntity != null)
                {
                    this.smokeEntity.updateTime(offsetTime);
                }
            }
            setXYZ(px:number, py:number, pz:number):void
            {
                if(this.smokeEntity != null)
                {
                    this.smokeEntity.setXYZ(px,py,pz);
                }
            }
            setPositionScale(scale:number):void
            {
                if(this.smokeEntity != null)
                {
                    this.smokeEntity.setScaleXYZ(scale,scale,scale);
                }
            }
            setSizeScale(scale:number):void
            {
                if(this.smokeEntity != null)
                {
                    this.smokeEntity.setScaleXY(scale,scale);
                }
            }
            setPosition(position:Vector3D):void
            {
                if(this.smokeEntity != null)
                {
                    this.smokeEntity.setPosition(position);
                }
            }
            setVisible(visible:boolean):void
            {
                if(this.smokeEntity != null)
                {
                    this.smokeEntity.setVisible(visible);
                }
            }
            update():void
            {
                if(this.smokeEntity != null)
                {
                    this.smokeEntity.update();
                }
            }
            isAwake():boolean
            {
                if(this.smokeEntity != null)
                {
                    return this.smokeEntity.isAwake();
                }
                return false;
            }
        }
    }
}
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as Vector3DT from "../../vox/math/Vector3D";
import * as Billboard3DFlowEntityT from "../../vox/entity/Billboard3DFlowEntity";
//import * as Billboard3DFlowDirecOnceEntityT from "../../vox/entity/Billboard3DFlowDirecOnceEntity";
import * as TextureProxyT from "../../vox/texture/TextureProxy";
import * as TextureConstT from "../../vox/texture/TextureConst";
import * as IParticleEffectT from "../../particle/effect/IParticleEffect";

import Vector3D = Vector3DT.vox.math.Vector3D;
import Billboard3DFlowEntity = Billboard3DFlowEntityT.vox.entity.Billboard3DFlowEntity;
//import Billboard3DFlowDirecOnceEntity = Billboard3DFlowDirecOnceEntityT.vox.entity.Billboard3DFlowDirecOnceEntity;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TextureConst = TextureConstT.vox.texture.TextureConst;
import IParticleEffect = IParticleEffectT.particle.effect.IParticleEffect;


export namespace particle
{
    export namespace effect
    {
        export class EruptionEffect implements IParticleEffect
        {
            flameEntity:Billboard3DFlowEntity = null;
            solidEntity:Billboard3DFlowEntity = null;
            private m_clipMixEnabled:boolean = false;
            constructor(){}
            initialize(flameTotal:number, solidTotal:number, flameTexture:TextureProxy,solidTexture:TextureProxy,clipMixEnabled:boolean = false):void
            {
                if(this.solidEntity == null)
                {
                    this.m_clipMixEnabled = clipMixEnabled;
                    this.initFlame(null,flameTotal,flameTexture);
                    this.initSolid(null,solidTotal,solidTexture);
                }
            }
            initializeFrom(eruptionEff:EruptionEffect, flameTexture:TextureProxy,solidTexture:TextureProxy,clipMixEnabled:boolean = false):void
            {
                if(eruptionEff != null && this.solidEntity == null)
                {
                    this.m_clipMixEnabled = clipMixEnabled;
                    this.initFlame(eruptionEff.flameEntity, 50,flameTexture);
                    this.initSolid(eruptionEff.solidEntity, 50,solidTexture);
                }
            }
            private initSolid(srcSolidEntity:Billboard3DFlowEntity,total:number,tex:TextureProxy):void
            {
                let size:number = 100;
                let params:number[][] = [
                    [0.0,0.0,0.5,0.5],
                    [0.5,0.0,0.5,0.5],
                    [0.0,0.5,0.5,0.5],
                    [0.5,0.5,0.5,0.5]
                ];
                //tex.premultiplyAlpha = true;
                tex.minFilter = TextureConst.NEAREST;
                tex.magFilter = TextureConst.NEAREST;
                //let total:number = 50;
                let etity:Billboard3DFlowEntity = new Billboard3DFlowEntity();
                if(srcSolidEntity != null)
                {
                    etity.copyMeshFrom(srcSolidEntity);
                    etity.createGroup(total);
                }
                else
                {
                    etity.createGroup(total);
                    let pv:Vector3D = new Vector3D();
                    for(let i:number = 0; i < total; ++i)
                    {
                        size = Math.random() * Math.random() * Math.random() * 180 + 10.0;
                        etity.setSizeAndScaleAt(i,size,size,0.2,1.0);
                        let uvparam:number[] = params[Math.floor((params.length-1) * Math.random() + 0.5)];
                        etity.setUVRectAt(i, uvparam[0],uvparam[1],uvparam[2],uvparam[3]);
                        etity.setTimeAt(i, 50.0 * Math.random() + 150, 0.1,0.7, Math.random() * 5);
                        etity.setBrightnessAt(i,1.0);
                        etity.setTimeSpeedAt(i,Math.random() * 1.0 + 0.5);
                        pv.setTo(Math.random() * 50.0 - 25.0,Math.random() * 10.0 + 10.0, Math.random() * 50.0 - 25.0);
                        etity.setPositionAt(i, pv.x,pv.y,pv.z);
                        etity.setAccelerationAt(i,Math.random() * 0.01 - 0.005,-0.004,0.0);
                        pv.normalize();
                        pv.scaleBy((Math.random() * 1.0 + 1.5));
                        etity.setVelocityAt(i,pv.x,pv.y,pv.z);
                    }
                }
                etity.setPlayParam(true,true, this.m_clipMixEnabled,true);
                etity.initialize(false,true,false, [tex]);
                etity.setSpdScaleMax(4.0,1.5);
                etity.toTransparentBlend();
                this.solidEntity = etity;
            }

            private initFlame(srcFlameEntity:Billboard3DFlowEntity,total:number,tex:TextureProxy):void
            {
                let size:number = 100;
                let params:number[][] = [
                    [0.0,0.0,0.5,0.5],
                    [0.5,0.0,0.5,0.5],
                    [0.0,0.5,0.5,0.5],
                    [0.5,0.5,0.5,0.5]
                ];
                let etity:Billboard3DFlowEntity = new Billboard3DFlowEntity();
                etity.toBrightnessBlend();
                if(srcFlameEntity != null)
                {
                    etity.copyMeshFrom(srcFlameEntity);
                    etity.createGroup(total);
                }
                else
                {
                    etity.createGroup(total);
                    let pv:Vector3D = new Vector3D();
                    for(let i:number = 0; i < total; ++i)
                    {
                        size = Math.random() * Math.random() * Math.random() * 180 + 10.0;
                        etity.setSizeAndScaleAt(i,size,size,0.5,1.0);
                        let uvparam:number[] = params[Math.floor((params.length-1) * Math.random() + 0.5)];
                        etity.setUVRectAt(i, uvparam[0],uvparam[1],uvparam[2],uvparam[3]);
                        etity.setTimeAt(i, 50.0 * Math.random() + 100, 0.4,0.6, Math.random() * 10);
                        etity.setBrightnessAt(i,1.0);
                        etity.setTimeSpeedAt(i,Math.random() * 1.0 + 0.5);pv.setTo(Math.random() * 60.0 - 30.0,Math.random() * 50.0 + 10.0, Math.random() * 60.0 - 30.0);
                        etity.setPositionAt(i, pv.x,pv.y,pv.z);
                        etity.setAccelerationAt(i,0.0,-0.01,0.0);
                        pv.normalize();
                        pv.scaleBy((Math.random() * 2.0 + 0.8));
                        etity.setVelocityAt(i,pv.x,pv.y,pv.z);
                    }
                }
                etity.setPlayParam(true,false,this.m_clipMixEnabled);
                etity.initialize(true,false,false,[tex]);

                this.flameEntity = etity;
            }
            setTime(time:number):void
            {
                if(this.solidEntity != null)
                {
                    this.solidEntity.setTime(time);
                    this.flameEntity.setTime(time);
                }
            }
            updateTime(offsetTime:number):void
            {
                if(this.solidEntity != null)
                {
                    this.solidEntity.updateTime(offsetTime);
                    this.flameEntity.updateTime(offsetTime);
                }
            }
            setXYZ(px:number, py:number, pz:number):void
            {
                if(this.solidEntity != null)
                {
                    this.solidEntity.setXYZ(px,py,pz);
                    this.flameEntity.setXYZ(px,py,pz);
                }
            }
            setPositionScale(scale:number):void
            {
                if(this.solidEntity != null)
                {
                    this.solidEntity.setScaleXYZ(scale,scale,scale);
                    this.flameEntity.setScaleXYZ(scale,scale,scale);
                }
            }
            setSizeScale(scale:number):void
            {
                if(this.solidEntity != null)
                {
                    this.solidEntity.setScaleXY(scale,scale);
                    this.flameEntity.setScaleXY(scale,scale);
                }
            }
            setPosition(position:Vector3D):void
            {
                if(this.solidEntity != null)
                {
                    this.solidEntity.setPosition(position);
                    this.flameEntity.setPosition(position);
                }
            }
            setVisible(visible:boolean):void
            {
                if(this.solidEntity != null)
                {
                    this.solidEntity.setVisible(visible);
                    this.flameEntity.setVisible(visible);
                }
            }
            update():void
            {
                if(this.solidEntity != null)
                {
                    this.solidEntity.update();
                    this.flameEntity.update();
                }
            }
            isAwake():boolean
            {
                if(this.solidEntity != null)
                {
                    return this.solidEntity.isAwake() || this.flameEntity.isAwake();
                }
                return false;
            }
        }
    }
}
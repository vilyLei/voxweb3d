

import * as MathConstT from "../../vox/math/MathConst";
import * as Vector3T from "../../vox/math/Vector3D";
import * as RendererSceneT from "../../vox/scene/RendererScene";
import * as TextureProxyT from "../../vox/texture/TextureProxy";
import * as DisplayEntityContainerT from "../../vox/entity/DisplayEntityContainer";
import * as DisplayEntityT from "../../vox/entity/DisplayEntity";
import * as Box3DEntityT from "../../vox/entity/Box3DEntity";
import * as DirectXZModuleT from "../../voxmotion/primitive/DirectXZModule";

import MathConst = MathConstT.vox.math.MathConst;
import Vector3D = Vector3T.vox.math.Vector3D;
import RendererScene = RendererSceneT.vox.scene.RendererScene;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import DisplayEntityContainer = DisplayEntityContainerT.vox.entity.DisplayEntityContainer;
import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import Box3DEntity = Box3DEntityT.vox.entity.Box3DEntity;
import DirectXZModule = DirectXZModuleT.voxmotion.primitive.DirectXZModule;

export namespace app
{
    export namespace calc
    {
        export class WlKTModule
        {
            private m_position:Vector3D = new Vector3D();
            private m_spdV:Vector3D = new Vector3D();
            private m_spdScale:number = 1.0;
            private m_swingSpeed:number = 0.08;
            private m_lgSwingSpeed:number = 0.5;

            private m_spd:number = 1.0;
            private m_scale:number = 1.0;
            private m_direcRad:number = 0;
            private m_stepAngle:number = 20.0;
            private m_currAngle:number = 20.0;
            private m_minY:number = -60.0;
            private m_offsetY:number = 30.0;
            private m_rsc:RendererScene = null;
            private m_texList:TextureProxy[] = null;
            private m_time:number = 0.0;
            private m_container:DisplayEntityContainer = new DisplayEntityContainer(true);
            private m_gL:DisplayEntity = null;
            private m_gR:DisplayEntity = null;
            private m_awake:boolean = true;
            private m_awakeFlag:boolean = true;
            private m_tickModule:DirectXZModule = new DirectXZModule();
            constructor(){}

            initialize(rsc:RendererScene,texList:TextureProxy[]):void
            {
                if(this.m_rsc == null)
                {
                    this.m_rsc = rsc;
                    this.m_texList = texList;
                    
                    this.createEles( this.creatLG(-this.m_offsetY) );
                    
                    this.m_tickModule.syncTargetUpdate = false;
                }
            }
            private calcSpeed():void
            {
                this.m_spd = this.m_scale * ((this.m_offsetY - this.m_minY) * this.m_stepAngle/360.0)/ 3.1415926;
                this.m_tickModule.setSpeed(this.m_spd);
            }
            private createEles(el:DisplayEntity):void
            {
                let dis:number = this.m_offsetY - this.m_minY;
                this.m_time = Math.random() * 50.0;
                this.calcSpeed();
                if(el != null)
                {
                    this.m_gL = new DisplayEntity();
                    this.m_gL.copyMeshFrom(el);
                    this.m_gL.copyMaterialFrom(el);
                }
                else
                {
                    this.m_gL = this.creatLG(-this.m_offsetY);
                }
                this.m_gR = new DisplayEntity();
                this.m_gR.copyMeshFrom(this.m_gL);
                this.m_gR.copyMaterialFrom(this.m_gL);
                this.m_gL.setXYZ(0, dis, -40);
                this.m_gR.setXYZ(0, dis,  40);
                this.m_container.addEntity(this.m_gL);
                this.m_container.addEntity(this.m_gR);
                this.m_rsc.addContainer(this.m_container);
                this.m_tickModule.bindTarget(this.m_container);
                this.m_tickModule.setVelocityFactor(0.02,0.03);
                this.m_lgSwingSpeed = this.m_swingSpeed * this.m_spdScale;
            }
            initializeFrom(module:WlKTModule):void
            {
                if(this.m_rsc == null)
                {
                    if(module != null && module.m_gL != null)
                    {
                        this.m_rsc = module.m_rsc;
                        this.m_texList = module.m_texList;
                        this.createEles( module.m_gL );
                    }
                }
            }
            setVelocityFactor(oldVelocityFactor:number, newVelocityFactor:number):void
            {
                this.m_tickModule.setVelocityFactor(oldVelocityFactor,newVelocityFactor);
            }
            update():void
            {
                this.m_container.update();
            }
            setRotation(rotation:number):void
            {
                this.m_direcRad = MathConst.DegreeToRadian(rotation);
                //  let spd:number = this.m_spd * this.m_spdScale;
                //  //  this.m_spdV.x = spd * Math.cos(this.m_direcRad);
                //  //  this.m_spdV.z = -spd * Math.sin(this.m_direcRad);
                //  this.m_tickModule.setSpeed(spd);
                this.m_container.setRotationY(rotation);
            }
            setSpeedScale(scale:number):void
            {
                this.m_spdScale = scale;
                this.m_lgSwingSpeed = this.m_swingSpeed * this.m_spdScale;
                let spd:number = this.m_spd * this.m_spdScale;
                //  this.m_spdV.x = spd * Math.cos(this.m_direcRad);
                //  this.m_spdV.z = -spd * Math.sin(this.m_direcRad);
                this.m_tickModule.setSpeed(spd);
            }
            setScale(scale:number):void
            {
                this.m_scale = scale;
                this.calcSpeed();
                this.m_container.setScale(scale);
            }
            setXYZ(px:number, py:number, pz:number):void
            {
                this.m_position.setXYZ(px,py,pz);
                this.m_container.setXYZ(px,py,pz);
            }
            setPosition(position:Vector3D):void
            {
                this.m_position.copyFrom(position);
                this.m_container.setPosition(position);
            }
            getPosition(position:Vector3D):void
            {
                this.m_container.getPosition(position);
            }
            moveOffsetXYZ(px:number, py:number, pz:number):void
            {
                this.m_container.getPosition(this.m_position);
                this.m_position.x += px;
                this.m_position.y += py;
                this.m_position.z += pz;
                this.m_container.setPosition(this.m_position);
            }
            //  moveOffset():void
            //  {
            //      //this.m_container.getPosition(this.m_position);
            //      this.m_position.addBy(this.m_spdV);
            //      this.m_container.setPosition(this.m_position);
            //  }
            moveToXZ(px:number,pz:number):void
            {
                this.m_tickModule.toXZ(px,pz);
                this.wake();
            }
            private creatLG(offsetH:number):DisplayEntity
            {
                let offsetY:number = offsetH;
                let minV:Vector3D = new Vector3D(-30,this.m_minY,-30);
                let maxV:Vector3D = new Vector3D();
                maxV.copyFrom(minV);
                maxV.scaleBy(-1.0);
                minV.y += offsetY;
                maxV.y += offsetY;

                let box:Box3DEntity = new Box3DEntity();
                box.initialize(minV, maxV, [this.m_texList[0]]);
                box.setXYZ(0,0,0);
                return box;
            }
            isAwake():boolean
            {
                return this.m_awake;
            }
            wake():void
            {
                this.m_awake = true;
                this.m_awakeFlag = true;
            }
            sleep():void
            {
                this.m_awake = false;
            }
            run():void
            {
                if(this.m_awakeFlag)
                {
                    if(this.m_awake)
                    {
                        this.m_tickModule.run();
                        this.m_awake = this.m_tickModule.isMoving();
                        this.m_currAngle = Math.sin(this.m_time) * this.m_stepAngle;                        
                    }
                    else
                    {
                        this.m_time = 0;
                        if(this.m_currAngle > 0.0)
                        {
                            this.m_currAngle -= 2.0;
                            if(this.m_currAngle < 0.0)
                            {
                                this.m_currAngle = 0.0;
                                this.m_awakeFlag = false;
                            }
                        }
                        else if(this.m_currAngle < 0.0)
                        {
                            this.m_currAngle += 2.0;
                            if(this.m_currAngle > 0.0)
                            {
                                this.m_currAngle = 0.0;
                                this.m_awakeFlag = false;
                            }
                        }
                        else
                        {
                            this.m_awakeFlag = false;
                        }
                    }
                    let entity:DisplayEntity = this.m_gL;
                    entity.setRotationXYZ(0.0,0.0, this.m_currAngle);
                    entity.update();    
                    entity = this.m_gR;
                    entity.setRotationXYZ(0.0,0.0, -this.m_currAngle);
                    entity.update();    
                    this.m_time += this.m_lgSwingSpeed;//0.08 * this.m_spdScale;
                    //this.m_time += 0.05 * this.m_spdScale;
                    this.m_container.update();
                }
            }
        }
    }
}
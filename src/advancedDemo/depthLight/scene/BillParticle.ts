/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as Vector3DT from "../../..//vox/math/Vector3D";
import * as TextureProxyT from "../../../vox/texture/TextureProxy";
import * as IRendererT from "../../../vox/scene/IRenderer";

import * as Billboard3DEntityT from "../../../vox/entity/Billboard3DEntity";

import Vector3D = Vector3DT.vox.math.Vector3D;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import IRenderer = IRendererT.vox.scene.IRenderer;

import Billboard3DEntity = Billboard3DEntityT.vox.entity.Billboard3DEntity;
export namespace advancedDemo
{
    export namespace depthLight
    {
        export namespace scene
        {
            export class BillParticle
            {
                constructor(tar:Billboard3DEntity)
                {
                    this.m_tar = tar;
                }
                private m_tar:Billboard3DEntity = null;
                private m_isAlive:boolean = true;
                spdV0:Vector3D = new Vector3D();
                spdV1:Vector3D = new Vector3D();
                spdV2:Vector3D = new Vector3D();
                spdV:Vector3D = new Vector3D();
                pv:Vector3D = new Vector3D();
                brightness:number = 1.0;
                scale:number = 1.0;
                awake():void
                {
                    this.m_isAlive = true;
                    this.brightness = 1.0;
                    this.m_tar.setVisible(true);
                    this.m_tar.setBrightness(this.brightness);
                    this.spdV0.setXYZ(Math.random() * 3.0 - 1.5, Math.random() * 3.0 - 1.5, Math.random() * 3.0 - 1.5);
                    this.spdV1.setXYZ(Math.random() * 3.0 - 1.5, Math.random() * 3.0 - 1.5, Math.random() * 3.0 - 1.5);
                    this.spdV2.setXYZ(Math.random() * 3.0 - 1.5, Math.random() * 3.0 - 1.5, Math.random() * 3.0 - 1.5);
                    //this.spdV.setXYZ(Math.random() * 3.0 - 1.5, Math.random() * 3.0 - 1.5, Math.random() * 3.0 - 1.5);
                    this.m_tar.update();
                }
                setPosition(pv:Vector3D):void
                {
                    this.m_tar.setPosition(pv);
                }
                setRGB3f(pr:number,pg:number,pb:number):void
                {
                    this.m_tar.setRGB3f(pr,pg,pb);
                }
                setScaleXY(sx:number,sy:number):void
                {
                    this.m_tar.setScaleXY(sx,sy);
                }
                isAlive():boolean
                {
                    return this.m_isAlive;
                }
                update():void
                {
                    if(this.m_isAlive)
                    {
                        if(this.brightness > 0.01)
                        {
                            let k0:number = Math.sin(this.brightness * 3.14) * 1.1;
                            let k:number = 0.0;
                            k = 1.0 - k0;
                            let k1:number = k * k;
                            this.spdV.x = (this.spdV0.x * k - this.spdV1.x * k0) * 0.7 + k1 * this.spdV2.x;
                            this.spdV.y = (this.spdV0.y * k - this.spdV1.y * k0) * 0.7 + k1 * this.spdV2.y;
                            this.spdV.z = (this.spdV0.z * k - this.spdV1.z * k0) * 0.7 + k1 * this.spdV2.z;
                            this.m_tar.getPosition(this.pv);
                            this.spdV.scaleBy(k0);
                            this.pv.addBy(this.spdV);
                            //k = this.scale * this.brightness * this.spdV.getLength() * 0.5;
                            k = this.scale * this.spdV.getLength() * 0.5;
                            this.m_tar.setScaleXY(k,k);
        
                            this.m_tar.setPosition(this.pv);
                            this.m_tar.setBrightness(this.brightness);
                            this.m_tar.update();
                            this.brightness -= 0.002;
                            //this.spdV.y -= 0.001;
                        }
                        else
                        {
                            this.m_isAlive = false;
                            this.m_tar.setVisible(false);
                        }
                    }
                }
            }
            export class BillParticleGroup
            {
                private m_pars:BillParticle[] = [];
                private m_sleepPars:BillParticle[] = [];
                texs:TextureProxy[] = [];
                renderer:IRenderer = null;
                rendererIndex:number = null;
                srcBillboard:Billboard3DEntity = null;        
                constructor()
                {
                }
                create():BillParticle
                {
                    let par:BillParticle = null;
                    if(this.m_sleepPars.length > 0)
                    {
                        par = this.m_sleepPars.pop();
                        this.m_pars.push(par);
                    }
                    else
                    {
                        if(this.srcBillboard == null)
                        {
                            this.srcBillboard = new Billboard3DEntity();
                            this.srcBillboard.initialize(100.0,100.0,[this.texs[0]]);
                        }
                        let billboard:Billboard3DEntity = new Billboard3DEntity();
                        billboard.setMesh(this.srcBillboard.getMesh());
                        billboard.setRenderStateByName("ADD01");
                        billboard.initialize(100.0,100.0, [this.texs[Math.floor(Math.random() * (this.texs.length - 0.5))]]);
                        this.renderer.addEntity(billboard,this.rendererIndex,true);
                        par = new BillParticle(billboard);
                        this.m_pars.push(par);
                    }
                    par.scale = Math.random() * 0.5 + 0.5;
                    par.setRGB3f(Math.random() * 1.3 + 0.4,Math.random() * 1.3 + 0.4,Math.random() * 1.3 + 0.4);
                    par.setScaleXY(par.scale,par.scale);
                    return par;
                }
                private m_pv:Vector3D = new Vector3D();
                runAndCreate():void
                {
                    let len:number = Math.round(Math.random() * 3.0) - 2;
                    let par:BillParticle;
                    let i:number = 0;
                    for(i = 0; i < len; ++i)
                    {
                        this.m_pv.setXYZ(Math.random() * 800.0 - 400.0, Math.random() * 400.0 + 400.0,Math.random() * 800.0 - 400.0);
                        par = this.create();
                        par.setPosition(this.m_pv);
                        par.awake();
                    }
                    this.run();
                }
                run():void
                {
                    let pars:BillParticle[] = this.m_pars;
                    let i:number = 0;
                    let len:number = pars.length;

                    for(; i < len; ++i)
                    {
                        pars[i].update();
                        if(!pars[i].isAlive())
                        {
                            this.m_sleepPars.push(pars[i]);
                            pars.splice(i,1);
                            --i;
                            --len;
                        }
                    }
                }
            }
        }
    }
}
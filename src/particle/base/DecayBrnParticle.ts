
import * as Vector3DT from "../..//vox/math/Vector3D";
import * as IRendererT from "../../vox/scene/IRenderer";
import * as Billboard3DEntityT from "../../vox/entity/Billboard3DEntity";
import * as TextureProxyT from "../../vox/texture/TextureProxy";
import * as Color4T from "../../vox/material/Color4";

import Vector3D = Vector3DT.vox.math.Vector3D;
import IRenderer = IRendererT.vox.scene.IRenderer;
import Billboard3DEntity = Billboard3DEntityT.vox.entity.Billboard3DEntity;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import Color4 = Color4T.vox.material.Color4;

export namespace particle
{
    export namespace base
    {
        export class DecayBrnParticle
        {
            private static s_pars:DecayBrnParticle[] = [];
            private static s_sleepPars:DecayBrnParticle[] = [];
            private static s_textures:TextureProxy[] = [];
            private static s_renderer:IRenderer = null;
            private static s_srcBillboard:Billboard3DEntity = null;
            private m_tar:Billboard3DEntity = null;
            private m_isAlive:boolean = true;
            // brightness衰减速度
            decaySpeed:number = 0.002;
            spdV0:Vector3D = new Vector3D();
            spdV1:Vector3D = new Vector3D();
            spdV2:Vector3D = new Vector3D();
    
            spdV:Vector3D = new Vector3D();
            position:Vector3D = new Vector3D();
            brightness:number = 1.0;
            scale:number = 0.5;
            constructor(tar:Billboard3DEntity)
            {
                this.m_tar = tar;
            }
            static Initialize(size:number,textures:TextureProxy[],renderer:IRenderer):void
            {
                DecayBrnParticle.s_renderer = renderer;
                let srcBillboard:Billboard3DEntity = new Billboard3DEntity();
                srcBillboard.initialize(size,size, [textures[0]]);
                DecayBrnParticle.s_textures = textures;
                DecayBrnParticle.s_srcBillboard = srcBillboard;
            }
            awake():void
            {
                this.m_isAlive = true;
                this.brightness = 1.0;
                this.m_tar.setVisible(true);
                this.m_tar.setBrightness(this.brightness);
                this.spdV0.setXYZ(Math.random() * 3.0 - 1.5, Math.random() * 3.0 - 1.5, Math.random() * 3.0 - 1.5);
                this.spdV1.setXYZ(Math.random() * 3.0 - 1.5, Math.random() * 3.0 - 1.5, Math.random() * 3.0 - 1.5);
                this.spdV2.setXYZ(Math.random() * 3.0 - 1.5, Math.random() * 3.0 - 1.5, Math.random() * 3.0 - 1.5);
                
                this.m_tar.update();
            }
            setPosition(position:Vector3D):void
            {
                this.position.copyFrom(position);
                this.m_tar.setPosition(position);
            }
            update():void
            {
                if(this.m_isAlive)
                {
                    if(this.brightness > 0.01)
                    {
                        let k0:number = Math.sin(this.brightness * 3.14) * 1.1;
                        let k1:number = 1.0 - k0;
                        let k2:number = k1 * k1;
                        this.spdV.x = (this.spdV0.x * k1 - this.spdV1.x * k0) * 0.7 + k2 * this.spdV2.x;
                        this.spdV.y = (this.spdV0.y * k1 - this.spdV1.y * k0) * 0.7 + k2 * this.spdV2.y;
                        this.spdV.z = (this.spdV0.z * k1 - this.spdV1.z * k0) * 0.7 + k2 * this.spdV2.z;
                        
                        this.m_tar.getPosition(this.position);
                        this.spdV.scaleBy(k0);
                        this.position.addBy(this.spdV);
                        k1 = this.scale * this.spdV.getLength();
                        this.m_tar.setScaleXY(k1,k1);
    
                        this.m_tar.setPosition(this.position);
                        this.m_tar.setBrightness(this.brightness);
                        this.m_tar.update();
                        this.brightness -= this.decaySpeed;
                    }
                    else
                    {
                        this.m_isAlive = false;
                        this.m_tar.setVisible(false);
                    }
                }
            }
            private static createParticle():DecayBrnParticle
            {
                let billboard:Billboard3DEntity = new Billboard3DEntity();
                billboard.setMesh(DecayBrnParticle.s_srcBillboard.getMesh());
                billboard.setRenderStateByName("ADD02");
                billboard.initialize(100.0,100.0, [DecayBrnParticle.s_textures[Math.floor(Math.random() * (DecayBrnParticle.s_textures.length - 0.5))]]);
                DecayBrnParticle.s_renderer.addEntity(billboard,1, true);
                let par:DecayBrnParticle = new DecayBrnParticle(billboard);
                DecayBrnParticle.s_pars.push(par);
                return par;
            }
            static Color:Color4 = new Color4();
            static Create():DecayBrnParticle
            {
                let par:DecayBrnParticle = null;
                if(DecayBrnParticle.s_sleepPars.length > 0)
                {
                    par = DecayBrnParticle.s_sleepPars.pop();
                    DecayBrnParticle.s_pars.push(par);
                }
                else
                {
                    par = DecayBrnParticle.createParticle();
                }
                par.scale = Math.random() * 0.25 + 0.25;
                par.m_tar.setRGB3f(Math.random() * 1.3 + 0.4,Math.random() * 1.3 + 0.4,Math.random() * 1.3 + 0.4);
                par.m_tar.setScaleXY(par.scale,par.scale);
                return par;
            }
            static Run():void
            {
                let pars:DecayBrnParticle[] = DecayBrnParticle.s_pars;
                let i:number = 0;
                let len:number = pars.length;
                
                for(; i < len; ++i)
                {
                    pars[i].update();
                    if(!pars[i].m_isAlive)
                    {
                        DecayBrnParticle.s_sleepPars.push(pars[i]);
                        pars.splice(i,1);
                        --i;
                        --len;
                    }
                }
            }    
        }
    }
}
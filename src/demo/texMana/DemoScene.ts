
import * as RenderConstT from "../../vox/render/RenderConst";
import * as RendererStateT from "../../vox/render/RendererState";
import * as Color4T from "../../vox/material/Color4";
import * as BillboardRGBMaskMaterialT from "../../vox/material/mcase/BillboardRGBMaskMaterial";
import * as ClipsBillboardMaskMaterialT from "../../vox/material/mcase/ClipsBillboardMaskMaterial";
import * as RendererInstanceContextT from "../../vox/scene/RendererInstanceContext";
import * as RendererInstanceT from "../../vox/scene/RendererInstance";

import * as DisplayEntityT from "../../vox/entity/DisplayEntity";
import * as Axis3DEntityT from "../../vox/entity/Axis3DEntity";
import * as Billboard3DEntityT from "../../vox/entity/Billboard3DEntity";
import * as ClipsBillboard3DEntityT from "../../vox/entity/ClipsBillboard3DEntity";
import * as TextureProxyT from "../../vox/texture/TextureProxy";
import * as TextureStoreT from "../../vox/texture/TextureStore";
import * as TextureBlockT from "../../vox/texture/TextureBlock";
import * as ImageTextureLoaderT from "../../vox/texture/ImageTextureLoader";
import * as EntityDispT from "../base/EntityDisp";

import CullFaceMode = RenderConstT.vox.render.CullFaceMode;
import RenderBlendMode = RenderConstT.vox.render.RenderBlendMode;
import DepthTestMode = RenderConstT.vox.render.DepthTestMode;
import RendererState = RendererStateT.vox.render.RendererState;
import Color4 = Color4T.vox.material.Color4;
import BillboardRGBMaskMaterial = BillboardRGBMaskMaterialT.vox.material.mcase.BillboardRGBMaskMaterial;
import ClipsBillboardMaskMaterial = ClipsBillboardMaskMaterialT.vox.material.mcase.ClipsBillboardMaskMaterial;
import RendererInstanceContext = RendererInstanceContextT.vox.scene.RendererInstanceContext;
import RendererInstance = RendererInstanceT.vox.scene.RendererInstance;

import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
import Billboard3DEntity = Billboard3DEntityT.vox.entity.Billboard3DEntity;
import ClipsBillboard3DEntity = ClipsBillboard3DEntityT.vox.entity.ClipsBillboard3DEntity;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TextureStore = TextureStoreT.vox.texture.TextureStore;
import TextureBlock = TextureBlockT.vox.texture.TextureBlock;
import ImageTextureLoader = ImageTextureLoaderT.vox.texture.ImageTextureLoader;
import EntityDisp = EntityDispT.demo.base.EntityDisp;
import EntityDispQueue = EntityDispT.demo.base.EntityDispQueue;

export namespace demo
{
    export namespace texMama
    {
        export class DemoScene
        {
            constructor()
            {
            }
            private m_renderer:RendererInstance = null;
            private m_rcontext:RendererInstanceContext = null;
            
            private m_texLoader:ImageTextureLoader;
            private m_texBlock:TextureBlock;
            private m_equeue:EntityDispQueue = new EntityDispQueue();
            
            private m_billMeshSrc0Entity:Billboard3DEntity = null;
            initialize(renderer:RendererInstance):void
            {
                console.log("texMama,DemoScene::initialize()......");
                if(this.m_rcontext == null)
                {
                    this.m_renderer = renderer;
                    this.m_rcontext = this.m_renderer.getRendererContext();               
                    RendererState.CreateRenderState("ADD01",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_BLEND);
                    RendererState.CreateRenderState("ADD02",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_ALWAYS);
                    
                    this.m_texBlock = new TextureBlock();
                    this.m_texBlock.setRenderer( this.m_renderer );
                    this.m_texLoader = new ImageTextureLoader(this.m_texBlock);

                    this.initDisp();
    
                }
            }
            uint8arrayToStringMethod(myUint8Arr:Uint8Array):void
            {
                return String.fromCharCode.apply(null, myUint8Arr);
            }
            uint16arrayToStringMethod(myUint16Arr:Uint16Array):void
            {
                return String.fromCharCode.apply(null, myUint16Arr);
            }
            private m_parClipTexList:string[] = [
                "static/assets/xulie_48.png",
                "static/assets/xulie_08_61.png",
                "static/assets/image_sequence_2x.png",
                "static/assets/Lightning4.jpg",
                "static/assets/xulie_49.png",
                "static/assets/xulie_02_07.png",
            ];
            private m_parTexList:string[] = [
                "static/assets/flare_core_01.jpg",
                "static/assets/flare_core_02.jpg",
                "static/assets/guangyun_H_0007.png",
                "static/assets/a_02_c.jpg",
            ];
            private m_baseTexList:string[] = [
                "static/assets/moss_02.jpg",
                "static/assets/animated_sun.jpg",
                "static/assets/fruit_01.jpg",
                "static/assets/flare_core_02.jpg"
            ];
            private getImageTexByUrl(purl:string,wrapRepeat:boolean = true,mipmapEnabled = true):TextureProxy
            {
                return this.m_texLoader.getImageTexByUrl(purl);
            }
            private getParClipTexAt(i:number):TextureProxy
            {
                let tex:TextureProxy = this.getImageTexByUrl(this.m_parClipTexList[i]);
                return tex;
            }
            private getParTexAt(i:number):TextureProxy
            {
                let tex:TextureProxy = this.getImageTexByUrl(this.m_parTexList[i]);
                return tex;
            }
            private getBaseTexAt(i:number):TextureProxy
            {
                let tex:TextureProxy = this.getImageTexByUrl(this.m_baseTexList[i]);
                return tex;
            }
            private initDisp():void
            {
                this.m_billMeshSrc0Entity = new Billboard3DEntity();
                // create and save mesh in m_billMeshSrc0Entity instance
                this.m_billMeshSrc0Entity.initialize(100.0,100.0, [TextureStore.CreateRGBATex2D(16,16,new Color4(1.0,0.0,1.0))]);                

                let axis:Axis3DEntity = new Axis3DEntity();
                axis.name = "axis";
                axis.initialize(300.0);
                axis.setXYZ(100.0,0.0,100.0);
                this.m_renderer.addEntity(axis);
                
                
                this.createBillClips(15);
                this.createBills(15);
                this.createMaskBill(5);
                this.createBillMaskClips(5);
            }
            //  getImageTexByUrl(purl:string,wrapRepeat:boolean = true,mipmapEnabled = true):TextureProxy
            //  {
            //      let ptex:TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
            //      ptex.mipmapEnabled = mipmapEnabled;
            //      if(wrapRepeat)ptex.setWrap(TextureConst.WRAP_REPEAT);
            //      return ptex;
            //  }
            private createBillMaskClips(total:number):void
            {
                let bill:ClipsBillboard3DEntity = null;
                let i:number = 0;
                let factorBoo:boolean = false;
                for(i = 0; i < total; ++i)
                {
                    bill = new ClipsBillboard3DEntity();
                    bill.copyMeshFrom( this.m_billMeshSrc0Entity );
                    factorBoo = Math.random() > 0.3;
                    if(factorBoo)
                    {
                        bill.setMaterial( new ClipsBillboardMaskMaterial(true) );
                        if(Math.random() > 0.5)
                        {
                            bill.initialize(100.0,100.0, [this.getBaseTexAt(0), this.getParClipTexAt(0)]);
                            bill.setClipsUVRNCN(4,4);
                        }
                        else
                        {
                            bill.initialize(100.0,100.0, [this.getBaseTexAt(0), this.getParClipTexAt(1)]);
                            bill.setClipsUVRNCN(4,4);
                        }
                    }
                    else
                    {
                        if(Math.random() > 0.5)
                        {
                            bill.setMaterial( new ClipsBillboardMaskMaterial(false,false) );
                            bill.initialize(100.0,100.0, [this.getBaseTexAt(0), this.getParClipTexAt(2)]);
                            bill.setClipsUVRNCN(4,4);
                        }
                        else
                        {
                            bill.setMaterial( new ClipsBillboardMaskMaterial(true,false) );
                            bill.initialize(300.0,300.0, [this.getBaseTexAt(3), this.getParClipTexAt(5)]);
                            bill.setClipsUVRNCN(4,4);
                            //  bill.initialize(300.0,300.0, [this.getBaseTexAt(1), this.getParClipTexAt(3)]);
                            //  bill.setClipsUVRNCN(3,3);
                        }
                    }
                    this.m_renderer.addEntity( bill );
                    bill.setRenderStateByName("ADD01");
                    if(total > 0)
                    {
                        bill.autoPlay(true,0.02);
                        bill.setXYZ(Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0);
                        let disp:EntityDisp = this.m_equeue.addClipsBillEntity(bill,factorBoo);
                        disp.lifeTime = Math.round(Math.random() * 100 + 200);
                        disp.scale = Math.random() * 0.8 + 0.5;
                    }
                }
            }
            private createBillClips(total:number):void
            {
                let bill:ClipsBillboard3DEntity = null;
                let i:number = 0;
                let factorBoo:boolean = false;
                for(i = 0; i < total; ++i)
                {
                    bill = new ClipsBillboard3DEntity();
                    bill.copyMeshFrom( this.m_billMeshSrc0Entity );
                    factorBoo = Math.random() > 0.3;
                    if(factorBoo)
                    {
                        if(Math.random() > 0.5)
                        {
                            bill.initialize(100.0,100.0, [this.getParClipTexAt(0)]);
                        }
                        else
                        {
                            bill.initialize(100.0,100.0, [this.getParClipTexAt(1)]);
                        }
                    }
                    else
                    {
                        bill.initialize(100.0,100.0, [this.getParClipTexAt(2)]);
                    }
                    bill.setRenderStateByName("ADD01");
                    bill.setClipsUVRNCN(4,4);
                    bill.autoPlay(true,0.02);
                    bill.setXYZ(Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0);
                    this.m_renderer.addEntity( bill );
                    let disp:EntityDisp = this.m_equeue.addClipsBillEntity(bill,factorBoo);
                    disp.lifeTime = Math.round(Math.random() * 100 + 200);
                    disp.scale = Math.random() * 0.8 + 0.5;
                }
            }
            private createMaskBill(total:number):void
            {
                let bill:Billboard3DEntity = null;
                let i:number = 0;
                let factorBoo:boolean = false;
                for(i = 0; i < total; ++i)
                {
                    bill = new Billboard3DEntity();
                    bill.setMaterial(new BillboardRGBMaskMaterial());
                    bill.copyMeshFrom( this.m_billMeshSrc0Entity );
                    //bill.initialize(100.0,100.0, [this.getParTexAt(Math.floor(Math.random() * (this.m_parTexList.length - 0.5)))]);
                    bill.initialize(100.0,100.0, [this.getBaseTexAt(0), this.getParTexAt(Math.floor(Math.random() * (this.m_parTexList.length - 0.5)))]);
                    bill.setRenderStateByName("ADD01");
                    bill.setXYZ(Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0);
                    let disp:EntityDisp = this.m_equeue.addBillEntity(bill,factorBoo);
                    disp.lifeTime = Math.round(Math.random() * 100 + 200);
                    disp.scale = Math.random() * 0.8 + 0.5;
                    this.m_renderer.addEntity( bill );
                }
            }
            private createBills(total:number):void
            {
                let bill:Billboard3DEntity = null;
                let i:number = 0;
                let factorBoo:boolean = false;
                for(i = 0; i < total; ++i)
                {
                    bill = new Billboard3DEntity();
                    bill.copyMeshFrom( this.m_billMeshSrc0Entity );
                    bill.initialize(100.0,100.0, [this.getParTexAt(Math.floor(Math.random() * (this.m_parTexList.length - 0.5)))]);
                    bill.setRenderStateByName("ADD01");
                    bill.setXYZ(Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0);
                    this.m_renderer.addEntity( bill );
                    let disp:EntityDisp = this.m_equeue.addBillEntity(bill,factorBoo);
                    disp.lifeTime = Math.round(Math.random() * 100 + 200);
                    disp.scale = Math.random() * 0.8 + 0.5;
                }
            }
            mouseDown():void
            {
                let i:number = 0;
                for(i = 0; i < 5; ++i)
                {
                    if(Math.random() > 0.5)this.createBillClips(Math.round(Math.random() * 5));
                    if(Math.random() > 0.5)this.createBills(Math.round(Math.random() * 5));
                    if(Math.random() > 0.5)this.createMaskBill(Math.round(Math.random() * 5));
                    if(Math.random() > 0.5)this.createBillMaskClips(Math.round(Math.random() * 5));
                }

                // this.m_renderer.showInfoAt(0);
            }
            run():void
            {
                this.m_texLoader.run();
                this.m_equeue.run();
                let disp:EntityDisp = null;
                let dispEntity:DisplayEntity = null;
                let disps:EntityDisp[] = this.m_equeue.getList();
                let i:number = 0;
                let len:number = this.m_equeue.getListLength();
                for(; i < len; ++i)
                {
                    disp = disps[i];
                    if(!disp.isAwake())
                    {
                        disps.splice(i,1);
                        dispEntity = disp.getTarget();
                        this.m_renderer.removeEntity(disp.getTarget());
                        dispEntity.destroy();
                        disp.destroy();
                        console.log("DemoScene::run(), remove a disp, i: "+i);
                        --i;
                        --len;
                    }
                }
                this.m_texLoader.run();
            }
        }
    }
}
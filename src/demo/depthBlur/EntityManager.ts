
import * as Vector3DT from "../../vox/geom/Vector3";
import * as RendererInstanceT from "../../vox/scene/RendererInstance";
import * as Box3DEntityT from "../../vox/entity/Box3DEntity";
import * as Plane3DEntityT from "../../vox/entity/Plane3DEntity";
import * as Billboard3DEntityT from "../../vox/entity/Billboard3DEntity";
import * as TextureProxyT from "../../vox/texture/TextureProxy";
import * as TextureConstT from "../../vox/texture/TextureConst";
import * as TexResLoaderT from "../../vox/texture/TexResLoader";
import * as ScreenPlaneMaterialT from "../../vox/material/mcase/ScreenPlaneMaterial";
import * as EntityDispT from "../base/EntityDisp";

import Vector3D = Vector3DT.vox.geom.Vector3D;
import RendererInstance = RendererInstanceT.vox.scene.RendererInstance;
import Box3DEntity = Box3DEntityT.vox.entity.Box3DEntity;
import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
import Billboard3DEntity = Billboard3DEntityT.vox.entity.Billboard3DEntity;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TextureConst = TextureConstT.vox.texture.TextureConst;
import TexResLoader = TexResLoaderT.vox.texture.TexResLoader;
import EntityDisp = EntityDispT.demo.base.EntityDisp;
import ScreenPlaneMaterial = ScreenPlaneMaterialT.vox.material.mcase.ScreenPlaneMaterial;
import EntityDispQueue = EntityDispT.demo.base.EntityDispQueue;

export namespace demo
{
    export namespace depthBlur
    {
        export class EntityManager
        {
            private m_texLoader:TexResLoader = new TexResLoader();
            private m_renderer:RendererInstance = null;

            private m_equeue:EntityDispQueue = new EntityDispQueue();
            constructor()
            {
            }
            run():void
            {
                this.m_equeue.run();
            }
            initialize(renderer:RendererInstance):void
            {
                console.log("EntityManager::initialize().");
                
                this.m_renderer = renderer;
                EntityDisp.MinV.setXYZ(-2000,-2000,-2000);
                EntityDisp.MaxV.setXYZ(2000,2000,2000);
                let i:number = 0;
                //let renderer:RendererInstance = this.m_renderer;
                let urls:string[] = [
                    "static/assets/default.jpg"
                    ,"static/assets/broken_iron.jpg"
                    ,"static/assets/fruit_01.jpg"
                    ,"static/assets/flare_core_02.jpg"
                ];
                let billUrls:string[] = [
                    "static/assets/a_02_c.jpg"
                    ,"static/assets/flare_core_01.jpg"
                    ,"static/assets/flare_core_02.jpg"
                    ,"static/assets/guangyun_H_0007.png"
                ];
                let tex0:TextureProxy = null;
                let texList:TextureProxy[] = [];
                for(i = 0; i < urls.length; ++i)
                {
                    tex0 = this.m_texLoader.getTexAndLoadImg(urls[i]);
                    tex0.mipmapEnabled = true;
                    tex0.setWrap(TextureConst.WRAP_REPEAT);
                    texList.push(tex0);
                }
                let billTexList:TextureProxy[] = [];
                for(i = 0; i < billUrls.length; ++i)
                {
                    tex0 = this.m_texLoader.getTexAndLoadImg(billUrls[i]);
                    tex0.mipmapEnabled = true;
                    tex0.setWrap(TextureConst.WRAP_REPEAT);
                    billTexList.push(tex0);
                }
                
                //var plane:Plane3DEntity = new Plane3DEntity();
                //plane.name = "plane";
                let boxSize:number = 80.0;
                let scale:number = 1.0;
                let sreBox:Box3DEntity = new Box3DEntity();
                sreBox.initialize(new Vector3D(-boxSize,-boxSize,-boxSize),new Vector3D(boxSize,boxSize,boxSize),[texList[0]]);
                let box:Box3DEntity = null;
                for(i = 0; i < 100; ++i)
                {
                    box = new Box3DEntity();
                    box.name = "box_"+i;
                    box.setMesh(sreBox.getMesh());
                    box.initialize(new Vector3D(-boxSize,-boxSize,-boxSize),new Vector3D(boxSize,boxSize,boxSize),[texList[Math.floor(texList.length * Math.random())]]);
                    box.setScaleXYZ(Math.random() + 0.8,Math.random() + 0.8,Math.random() + 0.8);
                    box.setXYZ(Math.random() * 2000.0 - 1000.0,Math.random() * 2000.0 - 1000.0,Math.random() * 2000.0 - 1000.0);
                    renderer.addEntity(box);
                    this.m_equeue.addEntity(box);
                }
                let billboard:Billboard3DEntity = null;
                let srcBillboard:Billboard3DEntity = new Billboard3DEntity();
                srcBillboard.initialize(300.0,300.0, [billTexList[0]]);
                for(i = 0; i < 150; ++i)
                {
                    billboard = new Billboard3DEntity();
                    billboard.name = "billboard_"+i;
                    billboard.setRenderStateByName("ADD01");
                    billboard.setMesh( srcBillboard.getMesh() );
                    billboard.initialize(200.0,200.0, [billTexList[Math.floor(texList.length * Math.random())]]);
                    billboard.setXYZ(Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0);
                    billboard.setScaleXY(Math.random() + 0.8,Math.random() + 0.8);
                    renderer.addEntity(billboard,1);
                    billboard.setRGB3f(Math.random() * 1.2,Math.random() * 1.2,Math.random() * 1.2);                     
                    this.m_equeue.addEntity(billboard);
                    //this.m_equeue.addBillEntity(billboard,true);
                }
            }
        }        
    }
}

import Vector3D from "../../vox/math/Vector3D";
import Matrix4 from "../../vox/math/Matrix4";
import RendererDeviece from "../../vox/render/RendererDeviece";
import {RenderBlendMode,CullFaceMode,DepthTestMode} from "../../vox/render/RenderConst";
import RendererState from "../../vox/render/RendererState";
import Color4 from "../../vox/material/Color4";
import RendererParam from "../../vox/scene/RendererParam";
import MeshBase from "../../vox/mesh/MeshBase";
import RendererInstanceContext from "../../vox/scene/RendererInstanceContext";
import RendererInstance from "../../vox/scene/RendererInstance";
import RenderStatusDisplay from "../../vox/scene/RenderStatusDisplay";
import MouseEvent from "../../vox/event/MouseEvent";
import Stage3D from "../../vox/display/Stage3D";

import DisplayEntity from "../../vox/entity/DisplayEntity";
import Plane3DEntity from "../../vox/entity/Plane3DEntity";
import Axis3DEntity from "../../vox/entity/Axis3DEntity";
import Box3DEntity from "../../vox/entity/Box3DEntity";
import Sphere3DEntity from "../../vox/entity/Sphere3DEntity";
import Cylinder3DEntity from "../../vox/entity/Cylinder3DEntity";
import Billboard3DEntity from "../../vox/entity/Billboard3DEntity";
import ClipsBillboard3DEntity from "../../vox/entity/ClipsBillboard3DEntity";
import ObjData3DEntity from "../../vox/entity/ObjData3DEntity";
import TextureProxy from "../../vox/texture/TextureProxy";
import {TextureConst} from "../../vox/texture/TextureConst";

import ImageTextureLoader from "../../vox/texture/ImageTextureLoader";
import * as EntityDispT from "../base/EntityDisp";
import TextureBlock from "../../vox/texture/TextureBlock";

import EntityDisp = EntityDispT.demo.base.EntityDisp;
import EntityDispQueue = EntityDispT.demo.base.EntityDispQueue;

export namespace demo
{
    export namespace vtxMana
    {
        export class DemoScene
        {
            constructor()
            {
            }
            private m_renderer:RendererInstance = null;
            private m_rcontext:RendererInstanceContext = null;
            private m_texLoader:ImageTextureLoader = null;
            private m_texBlock:TextureBlock;
            //private m_camTrack:CameraTrack = null;
            private m_equeue:EntityDispQueue = new EntityDispQueue();
            private m_srcBoxEntity:Box3DEntity = null;
            private m_boxEntity:Box3DEntity = null;
            private m_billMeshSrc0Entity:Billboard3DEntity = null;
            //
            private m_mesh:MeshBase = null;
            initialize(renderer:RendererInstance):void
            {
                console.log("DemoScene::initialize()......");
                if(this.m_rcontext == null)
                {
                    this.m_renderer = renderer;
                    this.m_rcontext = this.m_renderer.getRendererContext();               
                    RendererState.CreateRenderState("ADD01",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.BLEND);
                    RendererState.CreateRenderState("ADD02",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.ALWAYS);

                    this.m_texBlock = new TextureBlock();
                    this.m_texBlock.setRenderer( this.m_renderer );
                    this.m_texLoader = new ImageTextureLoader(this.m_texBlock);
                    //this.initDisp();
                    this.initTest();    
                }
            }
            private m_parClipTexList:string[] = [
                "static/assets/xulie_48.png",
                "static/assets/xulie_08_61.png",
                "static/assets/image_sequence_2x.png"
            ];
            private m_parTexList:string[] = [
                "static/assets/flare_core_01.jpg",
                "static/assets/flare_core_02.jpg",
                "static/assets/guangyun_H_0007.png",
            ];
            getImageTexByUrl(purl:string,wrapRepeat:boolean = true,mipmapEnabled = true):TextureProxy
            {
                let ptex:TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
                ptex.mipmapEnabled = mipmapEnabled;
                if(wrapRepeat)ptex.setWrap(TextureConst.WRAP_REPEAT);
                return ptex;
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
            private getdefaultTexAt(i:number):TextureProxy
            {
                let tex:TextureProxy = this.getImageTexByUrl("static/assets/default.jpg");
                return tex;
            }
            private initTest():void
            {
                let i:number = 0;
                //let tex0:TextureProxy = this.m_texLoader.getImageTexByUrl("default.jpg");
                //  this.m_srcBoxEntity = new Box3DEntity();
                //  this.m_srcBoxEntity.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[this.getdefaultTexAt(0)]);
                let objUrl:string = "static/assets/obj/box01.obj";
                objUrl = "static/assets/obj/letter_A.obj";
                let objDisp:ObjData3DEntity = new ObjData3DEntity();
                objDisp.moduleScale = 10.0;//10.0 + Math.random() * 5.5;
                objDisp.setRotationXYZ(Math.random() * 360.0,Math.random() * 360.0,Math.random() * 360.0);
                objDisp.initializeByObjDataUrl(objUrl,[this.getdefaultTexAt(0)]);
                objDisp.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
                this.m_renderer.addEntity(objDisp);

                let box:Box3DEntity = null;
                for(i = 0; i < 1; ++i)
                {
                    box = new Box3DEntity();
                    this.m_boxEntity = box;
                    box.name = "box_"+i;
                    if(this.m_srcBoxEntity != null)box.copyMeshFrom(this.m_srcBoxEntity);
                    box.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[this.getdefaultTexAt(0)]);
                    box.setXYZ(Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0);
                    this.m_renderer.addEntity(box);
                }
            }
            private initDisp():void
            {
                //let tex0:TextureProxy = this.m_texMana.getImageTexByUrl("assets/fruit_01.jpg");

                this.m_billMeshSrc0Entity = new Billboard3DEntity();
                //this.m_billMeshSrc0Entity.initialize(100.0,100.0, [this.getParTexAt(0)]);
                this.m_billMeshSrc0Entity.initialize(100.0,100.0, [this.m_texBlock.createRGBATex2D(16,16,new Color4(1.0,0.0,1.0))]);
                //this.m_renderer.addEntity( this.m_billMeshSrc0Entity );

                let axis:Axis3DEntity = new Axis3DEntity();
                axis.name = "axis";
                axis.initialize(300.0);
                axis.setXYZ(100.0,0.0,100.0);
                this.m_renderer.addEntity(axis);
                //
                this.createBillClips(15);
                this.createBills(15);
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
                //  this.createBillClips(Math.round(Math.random() * 15));
                //  this.createBills(Math.round(Math.random() * 15));
                if(this.m_boxEntity != null)
                {
                    if(this.m_boxEntity.isInRenderer())
                    {
                        this.m_renderer.removeEntity(this.m_boxEntity);
                        this.m_boxEntity.destroy();
                    }
                    else
                    {
                        let box:Box3DEntity = null;
                        for(let i:number = 0; i < 1; ++i)
                        {
                            box = new Box3DEntity();
                            if(this.m_mesh != null)
                            {
                                box.setMesh(this.m_mesh);
                            }
                            this.m_boxEntity = box;
                            box.name = "box_"+i;
                            if(this.m_srcBoxEntity != null)box.copyMeshFrom(this.m_srcBoxEntity);
                            box.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[this.getdefaultTexAt(0)]);
                            box.setXYZ(Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0);
                            this.m_renderer.addEntity(box);
                            if(this.m_mesh == null)
                            {
                                this.m_mesh = box.getMesh();
                            }
                        }
                    }
                }
            }
            run():void
            {
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
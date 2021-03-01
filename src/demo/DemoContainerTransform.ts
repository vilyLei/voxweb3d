
import * as Vector3DT from "../vox/geom/Vector3";
import * as RendererDevieceT from "../vox/render/RendererDeviece";
import * as RenderConstT from "../vox/render/RenderConst";
import * as RendererStateT from "../vox/render/RendererState";
import * as RendererParamT from "../vox/scene/RendererParam";
import * as RendererSceneT from "../vox/scene/RendererScene";
import * as RenderStatusDisplayT from "../vox/scene/RenderStatusDisplay";
import * as MouseEventT from "../vox/event/MouseEvent";
import * as Stage3DT from "../vox/display/Stage3D";

import * as DisplayEntityT from "../vox/entity/DisplayEntity";
import * as Plane3DEntityT from "../vox/entity/Plane3DEntity";
import * as Axis3DEntityT from "../vox/entity/Axis3DEntity";
import * as TextureProxyT from "../vox/texture/TextureProxy";
import * as TextureConstT from "../vox/texture/TextureConst";
import * as ImageTextureLoaderT from "../vox/texture/ImageTextureLoader";
import * as CameraTrackT from "../vox/view/CameraTrack";
import * as DisplayEntityContainerT from "../vox/entity/DisplayEntityContainer";
import * as EntityDispT from "./base/EntityDisp";

import Vector3D = Vector3DT.vox.geom.Vector3D;
import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import CullFaceMode = RenderConstT.vox.render.CullFaceMode;
import RenderBlendMode = RenderConstT.vox.render.RenderBlendMode;
import DepthTestMode = RenderConstT.vox.render.DepthTestMode;
import RendererState = RendererStateT.vox.render.RendererState;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import RendererScene = RendererSceneT.vox.scene.RendererScene;
import RenderStatusDisplay = RenderStatusDisplayT.vox.scene.RenderStatusDisplay;
import MouseEvent = MouseEventT.vox.event.MouseEvent;
import Stage3D = Stage3DT.vox.display.Stage3D;

import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;

import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TextureConst = TextureConstT.vox.texture.TextureConst;
import ImageTextureLoader = ImageTextureLoaderT.vox.texture.ImageTextureLoader;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;
import DisplayEntityContainer = DisplayEntityContainerT.vox.entity.DisplayEntityContainer;
import EntityDispQueue = EntityDispT.demo.base.EntityDispQueue;

export namespace demo
{
    export class DemoContainerTransform
    {
        constructor()
        {
        }
        private m_rscene:RendererScene = null;
        private m_texLoader:ImageTextureLoader = null;
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        private m_equeue:EntityDispQueue = new EntityDispQueue();
        private m_container:DisplayEntityContainer = null;
        private m_containerMain:DisplayEntityContainer = null;
        private m_followEntity:DisplayEntity = null;
        
        getImageTexByUrl(purl:string,wrapRepeat:boolean = true,mipmapEnabled = true):TextureProxy
        {
            let ptex:TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
            ptex.mipmapEnabled = mipmapEnabled;
            if(wrapRepeat)ptex.setWrap(TextureConst.WRAP_REPEAT);
            return ptex;
        }
        initialize():void
        {
            console.log("DemoContainerTransform::initialize()......");
            if(this.m_rscene == null)
            {
                RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
                
                let rparam:RendererParam = new RendererParam();
                rparam.setMatrix4AllocateSize(8192 * 4);
                rparam.setCamProject(45.0,10.0,3000.0);
                rparam.setCamPosition(1500.0,1500.0,1500.0);
                
                this.m_rscene = new RendererScene();
                this.m_rscene.initialize(rparam,3);
                this.m_rscene.setRendererProcessParam(1,true,true);
                this.m_texLoader = new ImageTextureLoader( this.m_rscene.textureBlock );

                let stage3D:Stage3D = this.m_rscene.getStage3D();
                stage3D.addEventListener(MouseEvent.MOUSE_DOWN,this,this.mouseDownListener);
                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rscene.getCamera());

                let tex0:TextureProxy = this.getImageTexByUrl("static/assets/default.jpg");
                let tex1:TextureProxy = this.getImageTexByUrl("static/assets/broken_iron.jpg");
                tex0.mipmapEnabled = true;
                tex1.mipmapEnabled = true;

                this.m_statusDisp.initialize("rstatus",this.m_rscene.getStage3D().viewWidth - 180);

                RendererState.CreateRenderState("ADD01",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_BLEND);
                RendererState.CreateRenderState("ADD02",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_ALWAYS);
                
                let plane:Plane3DEntity = new Plane3DEntity();
                plane.showDoubleFace();
                plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[tex0]);

                this.m_container = new DisplayEntityContainer();
                this.m_container.addEntity(plane);
                
                this.m_container.setXYZ(100.0,100.0,100.0);
                this.m_rscene.addEntity(plane);

                this.m_containerMain = new DisplayEntityContainer();
                this.m_containerMain.addChild(this.m_container);
                this.m_rscene.addContainer(this.m_containerMain);

                let axisEntity:Axis3DEntity = new Axis3DEntity();
                axisEntity.initialize(30.0);
                
                this.m_rscene.addEntity(axisEntity);
                this.m_followEntity = axisEntity;

                let axis:Axis3DEntity = new Axis3DEntity();
                axis.initialize(300.0);
                axis.setXYZ(100.0,100.0,100.0);
                this.m_rscene.addEntity(axis);
                
                axis = new Axis3DEntity();
                axis.initialize(600.0);
                this.m_rscene.addEntity(axis);
                
            }
        }
        private m_flagBoo:boolean = true;
        mouseDownListener(evt:any):void
        {
            console.log("mouseDownListener call, this.m_rscene: "+this.m_rscene.toString());
            this.m_flagBoo = !this.m_flagBoo;
        }
        position:Vector3D = new Vector3D();
        delayTime:number = 10;
        run():void
        {
            this.m_texLoader.run();
            this.m_equeue.run();

            this.m_rscene.setClearRGBColor3f(0.1, 0.1, 0.1);
            this.m_rscene.renderBegin();

            this.m_rscene.update();
            this.m_rscene.run();

            this.m_rscene.runEnd();
            this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
            
            if(this.m_containerMain != null)
            {
                this.m_container.setRotationY(this.m_container.getRotationY() + 1.0);
                this.m_containerMain.setRotationZ(this.m_containerMain.getRotationZ() + 1.0);
                
                this.position.setXYZ(200.0,10.0,150.0);
                this.m_container.localToGlobal(this.position);
                this.m_followEntity.setPosition(this.position);
                this.m_followEntity.update();
            }
            
            this.m_statusDisp.statusInfo = "/"+RendererState.DrawCallTimes;
            this.m_statusDisp.update();
        }
        
    }
}
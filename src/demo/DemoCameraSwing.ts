
import * as Vector3DT from "../vox/geom/Vector3";
import * as RendererDevieceT from "../vox/render/RendererDeviece";
import * as RenderConstT from "../vox/render/RenderConst";
import * as RODrawStateT from "../vox/render/RODrawState";
import * as RendererParamT from "../vox/scene/RendererParam";
import * as RenderStatusDisplayT from "../vox/scene/RenderStatusDisplay";
import * as MouseEventT from "../vox/event/MouseEvent";
import * as MouseEvt3DControllerT from "../vox/scene/MouseEvt3DController";
import * as Stage3DT from "../vox/display/Stage3D";
import * as IRendererSpaceT from "../vox/scene/IRendererSpace";
import * as RendererSubSceneT from '../vox/scene/RendererSubScene';
import * as RendererSceneT from "../vox/scene/RendererScene";

import * as DisplayEntityT from "../vox/entity/DisplayEntity";
import * as Axis3DEntityT from "../vox/entity/Axis3DEntity";
import * as Box3DEntityT from "../vox/entity/Box3DEntity";
import * as Sphere3DEntityT from "../vox/entity/Sphere3DEntity";
import * as ObjData3DEntityT from "../vox/entity/ObjData3DEntity";
import * as TextureProxyT from "../vox/texture/TextureProxy";
import * as TextureConstT from "../vox/texture/TextureConst";
import * as TexResLoaderT from "../vox/texture/TexResLoader";
import * as CameraTrackT from "../vox/view/CameraTrack";
import * as RaySelectorT from "../vox/scene/RaySelector";
import * as ColorRectImgButtonT from "../orthoui/button/ColorRectImgButton";
import * as ColorButtonT from "../orthoui/button/BoundsButton";

import Vector3D = Vector3DT.vox.geom.Vector3D;
import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import CullFaceMode = RenderConstT.vox.render.CullFaceMode;
import RenderBlendMode = RenderConstT.vox.render.RenderBlendMode;
import DepthTestMode = RenderConstT.vox.render.DepthTestMode;
import RenderStateObject = RODrawStateT.vox.render.RenderStateObject;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import RenderStatusDisplay = RenderStatusDisplayT.vox.scene.RenderStatusDisplay;
import MouseEvent = MouseEventT.vox.event.MouseEvent;
import MouseEvt3DController = MouseEvt3DControllerT.vox.scene.MouseEvt3DController;
import Stage3D = Stage3DT.vox.display.Stage3D;
import IRendererSpace = IRendererSpaceT.vox.scene.IRendererSpace;
import RendererScene = RendererSceneT.vox.scene.RendererScene;
import RendererSubScene = RendererSubSceneT.vox.scene.RendererSubScene;

import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
import Box3DEntity = Box3DEntityT.vox.entity.Box3DEntity;
import Sphere3DEntity = Sphere3DEntityT.vox.entity.Sphere3DEntity;
import ObjData3DEntity = ObjData3DEntityT.vox.entity.ObjData3DEntity;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TextureConst = TextureConstT.vox.texture.TextureConst;
import TexResLoader = TexResLoaderT.vox.texture.TexResLoader;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;
import RaySelector = RaySelectorT.vox.scene.RaySelector;
import ColorRectImgButton = ColorRectImgButtonT.orthoui.button.ColorRectImgButton;
import BoundsButton = ColorButtonT.orthoui.button.BoundsButton;

export namespace demo
{
    export class DemoCameraSwing
    {
        constructor()
        {
        }
        
        private m_rscene:RendererScene = null;
        private m_uiscene:RendererSubScene = null;
        private m_texLoader:TexResLoader = new TexResLoader();
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        private m_stage3D:Stage3D = null;
        initialize():void
        {
            console.log("DemoCameraSwing::initialize()......");
            if(this.m_rscene == null)
            {
                RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
                let tex0:TextureProxy = this.m_texLoader.getTexAndLoadImg("default.jpg");
                let tex1:TextureProxy = this.m_texLoader.getTexAndLoadImg("broken_iron.jpg");
                let tex2:TextureProxy = this.m_texLoader.getTexAndLoadImg("assets/warter_01.jpg");
                let tex3:TextureProxy = this.m_texLoader.getTexAndLoadImg("assets/bt_reset_01.png");
                tex0.mipmapEnabled = true;
                tex0.setWrap(TextureConst.WRAP_REPEAT);
                tex1.mipmapEnabled = true;
                tex1.setWrap(TextureConst.WRAP_REPEAT);
                tex2.mipmapEnabled = true;
                tex2.setWrap(TextureConst.WRAP_REPEAT);
                tex3.mipmapEnabled = true;
                
                this.m_statusDisp.initialize("rstatus");
                
                let rparam:RendererParam = new RendererParam("glcanvas");
                rparam.setMatrix4AllocateSize(8192 * 4);
                rparam.setCamProject(45.0,0.1,3000.0);
                rparam.setCamPosition(1500.0,1500.0,1500.0);
                
                this.m_rscene = new RendererScene();
                this.m_rscene.initialize(rparam,3);
                //this.m_rscene.setRendererProcessParam(1,true,true);
                this.m_rscene.updateCamera();

                let evtCtr:MouseEvt3DController = null;                
                this.m_stage3D = this.m_rscene.getStage3D();

                rparam = new RendererParam("glcanvas");
                rparam.cameraPerspectiveEnabled = false;
                rparam.setCamProject(45.0,0.1,3000.0);
                rparam.setCamPosition(0.0,0.0,1500.0);
                let subScene:RendererSubScene = null;
                subScene = this.m_rscene.createSubScene();
                subScene.initialize(rparam);
                // init mouse pick system
                let rspace:IRendererSpace = subScene.getSpace();
                let raySelector:RaySelector = new RaySelector();
                rspace.setRaySelector(raySelector);
                evtCtr = new MouseEvt3DController();
                subScene.setEvt3DController(evtCtr);
                this.m_uiscene = subScene;
                // left bottom align, is origin position.
                this.m_uiscene.getCamera().translationXYZ(this.m_stage3D.stageHalfWidth,this.m_stage3D.stageHalfHeight,1500.0);
                this.m_uiscene.getCamera().update();

                RenderStateObject.Create("ADD01",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_BLEND);
                RenderStateObject.Create("ADD02",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_ALWAYS);
                // mouse swing camera in the hot area.
                let viewHotArea:BoundsButton = new BoundsButton();
                viewHotArea.initializeBtn2D(this.m_stage3D.stageWidth, this.m_stage3D.stageHeight);
                this.m_uiscene.addEntity(viewHotArea);
                viewHotArea.addEventListener(MouseEvent.MOUSE_DOWN,this,this.mouseDownListener);
                viewHotArea.addEventListener(MouseEvent.MOUSE_UP,this,this.mouseUpListener);
                viewHotArea.addEventListener(MouseEvent.MOUSE_WHEEL,this,this.mouseWheeelListener);

                let resetCameraBtn:ColorRectImgButton = new ColorRectImgButton();
                resetCameraBtn.flipVerticalUV = true;
                resetCameraBtn.outColor.setRGB3f(0.0,1.0,0.0);
                resetCameraBtn.overColor.setRGB3f(0.0,1.0,1.0);
                resetCameraBtn.downColor.setRGB3f(1.0,0.0,1.0);
                resetCameraBtn.setRenderState( RenderStateObject.BACK_TRANSPARENT_STATE);
                resetCameraBtn.initialize(0.0,0.0,64.0,64.0,[tex3]);
                this.m_uiscene.addEntity(resetCameraBtn);
                resetCameraBtn.setXYZ(this.m_stage3D.stageWidth - 64.0, 0.0,0.1);
                resetCameraBtn.addEventListener(MouseEvent.MOUSE_UP,this,this.resetCameraListener);

                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rscene.getCamera());
                
                let i:number = 0;
                
                let axis:Axis3DEntity = new Axis3DEntity();
                axis.initialize(600.0);
                this.m_rscene.addEntity(axis);
                
                let sphere:Sphere3DEntity = null;
                for(i = 0; i < 1; ++i)
                {
                    sphere = new Sphere3DEntity();
                    sphere.initialize(50.0,15,15,[tex1]);
                    sphere.setXYZ(Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0);
                    this.m_rscene.addEntity(sphere);
                }
                let box:Box3DEntity = null;
                for(i = 0; i < 1; ++i)
                {
                    box = new Box3DEntity();
                    box.initialize(new Vector3D(-80.0,-50.0,-50.0),new Vector3D(80.0,50.0,50.0),[tex0]);
                    //box.setXYZ(Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0);
                    box.setXYZ(-300.0,100.0,0.0);
                    this.m_rscene.addEntity(box);
                }
                let objUrl:string;
                objUrl = "assets/obj/env_03.obj";
                let objDisp:ObjData3DEntity = new ObjData3DEntity();
                objDisp.moduleScale = 10.0;
                objDisp.initializeByObjDataUrl(objUrl,[tex2]);
                this.m_rscene.addEntity(objDisp);
            }
        }
        
        private m_mouseX:number = 0.0;
        private m_mouseY:number = 0.0;
        private m_mouseDownBoo:boolean = false;
        
        private resetCameraListener(evt:any):void
        {
            this.m_rscene.getCamera().lookAtRH(new Vector3D(1500.0,1500.0,1500.0),new Vector3D(),new Vector3D(0.0,1.0,0.0));
            this.m_rscene.getCamera().setRotationXYZ(0.0,0.0,0.0);
        }
        private mouseDownListener(evt:any):void
        {
            //console.log("mouseDownListener call, this.m_rscene: "+this.m_rscene.toString());
            this.m_mouseX = this.m_stage3D.mouseX;
            this.m_mouseY = this.m_stage3D.mouseY;
            this.m_mouseDownBoo = true;
        }
        private mouseUpListener(evt:any):void
        {
            //console.log("mouseUpListener call, this.m_rscene: "+this.m_rscene.toString());
            this.m_mouseDownBoo = false;
        }
        private mouseWheeelListener(evt:any):void
        {
            if(evt.wheelDeltaY < 0)
            {
                // zoom in
                this.m_rscene.getCamera().forward(-25.0);
            }
            else
            {
                // zoom out
                this.m_rscene.getCamera().forward(25.0);
            }
        }
        private updateMouseDrag():void
        {
            let dx:number = this.m_mouseX - this.m_stage3D.mouseX;
            let dy:number = this.m_mouseY - this.m_stage3D.mouseY;
            let abs_dx:number = Math.abs(dx);
            let abs_dy:number = Math.abs(dy);
            if(abs_dx > abs_dy)
            {
                if(abs_dx > 0.5)this.m_rscene.getCamera().swingHorizontalWithAxis(dx * 0.2,Vector3D.Y_AXIS);
            }
            else
            {
                if(abs_dy > 0.5)this.m_rscene.getCamera().swingVertical(dy * -0.2);
            }
            this.m_mouseX = this.m_stage3D.mouseX;
            this.m_mouseY = this.m_stage3D.mouseY;
        }
        run():void
        {
            this.m_statusDisp.update();
            if(this.m_mouseDownBoo)
            {
                this.updateMouseDrag();
            }
            // main renderer scene
            this.m_rscene.setClearRGBColor3f(0.0, 0.5, 0.0);
            this.m_rscene.runBegin();
            this.m_rscene.update();
            this.m_rscene.run();

            // ortho ui renderer scene
            this.m_uiscene.runBegin();
            this.m_uiscene.update();
            this.m_uiscene.cullingTest();
            this.m_uiscene.run();
            this.m_uiscene.runEnd();

            this.m_rscene.runEnd();
            this.m_rscene.updateCamera();

        }
    }
}
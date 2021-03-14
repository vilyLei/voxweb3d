
import * as Vector3DT from "..//vox/math/Vector3D";
import * as Matrix4T from "../vox/math/Matrix4";
import * as RendererDevieceT from "../vox/render/RendererDeviece";
import * as RenderConstT from "../vox/render/RenderConst";
import * as RendererStateT from "../vox/render/RendererState";
import * as RendererParamT from "../vox/scene/RendererParam";
import * as RendererInstanceT from "../vox/scene/RendererInstance";
import * as RenderStatusDisplayT from "../vox/scene/RenderStatusDisplay";
import * as MouseEventT from "../vox/event/MouseEvent";
import * as KeyboardEventT from "../vox/event/KeyboardEvent";
import * as MouseEvt3DControllerT from "../vox/scene/MouseEvt3DController";
//import * as KeyboardT from "../vox/ui/Keyboard";
import * as Stage3DT from "../vox/display/Stage3D";
import * as IRendererSpaceT from "../vox/scene/IRendererSpace";
import * as RendererSubSceneT from '../vox/scene/RendererSubScene';
import * as RendererSceneT from "../vox/scene/RendererScene";

import * as DisplayEntityT from "../vox/entity/DisplayEntity";
import * as Plane3DEntityT from "../vox/entity/Plane3DEntity";
import * as Axis3DEntityT from "../vox/entity/Axis3DEntity";
import * as Box3DEntityT from "../vox/entity/Box3DEntity";
import * as Sphere3DEntityT from "../vox/entity/Sphere3DEntity";
import * as Cylinder3DEntityT from "../vox/entity/Cylinder3DEntity";
import * as Billboard3DEntityT from "../vox/entity/Billboard3DEntity";
import * as ObjData3DEntityT from "../vox/entity/ObjData3DEntity";
import * as TextureProxyT from "../vox/texture/TextureProxy";
import * as TextureConstT from "../vox/texture/TextureConst";
import * as TexResLoaderT from "../vox/texture/TexResLoader";
import * as CameraTrackT from "../vox/view/CameraTrack";
import * as PathTrackT from "../voxnav/path/PathTrack";
import * as RaySelectorT from "../vox/scene/RaySelector";
import * as ColorRectImgButtonT from "../orthoui/button/ColorRectImgButton";
import * as ColorButtonT from "../orthoui/button/BoundsButton";

import Vector3D = Vector3DT.vox.math.Vector3D;
import Matrix4 = Matrix4T.vox.math.Matrix4;
import Matrix4Pool = Matrix4T.vox.math.Matrix4Pool;
import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import CullFaceMode = RenderConstT.vox.render.CullFaceMode;
import RenderBlendMode = RenderConstT.vox.render.RenderBlendMode;
import DepthTestMode = RenderConstT.vox.render.DepthTestMode;
import RendererState = RendererStateT.vox.render.RendererState;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import RendererInstance = RendererInstanceT.vox.scene.RendererInstance;
import RenderStatusDisplay = RenderStatusDisplayT.vox.scene.RenderStatusDisplay;
import MouseEvent = MouseEventT.vox.event.MouseEvent;
import KeyboardEvent = KeyboardEventT.vox.event.KeyboardEvent;
import MouseEvt3DController = MouseEvt3DControllerT.vox.scene.MouseEvt3DController;
import Stage3D = Stage3DT.vox.display.Stage3D;
import IRendererSpace = IRendererSpaceT.vox.scene.IRendererSpace;
import RendererScene = RendererSceneT.vox.scene.RendererScene;
import RendererSubScene = RendererSubSceneT.vox.scene.RendererSubScene;

import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
import Box3DEntity = Box3DEntityT.vox.entity.Box3DEntity;
import Sphere3DEntity = Sphere3DEntityT.vox.entity.Sphere3DEntity;
import Cylinder3DEntity = Cylinder3DEntityT.vox.entity.Cylinder3DEntity;
import Billboard3DEntity = Billboard3DEntityT.vox.entity.Billboard3DEntity;
import ObjData3DEntity = ObjData3DEntityT.vox.entity.ObjData3DEntity;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TextureConst = TextureConstT.vox.texture.TextureConst;
import TexResLoader = TexResLoaderT.vox.texture.TexResLoader;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;
import PathTrack = PathTrackT.voxnav.path.PathTrack;
import RaySelector = RaySelectorT.vox.scene.RaySelector;
import ColorRectImgButton = ColorRectImgButtonT.orthoui.button.ColorRectImgButton;
import BoundsButton = ColorButtonT.orthoui.button.BoundsButton;

export namespace voxnav
{
    class WalkNavAction
    {
        constructor(){}
        private m_target:any = null;

        private m_spdX:number = 0.0;
        private m_spdY:number = 0.2;
        private m_spdZ:number = 0.0;
        setRotSpeedXYZ(spdX:number,spdY:number,spdZ:number):void
        {  
            this.m_spdX = spdX;
            this.m_spdY = spdY;
            this.m_spdZ = spdZ;
        }
        bindTarget(tar:Sphere3DEntity):void
        {  
            this.m_target = tar;
        }
        destroy():void
        {  
            this.m_target = null;
        }
        getTarget():Sphere3DEntity
        {
            return this.m_target;
        }
        private m_dis:number = 0.0;
        private m_outV:Vector3D = new Vector3D();
        private m_flag:number = PathTrack.TRACK_END;
        update():void
        {
            if(this.m_flag != PathTrack.TRACK_END)
            {
                this.m_dis += 0.5;
                this.m_flag = this.m_pathTrack.calcPosByDis(this.m_outV,this.m_dis,true);
                this.m_target.setPosition( this.m_outV );
                this.m_target.update();
            }else{
                if(this.moveToEnd != null) this.moveToEnd();
            }
        }
        getTrackFlag():number
        {
            return this.m_flag;
        }
        moveToEnd:any = null;
        private m_pathTrack:PathTrack = new PathTrack();
        setPathPosList(posList:Vector3D[]):void
        {
            this.m_dis = 0;
            this.m_flag = PathTrack.TRACK_END + 100;
            //
            let i:number = 0;
            let len:number = posList.length;
            //trace("posList.length: "+posList.length);
            this.m_target.setPosition( posList[0] );
            this.m_target.update();

            this.m_pathTrack.clear();
            let pv:Vector3D = null;
            for(; i < len; ++i)
            {
                pv = posList[i];
                this.m_pathTrack.addXYZ(pv.x, pv.y, pv.z);
            }
        }
    }
    export class DemoTriNav
    {
        constructor()
        {
        }
        
        private m_rscene:RendererScene = null;
        private m_rspace:IRendererSpace = null;
        private m_raySelector:RaySelector = null;
        private m_subScene:RendererSubScene = null;
        private m_texLoader:TexResLoader = new TexResLoader();
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        private m_walkAct:WalkNavAction = new WalkNavAction();
        private m_delayAddEntitys:DisplayEntity[] = [];
        private m_stage3D:Stage3D = null;
        private m_box:Box3DEntity = null;
        private m_rotMat:Matrix4 = null;
        initialize():void
        {
            console.log("DemoTriNav::initialize()......");
            if(this.m_rscene == null)
            {
                RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
                let tex0:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/default.jpg");
                let tex1:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/broken_iron.jpg");
                let tex2:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/warter_01.jpg");
                let tex3:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/bt_reset_01.png");
                tex0.mipmapEnabled = true;
                tex0.setWrap(TextureConst.WRAP_REPEAT);
                tex1.mipmapEnabled = true;
                tex1.setWrap(TextureConst.WRAP_REPEAT);
                tex2.mipmapEnabled = true;
                tex2.setWrap(TextureConst.WRAP_REPEAT);
                tex3.mipmapEnabled = true;
                
                this.m_statusDisp.initialize("rstatus");
                
                let rparam:RendererParam = new RendererParam();
                rparam.setMatrix4AllocateSize(8192 * 4);
                rparam.setCamProject(45.0,0.1,3000.0);
                rparam.setCamPosition(1500.0,1500.0,1500.0);
                
                this.m_rscene = new RendererScene();
                this.m_rscene.initialize(rparam,3);
                //this.m_rscene.setRendererProcessParam(1,true,true);
                this.m_rscene.updateCamera();

                let evtCtr:MouseEvt3DController = null;                
                this.m_stage3D = this.m_rscene.getStage3D() as Stage3D;
                // create ui renderer scene
                rparam = new RendererParam();
                rparam.cameraPerspectiveEnabled = false;
                rparam.setCamProject(45.0,0.1,3000.0);
                rparam.setCamPosition(0.0,0.0,1500.0);
                let subScene:RendererSubScene = null;
                subScene = this.m_rscene.createSubScene();
                subScene.initialize(rparam);
                let rspace:IRendererSpace = subScene.getSpace();
                let raySelector:RaySelector = new RaySelector();
                rspace.setRaySelector(raySelector);
                evtCtr = new MouseEvt3DController();
                subScene.setEvt3DController(evtCtr);
                this.m_subScene = subScene;
                // ui left bottom align
                this.m_subScene.getCamera().translationXYZ(this.m_stage3D.stageHalfWidth,this.m_stage3D.stageHalfHeight,1500.0);
                this.m_subScene.getCamera().update();

                RendererState.CreateRenderState("ADD01",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_BLEND);
                RendererState.CreateRenderState("ADD02",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_ALWAYS);
                
                let cameraHotSwingHotArea:BoundsButton = new BoundsButton();
                cameraHotSwingHotArea.initializeBtn2D(this.m_stage3D.stageWidth, this.m_stage3D.stageHeight);
                this.m_subScene.addEntity(cameraHotSwingHotArea);
                cameraHotSwingHotArea.addEventListener(MouseEvent.MOUSE_DOWN,this,this.mouseDownListener);
                cameraHotSwingHotArea.addEventListener(MouseEvent.MOUSE_UP,this,this.mouseUpListener);
                cameraHotSwingHotArea.addEventListener(MouseEvent.MOUSE_WHEEL,this,this.mouseWheeelListener);

                let resetCameraBtn:ColorRectImgButton = new ColorRectImgButton();
                resetCameraBtn.flipVerticalUV = true;
                resetCameraBtn.outColor.setRGB3f(0.0,1.0,0.0);
                resetCameraBtn.overColor.setRGB3f(0.0,1.0,1.0);
                resetCameraBtn.downColor.setRGB3f(1.0,0.0,1.0);
                resetCameraBtn.setRenderState( RendererState.BACK_TRANSPARENT_STATE);
                resetCameraBtn.initialize(0.0,0.0,64.0,64.0,[tex3]);
                this.m_subScene.addEntity(resetCameraBtn);
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
                this.m_rotMat = Matrix4Pool.GetMatrix();
                let box:Box3DEntity = null;
                for(i = 0; i < 1; ++i)
                {
                    box = new Box3DEntity();
                    box.initialize(new Vector3D(-80.0,-50.0,-50.0),new Vector3D(80.0,50.0,50.0),[tex0]);
                    //box.setXYZ(Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0);
                    box.setXYZ(-300.0,100.0,0.0);
                    this.m_rscene.addEntity(box);
                    this.m_box = box;
                }
                //  if(sphere != null)
                //  {
                //      let pathPosList:Vector3D[] = [new Vector3D(0.0,0.0,0.0),new Vector3D(200.0,0.0,0.0),new Vector3D(100.0,0.0,100.0)];
                //      this.m_walkAct.bindTarget(sphere);
                //      this.m_walkAct.setPathPosList(pathPosList);
                //  }

                let objUrl:string;
                objUrl = "assets/obj/env_03.obj";
                let objDisp:ObjData3DEntity = new ObjData3DEntity();
                objDisp.moduleScale = 10.0;
                objDisp.initializeByObjDataUrl(objUrl,[tex2]);
                this.m_delayAddEntitys.push(objDisp);
            }
        }
        
        private m_mouseX:number = 0.0;
        private m_mouseY:number = 0.0;
        private m_mouseDownBoo:boolean = false;
        private keyDownListener(evt:any):void
        {
            console.log("keyDownListener call, key: "+evt.key+",repeat: "+evt.repeat);
        }
        private keyUpListener(evt:any):void
        {
            console.log("keyUpListener call, key: "+evt.key+",repeat: "+evt.repeat);            
        }
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
        private updateLoad():void
        {
            if(this.m_delayAddEntitys.length > 0)
            {
                let len:number = this.m_delayAddEntitys.length;
                for(let i:number = 0; i < len; ++i)
                {
                    if(this.m_delayAddEntitys[i].getMesh() != null)
                    {
                        this.m_rscene.addEntity(this.m_delayAddEntitys[i]);
                        this.m_delayAddEntitys.splice(i,1);
                        --i;
                        --len;
                    }
                }
            }
        }
        private m_rotYDegree:number = 0.0;
        run():void
        {
            this.m_statusDisp.update();
            this.updateLoad();
            if(this.m_mouseDownBoo)
            {
                this.updateMouseDrag();
            }

            this.m_rscene.setClearRGBColor3f(0.0, 0.5, 0.0);
            this.m_rscene.runBegin();

            this.m_rscene.update();
            this.m_rscene.run();

            //this.m_subScene.setViewPort(0,0,this.m_stage3D.stageWidth,this.m_stage3D.stageHeight);
            this.m_subScene.runBegin();
            this.m_subScene.update();
            this.m_subScene.cullingTest();
            this.m_subScene.run();
            this.m_subScene.runEnd();

            this.m_rscene.runEnd();
            //this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
            //this.m_rscene.getCamera().appendRotationByAxis(0.005, Vector3D.Y_AXIS,null);
            this.m_rscene.updateCamera();

            this.m_rotYDegree = 0.02;
            this.m_box.setRotationXYZ(0.0,0.0,-30.0);
            this.m_rotMat.appendRotationPivot(this.m_rotYDegree,Vector3D.Y_AXIS,null);
            this.m_box.getTransform().setParentMatrix(this.m_rotMat);// = box;
            this.m_box.update();
        }
    }
}
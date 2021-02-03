
import * as Vector3DT from "../vox/geom/Vector3";
import * as RendererDevieceT from "../vox/render/RendererDeviece";
import * as RenderConstT from "../vox/render/RenderConst";
import * as RODrawStateT from "../vox/render/RODrawState";
import * as RendererParamT from "../vox/scene/RendererParam";
import * as RendererInstanceContextT from "../vox/scene/RendererInstanceContext";
import * as RendererInstanceT from "../vox/scene/RendererInstance";
import * as RenderStatusDisplayT from "../vox/scene/RenderStatusDisplay";
import * as MouseEventT from "../vox/event/MouseEvent";
import * as Stage3DT from "../vox/display/Stage3D";

import * as Plane3DEntityT from "../vox/entity/Plane3DEntity";
import * as Axis3DEntityT from "../vox/entity/Axis3DEntity";
import * as Box3DEntityT from "../vox/entity/Box3DEntity";
import * as Sphere3DEntityT from "../vox/entity/Sphere3DEntity";
import * as Cylinder3DEntityT from "../vox/entity/Cylinder3DEntity";
import * as Billboard3DEntityT from "../vox/entity/Billboard3DEntity";
import * as TextureProxyT from "../vox/texture/TextureProxy";
import * as TextureConstT from "../vox/texture/TextureConst";
import * as TexResLoaderT from "../vox/texture/TexResLoader";
import * as CameraTrackT from "../vox/view/CameraTrack";
import * as PathTrackT from "../voxnav/path/PathTrack";

import Vector3D = Vector3DT.vox.geom.Vector3D;
import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import CullFaceMode = RenderConstT.vox.render.CullFaceMode;
import RenderBlendMode = RenderConstT.vox.render.RenderBlendMode;
import DepthTestMode = RenderConstT.vox.render.DepthTestMode;
import RenderStateObject = RODrawStateT.vox.render.RenderStateObject;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import RendererInstanceContext = RendererInstanceContextT.vox.scene.RendererInstanceContext;
import RendererInstance = RendererInstanceT.vox.scene.RendererInstance;
import RenderStatusDisplay = RenderStatusDisplayT.vox.scene.RenderStatusDisplay;
import MouseEvent = MouseEventT.vox.event.MouseEvent;
import Stage3D = Stage3DT.vox.display.Stage3D;

import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
import Box3DEntity = Box3DEntityT.vox.entity.Box3DEntity;
import Sphere3DEntity = Sphere3DEntityT.vox.entity.Sphere3DEntity;
import Cylinder3DEntity = Cylinder3DEntityT.vox.entity.Cylinder3DEntity;
import Billboard3DEntity = Billboard3DEntityT.vox.entity.Billboard3DEntity;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TextureConst = TextureConstT.vox.texture.TextureConst;
import TexResLoader = TexResLoaderT.vox.texture.TexResLoader;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;
import PathTrack = PathTrackT.voxnav.path.PathTrack;

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
            let pv = null;
            for(; i < len; ++i)
            {
                pv = posList[i];
                this.m_pathTrack.addXYZ(pv.x, pv.y, pv.z);
            }
        }
    }
    export class DemoPathWalk
    {
        constructor()
        {
        }
        private m_renderer:RendererInstance = null;
        private m_rcontext:RendererInstanceContext = null;
        private m_texLoader:TexResLoader = new TexResLoader();
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        private m_walkAct:WalkNavAction = new WalkNavAction();
        initialize():void
        {
            console.log("DemoPathWalk::initialize()......");
            if(this.m_rcontext == null)
            {
                RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
                let tex0:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/default.jpg");
                let tex1:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/broken_iron.jpg");
                let tex2:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/guangyun_H_0007.png");
                let tex3:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/flare_core_02.jpg");
                tex0.mipmapEnabled = true;
                tex0.setWrap(TextureConst.WRAP_REPEAT);
                tex1.mipmapEnabled = true;
                tex1.setWrap(TextureConst.WRAP_REPEAT);
                tex2.mipmapEnabled = true;
                tex2.setWrap(TextureConst.WRAP_REPEAT);
                tex3.mipmapEnabled = true;
                
                this.m_statusDisp.initialize("rstatus");
                let rparam:RendererParam = new RendererParam();
                rparam.setCamProject(45.0,0.1,3000.0);
                rparam.setCamPosition(1500.0,1500.0,1500.0);
                this.m_renderer = new RendererInstance();
                this.m_renderer.initialize(rparam);
                this.m_rcontext = this.m_renderer.getRendererContext();
                let stage3D:Stage3D = this.m_rcontext.getStage3D();
                stage3D.addEventListener(MouseEvent.MOUSE_DOWN,this,this.mouseDownListener);
                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rcontext.getCamera());
                
                RenderStateObject.Create("ADD01",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_BLEND);
                RenderStateObject.Create("ADD02",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_ALWAYS);
                
                let i:number = 0;
                let plane:Plane3DEntity = new Plane3DEntity();
                plane.showDoubleFace();
                plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[tex0]);
                this.m_renderer.addEntity(plane);
                
                let axis:Axis3DEntity = new Axis3DEntity();
                axis.initialize(600.0);
                this.m_renderer.addEntity(axis);
                
                let srcBox:Box3DEntity = new Box3DEntity();
                srcBox.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex1]);
                //srcBox = null;
                let box:Box3DEntity = null;
                for(i = 0; i < 0; ++i)
                {
                    box = new Box3DEntity();
                    if(srcBox != null)box.setMesh(srcBox.getMesh());
                    box.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex1]);
                    box.setXYZ(Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0);
                    this.m_renderer.addEntity(box);
                }
                let sphere:Sphere3DEntity = null;
                for(i = 0; i < 1; ++i)
                {
                    sphere = new Sphere3DEntity();
                    sphere.initialize(50.0,15,15,[tex1]);
                    sphere.setXYZ(Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0);
                    this.m_renderer.addEntity(sphere);
                }

                let pathPosList:Vector3D[] = [new Vector3D(0.0,0.0,0.0),new Vector3D(200.0,0.0,0.0),new Vector3D(100.0,0.0,100.0)];
                this.m_walkAct.bindTarget(sphere);
                this.m_walkAct.setPathPosList(pathPosList);
            }
        }
        mouseDownListener(evt:any):void
        {
            console.log("mouseUpListener call, this.m_renderer: "+this.m_renderer.toString());
        }
        run():void
        {
            //--this.m_runFlag;

            this.m_statusDisp.update();

            this.m_walkAct.update();
            //console.log("##-- begin");
            this.m_rcontext.setClearRGBColor3f(0.0, 0.5, 0.0);
            this.m_rcontext.runBegin();

            this.m_renderer.update();
            this.m_renderer.run();

            this.m_rcontext.runEnd();            
            //this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
            this.m_rcontext.updateCamera();
            
            //  //console.log("#---  end");
        }
    }
}
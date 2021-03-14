
import * as Vector3DT from "..//vox/math/Vector3D";
import * as RendererDevieceT from "../vox/render/RendererDeviece";
import * as RendererParamT from "../vox/scene/RendererParam";
import * as RenderStatusDisplayT from "../vox/scene/RenderStatusDisplay";

import * as Plane3DEntityT from "../vox/entity/Plane3DEntity";
import * as Axis3DEntityT from "../vox/entity/Axis3DEntity";
import * as Box3DEntityT from "../vox/entity/Box3DEntity";
import * as TextureProxyT from "../vox/texture/TextureProxy";
import * as TextureStoreT from "../vox/texture/TextureStore";
import * as CameraTrackT from "../vox/view/CameraTrack";
import * as FBOInstanceT from "../vox/scene/FBOInstance";
import * as DemoInstanceT from "./DemoInstance";

import Vector3D = Vector3DT.vox.math.Vector3D;
import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import RenderStatusDisplay = RenderStatusDisplayT.vox.scene.RenderStatusDisplay;

import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
import Box3DEntity = Box3DEntityT.vox.entity.Box3DEntity;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TextureStore = TextureStoreT.vox.texture.TextureStore;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;
import FBOInstance = FBOInstanceT.vox.scene.FBOInstance;
import DemoInstance = DemoInstanceT.demo.DemoInstance;

export namespace demo
{
    export class DemoFBOBlit extends DemoInstance
    {
        constructor()
        {
            super();
        }
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        private m_fboIns0:FBOInstance = null;
        private m_fboIns1:FBOInstance = null;

        protected initializeSceneParam(param:RendererParam):void
        {
            this.m_processTotal = 3;
            //param.maxWebGLVersion = 1;
            param.setCamPosition(500.0,500.0,500.0);
        }
        protected initializeSceneObj():void
        {
            
            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rcontext.getCamera());

            RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
            RendererDeviece.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDeviece.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

            this.m_statusDisp.initialize("rstatus",this.m_rscene.getStage3D().viewWidth - 180);

            let tex0:TextureProxy = this.getImageTexByUrl("static/assets/default.jpg");
            let tex1:TextureProxy = this.getImageTexByUrl("static/assets/broken_iron.jpg");
            
            this.m_fboIns0 = this.m_rscene.createFBOInstance();
            this.m_fboIns0.synFBOSizeWithViewport();
            this.m_fboIns0.createViewportSizeFBOAt(0,true,false,0);
            this.m_fboIns0.setClearRGBColor3f(0.3, 0.0, 0.3);
            this.m_fboIns0.setRenderToTexture(TextureStore.GetRTTTextureAt(0), 0);
            this.m_fboIns0.setRProcessIDList([0]);
            this.m_fboIns0.setClearState(true,true,false);

            this.m_fboIns1 = this.m_rscene.createFBOInstance();
            this.m_fboIns1.synFBOSizeWithViewport();
            this.m_fboIns1.createViewportSizeFBOAt(1,true,false,0);
            this.m_fboIns1.setClearRGBColor3f(0.3, 0.0, 0.3);
            this.m_fboIns1.setRenderToTexture(TextureStore.GetRTTTextureAt(1), 0);
            //this.m_fboIns1.setRProcessIDList([0]);
            this.m_fboIns1.setClearState(true,true,false);

            // add common 3d display entity
            var plane:Plane3DEntity = new Plane3DEntity();
            plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[tex0]);
            this.m_rscene.addEntity(plane);

            let axis:Axis3DEntity = new Axis3DEntity();
            axis.initialize(300.0);
            this.m_rscene.addEntity(axis);

            let box:Box3DEntity = new Box3DEntity();
            box.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex1]);
            this.m_rscene.addEntity(box);
            // add rtt texture 3d display entity
            let boxRtt:Box3DEntity = new Box3DEntity();
            boxRtt.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[TextureStore.GetRTTTextureAt(1)]);
            //boxRtt.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[TextureStore.GetRTTTextureAt(0)]);
            this.m_rscene.addEntity(boxRtt, 1);
        }
        runBegin():void
        {
            this.m_statusDisp.update();
            this.m_rscene.setClearRGBColor3f(0.0, 0.3, 0.0);
            super.runBegin();
        }
        run():void
        {
            this.m_fboIns0.run();
            this.m_fboIns1.run();
            //this.m_fboIns1.blitFrom(this.m_fboIns0);
            this.m_fboIns1.blitColorFrom(this.m_fboIns0);
            this.m_fboIns0.setRenderToBackBuffer();
            // to be rendering in backbuffer
            this.m_rscene.runAt(1);
        }
        runEnd():void
        {
            super.runEnd();
            this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
        }
    }
}
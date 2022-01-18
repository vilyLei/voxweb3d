
import DivLog from "../vox/utils/DivLog";
import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import {IRenderCamera} from "../vox/render/IRenderCamera";
import CameraBase from "../vox/view/CameraBase";
import RendererParam from "../vox/scene/RendererParam";
import RendererInstanceContext from "../vox/scene/RendererInstanceContext";
import RendererInstance from "../vox/scene/RendererInstance";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import FrameBufferType from "../vox/render/FrameBufferType";
import RendererState from "../vox/render/RendererState";

import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";

import {TextureConst} from "../vox/texture/TextureConst";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import ScreenFixedPlaneMaterial from "../vox/material/mcase/ScreenFixedPlaneMaterial";
import CameraTrack from "../vox/view/CameraTrack";

import TextureBlock from "../vox/texture/TextureBlock";


export namespace demo
{
    export class DemoRTTHalfSize
    {
        constructor()
        {
        }
        private m_texBlock:TextureBlock;
        private m_renderer:RendererInstance = null;
        private m_rcontext:RendererInstanceContext = null;
        private m_texLoader:ImageTextureLoader;
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        private m_camera:IRenderCamera = null;
        private m_viewSize:Vector3D = new Vector3D();
        initialize():void
        {
            console.log("DemoRTTHalfSize::initialize()......");
            if(this.m_rcontext == null)
            {
                RendererDevice.SHADERCODE_TRACE_ENABLED = true;
                RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
                //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
                DivLog.SetDebugEnabled(true);

                let rparam:RendererParam = new RendererParam();
                rparam.maxWebGLVersion = 1;
                rparam.setCamPosition(500.0,500.0,500.0);
                this.m_renderer = new RendererInstance();
                this.m_renderer.initialize(rparam, new CameraBase());
                this.m_renderer.appendProcess();
                this.m_renderer.appendProcess();
                this.m_renderer.appendProcess();
                this.m_rcontext = this.m_renderer.getRendererContext();
                this.m_camera = this.m_rcontext.getCamera();

                this.m_texBlock = new TextureBlock();
                this.m_texBlock.setRenderer( this.m_renderer.getRenderProxy() );
                this.m_texLoader = new ImageTextureLoader(this.m_texBlock);
                let tex0:TextureProxy = this.m_texLoader.getImageTexByUrl("static/assets/default.jpg");
                let tex1:TextureProxy = this.m_texLoader.getImageTexByUrl("static/assets/broken_iron.jpg");
                tex0.mipmapEnabled = true;
                tex0.setWrap(TextureConst.WRAP_REPEAT);
                tex1.setWrap(TextureConst.WRAP_REPEAT);
                tex1.mipmapEnabled = true;

                this.m_viewSize.x = this.m_rcontext.getStage3D().stageWidth;
                this.m_viewSize.y = this.m_rcontext.getStage3D().stageHeight;
                this.m_viewSize.z = Math.floor(this.m_viewSize.x * 0.5);
                this.m_viewSize.w = Math.floor(this.m_viewSize.y * 0.5);
                //  this.m_viewSize.z = Math.floor(this.m_rcontext.getStage3D().stageHalfWidth * 0.5);
                //  this.m_viewSize.w = Math.floor(this.m_rcontext.getStage3D().stageHalfHeight * 0.5);
                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rcontext.getCamera());
                // add common 3d display entity
                var plane:Plane3DEntity = new Plane3DEntity();
                plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[tex0]);
                //plane.initializeXOZ(-200.0,-150.0,400.0,300.0);
                this.m_renderer.addEntity(plane);

                let axis:Axis3DEntity = new Axis3DEntity();
                axis.initialize(300.0);
                this.m_renderer.addEntity(axis);

                let box:Box3DEntity = new Box3DEntity();
                box.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex1]);
                this.m_renderer.addEntity(box);
                
                let material:ScreenFixedPlaneMaterial = new ScreenFixedPlaneMaterial();
                let rttPlane:Plane3DEntity = new Plane3DEntity();
                rttPlane.setMaterial(material);
                rttPlane.initializeXOY(-1.0,-1.0,2.0,2.0,[this.m_texBlock.getRTTTextureAt(0)]);
                this.m_renderer.addEntity(rttPlane, 1);

                material = new ScreenFixedPlaneMaterial();
                rttPlane = new Plane3DEntity();
                rttPlane.setRenderState(RendererState.BACK_ADD_ALWAYS_STATE);
                rttPlane.setMaterial(material);
                //rttPlane.initialize(-1.0,-1.0,2.0,2.0,[this.m_texBlock.getRTTTextureAt(1)]);
                this.m_texBlock.createRTTTextureAt(1,256,256);
                rttPlane.initializeXOY(-1.0,-1.0,1.0,1.0,[this.m_texBlock.getRTTTextureAt(1)]);
                this.m_renderer.addEntity(rttPlane, 2);

                this.m_rcontext.createFBOAt(0,FrameBufferType.FRAMEBUFFER,this.m_viewSize.x,this.m_viewSize.y,true,false);
                this.m_rcontext.createFBOAt(1,FrameBufferType.FRAMEBUFFER,this.m_viewSize.z,this.m_viewSize.w,true,false);
                
                this.m_statusDisp.initialize();

            }
        }
        run():void
        {
            this.m_statusDisp.update();
            DivLog.ShowLogOnce("");
            let rinstance:RendererInstance = this.m_renderer;
            let pcontext:RendererInstanceContext = this.m_rcontext;
            //this.m_camera.perspectiveRH(this.m_camera.getFov(),this.m_camera.getAspect(),0.1,5000.0);
            //pcontext.setViewPort(0,0,this.m_viewSize.x,this.m_viewSize.y);
            pcontext.setClearRGBColor3f(0.0, 0.0, 0.0);
            pcontext.renderBegin();
            rinstance.update();
            //          rinstance.runAt(0);
            // --------------------------------------------- rtt begin
            pcontext.setClearRGBColor3f(0.1, 0.0, 0.1);
            pcontext.synFBOSizeWithViewport();
            pcontext.bindFBOAt(0,FrameBufferType.FRAMEBUFFER);
            pcontext.setRenderToTexture(this.m_texBlock.getRTTTextureAt(0), true, false, 0);
            pcontext.useFBO(true, true, false);
            rinstance.runAt(0);
            //              //pcontext.asynFBOSizeWithViewport();
            let renderAll:boolean = true;
            if(renderAll)
            {
                pcontext.setFBOSizeFactorWithViewPort(0.5);
                pcontext.bindFBOAt(1,FrameBufferType.FRAMEBUFFER);
                pcontext.setRenderToTexture(this.m_texBlock.getRTTTextureAt(1), true, false, 0);
                pcontext.useFBO(true, true, false);
                rinstance.runAt(0);
            }
            else
            {
                pcontext.asynFBOSizeWithViewport();
                pcontext.lockViewport();
                pcontext.setFBOSizeFactorWithViewPort(0.5);
                pcontext.bindFBOAt(1,FrameBufferType.FRAMEBUFFER);
                pcontext.setRenderToTexture(this.m_texBlock.getRTTTextureAt(1), true, false, 0);
                pcontext.useFBO(true, true, false);
                rinstance.runAt(0);
                pcontext.unlockViewport();
            }
            // --------------------------------------------- rtt end
            
            //pcontext.cameraUnlock();
            pcontext.setClearRGBColor3f(0.0, 3.0, 2.0);
            pcontext.setRenderToBackBuffer();
            rinstance.runAt(1);
            rinstance.runAt(2);
            //*/

            pcontext.runEnd();
            this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
            pcontext.updateCamera();
        }
        run2():void
        {
            let pcontext:RendererInstanceContext = this.m_rcontext;
            let rinstance:RendererInstance = this.m_renderer;
            // show fps status
            this.m_statusDisp.update();
            // 分帧加载
            //this.//m_texLoader.run();
            pcontext.setClearRGBColor3f(0.0, 0.0, 0.0);
            // render begin
            pcontext.renderBegin();
            // run logic program
            rinstance.update();
            // --------------------------------------------- rtt begin
            pcontext.setClearRGBColor3f(0.1, 0.0, 0.1);
            pcontext.synFBOSizeWithViewport();
            pcontext.setRenderToTexture(this.m_texBlock.getRTTTextureAt(0), true, false, 0);
            pcontext.useFBO(true, true, false);
            // to be rendering in framebuffer
            rinstance.runAt(0);
            // --------------------------------------------- rtt end
            pcontext.setClearRGBColor3f(0.0, 3.0, 2.0);
            pcontext.setRenderToBackBuffer();
            // to be rendering in backbuffer
            rinstance.runAt(1);
            // render end
            pcontext.runEnd();

            //this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
        }
    }
}
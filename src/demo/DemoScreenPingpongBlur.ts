
import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RendererInstanceContext from "../vox/scene/RendererInstanceContext";
import RendererInstance from "../vox/scene/RendererInstance";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import PingpongBlur from "../renderingtoy/mcase/PingpongBlur";

import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import {TextureConst} from "../vox/texture/TextureConst";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";

import { TextureBlock } from "../vox/texture/TextureBlock";
import CameraBase from "../vox/view/CameraBase";

export namespace demo
{
    export class DemoScreenPingpongBlur
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
        private m_blurIns:PingpongBlur = null;
        initialize():void
        {
            console.log("DemoScreenPingpongBlur::initialize()......");
            if(this.m_rcontext == null)
            {
                RendererDevice.SHADERCODE_TRACE_ENABLED = true;
                RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
                
                let rparam:RendererParam = new RendererParam();
                rparam.maxWebGLVersion = 2;
                rparam.setCamProject(45.0,0.1,3000.0);
                rparam.setCamPosition(1000.0,1000.0,1000.0);
                this.m_renderer = new RendererInstance();
                this.m_renderer.initialize(rparam, new CameraBase());
                this.m_renderer.appendProcess();
                this.m_renderer.appendProcess();
                
                this.m_texBlock = new TextureBlock();
                this.m_texBlock.setRenderer( this.m_renderer.getRenderProxy() );
                this.m_texLoader = new ImageTextureLoader(this.m_texBlock);
                
                let tex0:TextureProxy = this.m_texLoader.getImageTexByUrl("static/assets/default.jpg");
                let tex1:TextureProxy = this.m_texLoader.getImageTexByUrl("static/assets/broken_iron.jpg");
                tex0.mipmapEnabled = true;
                tex0.setWrap(TextureConst.WRAP_REPEAT);
                tex1.setWrap(TextureConst.WRAP_REPEAT);
                tex1.mipmapEnabled = true;
                
                this.m_blurIns = new PingpongBlur(this.m_renderer);
                this.m_blurIns.setSyncViewSizeEnabled(true);
                this.m_blurIns.bindSrcProcessId(0);
                this.m_rcontext = this.m_renderer.getRendererContext();
                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rcontext.getCamera());
                this.m_statusDisp.initialize();

                // add common 3d display entity
                let plane:Plane3DEntity = new Plane3DEntity();
                plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[tex0]);
                this.m_renderer.addEntity(plane);

                let box:Box3DEntity = new Box3DEntity();
                box.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex1]);
                this.m_renderer.addEntity(box);
            }
        }
        run():void
        {
            let pcontext:RendererInstanceContext = this.m_rcontext;
            let renderer:RendererInstance = this.m_renderer;
            this.m_statusDisp.update();

            this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
            pcontext.updateCamera();
            pcontext.setClearRGBColor3f(0.0, 0.0, 0.0);
            pcontext.renderBegin();
            
            renderer.update();
            //this.m_blurIns.syncViewportSize();
            this.m_blurIns.run(0);

            pcontext.runEnd();
        }
    }
}

import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import RenderAdapter from "../vox/render/RenderAdapter";
import RendererParam from "../vox/scene/RendererParam";
import RendererInstanceContext from "../vox/scene/RendererInstanceContext";
import RendererInstance from "../vox/scene/RendererInstance";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import {TextureConst} from "../vox/texture/TextureConst";
import TextureBlock from "../vox/texture/TextureBlock";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import DefaultMRTMaterial from "../vox/material/mcase/DefaultMRTMaterial";
import DivLog from "../vox/utils/DivLog";

export class DemoMRT
{
    constructor(){}
    private m_renderer:RendererInstance = null;
    private m_rcontext:RendererInstanceContext = null;
    private m_texLoader:ImageTextureLoader = null;
    private m_texBlock:TextureBlock;
    private m_camTrack:CameraTrack = null;
    private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
    
    initialize():void
    {
        console.log("DemoMRT::initialize()......");
        if(this.m_rcontext == null)
        {
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;

            this.m_statusDisp.initialize("rstatus");
            DivLog.SetDebugEnabled(true);
            let rparam:RendererParam = new RendererParam();
            rparam.maxWebGLVersion = 1;
            rparam.setCamPosition(800.0,800.0,800.0);
            this.m_renderer = new RendererInstance();
            this.m_renderer.initialize(rparam);
            this.m_renderer.appendProcess();
            this.m_rcontext = this.m_renderer.getRendererContext();

            this.m_texBlock = new TextureBlock();
            this.m_texBlock.setRenderer( this.m_renderer );
            this.m_texLoader = new ImageTextureLoader(this.m_texBlock);
            
            let tex0:TextureProxy = this.m_texLoader.getImageTexByUrl("static/assets/fruit_01.jpg");
            let tex1:TextureProxy = this.m_texLoader.getImageTexByUrl("static/assets/broken_iron.jpg");
            
            tex0.mipmapEnabled = true;
            tex0.setWrap(TextureConst.WRAP_REPEAT);
            tex1.mipmapEnabled = true;
            tex1.setWrap(TextureConst.WRAP_REPEAT);

            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rcontext.getCamera());

            // add common 3d display entity

            var plane:Plane3DEntity = new Plane3DEntity();
            plane.setMaterial(new DefaultMRTMaterial());
            plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[tex0]);
            this.m_renderer.addEntity(plane);
            this.m_renderer.addEntity(plane);

            let boxSize:number = 100.0;
            let box:Box3DEntity = new Box3DEntity();
            box.setMaterial(new DefaultMRTMaterial());
            box.initialize(new Vector3D(-boxSize,-boxSize,-boxSize),new Vector3D(boxSize,boxSize,boxSize),[tex1]);
            this.m_renderer.addEntity(box);

            boxSize = 100.0;
            // add mrt texture 3d display entity
            let boxMrt0:Box3DEntity = new Box3DEntity();
            boxMrt0.initialize(new Vector3D(-boxSize,-boxSize,-boxSize),new Vector3D(boxSize,boxSize,boxSize),[this.m_texBlock.getRTTTextureAt(0)]);
            boxMrt0.setXYZ(-150,0,-150);
            this.m_renderer.addEntity(boxMrt0, 1);
            let boxMrt1:Box3DEntity = new Box3DEntity();
            boxMrt1.name = "boxMrt1";
            boxMrt1.initialize(new Vector3D(-boxSize,-boxSize,-boxSize),new Vector3D(boxSize,boxSize,boxSize),[this.m_texBlock.getRTTTextureAt(1)]);
            boxMrt1.setXYZ(150,0,150);
            this.m_renderer.addEntity(boxMrt1, 1);
        }
    }
    run():void
    {
        
        this.m_texLoader.run();
        this.m_texBlock.run();

        let pcontext:RendererInstanceContext = this.m_rcontext;
        let rinstance:RendererInstance = this.m_renderer;
        let radapter:RenderAdapter = pcontext.getRenderAdapter();

        this.m_statusDisp.update();

        pcontext.setClearRGBColor3f(0.0, 0.0, 0.0);
        pcontext.renderBegin();
        rinstance.update();

        // --------------------------------------------- mrt begin
        pcontext.setClearRGBColor3f(0.1, 0.0, 0.1);
        radapter.synFBOSizeWithViewport();
        radapter.setRenderToTexture(this.m_texBlock.getRTTTextureAt(0), true, false, 0);
        radapter.setRenderToTexture(this.m_texBlock.getRTTTextureAt(1), true, false, 1);
        radapter.useFBO(true, true, false);
        rinstance.runAt(0);
        // --------------------------------------------- mrt end
        radapter.setRenderToBackBuffer();
        rinstance.runAt(1);

        pcontext.runEnd();            
        this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
        pcontext.updateCamera();
    }
}
export default DemoMRT;
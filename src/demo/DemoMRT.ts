import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import { IRenderAdapter } from "../vox/render/IRenderAdapter";
import RendererParam from "../vox/scene/RendererParam";
import RendererInstanceContext from "../vox/scene/RendererInstanceContext";
import RendererScene from "../vox/scene/RendererScene";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import TextureConst from "../vox/texture/TextureConst";
import { TextureBlock } from "../vox/texture/TextureBlock";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import DefaultMRTMaterial from "../vox/material/mcase/DefaultMRTMaterial";
import DivLog from "../vox/utils/DivLog";
import CameraBase from "../vox/view/CameraBase";
import FrameBufferType from "../vox/render/FrameBufferType";

export class DemoMRT {
    constructor() { }
    private m_rscene: RendererScene = null;
    private m_rcontext: RendererInstanceContext = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_camTrack: CameraTrack = null;

    private m_statusDisp = new RenderStatusDisplay();

    initialize(): void {
        console.log("DemoMRT::initialize()......");

        if (this.m_rscene) {

            RendererDevice.SHADERCODE_TRACE_ENABLED = true;

            this.m_statusDisp.initialize();

            DivLog.SetDebugEnabled(true);

            let rparam = new RendererParam();
            // rparam.maxWebGLVersion = 1;
            rparam.setCamPosition(800.0, 800.0, 800.0);

            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam);
            this.m_rcontext = this.m_rscene.getRendererContext() as any;

            this.m_texLoader = new ImageTextureLoader( this.m_rscene.textureBlock );

            let tex0 = this.m_texLoader.getImageTexByUrl("static/assets/fruit_01.jpg");
            let tex1 = this.m_texLoader.getImageTexByUrl("static/assets/broken_iron.jpg");

            // add common 3d display entity

            var plane = new Plane3DEntity();
            plane.setMaterial(new DefaultMRTMaterial());
            plane.initializeXOZ(-200.0, -150.0, 400.0, 300.0, [tex0]);
            this.m_rscene.addEntity(plane);
            this.m_rscene.addEntity(plane);

            let boxSize = 100.0;
            let box = new Box3DEntity();
            box.setMaterial(new DefaultMRTMaterial());
            box.initialize(new Vector3D(-boxSize, -boxSize, -boxSize), new Vector3D(boxSize, boxSize, boxSize), [tex1]);
            this.m_rscene.addEntity(box);

            let texBlock = this.m_rscene.textureBlock;

            boxSize = 100.0;
            // add mrt texture 3d display entity
            let boxMrt0 = new Box3DEntity();
            boxMrt0.initialize(new Vector3D(-boxSize, -boxSize, -boxSize), new Vector3D(boxSize, boxSize, boxSize), [texBlock.getRTTTextureAt(0)]);
            boxMrt0.setXYZ(-150, 0, -150);
            this.m_rscene.addEntity(boxMrt0, 1);

            let boxMrt1 = new Box3DEntity();
            boxMrt1.initialize(new Vector3D(-boxSize, -boxSize, -boxSize), new Vector3D(boxSize, boxSize, boxSize), [texBlock.getRTTTextureAt(1)]);
            boxMrt1.setXYZ(150, 0, 150);
            this.m_rscene.addEntity(boxMrt1, 1);
        }
    }
    run(): void {

        let texBlock = this.m_rscene.textureBlock;

        this.m_texLoader.run();

        let pcontext = this.m_rcontext;
        let rinstance = this.m_rscene;
        let radapter = pcontext.getRenderAdapter();
        
        this.m_statusDisp.update();

        pcontext.setClearRGBColor3f(0.0, 0.0, 0.0);
        pcontext.renderBegin();
        rinstance.update();

        // --------------------------------------------- mrt begin
        pcontext.setClearRGBColor3f(0.1, 0.0, 0.1);
        radapter.synFBOSizeWithViewport();
        radapter.setRenderToTexture(texBlock.getRTTTextureAt(0), true, false, 0);
        radapter.setRenderToTexture(texBlock.getRTTTextureAt(1), true, false, 1);
        radapter.useFBO(true, true, false);
        rinstance.runAt(0);

        // --------------------------------------------- mrt end
        radapter.setRenderToBackBuffer(FrameBufferType.FRAMEBUFFER);
        pcontext.setClearRGBColor3f(0.0, 0.0, 0.0);
        rinstance.runAt(1);

        pcontext.runEnd();
        this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
        pcontext.updateCamera();
    }
}
export default DemoMRT;

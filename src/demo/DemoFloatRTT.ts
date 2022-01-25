
import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RendererInstanceContext from "../vox/scene/RendererInstanceContext";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import TextureConst from "../vox/texture/TextureConst";
import TextureFormat from "../vox/texture/TextureFormat";
import TextureDataType from "../vox/texture/TextureDataType";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import RendererScene from "../vox/scene/RendererScene";
import RTTTextureProxy from "../vox/texture/RTTTextureProxy";
import { IRTTTexture } from "../vox/render/texture/IRTTTexture";

export class DemoFloatRTT {
    constructor() {
    }
    private m_rscene: RendererScene = null;
    private m_rcontext: RendererInstanceContext = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_rttTex: IRTTTexture = null;
    getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    initialize(): void {
        if (this.m_rcontext == null) {
            console.log("DemoFloatRTT::initialize()......");

            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

            let rparam: RendererParam = new RendererParam();
            rparam.maxWebGLVersion = 1;
            rparam.setCamPosition(500.0, 500.0, 500.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3);
            this.m_rscene.updateCamera();
            this.m_rcontext = this.m_rscene.getRendererContext();

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            let tex0: TextureProxy = this.getImageTexByUrl("static/assets/default.jpg");
            let tex1: TextureProxy = this.getImageTexByUrl("static/assets/broken_iron.jpg");

            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rcontext.getCamera());

            this.m_statusDisp.initialize();

            this.m_rttTex = this.m_rscene.textureBlock.createRTTTex2D(128, 128, false);
            this.m_rttTex.to2DTexture();
            this.m_rttTex.internalFormat = TextureFormat.RGBA16F;
            this.m_rttTex.srcFormat = TextureFormat.RGBA;
            this.m_rttTex.dataType = TextureDataType.HALF_FLOAT_OES;
            this.m_rttTex.minFilter = TextureConst.NEAREST;
            this.m_rttTex.magFilter = TextureConst.NEAREST;

            // add common 3d display entity
            let plane: Plane3DEntity = new Plane3DEntity();
            plane.initializeXOZ(-200.0, -150.0, 400.0, 300.0, [tex0]);
            this.m_rscene.addEntity(plane);

            let axis: Axis3DEntity = new Axis3DEntity();
            axis.initialize(300.0);
            this.m_rscene.addEntity(axis);

            let box: Box3DEntity = new Box3DEntity();
            box.initializeCube(200.0, [tex1]);
            this.m_rscene.addEntity(box);
            
            // add rtt texture 3d display entity
            let boxRtt: Box3DEntity = new Box3DEntity();
            //boxRtt.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[this.m_rscene.textureBlock.getRTTTextureAt(0)]);
            boxRtt.initializeCube(200.0, [this.m_rttTex]);
            this.m_rscene.addEntity(boxRtt, 1);

        }
    }
    run(): void {
        
        let pcontext: RendererInstanceContext = this.m_rcontext;
        // show fps status
        this.m_statusDisp.update();
        this.m_rscene.setClearRGBColor3f(0.0, 0.0, 0.0);
        // render begin
        this.m_rscene.runBegin();
        // run logic program
        this.m_rscene.update();

        // --------------------------------------------- rtt begin
        pcontext.setClearRGBColor3f(0.1, 0.0, 0.1);
        pcontext.synFBOSizeWithViewport();
        //pcontext.setRenderToTexture(this.m_rscene.textureBlock.getRTTTextureAt(0), true, false, 0);
        pcontext.setRenderToTexture(this.m_rttTex, true, false, 0);
        pcontext.useFBO(true, true, false);
        // to be rendering in framebuffer
        this.m_rscene.runAt(0);
        // --------------------------------------------- rtt end
        pcontext.setRenderToBackBuffer();
        // to be rendering in backbuffer
        this.m_rscene.runAt(1);

        // render end
        this.m_rscene.runEnd();

        this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
    }
}
export default DemoFloatRTT;
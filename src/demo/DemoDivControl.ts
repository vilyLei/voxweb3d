import MathConst from "../vox/math/MathConst";
import Matrix4 from "../vox/math/Matrix4";
import Matrix4Pool from "../vox/math/Matrix4Pool";
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RendererInstanceContext from "../vox/scene/RendererInstanceContext";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import MouseEvent from "../vox/event/MouseEvent";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Cylinder3DEntity from "../vox/entity/Cylinder3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import TextureConst from "../vox/texture/TextureConst";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import RendererScene from "../vox/scene/RendererScene";

export class DemoDivControl {
    constructor() {
    }
    private m_rscene: RendererScene = null;
    private m_rcontext: RendererInstanceContext = null;
    private m_texLoader: ImageTextureLoader;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    initialize(): void {
        console.log("DemoDivControl::initialize()......");
        if (this.m_rcontext == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

            //let div:any = document.getElementById("app");
            let div: HTMLDivElement = null;
            let rparam: RendererParam = new RendererParam(div);
            rparam.autoSyncRenderBufferAndWindowSize = false;
            rparam.maxWebGLVersion = 1;
            rparam.setCamPosition(500.0, 500.0, 500.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3);
            this.m_rscene.updateCamera();
            this.m_rcontext = this.m_rscene.getRendererContext() as any;
            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rcontext.getCamera());

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            let tex0: TextureProxy = this.getImageTexByUrl("static/assets/default.jpg");
            let tex1: TextureProxy = this.getImageTexByUrl("static/assets/broken_iron.jpg");
            this.m_statusDisp.initialize();

            let transMat: Matrix4 = new Matrix4();
            transMat.appendRotationEulerAngle(0.0, 0.0, MathConst.DegreeToRadian(90.0));
            //transMat.setTranslationXYZ(-200.0,0.0,0.0);
            let axis: Axis3DEntity = new Axis3DEntity();
            axis.initialize(300.0);
            this.m_rscene.addEntity(axis);

            let cylinder: Cylinder3DEntity = new Cylinder3DEntity();

            cylinder.setVtxTransformMatrix(transMat);
            cylinder.initialize(100.0, 200.0, 15, [tex1]);
            this.m_rscene.addEntity(cylinder);
        }
    }
    private mouseDown(): void {
        ///*
        this.m_rscene.getDiv().style.width = "600px";
        this.m_rscene.getDiv().style.height = "400px";

        //  this.m_div.style.width = "100%";
        //  this.m_div.style.height = "100%";
        this.m_rscene.updateRenderBufferSize();
        //*/
        console.log("mouse down.");
    }
    run(): void {
        // show fps status
        this.m_statusDisp.update();
        this.m_rscene.run();
        this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
    }
}
export default DemoDivControl;

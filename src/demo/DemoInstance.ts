
import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RendererInstanceContext from "../vox/scene/RendererInstanceContext";
import Stage3D from "../vox/display/Stage3D";
import CameraBase from "../vox/view/CameraBase";

import TextureProxy from "../vox/texture/TextureProxy";
import TextureConst from "../vox/texture/TextureConst";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import RendererScene from "../vox/scene/RendererScene";
class DemoInstance {
    constructor() {
    }
    protected m_rscene: RendererScene = null;
    protected m_rcontext: RendererInstanceContext = null;
    protected m_stage3D: Stage3D = null;
    protected m_camera: CameraBase = null;
    protected m_rparam: RendererParam = null;
    protected m_processTotal: number = 3;
    protected m_texLoader: ImageTextureLoader;
    getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    initialize(): void {
        if (this.m_rcontext == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

            this.m_rparam = new RendererParam();
            this.m_rparam.setCamPosition(500.0, 500.0, 500.0);
            this.initializeSceneParam(this.m_rparam);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(this.m_rparam, this.m_processTotal);
            this.m_rscene.updateCamera();
            this.m_rcontext = this.m_rscene.getRendererContext() as any;
            this.m_stage3D = this.m_rscene.getStage3D() as Stage3D;
            this.m_camera = this.m_rscene.getCamera();

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            this.initializeSceneObj();
        }
    }
    protected initializeSceneParam(param: RendererParam): void {

    }
    protected initializeSceneObj(): void {

    }
    run(): void {

    }

    runBegin(): void {
        // render begin
        this.m_rscene.runBegin();
        // run logic program
        this.m_rscene.update();

    }
    runEnd(): void {

        this.m_rscene.runEnd();
    }
}
export default DemoInstance;

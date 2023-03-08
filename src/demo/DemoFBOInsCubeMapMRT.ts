
import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import CubeMapMaterial from "../vox/material/mcase/CubeMapMaterial";
import CubeMapMRTMaterial from "../vox/material/mcase/CubeMapMRTMaterial";

import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import TextureConst from "../vox/texture/TextureConst";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";

import { EntityDisp } from "./base/EntityDisp";
import { EntityDispQueue } from "./base/EntityDispQueue";

import RendererScene from "../vox/scene/RendererScene";
import { IRendererInstanceContext } from "../vox/scene/IRendererInstanceContext";
import { MouseInteraction } from "../vox/ui/MouseInteraction";
import { IFBOInstance } from "../vox/scene/IFBOInstance";

export class DemoFBOInsCubeMapMRT {
    private m_rscene: RendererScene = null;
    // private m_rcontext: IRendererInstanceContext = null;
    private m_texLoader: ImageTextureLoader = null;
    // private m_equeue = new EntityDispQueue();
    constructor() {
    }

    getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    initialize(): void {
        console.log("DemoFBOInsCubeMapMRT::initialize()......");
        if (this.m_rscene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;

            let rparam = new RendererParam();
            rparam.setCamPosition(800.0, 800.0, 800.0);
            this.m_rscene = new RendererScene();
            // this.m_rscene.initialize(rparam).setAutoRunning(true);
            this.m_rscene.initialize(rparam);
            // this.m_rcontext = this.m_rscene.getRendererContext();
            
            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

			new MouseInteraction().initialize( this.m_rscene, 0, true).setAutoRunning(true);
			new RenderStatusDisplay( this.m_rscene, true);

            this.buildCubeMRT();
        }
    }
    private m_fboIns: IFBOInstance;
    private buildCubeMRT(): void {


        let tex0 = this.getImageTexByUrl("static/assets/default.jpg");
        let tex1 = this.getImageTexByUrl("static/assets/broken_iron.jpg");

        // add common 3d display entity ---------------------------------- begin
        
        var plane = new Plane3DEntity();
        plane.setMaterial(new CubeMapMRTMaterial());
        plane.initializeXOZ(-200.0, -150.0, 400.0, 300.0, [tex0]);
        this.m_rscene.addEntity(plane);

        let box = new Box3DEntity();
        box.setMaterial(new CubeMapMRTMaterial());
        box.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [tex1]);
        this.m_rscene.addEntity(box);

        // add common 3d display entity ---------------------------------- end

        // build rtt rendering process

        let fboIns = this.m_rscene.createFBOInstance();
        fboIns.setClearRGBAColor4f(0.3, 0.0, 0.0, 1.0);                 // set rtt background clear rgb(r=0.3,g=0.0,b=0.0) color
        fboIns.createFBOAt(0, 512, 512, true, false);
        fboIns.setRenderToCubeRTTTextureAt(0);                          // apply the first cube rtt texture, and apply the fbo framebuffer color attachment 0
        fboIns.setRProcessIDList([0]);
        this.m_fboIns = fboIns;
        this.m_rscene.prependRenderNode( fboIns );

        // add rtt texture 3d display entity
        let boxCubeMapMRT = new Box3DEntity();
        boxCubeMapMRT.useGourandNormal();
        boxCubeMapMRT.uuid = "boxCubeMapMRT";
        boxCubeMapMRT.setMaterial(new CubeMapMaterial());
        boxCubeMapMRT.initialize(new Vector3D(-80.0, -80.0, -80.0), new Vector3D(80.0, 80.0, 80.0), [fboIns.getRTTAt(0)]);
        this.m_rscene.addEntity(boxCubeMapMRT, 1);
        
        // let cubeMap0 = this.m_rscene.textureBlock.getCubeRTTTextureAt(0);
        // console.log("cubeMap0: ", cubeMap0);
        // console.log("fboIns.getRTTAt(0): ", fboIns.getRTTAt(0));
    }
    run1(): void {
        // this.m_rscene.run();
    }
    run(): void {

        this.m_rscene.setClearRGBColor3f(0.0, 0.3, 0.0);
        this.m_rscene.runBegin();
        this.m_rscene.update();

        // --------------------------------------------- fbo run begin
        this.m_fboIns.run(false, false, true , false);
        // --------------------------------------------- fbo run end

        this.m_rscene.setClearRGBColor3f(0.0, 0.3, 0.0);
        this.m_rscene.setRenderToBackBuffer();
        // this.m_rscene.runBegin();
        this.m_rscene.runAt(1);

        this.m_rscene.runEnd();
    }
    // run(): void {
        
    //     this.m_equeue.run();

    //     let pcontext = this.m_rcontext;
    //     let renderer = this.m_rscene;
        
    //     pcontext.unlockRenderState();
    //     pcontext.unlockMaterial();
    //     pcontext.renderBegin();
    //     renderer.update();

    //     // --------------------------------------------- cubemap mrt begin
    //     pcontext.setClearRGBColor3f(0.1, 0.0, 0.1);
    //     pcontext.setRenderToTexture(this.m_rscene.textureBlock.getCubeRTTTextureAt(0), true, false, 0);
    //     pcontext.useFBO(true, true, false);
    //     renderer.runAt(0);
    //     // --------------------------------------------- cubemap mrt end

    //     pcontext.setClearRGBColor3f(0.0, 0.3, 0.2);
    //     pcontext.setRenderToBackBuffer();
    //     pcontext.renderBegin();
    //     pcontext.unlockRenderState();
    //     renderer.runAt(1);

    //     pcontext.runEnd();
    //     pcontext.updateCamera();

    // }
}
export default DemoFBOInsCubeMapMRT;

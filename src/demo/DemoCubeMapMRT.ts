
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

export class DemoCubeMapMRT {
    private m_rscene: RendererScene = null;
    private m_rcontext: IRendererInstanceContext = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_equeue = new EntityDispQueue();
    constructor() {
    }

    getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    initialize(): void {
        
        console.log("DemoCubeMapMRT::initialize()......");
        if (this.m_rscene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;

            let rparam = new RendererParam();
            rparam.setCamPosition(800.0, 800.0, 800.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam);
            this.m_rcontext = this.m_rscene.getRendererContext();
            
            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

			new MouseInteraction().initialize( this.m_rscene, 0, true).setAutoRunning(true);
			new RenderStatusDisplay( this.m_rscene, true);

            let tex0 = this.getImageTexByUrl("static/assets/default.jpg");
            let tex1 = this.getImageTexByUrl("static/assets/broken_iron.jpg");

            // add common 3d display entity
            var plane: Plane3DEntity = new Plane3DEntity();
            plane.uuid = "plane";
            plane.setMaterial(new CubeMapMRTMaterial());
            plane.initializeXOZ(-200.0, -150.0, 400.0, 300.0, [tex0]);
            this.m_rscene.addEntity(plane, 0);

            let box: Box3DEntity = new Box3DEntity();
            box.uuid = "box";
            box.setMaterial(new CubeMapMRTMaterial());
            box.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [tex1]);
            this.m_rscene.addEntity(box, 0);

            // add rtt texture 3d display entity
            let boxCubeMapMRT: Box3DEntity = new Box3DEntity();
            boxCubeMapMRT.useGourandNormal();
            boxCubeMapMRT.uuid = "boxCubeMapMRT";
            boxCubeMapMRT.setMaterial(new CubeMapMaterial());
            boxCubeMapMRT.initialize(new Vector3D(-80.0, -80.0, -80.0), new Vector3D(80.0, 80.0, 80.0), [this.m_rscene.textureBlock.createCubeRTTTextureAt(0, 256, 256)]);
            this.m_rscene.addEntity(boxCubeMapMRT, 1);

            let disp: EntityDisp = this.m_equeue.addEntity(boxCubeMapMRT);
            disp.moveEnabled = false;

        }
    }
    run(): void {
        
        this.m_equeue.run();

        let pcontext = this.m_rcontext;
        let rsc = this.m_rscene;
        
        rsc.runBegin();
        rsc.update();
        // --------------------------------------------- cubemap mrt begin
        pcontext.setClearRGBColor3f(0.1, 0.0, 0.1);
        pcontext.setRenderToTexture(this.m_rscene.textureBlock.getCubeRTTTextureAt(0), true, false, 0);
        pcontext.useFBO(true, true, false);
        rsc.runAt(0);
        // --------------------------------------------- cubemap mrt end

        rsc.setClearRGBColor3f(0.0, 0.3, 0.2);
        rsc.setRenderToBackBuffer();
        rsc.runAt(1);

        rsc.runEnd();
        rsc.updateCamera();

    }
    
    run2(): void {
        
        this.m_equeue.run();

        let pcontext = this.m_rcontext;
        let renderer = this.m_rscene;
        
        pcontext.renderBegin();
        renderer.update();
        // --------------------------------------------- cubemap mrt begin
        pcontext.setClearRGBColor3f(0.1, 0.0, 0.1);
        pcontext.setRenderToTexture(this.m_rscene.textureBlock.getCubeRTTTextureAt(0), true, false, 0);
        pcontext.useFBO(true, true, false);
        renderer.runAt(0);
        // --------------------------------------------- cubemap mrt end

        pcontext.setClearRGBColor3f(0.0, 0.3, 0.2);
        pcontext.setRenderToBackBuffer();
        renderer.runAt(1);

        pcontext.runEnd();
        pcontext.updateCamera();

    }
    run1(): void {
        
        this.m_equeue.run();

        let pcontext = this.m_rcontext;
        let renderer = this.m_rscene;
        
        pcontext.renderBegin();
        renderer.update();

        // --------------------------------------------- cubemap mrt begin
        pcontext.setClearRGBColor3f(0.1, 0.0, 0.1);
        pcontext.setRenderToTexture(this.m_rscene.textureBlock.getCubeRTTTextureAt(0), true, false, 0);
        pcontext.useFBO(true, true, false);
        renderer.runAt(0);
        // --------------------------------------------- cubemap mrt end

        pcontext.setClearRGBColor3f(0.0, 0.3, 0.2);
        pcontext.setRenderToBackBuffer();
        pcontext.renderBegin();
        renderer.runAt(1);

        pcontext.runEnd();
        pcontext.updateCamera();

    }
}
export default DemoCubeMapMRT;

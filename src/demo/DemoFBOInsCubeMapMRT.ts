
import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import CubeMapMaterial from "../vox/material/mcase/CubeMapMaterial";
import CubeMapMRTMaterial from "../vox/material/mcase/CubeMapMRTMaterial";

import MouseEvent from "../vox/event/MouseEvent";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import TextureConst from "../vox/texture/TextureConst";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";

import RendererScene from "../vox/scene/RendererScene";
import { MouseInteraction } from "../vox/ui/MouseInteraction";
import { IFBOInstance } from "../vox/scene/IFBOInstance";
import IMouseEvent from "../vox/event/IMouseEvent";
import DebugFlag from "../vox/debug/DebugFlag";

export class DemoFBOInsCubeMapMRT {
    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader = null;
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
            this.m_rscene.initialize(rparam).setAutoRunning(true);
            // this.m_rscene.initialize(rparam);
            
            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

			new MouseInteraction().initialize( this.m_rscene, 0, true).setAutoRunning(true);
			new RenderStatusDisplay( this.m_rscene, true);

            this.buildCubeMRT();
        }
    }
    private mouseDown(evt: IMouseEvent): void {
        DebugFlag.Flag_0 = 1;
    }
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
        fboIns.setRProcessIDList([0], false);
        fboIns.setAutoRunning( true );

        // add rtt texture 3d display entity
        let boxCubeMapMRT = new Box3DEntity();
        boxCubeMapMRT.useGourandNormal();
        boxCubeMapMRT.uuid = "boxCubeMapMRT";
        boxCubeMapMRT.setMaterial(new CubeMapMaterial());
        boxCubeMapMRT.initialize(new Vector3D(-80.0, -80.0, -80.0), new Vector3D(80.0, 80.0, 80.0), [fboIns.getRTTAt(0)]);
        this.m_rscene.addEntity(boxCubeMapMRT, 1);
        
    }
    // run1(): void {
        
    //     this.m_rscene.run();
    // }
    // run2(): void {

    //     this.m_rscene.setClearRGBColor3f(0.0, 0.3, 0.0);
    //     this.m_rscene.runBegin();
    //     this.m_rscene.update();

    //     // --------------------------------------------- fbo run begin
    //     this.m_fboIns.run();
    //     // --------------------------------------------- fbo run end

    //     this.m_rscene.setRenderToBackBuffer();
    //     this.m_rscene.setClearRGBColor3f(0.0, 0.3, 0.0);
    //     this.m_rscene.runAt(1);

    //     this.m_rscene.runEnd();
    //     DebugFlag.Flag_0 = 0;
    // }
}
export default DemoFBOInsCubeMapMRT;

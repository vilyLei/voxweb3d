import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import TextureConst from "../vox/texture/TextureConst";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import RendererScene from "../vox/scene/RendererScene";
import { MouseInteraction } from "../vox/ui/MouseInteraction";
import DefaultMRTMaterial from "../vox/material/mcase/DefaultMRTMaterial";


export class DemoFBOInsMRT {
    
    constructor() { }
    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader = null;
    
    private getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    initialize(): void {
        if (this.m_rscene == null) {
            console.log("DemoFBOInsMRT::initialize()......");
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

            let rparam: RendererParam = new RendererParam();
            rparam.setCamPosition(500.0, 500.0, 500.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3).setAutoRunning( true );
            this.m_rscene.updateCamera();
            this.m_rscene.setClearRGBColor3f(0.0, 0.3, 0.0);

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);


			new MouseInteraction().initialize(this.m_rscene, 0, true).setAutoRunning(true);
			new RenderStatusDisplay(this.m_rscene, true);

            this.buildMRT();
        }
    }

    private buildMRT(): void {
        let tex0: TextureProxy = this.getImageTexByUrl("static/assets/default.jpg");
        let tex1: TextureProxy = this.getImageTexByUrl("static/assets/broken_iron.jpg");

        // add common 3d display entity ---------------------------------- begin
        var plane: Plane3DEntity = new Plane3DEntity();
        plane.setMaterial(new DefaultMRTMaterial());
        plane.initializeXOZ(-200.0, -150.0, 400.0, 300.0, [tex0]);
        this.m_rscene.addEntity(plane);

        let box: Box3DEntity = new Box3DEntity();
        box.setMaterial(new DefaultMRTMaterial());
        box.initializeCube(150.0, [tex1]);
        this.m_rscene.addEntity(box);
        // add common 3d display entity ---------------------------------- end

        let fboIns = this.m_rscene.createFBOInstance();
        fboIns.setClearRGBAColor4f(0.3, 0.0, 0.3, 1.0);         // set rtt background clear rgb(r=0.3,g=0.0,b=0.0) color
        fboIns.createFBOAt(0, 512, 512, true, false);
        fboIns.setRenderToRTTTextureAt(0, 0);                   // apply the first rtt texture, and apply the fbo framebuffer color attachment 0
        fboIns.setRenderToRTTTextureAt(1, 1);                   // apply the second rtt texture, and apply the fbo framebuffer color attachment 1
        fboIns.setRProcessIDList([0], false);
        this.m_rscene.prependRenderNode( fboIns );

        let mrtBox: Box3DEntity = new Box3DEntity();
        mrtBox.initializeCube(200.0, [fboIns.getRTTAt(0)]);
        mrtBox.setXYZ(-150, 0, -150);                           // set position in world space
        this.m_rscene.addEntity(mrtBox, 1);                     // add rttBox to The second renderer process

        mrtBox = new Box3DEntity();
        mrtBox.initializeCube(200.0, [fboIns.getRTTAt(1)]);
        mrtBox.setXYZ(150, 0, 150);                             // set position in world space
        this.m_rscene.addEntity(mrtBox, 1);                     // add rttBox to The second renderer process
    }
}
export default DemoFBOInsMRT;
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import { MouseInteraction } from "../vox/ui/MouseInteraction";
import IRenderTexture from "../vox/render/texture/IRenderTexture";


import RendererScene from "../vox/scene/RendererScene";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import NormalMaterial from "./material/NormalMaterial";

export class DemoNormalMap {

	private m_rscene: RendererScene;
    private m_init = true;
    private m_texLoader: ImageTextureLoader = null;
    private getTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): IRenderTexture {
        return this.m_texLoader.getTexByUrl(purl, wrapRepeat, mipmapEnabled);
    }
    constructor() { }

    initialize(): void {

        console.log("DemoNormalMap::initialize()......");

        if (this.m_init) {

			this.m_init = false;
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;

			let rparam = new RendererParam();
            rparam.setCamProject(45.0, 10.1, 9000.0);
            rparam.setCamPosition(2500.0, 2500.0, 2500.0);

            let rscene = this.m_rscene = new RendererScene();
            rscene.initialize(rparam);

            new MouseInteraction().initialize(rscene, 0, true).setAutoRunning(true);
            new RenderStatusDisplay(rscene, true);

            this.m_texLoader = new ImageTextureLoader(rscene.textureBlock);

			this.init3DScene();
        }
    }
	private init3DScene(): void {

		let diffuseTex = this.getTexByUrl("static/assets/noise.jpg");

		let material = new NormalMaterial();
		material.setTextureList([diffuseTex]);
		material.normalEnabled = true;

		let plane = new Plane3DEntity();
		plane.normalEnabled = true;
		plane.setMaterial(material);
		plane.initializeXOZSquare(900);
		this.m_rscene.addEntity(plane);
	}
    run(): void {
       this.m_rscene.run();
    }
}
export default DemoNormalMap;

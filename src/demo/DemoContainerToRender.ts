import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import TextureProxy from "../vox/texture/TextureProxy";
import TextureConst from "../vox/texture/TextureConst";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import RendererScene from "../vox/scene/RendererScene";
import { MouseInteraction } from "../vox/ui/MouseInteraction";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import RenderableEntityContainer from "../vox/entity/RenderableEntityContainer";
import Box3DEntity from "../vox/entity/Box3DEntity";
import ProfileInstance from "../voxprofile/entity/ProfileInstance";
import Billboard3DEntity from "../vox/entity/Billboard3DEntity";
import MouseEvent from "../vox/event/MouseEvent";
import DisplayEntity from "../vox/entity/DisplayEntity";
import IRenderEntityBase from "../vox/render/IRenderEntityBase";

export class DemoContainerToRender {
	private m_rscene: RendererScene = null;
	private m_texLoader: ImageTextureLoader = null;

    private m_profileInstance: ProfileInstance = null;

	constructor() {}

	private getTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
		let ptex = this.m_texLoader.getImageTexByUrl(purl);
		ptex.mipmapEnabled = mipmapEnabled;
		if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
		return ptex;
	}
	initialize(): void {

		console.log("DemoContainerToRender::initialize()......");

		if (this.m_rscene == null) {

			RendererDevice.SHADERCODE_TRACE_ENABLED = false;

			let rparam = new RendererParam();
			rparam.setAttriAntialias(true);
			rparam.setCamProject(45.0, 10.1, 3000.0);
			rparam.setCamPosition(1500.0, 1500.0, 1500.0);

			this.m_rscene = new RendererScene();
			this.m_rscene.initialize(rparam);
			this.m_rscene.setClearRGBColor3f(0.1, 0.3, 0.2);
			this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownListener);
			// this.m_profileInstance = new ProfileInstance();
            // this.m_profileInstance.initialize(this.m_rscene.getRenderer());

			new RenderStatusDisplay(this.m_rscene, true);
			new MouseInteraction().initialize(this.m_rscene, 0, true).setAutoRunning(true);

			this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

			this.init3DScene();
		}
	}
	// private m_target: RenderableEntityContainer = null;
	private m_target: IRenderEntityBase = null;
	private init3DScene(): void {

		// let axis = new Axis3DEntity();
		// axis.initialize(300);
		// this.m_rscene.addEntity(axis);

		let billboard = new Billboard3DEntity();
		billboard.setXYZ(100,100,-200);
		billboard.initialize(100, 100, [this.getTexByUrl("static/assets/flare_core_03.jpg")]);
		billboard.setRGB3f(1.0, 0.3, 0.4);
		this.m_rscene.addEntity(billboard);

		let container = new RenderableEntityContainer();
		this.m_target = container;
		this.m_rscene.addEntity(container);

		let box = new Box3DEntity();
		box.normalEnabled = true;
		box.initializeCube(30);
		container.addChild(box);
		// this.m_target = box;
		// this.m_rscene.addEntity(box);

		box = new Box3DEntity();
		box.normalEnabled = true;
		box.initializeCube(30);
		box.setXYZ(0, 0, 1000);
		container.addChild(box);

		box = new Box3DEntity();
		box.normalEnabled = true;
		box.initializeCube(30);
		box.setXYZ(1000, 0, 0);
		container.addChild(box);


		let subContainer = new RenderableEntityContainer();

		billboard = new Billboard3DEntity();
		billboard.setXYZ(100,100,200);
		billboard.initialize(100, 100, [this.getTexByUrl("static/assets/flare_core_03.jpg")]);
		billboard.setRGB3f(0.0, 0.9, 0.1);
		subContainer.addEntity(billboard);

		container.addEntity(subContainer);

	}
	mouseDownListener(evt: any): void {
		console.log("this.m_target.isInRenderer(): ", this.m_target.isInRenderer());
		if(this.m_target.isInRenderer()) {
			// this.m_rscene.removeContainer( this.m_target );
			this.m_rscene.removeEntity( this.m_target );
		}else {
			this.m_rscene.addEntity( this.m_target );
		}
	}
	run(): void {
		if (this.m_rscene != null) {
			this.m_rscene.run();

			if (this.m_profileInstance != null) {
				this.m_profileInstance.run();
			}
		}
	}
}
export default DemoContainerToRender;

import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import TextureProxy from "../vox/texture/TextureProxy";
import TextureConst from "../vox/texture/TextureConst";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import RendererScene from "../vox/scene/RendererScene";
import { MouseInteraction } from "../vox/ui/MouseInteraction";
import IRendererScene from "../vox/scene/IRendererScene";
import Box3DEntity from "../vox/entity/Box3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import DisplayEntityContainer from "../vox/entity/DisplayEntityContainer";
import Torus3DEntity from "../vox/entity/Torus3DEntity";
import IDefault3DMaterial from "../vox/material/mcase/IDefault3DMaterial";
import Cylinder3DEntity from "../vox/entity/Cylinder3DEntity";
import Color4 from "../vox/material/Color4";
import Cone3DEntity from "../vox/entity/Cone3DEntity";
import EventBase from "../vox/event/EventBase";
import MouseEvent from "../vox/event/MouseEvent";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";

class Clock {
	private m_rc: IRendererScene = null;
    private m_hourHand: DisplayEntityContainer;
    private m_minutesHand: DisplayEntityContainer;
    private m_secondsHand: DisplayEntityContainer;
    private m_body: DisplayEntityContainer;
	constructor() {}

	initialize(rc: IRendererScene, radius: number): void {

		if (this.m_rc == null && rc) {
			this.m_rc = rc;

			let bodyContainer  = this.m_body = new DisplayEntityContainer();
			this.m_rc.addEntity(bodyContainer);
			this.initHourItem(radius, bodyContainer);
			this.m_hourHand = this.createHand(3, radius * 0.4, new Color4(0.7, 0.3, 0.0));
			bodyContainer.addChild(this.m_hourHand);
			this.m_minutesHand = this.createHand(2, radius * 0.6, new Color4(0.7, 0.9, 0.0));
			bodyContainer.addChild(this.m_minutesHand);
            //m_secondsHand
			this.m_secondsHand = this.createHand(1, radius * 0.8, new Color4(0.7, 0.2, 0.7));
			bodyContainer.addChild(this.m_secondsHand);

            this.m_rc.addEventListener(EventBase.ENTER_FRAME, this, this.enterFrame);
            this.m_rc.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
		}
	}
	private createHand(radius: number, long: number, color: Color4): DisplayEntityContainer {
		let container = new DisplayEntityContainer();
		let body = new Cylinder3DEntity();
		body.normalEnabled = true;
		body.initialize(radius, long * 0.8, 20, null, 1, 0.0);
		(body.getMaterial() as IDefault3DMaterial).setColor(color);
		container.addChild(body);
		let head = new Cone3DEntity();
		head.normalEnabled = true;
		head.initialize(radius + 3, long * 0.2, 20, null, 1, 0.0);
		(head.getMaterial() as IDefault3DMaterial).setColor(color);
		head.setXYZ(0.0, long * 0.8, 0.0);
		container.addChild(head);

		return container;
	}
	private initHourItem(radius: number, container: DisplayEntityContainer): void {
		let itemBox = new Box3DEntity();
		itemBox.normalEnabled = true;
		itemBox.initializeSizeXYZ(10, 20, 10);

		for (let i = 0; i < 12; ++i) {
			const fk = i / 12.0;
			const rad = Math.PI * 2.0 * fk;
			const py = radius * Math.cos(rad);
			const pz = radius * Math.sin(rad);
			const degree = 360.0 * fk;

			let item = new Box3DEntity();
			item.normalEnabled = true;
			item.setMesh(itemBox.getMesh());
			item.initializeCube(10);
			(item.getMaterial() as IDefault3DMaterial).setRGB3f(0.8 * fk, 0.5, 0.9);
			item.setXYZ(0.0, py, pz);
			item.setRotationXYZ(degree, 0.0, 0.0);
			container.addChild(item);
		}
		let ring = new Torus3DEntity();
		ring.normalEnabled = true;
		ring.initialize(radius + 15, 5, 30, 50);
		(ring.getMaterial() as IDefault3DMaterial).setRGB3f(0.1, 0.5, 0.8);
		container.addChild(ring);

        let center = new Sphere3DEntity();
        center.normalEnabled = true;
        center.initialize(5, 20, 20);
		(center.getMaterial() as IDefault3DMaterial).setRGB3f(0.3, 0.7, 0.8);
		container.addChild(center);

        let base = new Cylinder3DEntity();
        base.normalEnabled = true;
        base.initialize(radius + 20, 8, 50);
        base.setXYZ(-5,0,0);
        base.setRotationXYZ(0,0,90);
		(base.getMaterial() as IDefault3DMaterial).setRGB3f(0.1, 0.2, 0.5);
		container.addChild(base);
	}
    private m_seconds = -1;
    private m_degree = 0.0;
    private m_play = true;
	private mouseDown(): void {
        if(this.m_play) {
            this.stop();
        }else {
            this.play();
        }
    }
	private play(): void {
        this.m_play = true;
    }
	private stop(): void {
        this.m_play = false;
    }
	private enterFrame(): void {

        var d = new Date();
        let seconds = d.getSeconds();
        
        if(this.m_seconds != seconds) {
            this.m_seconds = seconds;

            let hour = d.getHours() % 12;
            let degree = 360.0 * hour / 12.0;
            this.m_hourHand.setRotationXYZ(-degree, 0.0, 0.0);
            this.m_hourHand.update();
    
            let minutes = d.getMinutes();
            degree = 360.0 * minutes / 60.0;
            this.m_minutesHand.setRotationXYZ(-degree, 0.0, 0.0);
            this.m_minutesHand.update();
    
            degree = 360.0 * seconds / 60.0;
            this.m_secondsHand.setRotationXYZ(-degree, 0.0, 0.0);
            this.m_secondsHand.update();
        }
        if(this.m_play) {
            this.m_body.setRotationY(this.m_degree);
            this.m_degree += 0.5;
        }
    }
}
export class DemoEntityContainer {
	private m_rscene: RendererScene = null;
	private m_texLoader: ImageTextureLoader = null;

	constructor() {}

	private getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
		let ptex = this.m_texLoader.getImageTexByUrl(purl);
		ptex.mipmapEnabled = mipmapEnabled;
		if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
		return ptex;
	}
	initialize(): void {
		console.log("DemoEntityContainer::initialize()......");
		if (this.m_rscene == null) {
			RendererDevice.SHADERCODE_TRACE_ENABLED = true;

			let rparam = new RendererParam();
			rparam.setAttriAntialias(true);
			rparam.setCamProject(45.0, 10.1, 3000.0);
			rparam.setCamPosition(1500.0, 1500.0, 1500.0);

			this.m_rscene = new RendererScene();
			this.m_rscene.initialize(rparam);
			this.m_rscene.setClearRGBColor3f(0.1, 0.3, 0.2);

			new RenderStatusDisplay(this.m_rscene, true);
			new MouseInteraction().initialize(this.m_rscene, 0, true).setAutoRunning(true);

			this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

			let tex0 = this.getImageTexByUrl("static/assets/default.jpg");
			let tex1 = this.getImageTexByUrl("static/assets/broken_iron.jpg");
			let tex2 = this.getImageTexByUrl("static/assets/guangyun_H_0007.png");

			// let axis = new Axis3DEntity();
			// axis.initialize(300);
			// this.m_rscene.addEntity(axis);

			let clock = new Clock();
			clock.initialize(this.m_rscene, 100.0);
		}
	}
	mouseDownListener(evt: any): void {
		console.log("mouseDownListener call, this.m_rscene: ", this.m_rscene.toString());
	}
	run(): void {
		if (this.m_rscene != null) {
			this.m_rscene.run();
		}
	}
}
export default DemoEntityContainer;

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
import { PBRParam, PBRMateralBuilder } from "./material/PBRMateralBuilder";
import IDisplayEntityContainer from "../vox/entity/IDisplayEntityContainer";
import IColor4 from "../vox/material/IColor4";
import IRenderMaterial from "../vox/render/IRenderMaterial";
import Line3DEntity from "../vox/entity/Line3DEntity";
import Vector3D from "../vox/math/Vector3D";
import DisplayEntity from "../vox/entity/DisplayEntity";
import ImageTextureAtlas from "../vox/texture/ImageTextureAtlas";
import Default3DMaterial from "../vox/material/mcase/Default3DMaterial";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import RendererState from "../vox/render/RendererState";

class ClockEntity {
	private static s_pbr: PBRMateralBuilder = null;
	private m_rc: IRendererScene = null;
	private m_hourHand: IDisplayEntityContainer;
	private m_minutesHand: IDisplayEntityContainer;
	private m_secondsHand: IDisplayEntityContainer;
	private m_body: IDisplayEntityContainer;
	constructor() {}

	initialize(rc: IRendererScene, radius: number): void {
		if (this.m_rc == null && rc) {
			this.m_rc = rc;

			if (ClockEntity.s_pbr == null) {
				const pbr = (ClockEntity.s_pbr = new PBRMateralBuilder());
				pbr.sharedLightColor = false;
				pbr.initialize(this.m_rc);
			}

			let bodyContainer = (this.m_body = new DisplayEntityContainer(true, true));
			this.m_rc.addEntity(bodyContainer, 2);
			this.initTimeItem(radius, bodyContainer);
			let long = radius * 0.4;
			this.m_hourHand = this.createHand(3, long, long * 0.3, new Color4(0.7, 0.3, 0.0), true, radius * 1.0);
			bodyContainer.addChild(this.m_hourHand);
			long = radius * 0.6;
			this.m_minutesHand = this.createHand(2, long, long * 0.2, new Color4(0.7, 0.9, 0.0), true, radius * 1.0);
			bodyContainer.addChild(this.m_minutesHand);
			long = radius * 0.8;
			this.m_secondsHand = this.createHand(1, long, long * 0.15, new Color4(0.7, 0.2, 0.7));
			bodyContainer.addChild(this.m_secondsHand);

			this.createText(radius);

			this.m_rc.addEventListener(EventBase.ENTER_FRAME, this, this.enterFrame);
			this.m_rc.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
		}
	}
	private createMaterial(color: IColor4): IRenderMaterial {
		const pbr = ClockEntity.s_pbr;
		let material = pbr.createMaterial(Math.random(), Math.random() * 0.2 + 0.8, 1.3, color);
		return material;
	}
	private createMaterial2(roughness: number, metallic: number): IRenderMaterial {
		const pbr = ClockEntity.s_pbr;
		let material = pbr.createMaterial(roughness, metallic, 1.3);
		return material;
	}
	private createHand(
		radius: number,
		long: number,
		headLong: number,
		color: IColor4,
		haveLine: boolean = false,
		lineLong: number = 10.0
	): IDisplayEntityContainer {
		let container = new DisplayEntityContainer(true, true);

		let material = this.createMaterial(color);

		// let body = VoxEntity.createCylinder(radius, long * 0.8, 20, material, false, 1, 0.0);
		let body = new Cylinder3DEntity();
		body.setMaterial(material);
		body.initialize(radius, long * 0.8, 20, null, 1, 0.0);
		container.addChild(body);
		// let head = VoxEntity.createCone(radius + 3, headLong, 20, material, false, 0.0);
		let head = new Cone3DEntity();
		head.setMaterial(material);
		head.initialize(radius + 3, headLong, 20);
		head.setXYZ(0.0, long * 0.8, 0.0);
		container.addChild(head);
		if (haveLine) {
			let line = new Line3DEntity();
			line.dynColorEnabled = true;
			line.initialize(new Vector3D(), new Vector3D(0.0, lineLong, 0.0));
			let color = new Color4(0.1, 0.2, 0.1);
			line.setRGB3f(color.r, color.g, color.b);
			// let line = VoxEntity.createLine(new Vector3D(), new Vector3D(0.0, lineLong, 0.0), new Color4(0.1, 0.2, 0.1));
			container.addChild(line);
		}

		return container;
	}
	private createText(radius: number): void {
		// let canvasBuilder = VoxTexture.createCanvasTexAtlas();
		let canvasBuilder = new ImageTextureAtlas(this.m_rc, 512, 512);
		// canvasBuilder.initialize(this.m_rc, 512, 512);
		// canvasBuilder.setFontName("Franklin Gothic Heavy");
		let size = 32;

		// document.body.appendChild(canvas);
		let container = new DisplayEntityContainer();

		// material.setRGB3f(0.3, 0.7, 0.8);
		let material = this.createMaterial2(0.9, 0.3);

		// let base = VoxEntity.createCylinder(radius + 20, 8, 50, material);
		let base = new Cylinder3DEntity();
		base.setMaterial(material);
		base.initialize(radius + 20, 8, 50);
		base.setXYZ(-5, 0, 0);
		base.setRotationXYZ(0, 0, 90);
		this.m_rc.addEntity(base);

		let canvas = canvasBuilder.createCharsCanvasFixSize(size, size, "-", 30);
		let tex = this.m_rc.textureBlock.createImageTex2D();
		tex.setDataFromImage(canvas);
		material = new Default3DMaterial();
		material.setTextureList([tex]);
		// let planeSrc = VoxEntity.createYOZPlane(-0.5 * size, -0.5 * size, size, size, material);
		let planeSrc = new Plane3DEntity();
		planeSrc.setMaterial(material);
		planeSrc.initializeYOZ(-0.5 * size, -0.5 * size, size, size);

		let r = radius * 0.8;
		for (let i = 0; i < 12; ++i) {
			let sx = 0.1;
			let sy = 0.5;
			if (i % 5 == 0) {
				sy = 1.0;
			}
			let sz = 0.1;

			const fk = i / 12.0;
			const rad = Math.PI * 2.0 * fk;
			const py = r * Math.cos(rad);
			const pz = r * Math.sin(rad);

			let canvas = canvasBuilder.createCharsCanvasFixSize(size + 32, size + 32, 12 - i + "", 30, new Color4(), new Color4(1, 1, 1, 0));
			let tex = this.m_rc.textureBlock.createImageTex2D();
			tex.setDataFromImage(canvas);

			let material = new Default3DMaterial();
			material.setTextureList([tex]);
			material.initializeByCodeBuf(true);
			let plane = new DisplayEntity();
			plane.setRenderState(RendererState.FRONT_TRANSPARENT_STATE);
			plane.copyMeshFrom(planeSrc);
			plane.setMaterial(material);
			plane.setXYZ(2.0, py, pz);
			plane.setScaleXYZ(1.0, -1.0, 1.0);
			plane.setRotationXYZ(90, 0, 0);
			container.addEntity(plane);
		}

		this.m_rc.addEntity(container, 1);
	}
	private initTimeItem(radius: number, container: IDisplayEntityContainer): void {
		let material = this.createMaterial(null);
		let itemBox = new Box3DEntity();
		itemBox.setMaterial(material);
		itemBox.initialize(new Vector3D(-5, -20, -10), new Vector3D(5, 0, 10));
		// let itemBox = VoxEntity.createBox(new Vector3D(-5, -20, -10), new Vector3D(5, 0, 10), material);

		let r = radius + 10;
		for (let i = 0; i < 60; ++i) {
			let sx = 0.1;
			let sy = 0.5;
			if (i % 5 == 0) {
				sy = 1.0;
			}
			let sz = 0.1;

			const fk = i / 60.0;
			const rad = Math.PI * 2.0 * fk;
			const py = r * Math.cos(rad);
			const pz = r * Math.sin(rad);
			const degree = 360.0 * fk;

			material = this.createMaterial(new Color4(0.8 * fk, 0.5, 0.9));
			material.initializeByCodeBuf(false);

			const item = new DisplayEntity();
			item.setMaterial(material).setMesh(itemBox.getMesh());
			item.setXYZ(0.0, py, pz)
				.setRotationXYZ(degree, 0.0, 0.0)
				.setScaleXYZ(sx, sy, sz);
			container.addChild(item);
		}

		material = this.createMaterial(new Color4(0.1, 0.5, 0.8));

		// let ring = VoxEntity.createTorus(radius + 15, 5, 30, 100, 0, material);
		let ring = new Torus3DEntity();
		ring.axisType = 0;
		ring.setMaterial(material);
		ring.initialize(radius + 15, 5, 30, 100);
		container.addChild(ring);

		material = this.createMaterial(new Color4(0.3, 0.7, 0.8));

		// let center = VoxEntity.createSphere(5, 20, 20, material);
		let center = new Sphere3DEntity();
		center.setMaterial(material);
		center.initialize(5, 20, 20);
		container.addChild(center);
	}
	private m_seconds = -1;
	private m_degree = 0.0;
	private m_play = true;
	private mouseDown(): void {
		if (this.m_play) {
			this.stop();
		} else {
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

		if (this.m_seconds != seconds) {
			this.m_seconds = seconds;

			let hour = d.getHours() % 12;
			let minutes = d.getMinutes();

			let degree = (360.0 * (hour * 60 + minutes) * 60) / 43200;
			this.m_hourHand.setRotationXYZ(-degree, 0.0, 0.0);
			this.m_hourHand.update();

			degree = (360.0 * (minutes * 60 + seconds)) / 3600.0;
			this.m_minutesHand.setRotationXYZ(-degree, 0.0, 0.0);
			this.m_minutesHand.update();

			degree = (360.0 * seconds) / 60.0;
			this.m_secondsHand.setRotationXYZ(-degree, 0.0, 0.0);
			this.m_secondsHand.update();
		}
		// if (this.m_play) {
		// 	this.m_body.setRotationY(this.m_degree);
		// 	this.m_degree += 0.5;
		// }
	}
}
export class DemoEntityContainerRender {
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
		console.log("DemoEntityContainerRender::initialize()......");
		if (this.m_rscene == null) {
			RendererDevice.SHADERCODE_TRACE_ENABLED = true;

			let rparam = new RendererParam();
			rparam.setAttriAntialias(true);
			rparam.setCamProject(45.0, 10.1, 3000.0);
			rparam.setCamPosition(1500.0, 1500.0, 1500.0);

			this.m_rscene = new RendererScene();
			this.m_rscene.initialize(rparam);
			this.m_rscene.setClearRGBColor3f(0.1, 0.3, 0.2);

			this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownListener);

			new RenderStatusDisplay(this.m_rscene, true);
			new MouseInteraction().initialize(this.m_rscene, 0, true).setAutoRunning(true);

			this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

			let clock = new ClockEntity();
			clock.initialize(this.m_rscene, 100.0);
		}
	}
	private m_flag = 1;
	mouseDownListener(evt: any): void {
		console.log("mouseDownListener call, this.m_rscene: ", this.m_rscene.toString());
		this.m_flag = 1;
	}
	run(): void {
		if (this.m_flag > 0) {
			if (this.m_rscene != null) {
				this.m_rscene.run();
			}
			// this.m_flag = 0;
		}
	}
}
export default DemoEntityContainerRender;

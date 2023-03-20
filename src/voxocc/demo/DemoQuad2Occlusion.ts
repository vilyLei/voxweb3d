import Vector3D from "../../vox/math/Vector3D";
import { CubeRandomRange } from "../../vox/utils/RandomRange";
import RendererDevice from "../../vox/render/RendererDevice";
import RendererParam from "../../vox/scene/RendererParam";
import TextureProxy from "../../vox/texture/TextureProxy";
import ImageTextureLoader from "../../vox/texture/ImageTextureLoader";
import RendererScene from "../../vox/scene/RendererScene";
import MouseEvent from "../../vox/event/MouseEvent";
import Stage3D from "../../vox/display/Stage3D";
import H5FontSystem from "../../vox/text/H5FontSys";

import DisplayEntity from "../../vox/entity/DisplayEntity";
import Axis3DEntity from "../../vox/entity/Axis3DEntity";
import Box3DEntity from "../../vox/entity/Box3DEntity";
import BillboardFrame from "../../vox/entity/BillboardFrame";
import ProfileInstance from "../../voxprofile/entity/ProfileInstance";
import CameraTrack from "../../vox/view/CameraTrack";
import BrokenLine3DEntity from "../../vox/entity/BrokenLine3DEntity";
import { QuadPOV } from "../../voxocc/occlusion/QuadPOV";
import QuadGapPOV from "../../voxocc/occlusion/QuadGapPOV";
import IRendererSpace from "../../vox/scene/IRendererSpace";
import { SpaceCullingMask } from "../../vox/space/SpaceCullingMask";
import SpaceCullingor from "../../vox/scene/SpaceCullingor";
import { MouseInteraction } from "../../vox/ui/MouseInteraction";
import RenderStatusDisplay from "../../vox/scene/RenderStatusDisplay";
import DebugFlag from "../../vox/debug/DebugFlag";

export class DemoQuad2Occlusion {
	constructor() {}

	private m_rscene: RendererScene = null;
	private m_texLoader: ImageTextureLoader;

	private m_quadOccObj = new QuadPOV();
	private m_quadOccObj0 = new QuadGapPOV();
	// private m_quadOccObj1: QuadGapPOV = new QuadGapPOV();
	private m_dispList: DisplayEntity[] = [];
	private m_frameList: BillboardFrame[] = [];
	initialize(): void {
		console.log("DemoQuad2Occlusion::initialize()......");
		if (this.m_rscene == null) {

			RendererDevice.SHADERCODE_TRACE_ENABLED = true;

			let rparam = new RendererParam();
			rparam.setCamProject(45.0, 50.0, 8000.0);
			rparam.setCamPosition(1500.0, 1500.0, 1500.0);

			this.m_rscene = new RendererScene();
			this.m_rscene.initialize(rparam, 3);
			this.m_rscene.setRendererProcessParam(1, true, true);
			this.m_rscene.setClearRGBColor3f(0.0, 0.1, 0.1);

			let rspace = this.m_rscene.getSpace();

			new MouseInteraction().initialize(this.m_rscene).setAutoRunning(true);
			new RenderStatusDisplay(this.m_rscene, true);

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownListener);

            this.m_texLoader = new ImageTextureLoader( this.m_rscene.textureBlock );

			let tex1 = this.m_texLoader.getImageTexByUrl("static/assets/broken_iron.jpg");

			let i = 0;

			let offsetPV = new Vector3D();
			let tx = 600.0;
			let tz = -1500.0;

			tz = -100.0;
			let posList: Vector3D[] = [
				new Vector3D(-tx + offsetPV.x, 600.0 + offsetPV.y, tz + offsetPV.z),
				new Vector3D(tx + offsetPV.x, 600.0 + offsetPV.y, tz + offsetPV.z),
				new Vector3D(tx + offsetPV.x, -600.0 + offsetPV.y, tz + offsetPV.z),
				new Vector3D(-tx + offsetPV.x, -600.0 + offsetPV.y, tz + offsetPV.z)
			];
			let dispLS:BrokenLine3DEntity;// = new BrokenLine3DEntity();
			///*
			this.m_quadOccObj.setCamPosition(this.m_rscene.getCamera().getPosition());
			this.m_quadOccObj.setParam(posList[0], posList[1], posList[2], posList[3]);
			this.m_quadOccObj.updateOccData();

			dispLS = new BrokenLine3DEntity();
			dispLS.initializeQuad(posList[0], posList[1], posList[2], posList[3]);
			dispLS.setRGB3f(1.0, 1.0, 0.0);
			this.m_rscene.addEntity(dispLS);
			//*/
			let axis = new Axis3DEntity();
			axis.initialize(300.0);
			this.m_rscene.addEntity(axis);

			offsetPV.x = 250.0;
			tx = 150.0;
			posList = [
				new Vector3D(-tx + offsetPV.x, 150.0 + offsetPV.y, tz + offsetPV.z),
				new Vector3D(tx + offsetPV.x, 150.0 + offsetPV.y, tz + offsetPV.z),
				new Vector3D(tx + offsetPV.x, -150.0 + offsetPV.y, tz + offsetPV.z),
				new Vector3D(-tx + offsetPV.x, -150.0 + offsetPV.y, tz + offsetPV.z)
			];
            ///*
			this.m_quadOccObj0.setCamPosition(this.m_rscene.getCamera().getPosition());
			this.m_quadOccObj0.setParam(posList[0], posList[1], posList[2], posList[3]);
			this.m_quadOccObj0.updateOccData();
			this.m_quadOccObj.addSubPov(this.m_quadOccObj0);
			dispLS = new BrokenLine3DEntity();
			dispLS.initializeQuad(posList[0], posList[1], posList[2], posList[3]);
			dispLS.setRGB3f(0.0, 1.0, 0.0);
			this.m_rscene.addEntity(dispLS);
            //*/

			offsetPV.x = -350.0;
			offsetPV.y = 50.0;
			tx = 150.0;
			posList = [
				new Vector3D(-tx + offsetPV.x, 150.0 + offsetPV.y, tz + offsetPV.z),
				new Vector3D(tx + offsetPV.x, 150.0 + offsetPV.y, tz + offsetPV.z),
				new Vector3D(tx + offsetPV.x, -150.0 + offsetPV.y, tz + offsetPV.z),
				new Vector3D(-tx + offsetPV.x, -150.0 + offsetPV.y, tz + offsetPV.z)
			];
            /*
			this.m_quadOccObj1.setCamPosition(this.m_rscene.getCamera().getPosition());
			this.m_quadOccObj1.setParam(posList[0], posList[1], posList[2], posList[3]);
			this.m_quadOccObj1.updateOccData();
			this.m_quadOccObj.addSubPov(this.m_quadOccObj1);
			dispLS = new BrokenLine3DEntity();
			dispLS.initializeQuad(posList[0], posList[1], posList[2], posList[3]);
			dispLS.setRGB3f(0.0, 1.0, 0.0);
			this.m_rscene.addEntity(dispLS);
            //*/

			let cullingor = new SpaceCullingor();
			cullingor.addPOVObject(this.m_quadOccObj);
			// cullingor.addPOVObject(this.m_quadOccObj0);
			rspace.setSpaceCullingor(cullingor);

			// let occ_circleFrame = new BillboardFrame();
			// occ_circleFrame.initializeCircle(this.m_quadOccObj.getOccRadius(), 20);
			// occ_circleFrame.setPosition(this.m_quadOccObj.getOccCenter());
			// this.m_rscene.addEntity(occ_circleFrame);

			axis = new Axis3DEntity();
			axis.initialize(30.0);
			axis.setPosition(posList[0]);
			this.m_rscene.addEntity(axis);
			axis = new Axis3DEntity();
			axis.initialize(80.0);
			axis.setPosition(posList[1]);
			this.m_rscene.addEntity(axis);
			let cubeRange = new CubeRandomRange();
			cubeRange.min.setXYZ(-400.0, -400.0, -400.0);
			cubeRange.max.setXYZ(400.0, 400.0, -200.0);
			cubeRange.initialize();

			let pv = new Vector3D();
			let circleFrame: BillboardFrame = null;
			let srcBox = new Box3DEntity();
			srcBox.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [tex1]);

			let total = 80;
			let sk = 0.15;
			let box: Box3DEntity = null;
			let minV = new Vector3D(-100.0, -100.0, -100.0);
			let maxV = new Vector3D(100.0, 100.0, 100.0);
			let texList: TextureProxy[] = [tex1];
			total = 1;
			for (i = 0; i < total; ++i) {
				box = new Box3DEntity();
				if (srcBox != null) box.setMesh(srcBox.getMesh());
				box.initialize(minV, maxV, texList);
				if (total > 1) {
					box.setScaleXYZ((Math.random() * 1.5 + 0.8) * sk, (Math.random() * 1.5 + 0.8) * sk, (Math.random() * 1.5 + 0.8) * sk);
					cubeRange.calc();
					box.setPosition(cubeRange.value);
					//console.log("cubeRange.value: "+cubeRange.value);
					//box.setXYZ(Math.random() * 4000.0 - 2000.0,Math.random() * 4000.0 - 2000.0,Math.random() * 4000.0 - 2000.0);
				} else {
					// box.setXYZ(-500.0, -200.0, -500.0);
					box.uuid = "box_"+i;
					box.setScaleXYZ(0.3, 0.4, 0.7);
					box.setXYZ(200.0, 0.0, -300.0);
				}
				box.spaceCullMask |= SpaceCullingMask.POV;
				this.m_rscene.addEntity(box);
				this.m_dispList.push(box);

				box.getPosition(pv);
				circleFrame = new BillboardFrame();
				circleFrame.initializeCircle(box.getGlobalBounds().radius, 20);
				circleFrame.setPosition(pv);
				this.m_rscene.addEntity(circleFrame);
				this.m_frameList.push(circleFrame);
			}
		}
	}
    mouseDownListener(evt: any): void {
        DebugFlag.Flag_0 = 1;
    }

	showTestStatus(): void {
		let i: number = 0;
		let len: number = this.m_dispList.length;
		for (; i < len; ++i) {
			//this.m_frameList[i].setRGB3f(1.0,1.0,1.0);
			if (this.m_dispList[i].isRendering()) {
				this.m_frameList[i].setRGB3f(1.0, 1.0, 1.0);
			} else {
				this.m_frameList[i].setRGB3f(1.0, 0.0, 1.0);
			}
		}
	}
	run(): void {
		if(this.m_rscene) {
			this.m_rscene.run();
			this.showTestStatus();
			DebugFlag.Flag_0 = 0;
		}
	}
}

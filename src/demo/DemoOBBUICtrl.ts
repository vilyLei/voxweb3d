import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import TextureProxy from "../vox/texture/TextureProxy";
import TextureConst from "../vox/texture/TextureConst";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import RendererScene from "../vox/scene/RendererScene";
import { MouseInteraction } from "../vox/ui/MouseInteraction";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import DisplayEntityContainer from "../vox/entity/DisplayEntityContainer";
import Box3DEntity from "../vox/entity/Box3DEntity";
import ProfileInstance from "../voxprofile/entity/ProfileInstance";
import OBB from "../vox/geom/OBB";
import IColorMaterial from "../vox/material/mcase/IColorMaterial";
import BoxFrame3D from "../vox/entity/BoxFrame3D";
import Vector3D from "../vox/math/Vector3D";
import IOBB from "../vox/geom/IOBB";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import Line3DEntity from "../vox/entity/Line3DEntity";

import { CtrlInfo, ItemCallback, CtrlItemParam, ParamCtrlUI } from "../orthoui/usage/ParamCtrlUI";
import RendererSceneGraph from "../vox/scene/RendererSceneGraph";
import IRendererScene from "../vox/scene/IRendererScene";
import IRendererSceneGraphStatus from "../vox/scene/IRendererSceneGraphStatus";
import DisplayEntity from "../vox/entity/DisplayEntity";

class OBBEntity {
	entity: DisplayEntity = null;
	obb: OBB = new OBB();
	constructor() {
	}
	initialize(): void {
	}
	update(): void {

	}
}
export class DemoOBBUICtrl {
	private m_graph = new RendererSceneGraph();
	private m_rscene: IRendererScene = null;
	private m_texLoader: ImageTextureLoader = null;

	private m_profileInstance = new ProfileInstance();
	private m_ctrlui = new ParamCtrlUI();

	constructor() {}

	private getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
		let ptex = this.m_texLoader.getImageTexByUrl(purl);
		ptex.mipmapEnabled = mipmapEnabled;
		if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
		return ptex;
	}
	initialize(): void {
		console.log("DemoOBBUICtrl::initialize()......");

		if (this.m_rscene == null) {
			RendererDevice.SHADERCODE_TRACE_ENABLED = false;

			let rparam = new RendererParam();
			rparam.setAttriAntialias(true);
			rparam.setCamProject(45.0, 10.1, 3000.0);
			rparam.setCamPosition(1500.0, 1500.0, 1500.0);

			this.m_rscene = this.m_graph.createScene();
			this.m_rscene.initialize(rparam);
			this.m_rscene.setClearRGBColor3f(0.1, 0.1, 0.1);

			new RenderStatusDisplay(this.m_rscene, true);
			new MouseInteraction().initialize(this.m_rscene, 0, true).setAutoRunning(true);

			this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

			this.init3DScene();
			this.initUI();
		}
	}

	private m_entity0: DisplayEntity;
	private m_entity1: DisplayEntity;
	private m_obb0 = new OBB();
	private m_obb1 = new OBB();
	private m_obbFrame0 = new BoxFrame3D();
	private m_obbFrame1 = new BoxFrame3D();
	private m_initUI = true;
	private m_ver = 0;
	private m_currPos = new Vector3D();
	private m_initPos = new Vector3D();
	private initUI(): void {
		if (!this.m_initUI) {
			return;
		}
		this.m_initUI = false;

		let ui = this.m_ctrlui;
		ui.initialize(this.m_rscene, true);

		// let ls = this.m_entities;
		// let entity0 = ls[0];
		// let entity1 = ls[1];
		// entity0.getScaleXYZ(this.m_sv);

		console.log("initUI --------------------------------------");
		this.m_entity = this.m_entity0;
		this.m_obb = this.m_obb0;

		ui.addStatusItem("选择", "select_obb", "白色OBB", "蓝色OBB", true, (info: CtrlInfo): void => {
			console.log("info.flag: ", info.flag);
			if (info.flag) {
				this.m_entity = this.m_entity0;
				this.m_obb = this.m_obb0;
			} else {
				this.m_entity = this.m_entity1;
				this.m_obb = this.m_obb1;
			}
		});
		ui.addStatusItem("缩放", "scale", "Yes", "No", true, (info: CtrlInfo): void => {
			// entity0.setVisible(info.flag);
			this.m_opType = 0;
		});
		ui.addStatusItem("旋转", "rotate", "Yes", "No", true, (info: CtrlInfo): void => {
			// entity0.setVisible(info.flag);
			this.m_opType = 1;
		});
		ui.addStatusItem("平移", "translate", "Yes", "No", true, (info: CtrlInfo): void => {
			// entity1.setVisible(info.flag);
			this.m_opType = 2;
		});

		ui.addValueItem("操作X轴", "op-x", 0, -360, 360, (info: CtrlInfo): void => {
			// let pv = entity1.getPosition();
			// pv.y = info.values[0];
			// entity1.setPosition(pv);
			// entity1.update();
			this.m_currPos.x = info.values[0];
			this.m_ver++;
		});

		ui.addValueItem("操作Y轴", "op-y", 0, -360, 360, (info: CtrlInfo): void => {
			// let pv = entity1.getPosition();
			// pv.y = info.values[0];
			// entity1.setPosition(pv);
			// entity1.update();
			this.m_currPos.y = info.values[0];
			this.m_ver++;
		});
		ui.addValueItem("操作Z轴", "op-z", 0, -360, 360, (info: CtrlInfo): void => {
			// let pv = entity1.getPosition();
			// pv.y = info.values[0];
			// entity1.setPosition(pv);
			// entity1.update();
			this.m_currPos.z = info.values[0];
			this.m_ver++;
		});

		//*/
		ui.updateLayout(true);

		let node = this.m_graph.addScene(ui.ruisc);
		// node.setPhase0Callback(null, (sc: IRendererScene, st: IRendererSceneGraphStatus): void => {
		//     /**
		//      * 设置摄像机转动操作的启用状态
		//      */
		//     this.m_stageDragSwinger.setEnabled(!st.rayPickFlag);
		// })
	}
	// private trans

	private init3DScene(): void {
		// this.test01();
		this.test02();
	}
	private m_entity: DisplayEntity;
	private m_obb: OBB;
	private m_opType = 0;
	private updateOp(): void {}
	private updateOBBs(): void {}
	private buildByOBB(obb: IOBB, scale: number = 1.0): void {
		let pv = new Vector3D();
		// bottom frame plane wit "-y axis"
		let et = obb.extent.clone().scaleBy(scale);

		let cv = obb.center.clone();
		let max_vx = obb.axis[0].clone().scaleBy(et.x);
		let max_vy = obb.axis[1].clone().scaleBy(et.y);
		let max_vz = obb.axis[2].clone().scaleBy(et.z);
		let min_vx = max_vx.clone().scaleBy(-1); //.addBy(cv);
		let min_vy = max_vy.clone().scaleBy(-1); //.addBy(cv);
		let min_vz = max_vz.clone().scaleBy(-1); //.addBy(cv);
		// max_vx.addBy(cv);
		// max_vy.addBy(cv);
		// max_vz.addBy(cv);

		console.log("max_vy: ", max_vy);

		// 与"y"轴垂直的上面
		let maxV = max_vx
			.clone()
			.addBy(max_vy)
			.addBy(max_vz)
			.addBy(cv);
		let v0 = maxV;
		console.log("v0: ", max_vy);
		let v1 = max_vx
			.clone()
			.addBy(max_vy)
			.addBy(min_vz)
			.addBy(cv);
		let v2 = min_vx
			.clone()
			.addBy(max_vy)
			.addBy(min_vz)
			.addBy(cv);
		let v3 = min_vx
			.clone()
			.addBy(max_vy)
			.addBy(max_vz)
			.addBy(cv);

		let p0 = max_vx
			.clone()
			.addBy(min_vy)
			.addBy(max_vz)
			.addBy(cv);
		let p1 = max_vx
			.clone()
			.addBy(min_vy)
			.addBy(min_vz)
			.addBy(cv);
		let p2 = min_vx
			.clone()
			.addBy(min_vy)
			.addBy(min_vz)
			.addBy(cv);
		let p3 = min_vx
			.clone()
			.addBy(min_vy)
			.addBy(max_vz)
			.addBy(cv);

		let ls = [v0, v1, v2, v3, p0, p1, p2, p3];
		let centV = new Vector3D();
		for (let i = 0; i < ls.length; ++i) {
			centV.addBy(ls[i]);
			// let sph = new Sphere3DEntity();
			// sph.initialize(5, 20,20);
			// sph.setPosition(ls[i]);
			// this.m_rscene.addEntity( sph );
		}
		centV.scaleBy(1.0 / ls.length);
		console.log("cv: ", cv);
		console.log("centV: ", centV);

		let size = 150;
		let axis_x = new Line3DEntity();
		axis_x.dynColorEnabled = true;
		axis_x.initialize(
			cv,
			obb.axis[0]
				.clone()
				.scaleBy(150)
				.addBy(cv)
		);
		axis_x.setRGB3f(1.0, 0, 0);
		this.m_rscene.addEntity(axis_x);

		let axis_y = new Line3DEntity();
		axis_y.dynColorEnabled = true;
		axis_y.initialize(
			cv,
			obb.axis[1]
				.clone()
				.scaleBy(150)
				.addBy(cv)
		);
		axis_y.setRGB3f(0, 1.0, 0);
		this.m_rscene.addEntity(axis_y);

		let axis_z = new Line3DEntity();
		axis_z.dynColorEnabled = true;
		axis_z.initialize(
			cv,
			obb.axis[2]
				.clone()
				.scaleBy(150)
				.addBy(cv)
		);
		axis_z.setRGB3f(0, 0, 1.0);
		this.m_rscene.addEntity(axis_z);
	}
	private test02(): void {
		console.log("test02() ------------------------------------- >>>>>>>>");
		let axis = new Axis3DEntity();
		axis.initialize(300);
		this.m_rscene.addEntity(axis);

		let box0 = new Box3DEntity();
		box0.normalEnabled = true;
		box0.initializeSizeXYZ(100, 100, 100);
		box0.setXYZ(0, 0, 0);
		box0.setRotationXYZ(0, 0, 30);
		this.m_rscene.addEntity(box0);
		let obb0 = this.m_obb0;
		obb0.fromAABB(box0.getLocalBounds(), box0.getMatrix());
		this.buildByOBB(obb0);
		let obbFrame0 = this.m_obbFrame0;
		obbFrame0.color.setRGB3f(1.0, 0.0, 0.0);
		obbFrame0.initializeByOBB(obb0, 1.002);
		this.m_rscene.addEntity(obbFrame0);

		let box1 = new Box3DEntity();
		box1.normalEnabled = true;
		box1.initializeSizeXYZ(80, 80, 80);
		(box1.getMaterial() as IColorMaterial).setRGB3f(0.5, 1.0, 0.8);
		box1.setXYZ(95, 60, 30);
		box1.setRotationXYZ(130, 0, 110);
		this.m_rscene.addEntity(box1);

		this.m_entity0 = box0;
		this.m_entity1 = box1;

		console.log(" ------------------------------------- ");

		let obb1 = this.m_obb1;
		obb1.fromAABB(box1.getLocalBounds(), box1.getMatrix());
		this.buildByOBB(obb1);
		let obbFrame1 = this.m_obbFrame1;
		obbFrame1.color.setRGB3f(1.0, 1.0, 0.0);
		obbFrame1.initializeByOBB(obb1, 1.002);
		this.m_rscene.addEntity(obbFrame1);

		console.log(" ------------------------------------- ");

		console.log("obb0: ", obb0);
		console.log("obb1: ", obb1);
		// let intersection = obb0.intersect(obb1);

		// let intersection = obb0.obbIntersect(obb0, obb1);
		// console.log("$$$$$$$$$ intersection: ", intersection);

		// let intersection0 = obb0.obbIntersect2(obb0, obb1);
		// let intersection1 = obb0.obbIntersect2(obb1, obb0);
		// let intersection = intersection0 && intersection1;
		// console.log("$$$$$$$$$ intersection0: ", intersection0);
		// console.log("$$$$$$$$$ intersection1: ", intersection1);
		// console.log("$$$$$$$$$ intersection: ", intersection);

		let intersection = obb0.obbIntersect2(obb0, obb1);
		console.log("$$$$$$$$$ intersection: ", intersection);
	}
	mouseDownListener(evt: any): void {
		console.log("mouseDownListener call, this.m_rscene: ", this.m_rscene.toString());
	}
	run(): void {
		if (this.m_graph) {
			this.m_graph.run();
		}
	}
}
export default DemoOBBUICtrl;

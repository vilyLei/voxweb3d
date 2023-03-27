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
import { OBBTestEntity } from "./base/ObbTestEntity";
import Color4 from "../vox/material/Color4";
import DivLog from "../vox/utils/DivLog";

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

			// DivLog.ShowLogOnce("test true.");

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

			this.initDiv();
			this.init3DScene();
			this.initUI();
		}
	}
	private m_obbEntity0 = new OBBTestEntity();
	private m_obbEntity1 = new OBBTestEntity();
	private m_obbEntity: OBBTestEntity = null;
	private m_initUI = true;
	private m_initData = false;
    private m_infoDiv: HTMLDivElement = null;
	private initDiv(): void {
		let div: HTMLDivElement = document.createElement("div");
		div.style.color = "";
		let pdiv: any = div;
		pdiv.width = 128;
		pdiv.height = 64;
		pdiv.style.backgroundColor = "#dddddd";
		pdiv.style.color = "相交测试";
		pdiv.style.left = 20 + "px";
		pdiv.style.top = 200 + "px";
		pdiv.style.zIndex = "9999";
		pdiv.style.position = "absolute";
		document.body.appendChild(pdiv);
		this.m_infoDiv = pdiv;
	}
	private updateUIParam(): void {
		this.m_typeSelecting = false;

		let value3 = this.m_obbEntity.getCurrValue3();

		let item = this.m_ctrlui.getItemByUUID("op-x");
		item.param.value = value3.x;
		item.syncEnabled = false;
		item.updateParamToUI();
		item = this.m_ctrlui.getItemByUUID("op-y");
		item.param.value = value3.y;
		item.syncEnabled = false;
		item.updateParamToUI();
		item = this.m_ctrlui.getItemByUUID("op-z");
		item.param.value = value3.y;
		item.syncEnabled = false;
		item.updateParamToUI();

		this.m_typeSelecting = true;
	}
	private m_typeSelecting = true;
	private selectType(type: number): void {
		this.m_typeSelecting = false;
		let item = this.m_ctrlui.getItemByUUID("scale");
		item.param.flag = type == 0;
		item.syncEnabled = false;
		item.updateParamToUI();
		item = this.m_ctrlui.getItemByUUID("rotate");
		item.param.flag = type == 1;
		item.syncEnabled = false;
		item.updateParamToUI();
		item = this.m_ctrlui.getItemByUUID("translate");
		item.param.flag = type == 2;
		item.syncEnabled = false;
		item.updateParamToUI();

		this.m_obbEntity0.setOperationType(type);
		this.m_obbEntity1.setOperationType(type);
		this.updateUIParam();
	}
	private initUI(): void {
		if (!this.m_initUI) {
			return;
		}
		this.m_initUI = false;

		let ui = this.m_ctrlui;
		ui.initialize(this.m_rscene, true);

		this.m_obbEntity = this.m_obbEntity0;

		ui.addStatusItem("选择", "select_obb", "蓝色OBB", "白色OBB", true, (info: CtrlInfo): void => {

			if (this.m_initData) {
				this.m_obbEntity.deselect();
				this.m_obbEntity = info.flag ? this.m_obbEntity0 : this.m_obbEntity1;
				this.m_obbEntity.select();
			}
		}, true, false);
		ui.addStatusItem("缩放", "scale", "Yes", "No", true, (info: CtrlInfo): void => {
			this.selectType(0);
		}, true, false);
		ui.addStatusItem("旋转", "rotate", "Yes", "No", false, (info: CtrlInfo): void => {
			this.selectType(1);
		}, true, false);
		ui.addStatusItem("平移", "translate", "Yes", "No", false, (info: CtrlInfo): void => {
			this.selectType(2);
		}, true, false);

		ui.addValueItem("操作X轴", "op-x", 0, 0.0, 1.0, (info: CtrlInfo): void => {
			this.m_obbEntity.setValueX(info.values[0]);
			this.obbTest();
		}, false, true, null, false);

		ui.addValueItem("操作Y轴", "op-y", 0, 0.0, 1.0, (info: CtrlInfo): void => {
			this.m_obbEntity.setValueY(info.values[0]);
			this.obbTest();
		}, false, true, null, false);
		ui.addValueItem("操作Z轴", "op-z", 0, 0.0, 1.0, (info: CtrlInfo): void => {
			this.m_obbEntity.setValueZ(info.values[0]);
			this.obbTest();
		}, false, true, null, false);
		ui.addStatusItem("问题", "test_obb", "输出", "输出", true, (info: CtrlInfo): void => {

			console.log("问题数据输出 ...");
			this.m_obbEntity0.showErrorData();
			this.m_obbEntity1.showErrorData();

		}, true, false);
		//*/
		ui.updateLayout(true);

		this.selectType(1);
		this.m_obbEntity.select();

		this.obbTest();
		this.m_graph.addScene(ui.ruisc);
	}

	private obbTest(): void {

		this.m_obbEntity0.update();
		this.m_obbEntity1.update();

		let obb0 = this.m_obbEntity0.obb;
		let obb1 = this.m_obbEntity1.obb;

		let intersection = obb0.intersect(obb1);
		// let intersection = obb0.obbIntersect(obb1);

		if(intersection) {
			this.m_infoDiv.innerHTML = "<font color='#ee0000'>相交测试结果: (" + intersection + ")</font>";
		}else {
			this.m_infoDiv.innerHTML = "相交测试结果: (" + intersection + ")";
		}
	}
	private init3DScene(): void {
		let axis = new Axis3DEntity();
		axis.initialize(300.0);
		this.m_rscene.addEntity(axis);

		this.m_obbEntity0.name = "obbEntity0";
		this.m_obbEntity1.name = "obbEntity1";
		this.m_obbEntity0.initialize(this.m_rscene, 150, new Color4(1.0, 1.0, 1.0), new Color4(0.0, 0.0, 0.0));
		this.m_obbEntity1.initialize(this.m_rscene, 100, new Color4(0.0, 0.5, 0.8), new Color4(0.0, 0.0, 0.0), new Vector3D(150, 0.0, 0.0));
	}
	mouseDownListener(evt: any): void {
		console.log("mouseDownListener call, this.m_rscene: ", this.m_rscene.toString());
	}
	run(): void {
		if (this.m_graph) {
			this.m_initData = true;
			this.m_graph.run();
		}
	}
}
export default DemoOBBUICtrl;

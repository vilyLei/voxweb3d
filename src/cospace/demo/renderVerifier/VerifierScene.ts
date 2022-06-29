
import RendererScene from "../../../vox/scene/RendererScene";
import { CoSpace } from "../../CoSpace";
import { ISceneNode } from "./ISceneNode";
import { FBXSceneNode } from "./FBXSceneNode";
import { CTMSceneNode } from "./CTMSceneNode";
import { OBJSceneNode } from "./OBJSceneNode";
import Axis3DEntity from "../../../vox/entity/Axis3DEntity";
import {IDropFileListerner, DropFileController} from "./DropFileController";
import {VerifierParam} from "./VerifierParam";
import { TaskCodeModuleParam } from "../../schedule/TaskCodeModuleParam";
import { ModuleNS } from "../../modules/base/ModuleNS";
import DivLog from "../../../vox/utils/DivLog";

class VerifierScene implements IDropFileListerner {

	/**
	 * (引擎)数据协同中心实例
	 */
	private m_cospace: CoSpace = new CoSpace();
	private m_vfParam: VerifierParam = new VerifierParam();

	private m_rscene: RendererScene = null;

	private m_waitSceneNodes: ISceneNode[] = [];
	private m_sceneNodes: ISceneNode[] = [];
	private m_dropController: DropFileController = new DropFileController();

	constructor() { }

	initialize(rscene: RendererScene): void {

		if (this.m_rscene == null) {

			this.m_rscene = rscene;

			let axis: Axis3DEntity = new Axis3DEntity();
			axis.initialize(300);
			this.m_rscene.addEntity(axis);
			

			this.m_vfParam.initialize();
			if((this.m_vfParam.hostUrl.indexOf(".artvily.") > 0 || this.m_vfParam.demoType != "") && this.m_vfParam.threadsTotal > 0) {
				let modules: TaskCodeModuleParam[] = [
					new TaskCodeModuleParam("static/renderingVerifier/modules/m1.js", ModuleNS.ctmParser),
					new TaskCodeModuleParam("static/renderingVerifier/modules/o1.js", ModuleNS.objParser)
				];
				this.m_cospace.geometry.setTaskModuleUrls(modules);
				this.m_cospace.initialize(this.m_vfParam.threadsTotal, "static/renderingVerifier/modules/c1.js", true);
			}else {
				let modules: TaskCodeModuleParam[] = [
					new TaskCodeModuleParam("static/cospace/modules/ctm/ModuleCTMGeomParser.umd.js", ModuleNS.ctmParser),
					new TaskCodeModuleParam("static/cospace/modules/obj/ModuleOBJGeomParser.umd.js", ModuleNS.objParser)
				];
				this.m_cospace.geometry.setTaskModuleUrls(modules);
				// this.m_cospace.geometry.setTaskModuleUrls(["static/cospace/modules/ctm/ModuleCTMGeomParser.umd.js"]);
				// // 初始化数据协同中心
				// this.m_cospace.initialize(3, "static/renderingVerifier/modules/c1.js", true);
				// this.m_cospace.initialize(3, "static/cospace/core/code/ThreadCore.umd.min.js", true);
				this.m_cospace.initialize(3, "static/cospace/core/code/ThreadCore.umd.js", true);
			}
			
			this.m_dropController.initialize(this.m_rscene.getCanvas(), this);
			DivLog.ShowLogOnce("模型法线检查</br>请用谷歌浏览器(Google Chrome)</br>请拖入单个模型文件(ctm/obj/fbx)</br>或者拖入只包含ctm文件的文件夹");

			this.test();
		}
	}
	
	private test(): void {
		// let list = [236, 82, 86, -236, 82, 26, 83, -87, 86, 83, 30, -85, 254, 235, 86, -85];
		// list.forEach( function ( va: number, vb: number ): void {
		// 	console.log("va, vb: ", va, vb);
		// });
	}
	
	isDropEnabled(): boolean {
		return this.isFinish();
	}
	
	private resetScene(): void {

		DivLog.ShowLogOnce("正在载入模型文件...");
		this.clear();
	}
	initFileLoad(files: any[]): void {
		console.log("initFileLoad(), files.length: ", files.length);
		let flag: number = 1;
		if (files.length > 0) {
			let name: string = "";
			let urls: string[] = [];
			for (let i = 0; i < files.length; i++) {
				if (i == 0) name = files[i].name;
				const urlObj = window.URL.createObjectURL(files[i]);
				urls.push(urlObj);
			}
			
			if (name != "") {
				name.toLocaleLowerCase();
				if (name.indexOf(".ctm") > 1) {
					this.resetScene();
					this.addCTM(urls);
				} else if (name.indexOf(".fbx") > 1) {
					this.resetScene();
					this.addFBX(urls);
				} else if (name.indexOf(".obj") > 1) {
					this.resetScene();
					this.addOBJ( urls );
				} else {
					flag = 31;
				}
			} else {
				flag = 31;
			}
		} else {
			flag = 31;
		}
		this.m_dropController.alertShow(flag);
	}
	initTest(): void {

		if(this.m_vfParam.demoType != "") {
			let urls = this.m_vfParam.getUrls();
			switch(this.m_vfParam.demoType) {
				case "fbx":
					this.addFBX( urls );
					break;
				case "ctm":
					this.addCTM( urls );
					break;
				default:
					break;
			}
			return;
		}
		if(this.m_vfParam.hostUrl.indexOf(".artvily.") > 0) {
			return;
		}
		let size = 107375616;

		// return;
		let url: string = "static/assets/fbx/test01.fbx";
		url = "static/assets/fbx/box.fbx";
		// url = "static/private/fbx/box01.fbx";
		// url = "static/private/fbx/sph.fbx";
		// url = "static/private/fbx/cylinder.fbx";
		// url = "static/private/fbx/cylinder0.fbx";
		// url = "static/private/fbx/cylinder1.fbx";
		// url = "static/private/fbx/cylinder2.fbx";
		// url = "static/private/fbx/cylinder3.fbx";
		// url = "static/private/fbx/sph01.fbx";
		// url = "static/private/fbx/sph02.fbx";
		// url = "static/private/fbx/cone0.fbx";

		// url = "static/private/fbx/face2.fbx";
		// url = "static/private/fbx/tri.fbx";
		// url = "static/private/fbx/plane.fbx";
		// url = "static/private/fbx/base2.fbx";
		// url = "static/private/fbx/model_500W.fbx";
		// url = "static/private/fbx/base3.fbx";
		// url = "static/private/fbx/nvxie_zzb.fbx";
		// url = "static/private/fbx/3279.fbx";
		// url = "static/private/fbx/3279_b.fbx";
		// url = "static/private/fbx/model_1000W.fbx";
		// url = "static/private/fbx/model2_1000W.fbx";
		// url = "static/private/fbx/Samba_Dancing.fbx";
		// url = "static/private/fbx/monkey.fbx";
		// this.addFBX( [url] );

		let hostUrl = this.m_vfParam.hostUrl;

		let baseUrl: string = hostUrl + "static/private/ctm/";
		let urls: string[] = [];
		for (let i = 0; i <= 26; ++i) {
			urls.push(baseUrl + "sh202/sh202_" + i + ".ctm");
		}
		urls = [baseUrl + "errorNormal.ctm"];
		// this.addCTM(urls);

		baseUrl = hostUrl + "static/private/obj/";
		urls = [baseUrl + "base.obj"];
		this.addOBJ(urls);
	}
	mouseDown(evt: any): void {
		let nodes = this.m_sceneNodes;
		for (let i = 0; i < nodes.length; ++i) {
			nodes[i].mouseDown(evt);
		}
	}
	private addFBX(urls: string[]): void {
		this.addNewNode(new FBXSceneNode(), urls);
	}
	private addCTM(urls: string[]): void {
		this.addNewNode(new CTMSceneNode(), urls);
	}
	private addOBJ(urls: string[]): void {
		this.addNewNode(new OBJSceneNode(), urls);
	}
	private addNewNode(node: ISceneNode, urls: string[]): void {
		DivLog.ShowLogOnce("正在解析原数据...");
		node.initialize(this.m_rscene, this.m_cospace);
		node.load(urls);
		this.m_waitSceneNodes.push(node);
		this.m_sceneNodes.push(node);
	}
	showInfo(info: string): void {
		DivLog.ShowLogOnce(info);
	}
	isFinish(): boolean {
		return this.m_waitSceneNodes.length == 0;
	}
	clear(): void {
		if (this.isFinish()) {
			let nodes = this.m_sceneNodes;
			for (let i = 0; i < nodes.length; ++i) {
				const node = nodes[i];
				node.clear();
			}
			this.m_sceneNodes = [];
		}
	}
	run(): void {

		let nodes = this.m_waitSceneNodes;
		for (let i = 0; i < nodes.length; ++i) {
			const node = nodes[i];
			node.run();
			if (node.isFinish()) {
				nodes.splice(i, 1);
				i--;
			}
		}
	}
}

export { VerifierScene };

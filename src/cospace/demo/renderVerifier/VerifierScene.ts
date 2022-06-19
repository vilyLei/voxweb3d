
import RendererScene from "../../../vox/scene/RendererScene";
import { CoSpace } from "../../CoSpace";
import { ISceneNode } from "./ISceneNode";
// import { SceneNode } from "./SceneNode";
import { FBXSceneNode } from "./FBXSceneNode";
import DivLog from "../../../vox/utils/DivLog";
import { CTMSceneNode } from "./CTMSceneNode";
import { OBJSceneNode } from "./OBJSceneNode";

class VerifierScene {

	private m_cospace: CoSpace = null;
	private m_rscene: RendererScene = null;

	private m_waitSceneNodes: ISceneNode[] = [];
	private m_sceneNodes: ISceneNode[] = [];
	constructor() { }

	initialize(rscene: RendererScene, cospace: CoSpace): void {

		if (this.m_rscene == null) {

			this.m_rscene = rscene;
			this.m_cospace = cospace;
			DivLog.ShowLogOnce("模型法线检测</br>请用谷歌浏览器(Google Chrome)</br>请拖入单个模型文件(ctm/obj/fbx)</br>或者拖入只包含ctm文件的文件夹");
			this.initDrop(this.m_rscene.getCanvas());
		}
	}
	private initDrop(canvas: HTMLCanvasElement): void {

		// --------------------------------------------- 阻止必要的行为 begin
		canvas.addEventListener("dragenter", (e) => {
			e.preventDefault();
			e.stopPropagation();
		}, false);

		canvas.addEventListener("dragover", (e) => {
			e.preventDefault();
			e.stopPropagation();
		}, false);

		canvas.addEventListener("dragleave", (e) => {
			e.preventDefault();
			e.stopPropagation();
		}, false);

		canvas.addEventListener("drop", (e) => {
			e.preventDefault();
			e.stopPropagation();
			console.log("canvas drop evt.", e);
			this.receiveDropFile(e);
		}, false);
	}

	private receiveDropFile(e: DragEvent): void {
		if (this.isFinish()) {

			let dt = e.dataTransfer;
			// 只能拽如一个文件或者一个文件夹里面的所有文件。如果文件夹里面有子文件夹则子文件夹中的文件不会载入
			let files: any = [];
			let filesTotal: number = 0;
			let filesCurrTotal: number = 0;
			
			if (dt.items !== undefined) {
				let items = dt.items;
				// Chrome有items属性，对Chrome的单独处理
				for (let i = 0; i < items.length; i++) {
					let item = items[i];
					let entity = item.webkitGetAsEntry();
					if (entity != null) {
						if (entity.isFile) {
							let file = item.getAsFile();
							// console.log("drop a file: ", file);
							files.push(file);
							this.initFileLoad(files);
							filesTotal = 1;
						} else if (entity.isDirectory) {
							// let file = item.getAsFile();
							let dr = (entity as any).createReader();
							// console.log("drop a dir, dr: ", dr);
							dr.readEntries((entries: any) => {
								filesTotal = entries.length;
								if (filesTotal > 0) {
									// 循环目录内容
									entries.forEach((entity: any) => {
										if (entity.isFile) {
											entity.file((file: any) => {
												files.push(file);
												filesCurrTotal++;
												if (filesTotal == filesCurrTotal) {
													this.initFileLoad(files);
												}
											});
										}
									});
								} else {
									this.alertShow(31);
								}
							});
							break;
						}
					}
					if (filesTotal > 0) {
						break;
					}
				}
			}
		}
	}
	private resetScene(): void {

		DivLog.ShowLogOnce("正在载入模型文件...");
		this.clear();
	}
	private initFileLoad(files: any[]): void {
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
					this.addObj( urls );
				} else {
					flag = 31;
				}
			} else {
				flag = 31;
			}
		} else {
			flag = 31;
		}
		this.alertShow(flag);
	}
	private alertShow(flag: number): void {
		switch (flag) {
			case 31:
				alert("没有找到对应的模型文件");
				break;
			default:
				break;
		}
	}
	initTest(): void {
		let url: string = "static/assets/fbx/test01.fbx";
		url = "static/assets/fbx/box.fbx";
		// url = "static/private/fbx/test_500W.fbx";
		// url = "static/private/fbx/Samba_Dancing.fbx";
		// this.addFBX( [url] );

		let baseUrl: string = window.location.href + "static/private/ctm/";
		let urls: string[] = [];
		for (let i = 0; i <= 26; ++i) {
			urls.push(baseUrl + "sh202/sh202_" + i + ".ctm");
		}
		// this.addCTM(urls);
	}
	private addFBX(urls: string[]): void {
		this.addNewNode(new FBXSceneNode(), urls);
	}
	private addCTM(urls: string[]): void {
		this.addNewNode(new CTMSceneNode(), urls);
	}
	private addObj(urls: string[]): void {
		this.addNewNode(new OBJSceneNode(), urls);
	}
	private addNewNode(node: ISceneNode, urls: string[]): void {
		DivLog.ShowLogOnce("正在解析原数据...");
		node.initialize(this.m_rscene, this.m_cospace);
		node.load(urls);
		this.m_waitSceneNodes.push(node);
		this.m_sceneNodes.push(node);
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

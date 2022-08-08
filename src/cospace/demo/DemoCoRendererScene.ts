
import { IRendererInstanceContext } from "../../vox/scene/IRendererInstanceContext";
import { IRendererInstance } from "../../vox/scene/IRendererInstance";

import { ICoRendererScene } from "../voxengine/scene/ICoRendererScene";
import { IMouseInteraction } from "../voxengine/ui/IMouseInteraction";
import { ICoRenderer } from "../voxengine/ICoRenderer";
import { ICoRScene } from "../voxengine/ICoRScene";
import { ICoMouseInteraction } from "../voxengine/ui/ICoMouseInteraction";

import Plane3DEntity from "../../vox/entity/Plane3DEntity";
// import CoRendererScene from "../voxengine/scene/CoRendererScene";

declare var CoRenderer: ICoRenderer;
declare var CoRScene: ICoRScene;
declare var CoRScene: ICoRScene;
declare var CoMouseInteraction: ICoMouseInteraction;
/**
 * cospace renderer
 */
export class DemoCoRendererScene {


	private m_rscene: ICoRendererScene = null;
	private m_interact: IMouseInteraction = null;

	constructor() { }

	initialize(): void {

		// 启用鼠标点击事件
		document.onmousedown = (evt: any): void => {
			this.mouseDown(evt);
		};

		let url: string = "static/cospace/engine/renderer/CoRenderer.umd.min.js";
		this.loadRendererModule(url);
		url = "static/cospace/engine/rscene/CoRScene.umd.min.js";
		this.loadRendererModule(url);
		url = "static/cospace/engine/mouseInteract/CoMouseInteraction.umd.min.js";
		this.loadRendererModule(url, "CoMouseInteraction");
	}
	isEngineEnabled(): boolean {
		return typeof CoRenderer !== "undefined" && typeof CoRScene !== "undefined";
	}
	private initInteract(): void {
		if(this.m_rscene != null && this.m_interact == null && (typeof CoMouseInteraction !== "undefined")) {
			
			this.m_interact = CoMouseInteraction.createMouseInteraction();
			this.m_interact.initialize( this.m_rscene );
			this.m_interact.setSyncLookAtEnabled( true );
		}
	}
	private loadedModule(module: string): void {
		if (this.m_rscene == null) {
			console.log("typeof CoRenderer: ", typeof CoRenderer);
			console.log("typeof CoRScene: ", typeof CoRScene);
			if (this.isEngineEnabled()) {
				console.log("engine 代码块加载完毕");
				this.initRenderer();
			}
		} else {
			switch(module) {
				case "CoMouseInteraction":
					this.initInteract();
					break;
				default:
					break;
			}
		}
	}
	
	private initRenderer(): void {

		// this.m_rscene = new CoRendererScene();
		// this.m_rscene.initialize();

		if (this.m_rscene == null) {

			let RendererDevice = CoRenderer.RendererDevice;
			RendererDevice.SHADERCODE_TRACE_ENABLED = true;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
			RendererDevice.SetWebBodyColor("black");

			let rparam = CoRScene.createRendererSceneParam();
			rparam.setAttriAntialias(!RendererDevice.IsMobileWeb());
			rparam.setCamPosition(1800.0, 1800.0, 1800.0);
			rparam.setCamProject(45, 20.0, 9000.0);
			this.m_rscene = CoRScene.createRendererScene();
			this.m_rscene.initialize(rparam, 3);

			
			this.initInteract();

			let axis = CoRScene.createAxis3DEntity();
			this.m_rscene.addEntity(axis);

			this.createPlane();
		}
	}
	private mouseDown(evt: any): void {

	}

	private createPlane(): void {

		//     let tex = this.m_rscene.textureBlock.createImageTex2D(64, 64, false);

		//     let plane = new Plane3DEntity();
		//     plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, [tex]);
		//     this.m_rscene.addEntity(plane);

		//     let img: HTMLImageElement = new Image();
		//     img.onload = (evt: any): void => {
		//         tex.setDataFromImage(img, 0, 0, 0, false);
		//     }
		//     img.src = "static/assets/yanj.jpg";
	}
	private loadRendererModule(purl: string, module: string = ""): void {

		let codeLoader: XMLHttpRequest = new XMLHttpRequest();
		codeLoader.open("GET", purl, true);
		codeLoader.onerror = function (err) {
			console.error("load error: ", err);
		}

		codeLoader.onprogress = e => { };
		codeLoader.onload = evt => {
			console.log("engine module js file loaded.");
			let scriptEle: HTMLScriptElement = document.createElement("script");
			scriptEle.onerror = evt => {
				console.error("module script onerror, e: ", evt);
			};
			scriptEle.type = "text/javascript";
			scriptEle.innerHTML = codeLoader.response;
			document.head.appendChild(scriptEle);
			this.loadedModule(module);
		};
		codeLoader.send(null);
	}

	private m_time: number = 0.0;
	run(): void {
		if (this.m_rscene != null) {
			if(this.m_interact != null) {
				this.m_interact.run();
			}
			this.m_rscene.run();
		}
	}
}

export default DemoCoRendererScene;

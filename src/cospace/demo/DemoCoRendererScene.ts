
import { IRendererInstanceContext } from "../../vox/scene/IRendererInstanceContext";
import { IRendererInstance } from "../../vox/scene/IRendererInstance";

import { ICoRendererScene } from "../voxengine/scene/ICoRendererScene";
import { ICoRenderer } from "../voxengine/ICoRenderer";
import { ICoRScene } from "../voxengine/ICoRScene";

// import Plane3DEntity from "../../vox/entity/Plane3DEntity";
// import CoRendererScene from "../voxengine/scene/CoRendererScene";

declare var CoRenderer: ICoRenderer;
declare var CoRScene: ICoRScene;
/**
 * cospace renderer
 */
export class DemoCoRendererScene {


	private m_rscene: ICoRendererScene = null;

	constructor() {}

	initialize(): void {

		// 启用鼠标点击事件
		document.onmousedown = (evt: any): void => {
			this.mouseDown(evt);
		};

		let url: string = "static/cospace/engine/renderer/CoRenderer.umd.js";
		this.loadRendererModule( url );
		url = "static/cospace/engine/rscene/CoRScene.umd.js";
		this.loadRendererModule( url );

	}

	private initEngineCode(): void {
		console.log("typeof CoRenderer: ", typeof CoRenderer);
		console.log("typeof CoRScene: ", typeof CoRScene);
		if (typeof CoRenderer !== "undefined" && typeof CoRScene !== "undefined") {
			console.log("engine 代码块加载完毕");
			this.initRenderer();
		}
	}
	private initRenderer(): void {

		//this.m_renderer = new CoRenderer.RendererInstance();
        // this.m_renderer.initialize(new RendererParam(), new Camera(this.m_renderer.getRCUid()));
        // this.m_rcontext = this.m_renderer.getRendererContext();

		// this.m_rscene = new CoRendererScene();
        // this.m_rscene.initialize();


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

		let axis = CoRScene.createAxis3DEntity();
		this.m_rscene.addEntity(axis);

		this.createPlane();
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
	private loadRendererModule(purl: string): void {

		let codeLoader: XMLHttpRequest = new XMLHttpRequest();
		codeLoader.open("GET", purl, true);
		codeLoader.onerror = function(err) {
			console.error("load error: ", err);
		}

		codeLoader.onprogress = e => {};
		codeLoader.onload = evt => {
			console.log("engine module js file loaded.");
			let scriptEle: HTMLScriptElement = document.createElement("script");
			scriptEle.onerror = evt => {
				console.error("module script onerror, e: ", evt);
			};
			scriptEle.type = "text/javascript";
			scriptEle.innerHTML = codeLoader.response;
			document.head.appendChild(scriptEle);
			this.initEngineCode();
		};
		codeLoader.send(null);
	}

    private m_time: number = 0.0;
	run(): void {
		if(this.m_rscene != null) {
			this.m_rscene.run();
		}
	}
}

export default DemoCoRendererScene;

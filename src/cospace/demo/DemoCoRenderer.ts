import {Camera} from "../../vox/view/Camera";
import RendererParam from "../../vox/scene/RendererParam";

import { IRendererInstanceContext } from "../../vox/scene/IRendererInstanceContext";
import { IRendererInstance } from "../../vox/scene/IRendererInstance";
import { ICoRenderer } from "../voxengine/ICoRenderer";

declare var CoRenderer: ICoRenderer;
/**
 * cospace renderer
 */
export class DemoCoRenderer {

    private m_renderer: IRendererInstance = null;
    private m_rcontext: IRendererInstanceContext = null;
	constructor() {}

	initialize(): void {


		// 启用鼠标点击事件
		document.onmousedown = (evt: any): void => {
			this.mouseDown(evt);
		};

		let url: string = "static/cospace/engine/renderer/CoRenderer.umd.min.js";
		this.loadRendererModule( url );
	}

	private initEngineCode(): void {
		console.log("typeof CoRenderer: ", typeof CoRenderer);
		if (typeof CoRenderer !== "undefined") {
			console.log("renderer 代码块加载完毕");
			this.initRenderer();
		}
	}
	private initRenderer(): void {

		this.m_renderer = CoRenderer.createRendererInstance();
        this.m_renderer.initialize(new RendererParam(), new Camera(this.m_renderer.getRCUid()));
        this.m_rcontext = this.m_renderer.getRendererContext();
	}
	private mouseDown(evt: any): void {

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
		if(this.m_rcontext != null) {
            let t: number = Math.abs( Math.cos( this.m_time += 0.01 ) );
            this.m_rcontext.setClearRGBColor3f(0.0, t, 1.0 - t);

            this.m_rcontext.renderBegin();
            this.m_renderer.run();
            this.m_rcontext.runEnd();
        }
	}
}

export default DemoCoRenderer;

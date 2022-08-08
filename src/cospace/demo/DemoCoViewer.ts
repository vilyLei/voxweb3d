
import {
	CoTextureDataUnit,
	CoModuleFileType,
	CoGeomDataType,
	CoModuleNS,
	CoDataFormat,
	CoGeomDataUnit,
	CoTaskCodeModuleParam
} from "../app/CoSpaceAppData";

import { ICoSpaceApp } from "../app/ICoSpaceApp";
import { ICoSpaceAppIns } from "../app/ICoSpaceAppIns";
import { IShaderMaterial } from "../voxengine/material/IShaderMaterial";
import { ICoDisplayEntity } from "../voxengine/entity/ICoDisplayEntity";

import { ICoRendererScene } from "../voxengine/scene/ICoRendererScene";
import { IMouseInteraction } from "../voxengine/ui/IMouseInteraction";
import { ICoRenderer } from "../voxengine/ICoRenderer";
import { ICoRScene } from "../voxengine/ICoRScene";
import { ICoMouseInteraction } from "../voxengine/ui/ICoMouseInteraction";

declare var CoRenderer: ICoRenderer;
declare var CoRScene: ICoRScene;
declare var CoRScene: ICoRScene;
declare var CoMouseInteraction: ICoMouseInteraction;


declare var CoSpaceApp: ICoSpaceApp;
/**
 * cospace renderer
 */
export class DemoCoViewer {

	private m_rscene: ICoRendererScene = null;
	private m_interact: IMouseInteraction = null;

	private m_coAppIns: ICoSpaceAppIns;

	private m_modules: CoTaskCodeModuleParam[];
	constructor() { }

	private initCurr(): void {
		let modules: CoTaskCodeModuleParam[] = [
			{ url: "static/cospace/core/coapp/CoSpaceApp.umd.js", name: CoModuleNS.coSpaceApp, type: CoModuleFileType.JS },
			{ url: "static/cospace/core/code/ThreadCore.umd.js", name: CoModuleNS.threadCore, type: CoModuleFileType.JS },
			{ url: "static/cospace/modules/ctm/ModuleCTMGeomParser.umd.js", name: CoModuleNS.ctmParser, type: CoModuleFileType.JS },
			{ url: "static/cospace/modules/obj/ModuleOBJGeomParser.umd.js", name: CoModuleNS.objParser, type: CoModuleFileType.JS },
			{ url: "static/cospace/modules/png/ModulePNGParser.umd.js", name: CoModuleNS.pngParser, type: CoModuleFileType.JS }
		];
		this.m_modules = modules;
	}
	initialize(): void {

		// 启用鼠标点击事件
		document.onmousedown = (evt: any): void => {
			this.mouseDown(evt);
		};

		let url: string = "static/cospace/engine/renderer/CoRenderer.umd.min.js";
		this.loadModule(url);
		url = "static/cospace/engine/rscene/CoRScene.umd.min.js";
		this.loadModule(url);
		url = "static/cospace/engine/mouseInteract/CoMouseInteraction.umd.min.js";
		this.loadModule(url, "CoMouseInteraction");

		this.initCurr();

		url = this.m_modules[0].url;
		this.loadModule(url, "CoSpaceApp");
	}
	isEngineEnabled(): boolean {
		return typeof CoRenderer !== "undefined" && typeof CoRScene !== "undefined";
	}
	private initInteract(): void {
		if (this.m_rscene != null && this.m_interact == null && (typeof CoMouseInteraction !== "undefined")) {

			this.m_interact = CoMouseInteraction.createMouseInteraction();
			this.m_interact.initialize(this.m_rscene);
			this.m_interact.setSyncLookAtEnabled(true);
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
			switch (module) {
				case "CoMouseInteraction":
					this.initInteract();
					break;
				case "CoSpaceApp":
					this.initCoSpaceApp();
					break;
				default:
					break;
			}
		}
	}
	private initCoSpaceApp(): void {
		if (this.m_rscene != null && this.m_coAppIns == null && (typeof CoSpaceApp !== "undefined")) {
			this.m_coAppIns = CoSpaceApp.createInstance();
			let modules = this.m_modules;
			this.m_coAppIns.setTaskModuleParams(modules);
			this.m_coAppIns.initialize(3, modules[1].url, true);

			this.loadOBJ();
		}
	}
	private initRenderer(): void {

		if (this.m_rscene == null) {

			let RendererDevice = CoRenderer.RendererDevice;
			RendererDevice.SHADERCODE_TRACE_ENABLED = true;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
			RendererDevice.SetWebBodyColor("#888888");

			let rparam = CoRScene.createRendererSceneParam();
			rparam.setAttriAntialias(!RendererDevice.IsMobileWeb());
			rparam.setCamPosition(1800.0, 1800.0, 1800.0);
			rparam.setCamProject(45, 20.0, 9000.0);
			this.m_rscene = CoRScene.createRendererScene();
			this.m_rscene.initialize(rparam, 3);
			this.m_rscene.setClearUint24Color(0x888888);


			this.initInteract();
			this.initCoSpaceApp();

			let axis = CoRScene.createAxis3DEntity();
			this.m_rscene.addEntity(axis);

			this.createPlane();
		}
	}
	private mouseDown(evt: any): void {

	}

	private loadOBJ(): void {
		let baseUrl: string = "static/private/obj/";
		let url = baseUrl + "base.obj";
		url = baseUrl + "base4.obj";

		this.m_coAppIns.getCPUDataByUrlAndCallback(
			url,
			CoDataFormat.OBJ,
			(unit: CoGeomDataUnit, status: number): void => {
				console.log("parsing finish obj model, data: ", unit.data);
				for(let i: number = 0; i < unit.data.models.length; ++i) {
					let entity = this.createEntity( unit.data.models[i] );
					entity.setScaleXYZ(23.0, 23.0, 23.0);
				}
			},
			true
		);
	}	private createEntity(model: CoGeomDataType): ICoDisplayEntity {
		console.log("createEntity(), model: ", model);

		// const material: any = new (CoRScene as any).Default3DMaterial();
		// material.initializeByCodeBuf();

		let rst = CoRenderer.RendererState;
		let material = this.createNormalMaterial();
		let entity = CoRScene.createDisplayEntityFromModel(model, material);
		// entity.setRenderState(rst.NONE_CULLFACE_NORMAL_STATE);
		this.m_rscene.addEntity(entity);
		return entity;
	}
	private m_nv_vertCode =
	`#version 300 es
precision mediump float;
layout(location = 0) in vec3 a_vs;
layout(location = 1) in vec3 a_nvs;
uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
out vec4 v_param;
void main()
{
	vec4 viewPv = u_viewMat * u_objMat * vec4(a_vs, 1.0);
	gl_Position = u_projMat * viewPv;
	vec3 pnv = normalize(a_nvs * inverse(mat3(u_objMat)));
	v_param = vec4(pnv, 1.0);
}
	`;
	private m_nv_fragCode =
	`#version 300 es
precision mediump float;
const float MATH_PI = 3.14159265;
const float MATH_2PI = 2.0 * MATH_PI;
const float MATH_3PI = 3.0 * MATH_PI;
const float MATH_1PER2PI = 0.5 * MATH_PI;
const float MATH_3PER2PI = 3.0 * MATH_PI * 0.5;

const vec3 gama = vec3(1.0/2.2);
in vec4 v_param;
layout(location = 0) out vec4 FragColor;
void main() {

	bool facing = gl_FrontFacing;
	vec2 dv = fract(gl_FragCoord.xy/vec2(5.0)) - vec2(0.5);
	vec2 f2 = sign(dv);

	vec3 nv = normalize(v_param.xyz);
	vec3 color = pow(nv, gama);

	vec3 frontColor = color.xyz;
	vec3 backColor = vec3(sign(f2.x * f2.y), 1.0, 1.0);
	vec3 dstColor = facing ? frontColor : backColor;

	FragColor = vec4(dstColor, 1.0);
	// FragColor = vec4(color, 1.0);
}
	`;
	private m_nv_material: IShaderMaterial = null;
	private createNormalMaterial(): IShaderMaterial {
		if(this.m_nv_material != null) {
			return this.m_nv_material;
		}
		let material = CoRScene.createShaderMaterial("nv_material");
		material.setVtxShaderCode( this.m_nv_vertCode );
		material.setFragShaderCode( this.m_nv_fragCode );
		material.initializeByCodeBuf();
		this.m_nv_material = material;
		return material;
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
	private loadModule(purl: string, module: string = ""): void {

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
			if (this.m_interact != null) {
				this.m_interact.run();
			}
			this.m_rscene.run();
		}
	}
}

export default DemoCoViewer;

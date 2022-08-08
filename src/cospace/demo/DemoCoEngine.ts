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
import { ICoRendererParam } from "../voxengine/engine/ICoRendererParam";
import { IEngineBase } from "../voxengine/engine/IEngineBase";
import { ICoEngine } from "../voxengine/ICoEngine";
import { IShaderMaterial } from "../voxengine/material/IShaderMaterial";
import { ICoDisplayEntity } from "../voxengine/entity/ICoDisplayEntity";

declare var CoSpaceApp: ICoSpaceApp;
declare var CoEngine: ICoEngine;
/**
 * 引擎数据/资源协同空间
 */
export class DemoCoEngine {

	private m_appIns: ICoSpaceAppIns;
	private m_engine: IEngineBase;
	private m_modules: CoTaskCodeModuleParam[];
	constructor() {}

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

	private initTestSvr(): void {
		let modules: CoTaskCodeModuleParam[] = [
			{ url: "http://localhost:9090/static/renderingVerifier/modules/coapp1.js", name: CoModuleNS.coSpaceApp, type: CoModuleFileType.JS },
			{ url: "http://localhost:9090/static/renderingVerifier/modules/th1.js", name: CoModuleNS.threadCore, type: CoModuleFileType.JS },
			{ url: "http://localhost:9090/static/renderingVerifier/modules/ct1.js", name: CoModuleNS.ctmParser, type: CoModuleFileType.JS },
			{ url: "http://localhost:9090/static/renderingVerifier/modules/ob1.js", name: CoModuleNS.objParser, type: CoModuleFileType.JS }
		];
		this.m_modules = modules;
	}
	initialize(): void {
		this.initCurr();
		// this.initTestSvr();

		console.log("DemoCoEngine::initialize()...");

		let url: string = this.m_modules[0].url;
		this.loadAppModule(url);

		this.loadEngineModule("static/cospace/engine/CoEngine.umd.js");

		// 启用鼠标点击事件
		document.onmousedown = (evt: any): void => {
			this.mouseDown(evt);
		};
	}

	private initEngineCode(): void {
		console.log("typeof CoEngine: ", typeof CoEngine);
		if (typeof CoEngine !== "undefined") {
			console.log("engine 代码块加载完毕");
			this.m_engine = CoEngine.createEngine();
			console.log("this.m_engine: ", this.m_engine);
			this.initEngine();
		}
	}
	private initApp(): void {
		if (this.m_appIns != null && this.m_engine != null) {
			console.log("this.m_appIns: ", this.m_appIns);
			let modules = this.m_modules;
			this.m_appIns.setTaskModuleParams(modules);
			this.m_appIns.initialize(3, modules[1].url, true);
			// this.loadCTM();
			this.loadOBJ();
		}
	}
	private initEngine(): void {
		console.log("initEngine()...");

		let RendererDevice = CoEngine.RendererDevice;
		RendererDevice.SHADERCODE_TRACE_ENABLED = true;
		RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
		RendererDevice.SetWebBodyColor("black");

		let rparam: ICoRendererParam = CoEngine.createRendererParam();
		rparam.setAttriAntialias(!RendererDevice.IsMobileWeb());
		rparam.setCamPosition(1800.0, 1800.0, 1800.0);
		rparam.setCamProject(45, 20.0, 9000.0);
		this.m_engine.initialize(rparam, 6);

		(this.m_engine as any).interaction.cameraZoomController.syncLookAt = true;

		let rscene = this.m_engine.rscene;
		rscene.setClearRGBColor3f(0.2, 0.2, 0.2);

		let axis = CoEngine.createAxis3DEntity(500);
		rscene.addEntity(axis);

		let pos = CoEngine.createVec3(100.0,0.0,1.0,);
		axis = CoEngine.createAxis3DEntity(50);
		axis.setPosition( pos );
		rscene.addEntity(axis);



		this.initApp();
	}
	private m_pngs: string[] = ["static/assets/xulie_49.png", "static/private/image/bigPng.png", "static/assets/letterA.png"];
	private loadPNGByCallback(url: string): void {
		//let url: string = "static/assets/letterA.png";
		this.m_appIns.getCPUDataByUrlAndCallback(
			url,
			CoDataFormat.Png,
			(unit: CoTextureDataUnit, status: number): void => {
				console.log("DemoCospace::loadPNGByCallback(), texture data:", unit.data.imageDatas[0]);
				console.log("DemoCospace::loadPNGByCallback(), texture des:", unit.data.desList[0]);
				// console.log("lossTime: ", unit.lossTime + " ms");
			},
			true
		);
	}
	private loadCTM(): void {
		let baseUrl: string = "static/private/ctm/";
		let urls: string[] = [];
		for (let i = 0; i <= 26; ++i) {
			urls.push(baseUrl + "sh202/sh202_" + i + ".ctm");
		}
		// urls = [baseUrl + "errorNormal.ctm"];
		for (let i = 0; i < urls.length; ++i) {
			let url = urls[i];
			this.m_appIns.getCPUDataByUrlAndCallback(
				url,
				CoDataFormat.CTM,
				(unit: CoGeomDataUnit, status: number): void => {
					this.createEntity(unit.data.models[0]);
				},
				true
			);
		}
	}
	private createEntity(model: CoGeomDataType): ICoDisplayEntity {
		console.log("createEntity(), model: ", model);

		// const material: any = new (CoEngine as any).Default3DMaterial();
		// material.initializeByCodeBuf();

		let rst = CoEngine.RendererState;
		let material = this.createNormalMaterial();
		let entity = CoEngine.createDisplayEntityFromModel(model, material);
		// entity.setRenderState(rst.NONE_CULLFACE_NORMAL_STATE);
		this.m_engine.rscene.addEntity(entity);
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
		let material = CoEngine.createShaderMaterial("nv_material");
		material.setVtxShaderCode( this.m_nv_vertCode );
		material.setFragShaderCode( this.m_nv_fragCode );
		material.initializeByCodeBuf();
		this.m_nv_material = material;
		return material;
	}
	private loadOBJ(): void {
		let baseUrl: string = "static/private/obj/";
		let url = baseUrl + "base.obj";
		url = baseUrl + "base4.obj";

		this.m_appIns.getCPUDataByUrlAndCallback(
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
	}
	private mouseDown(evt: any): void {

		// this.loadOBJ();
		// this.loadPNGByCallback(this.m_pngs[0]);
		// this.loadPNGByCallback(this.m_pngs[1]);
	}

	private loadEngineModule(purl: string): void {
		let codeLoader: XMLHttpRequest = new XMLHttpRequest();
		codeLoader.open("GET", purl, true);
		codeLoader.onerror = function(err) {
			console.error("load error: ", err);
		};

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

	private loadAppModule(purl: string): void {
		let codeLoader: XMLHttpRequest = new XMLHttpRequest();
		codeLoader.open("GET", purl, true);
		codeLoader.onerror = function(err) {
			console.error("load error: ", err);
		};

		codeLoader.onprogress = e => {};
		codeLoader.onload = evt => {
			console.log("module js file loaded.");
			let scriptEle: HTMLScriptElement = document.createElement("script");
			scriptEle.onerror = evt => {
				console.error("module script onerror, e: ", evt);
			};
			scriptEle.type = "text/javascript";
			scriptEle.innerHTML = codeLoader.response;
			document.head.appendChild(scriptEle);
			this.initAppCode();
		};
		codeLoader.send(null);
	}
	private initAppCode(): void {
		console.log("typeof CoSpaceApp: ", typeof CoSpaceApp);
		if (typeof CoSpaceApp !== "undefined") {
			console.log("cospace 代码块加载完毕");
			this.m_appIns = CoSpaceApp.createInstance();
			this.initApp();
		}
	}

	run(): void {
		if (this.m_engine != null) {
			this.m_engine.run();
		}
	}
}

export default DemoCoEngine;

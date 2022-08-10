export class ViewerSCData {
	constructor() {}

	build(): void {

		let urlCMouseInteraction = "static/cospace/engine/mouseInteract/CoMouseInteraction.umd.js";

		let urlRenderer = "static/cospace/engine/renderer/CoRenderer.umd.js";
		let urlRScene = "static/cospace/engine/rscene/CoRScene.umd.js";

		let engine: any = {
			renderer: {url: urlRenderer},
			rendererScene: {url: urlRScene},
			mouseInteraction: {url: urlCMouseInteraction}
		}


		let material: any = {};
		material.context = {} as any;
		material.fog = {} as any;
		material.pbr = {} as any;
		material.light = {} as any;
		material.shadow = {} as any;

		let mc = material.context;
		mc.shaderLibVersion = "v101";
		mc.loadAllShaderCode = true;
		mc.shaderCodeBinary = true;

		let fog = material.fog;
		fog.density = 0.0005;
		fog.rgb = [0.0, 0.8, 0.1];

		let ns = "rough_plaster_broken";
		let pbr = material.pbr;
		pbr.map = {};
		let map = pbr.map;
		map.envMap = "static/bytes/spe.mdf";
		map.envBrnMap = "static/bytes/spb.bin";
		map.diffuseMap = "static/assets/pbrtex/" + ns + "_diff_1k.jpg";
		map.normalMap = "static/assets/pbrtex/" + ns + "_nor_1k.jpg";
		map.armMap = "static/assets/pbrtex/" + ns + "_arm_1k.jpg";
		map.parallaxMap = "static/assets/pbrtex/" + ns + "_disp_1k.jpg";
		map.displacementMap = "static/assets/pbrtex/" + ns + "_disp_1k.jpg";


		pbr.defaultParam = {
			metallic: 1.0,
			roughness: 0.4,
			ao: 1.0,
			scatterIntensity: 8.0,
			sideIntensity: 8.0,

			shadowReceiveEnabled: true,
			fogEnabled: true,

			scatterEnabled: false,
			woolEnabled: true,
			absorbEnabled: false,
			normalNoiseEnabled: false,

			displacementParams: [0.02, -0.01],
			albedoColor: [1.0, 1.0, 1.0],
			parallaxParams: [1, 10, 5.0, 0.02]
		};


		let light = material.light;
		light.pointLights = [
			{position:[0.0, 190.0, 0.0], rgb: [0.0, 2.2, 0.0], factor1: 0.00001, factor2: 0.00005}
		];
		// light.spotLights = [
		// 	{position:[200.0, 190.0, 0.0], rgb: [5.8, 0.0, 0.0], direction: [0.0, -1.0, 0.0], factor1: 0.000001, factor2: 0.000001, angleDegree: 30}
		// ];

		light.directionLights = [
			{direction:[-1.0, -1.0, 0.0], rgb: [2.0, 0.0, 0.0]},
			{direction:[1.0, 1.0, 0.0], rgb: [0.0, 0.0, 2.0]}
		];

		let shadow = material.shadow;
		shadow.cameraPosition = [1, 800, 1];
		shadow.cameraNear = 10.0;
		shadow.cameraFar = 3000.0;
		shadow.mapSize = [512.0, 512.0];
		shadow.cameraViewSize = [4000, 4000];
		shadow.radius = 2.0;
		shadow.bias = -0.0005;
		shadow.shadowIntensity = 0.8;
		shadow.colorIntensity = 0.3;

		let url0 = "static/cospace/renderEffect/pbr/PBREffect.umd.js";
		let url1 = "static/cospace/renderEffect/lightModule/CoLightModule.umd.js";
		let url2 = "static/cospace/renderEffect/envLight/CoEnvLightModule.umd.js";
		let url3 = "static/cospace/renderEffect/vsmShadow/VSMShadowModule.umd.js";

		pbr.module = {url: url0};
		light.module = {url: url1};
		fog.module = {url: url2};
		shadow.module = {url: url3};


		let sceneData: any = {};
		sceneData.engine = engine;
		sceneData.material = material;

		let scJson = JSON.stringify(sceneData);
		console.log(scJson);
	}
	loadSCData(url: string , callback: (scData: any) => void): void {
		let loader: XMLHttpRequest = new XMLHttpRequest();
		loader.open("GET", url, true);
		loader.onerror = function(err) {
			console.error("load error: ", err);
		};

		loader.onprogress = e => {};
		loader.onload = evt => {
			console.log("scene data json file loaded, url: ", url);
			let jsonStr = loader.response;
			let json = JSON.parse( jsonStr );
			if(callback != null) {
				callback( json );
			}
		}
		loader.send(null);
	}
}

export default ViewerSCData;

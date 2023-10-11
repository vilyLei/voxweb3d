//////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////           WEBGL               ////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

// import { BaseRendering as Demo } from "./miniro/demo/BaseRendering";
// import { TextureRendering as Demo } from "./miniro/demo/TextureRendering";
// import { Texture2Rendering as Demo } from "./miniro/demo/Texture2Rendering";
// import { ChangeColor as Demo } from "./miniro/demo/ChangeColor";
// import { GLSL1Test as Demo } from "./miniro/demo/GLSL1Test";

//////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////           WEB-GPU               /////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

// import { WGPURInitialization as Demo } from "./miniro/engine/wgpurender/test/WGPURInitialization";
// import { WGPURRectShape as Demo } from "./miniro/engine/wgpurender/test/WGPURRectShape";
// import { WGPURUniform as Demo } from "./miniro/engine/wgpurender/test/WGPURUniform";
// import { WGPURColorGrid as Demo } from "./miniro/engine/wgpurender/test/WGPURColorGrid";
// import { WGPURStorage as Demo } from "./miniro/engine/wgpurender/test/WGPURStorage";
// import { WGPURStorage2 as Demo } from "./miniro/engine/wgpurender/test/WGPURStorage2";
// import { WGPUSimulation as Demo } from "./miniro/engine/wgpurender/test/WGPUSimulation";
// import { WGPUGameOfLife as Demo } from "./miniro/engine/wgpurender/test/WGPUGameOfLife";
// import { WGPUGameOfLife2 as Demo } from "./miniro/engine/wgpurender/test/WGPUGameOfLife2";

// import { WGPUApiTest as Demo } from "./miniro/engine/wgpurender/test/WGPUApiTest";

import { ColorTriangle as Demo } from "./miniro/engine/wgpurender/test/ColorTriangle";

// import { WGPURSampler as Demo } from "./miniro/engine/wgpurender/test/WGPURSampler";

let demoIns = new Demo();
function main(): void {
	console.log("------ demo --- init ------");
	demoIns.initialize();
	function mainLoop(now: any): void {
		demoIns.run();
		window.requestAnimationFrame(mainLoop);
	}
	window.requestAnimationFrame(mainLoop);
	console.log("------ demo --- running ------");
}
main();

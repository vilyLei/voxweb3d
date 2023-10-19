//////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////           WEB-GPU               /////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////


// import { ShapeTriangle as Demo } from "./voxgpu/demo/ShapeTriangle";
// import { ShapeTriangleMSAA as Demo } from "./voxgpu/demo/ShapeTriangleMSAA";
// import { ShapeCubeRotating as Demo } from "./voxgpu/demo/ShapeCubeRotating";
// import { ShapeCubeRotCam as Demo } from "./voxgpu/demo/ShapeCubeRotCam";
// import { ShapeCubeMSAA as Demo } from "./voxgpu/demo/ShapeCubeMSAA";
// import { MultiShapeCube as Demo } from "./voxgpu/demo/MultiShapeCube";
// import { TexturedCube as Demo } from "./voxgpu/demo/TexturedCube";

// import { BaseRPipeline as Demo } from "./voxgpu/demo/BaseRPipeline";
// import { BaseRPipeline2 as Demo } from "./voxgpu/demo/BaseRPipeline2";
// import { BaseWROScene as Demo } from "./voxgpu/demo/BaseWROScene";

// import { DemoWROPrimitive as Demo } from "./voxgpu/demo/DemoWROPrimitive";

// import { BaseWROBlend as Demo } from "./voxgpu/demo/BaseWROBlend";
// import { DemoDrawInstance as Demo } from "./voxgpu/demo/DemoDrawInstance";
// import { DemoMultiTexture as Demo } from "./voxgpu/demo/DemoMultiTexture";
// import { DemoMaterial as Demo } from "./voxgpu/demo/DemoMaterial";

// import { DemoEntityTestScene as Demo } from "./voxgpu/demo/DemoEntityTestScene";
// import { DemoEntityAnimate as Demo } from "./voxgpu/demo/DemoEntityAnimate";

// import { DemoCubeMap as Demo } from "./voxgpu/demo/DemoCubeMap";

// import { DemoTriangle as Demo } from "./voxgpu/demo/DemoTriangle";
import { DemoCube as Demo } from "./voxgpu/demo/DemoCube";

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

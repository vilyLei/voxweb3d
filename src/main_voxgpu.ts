//////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////           WEB-GPU               /////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////


// import { ShapeTriangle as Demo } from "./voxgpu/demo/ShapeTriangle";
// import { ShapeTriangleMSAA as Demo } from "./voxgpu/demo/ShapeTriangleMSAA";
// import { ShapeCubeRotating as Demo } from "./voxgpu/demo/ShapeCubeRotating";
// import { ShapeCubeRotCam as Demo } from "./voxgpu/demo/ShapeCubeRotCam";
// import { ShapeCubeMSAA as Demo } from "./voxgpu/demo/ShapeCubeMSAA";
// import { MultiShapeCube as Demo } from "./voxgpu/demo/MultiShapeCube";

import { TexturedCube as Demo } from "./voxgpu/demo/TexturedCube";

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

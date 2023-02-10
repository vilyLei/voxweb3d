
// import { DemoBase as Demo } from "./demo/DemoBase";
// import { DemoMouseEvent as Demo } from "./demo/DemoMouseEvent";
// import { DemoCoBase as Demo } from "./demo/DemoCoBase";
// import { DemoCoUIInterac as Demo } from "./demo/DemoCoUIInterac";
// import { DemoCoMesh as Demo } from "./demo/DemoCoMesh";
// import { DemoCoAGeom as Demo } from "./demo/DemoCoAGeom";
// import { DemoMoveObj as Demo } from "./demo/DemoMoveObj";

// import { DemoEditTrans as Demo } from "./demo/DemoEditTrans";
// import { DemoTransEditor as Demo } from "./demo/DemoTransEditor";

// import { DemoUIAtlas as Demo } from "./demo/DemoUIAtlas";
// import { DemoUIScene as Demo } from "./demo/DemoUIScene";
// import { DemoUIPanel as Demo } from "./demo/DemoUIPanel";
import { DemoText as Demo } from "./demo/DemoText";

// import { DemoNormalViewer as Demo } from "./demo/DemoNormalViewer";

// import { DemoKeyboardEvent as Demo } from "./demo/DemoKeyboardEvent";
// import { DemoTransRecoder as Demo } from "./demo/DemoTransRecoder";

let demoIns = new Demo();
let ins: any = demoIns;
function main(): void {
	console.log("------ demo --- init ------");
	ins.initialize();
	function mainLoop(now: any): void {
		ins.run();
		window.requestAnimationFrame(mainLoop);
	}
	window.requestAnimationFrame(mainLoop);
	console.log("------ demo --- running ------");
}
main();

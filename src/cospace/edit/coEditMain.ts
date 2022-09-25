
// import { DemoBase as Demo } from "./demo/DemoBase";
// import { DemoMouseEvent as Demo } from "./demo/DemoMouseEvent";
// import { DemoCoBase as Demo } from "./demo/DemoCoBase";
// import { DemoCoAGeom as Demo } from "./demo/DemoCoAGeom";
// import { DemoMoveObj as Demo } from "./demo/DemoMoveObj";

// import { DemoEditTrans as Demo } from "./demo/DemoEditTrans";

// import { DemoUIScene as Demo } from "./demo/DemoUIScene";
// import { DemoKeyboardEvent as Demo } from "./demo/DemoKeyboardEvent";
import { DemoTransRecoder as Demo } from "./demo/DemoTransRecoder";

let demoIns: Demo = new Demo();
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

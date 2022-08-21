
// import { DemoBase as Demo } from "./demo/DemoBase";
// import { DemoCoBase as Demo } from "./demo/DemoCoBase";
// import { DemoCoAGeom as Demo } from "./demo/DemoCoAGeom";
import { DemoMoveObj as Demo } from "./demo/DemoMoveObj";

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

// import {DemoThread as Demo} from "./cospace/modules/thread/example/DemoThread";
// import {DemoThread as Demo} from "./cospace/demo/DemoThread";
// import {DemoThreadLoadJS as Demo} from "./cospace/demo/DemoThreadLoadJS";
// import { DemoCTMLoadAndParser as Demo } from "./cospace/demo/DemoCTMLoadAndParser";
// import { DemoFBXFastParser as Demo } from "./cospace/demo/DemoFBXFastParser";
// import { DemoOBJParser as Demo } from "./cospace/demo/DemoOBJParser";

// import { DemoCTMLoad as Demo } from "./cospace/demo/DemoCTMLoad";
// import { DemoCTMParser as Demo } from "./cospace/demo/DemoCTMParser";
// import { DemoDracoParser as Demo } from "./cospace/demo/DemoDracoParser";
// import { DemoCTMToDraco as Demo } from "./cospace/demo/DemoCTMToDraco";
// import { DemoDracoEncode as Demo } from "./cospace/demo/DemoDracoEncode";
// import { DemoDracoEncode as Demo } from "./cospace/demo/DemoDracoEncode";
// import { DemoDracoParser2 as Demo } from "./cospace/demo/DemoDracoParser2";
// import { DemoFBXParser as Demo } from "./cospace/demo/DemoFBXParser";
// import { DemoGLBParser as Demo } from "./cospace/demo/DemoGLBParser";
// import { DemoPNGParser as Demo } from "./cospace/demo/DemoPNGParser";
// import { DemoMixParser as Demo } from "./cospace/demo/DemoMixParser";
// import { DemoCospace as Demo } from "./cospace/demo/DemoCospace";
// import { DemoDependenceGraph as Demo } from "./cospace/demo/DemoDependenceGraph";
// import { DemoCTMViewer as Demo } from "./cospace/demo/DemoCTMViewer";
// import { DemoNormalViewer as Demo } from "./cospace/demo/DemoNormalViewer";

// import { RenderingVerifier as Demo } from "./cospace/demo/RenderingVerifier";

// import { DemoCoApp as Demo } from "./cospace/demo/DemoCoApp";

// import { DemoCoRenderer as Demo } from "./cospace/demo/DemoCoRenderer";
// import { DemoCoRendererScene as Demo } from "./cospace/demo/DemoCoRendererScene";
// import { DemoCoRendererSubScene as Demo } from "./cospace/demo/DemoCoRendererSubScene";
// import { DemoCoSimpleRendereScene as Demo } from "./cospace/demo/DemoCoSimpleRendereScene";

// import { DemoCoViewer as Demo } from "./cospace/demo/DemoCoViewer";

import { DemoOutline as Demo } from "./cospace/demo/DemoOutline";
// import { DemoPostOutline as Demo } from "./cospace/demo/DemoPostOutline";

// import { DemoCoEngine as Demo } from "./cospace/demo/DemoCoEngine";
// import { DemoInputText as Demo } from "./cospace/demo/DemoInputText";
// import { DemoCORS as Demo } from "./cospace/demo/DemoCORS";

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

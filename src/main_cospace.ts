(document as any).demoState = 1;
class VVF {
    isEnabled(): boolean {
        return true;
    }
}
let pwin: any = window;
pwin["VoxVerify"] = new VVF();

// import {DemoThread as Demo} from "./cospace/modules/thread/example/DemoThread";
// import {DemoThread as Demo} from "./cospace/demo/DemoThread";
// import {DemoThreadLoadJS as Demo} from "./cospace/demo/DemoThreadLoadJS";
// import { DemoCTMLoadAndParser as Demo } from "./cospace/demo/DemoCTMLoadAndParser";
// import { DemoFBXFastParser as Demo } from "./cospace/demo/DemoFBXFastParser";
// import { DemoOBJParser as Demo } from "./cospace/demo/DemoOBJParser";

// import { DemoCTMLoad as Demo } from "./cospace/demo/DemoCTMLoad";
// import { DemoCTMParser as Demo } from "./cospace/demo/DemoCTMParser";
// import { DemoDracoParser as Demo } from "./cospace/demo/DemoDracoParser";
// import { DemoShowCTMAndDraco as Demo } from "./cospace/demo/DemoShowCTMAndDraco";
// import { DemoCTMToDraco as Demo } from "./cospace/demo/DemoCTMToDraco";
// import { DemoDracoEncode as Demo } from "./cospace/demo/DemoDracoEncode";
// import { DemoDracoParser2 as Demo } from "./cospace/demo/DemoDracoParser2";
// import { DemoFBXParser as Demo } from "./cospace/demo/DemoFBXParser";
// import { DemoGLBParser as Demo } from "./cospace/demo/DemoGLBParser";
// import { DemoPNGParser as Demo } from "./cospace/demo/DemoPNGParser";
// import { DemoMixParser as Demo } from "./cospace/demo/DemoMixParser";
import { DemoCospace as Demo } from "./cospace/demo/DemoCospace";
// import { DemoCospaceDeferredInit as Demo } from "./cospace/demo/DemoCospaceDeferredInit";
// import { DemoDependenceGraph as Demo } from "./cospace/demo/DemoDependenceGraph";
// import { DemoCTMViewer as Demo } from "./cospace/demo/DemoCTMViewer";
// import { DemoNormalViewer as Demo } from "./cospace/demo/DemoNormalViewer";

// import { RenderingVerifier as Demo } from "./cospace/demo/RenderingVerifier";

// import { DemoCoApp as Demo } from "./cospace/demo/DemoCoApp";
// import { DemoCoAppDeferredInit as Demo } from "./cospace/demo/DemoCoAppDeferredInit";

// import { DemoCoRenderer as Demo } from "./cospace/demo/DemoCoRenderer";
// import { DemoCoRendererScene as Demo } from "./cospace/demo/DemoCoRendererScene";
// import { DemoCoRendererSubScene as Demo } from "./cospace/demo/DemoCoRendererSubScene";
// import { DemoCoRendererSceneGraph as Demo } from "./cospace/demo/DemoCoRendererSceneGraph";
// import { DemoCoSimpleRendereScene as Demo } from "./cospace/demo/DemoCoSimpleRendereScene";
// import { DemoDisplayModel as Demo } from "./cospace/demo/DemoDisplayModel";
// import { DemoShaderMaterial as Demo } from "./cospace/demo/DemoShaderMaterial";
// import { DemoPrimitives as Demo } from "./cospace/demo/DemoPrimitives";
// import { DemoVtxDrawingInfo as Demo } from "./cospace/demo/DemoVtxDrawingInfo";

// import { DemoCoViewer as Demo } from "./cospace/demo/DemoCoViewer";
// import { DemoVox3DEditor as Demo } from "./cospace/demo/DemoVox3DEditor";

// import { DemoOutline as Demo } from "./cospace/demo/DemoOutline";
// import { DemoPostOutline as Demo } from "./cospace/demo/DemoPostOutline";
// import { DemoCoParticle as Demo } from "./cospace/demo/DemoCoParticle";
// import { DemoCoParticleFlow as Demo } from "./cospace/demo/DemoCoParticleFlow";
// import { DemoCoParticleModule as Demo } from "./cospace/demo/DemoCoParticleModule";

// import { DemoCoEdit as Demo } from "./cospace/demo/DemoCoEdit";

// import { DemoInputText as Demo } from "./cospace/demo/DemoInputText";
// import { DemoCORS as Demo } from "./cospace/demo/DemoCORS";


let demoIns: Demo = new Demo();
let ins: any = demoIns;
function main(): void {
	console.log("------ demo --- init ------");
	ins.initialize();
	if(ins.run) {
		function mainLoop(now: any): void {
			ins.run();
			window.requestAnimationFrame(mainLoop);
		}
		window.requestAnimationFrame(mainLoop);
	}
	console.log("------ demo --- running ------");
}
main();

// import {DemoThread as Demo} from "./cospace/modules/thread/example/DemoThread";
// import {DemoThread as Demo} from "./cospace/demo/DemoThread";
// import {DemoThreadLoadJS as Demo} from "./cospace/demo/DemoThreadLoadJS";
// import { DemoCTMLoadAndParser as Demo } from "./cospace/demo/DemoCTMLoadAndParser";
// import { DemoCTMParser as Demo } from "./cospace/demo/DemoCTMParser";
// import { DemoDracoParser as Demo } from "./cospace/demo/DemoDracoParser";
// import { DemoDracoParser2 as Demo } from "./cospace/demo/DemoDracoParser2";
// import { DemoMixParser as Demo } from "./cospace/demo/DemoMixParser";
// import { DemoCospace as Demo } from "./cospace/demo/DemoCospace";
// import { DemoDependenceGraph as Demo } from "./cospace/demo/DemoDependenceGraph";
// import { DemoCTMViewer as Demo } from "./cospace/demo/DemoCTMViewer";
// import { DemoNormalViewer as Demo } from "./cospace/demo/DemoNormalViewer";
import { RenderingVerifier as Demo } from "./cospace/demo/RenderingVerifier";

document.title = "RenderingVerifier";
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

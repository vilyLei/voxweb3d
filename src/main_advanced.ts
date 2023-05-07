(document as any).demoState = 1;
class VVF {
    isEnabled(): boolean {
        return true;
    }
}
let pwin: any = window;
pwin["VoxVerify"] = new VVF();

// import {DemoLightFlow2 as Demo} from "./advancedDemo/depthLight/DemoLightFlow2";

// import {DemoLightFlow as Demo} from "./advancedDemo/depthLight/DemoLightFlow";

// import {DemoLightFlow as Demo} from "./advancedDemo/depthFog/DemoLightFlow";

// import { DemoSphDepthFogRender as Demo } from "./advancedDemo/base/DemoSphDepthFogRender";

import { DemoSphDepthFogRender2 as Demo } from "./advancedDemo/base/DemoSphDepthFogRender2";

// import { DemoSphDepthFog as Demo } from "./advancedDemo/base/DemoSphDepthFog";

// import { DemoFog as Demo } from "./advancedDemo/base/DemoFog";

//  import {DemoRTTBlend as Demo} from "./advancedDemo/base/DemoRTTBlend";

//  import {DemoRTT as Demo} from "./advancedDemo/base/DemoRTT";

let demoIns = new Demo() as any;
function main(): void {
    console.log("-------------------------------- vat sys --- init ------------------------------------");
    demoIns.initialize();
    if(demoIns.run) {
        function mainLoop(now: any): void {
            demoIns.run();
            window.requestAnimationFrame(mainLoop);
        }
        window.requestAnimationFrame(mainLoop);
    }
    console.log("-------------------------------- vat sys --- running -------------------------------------");
}
//
main();

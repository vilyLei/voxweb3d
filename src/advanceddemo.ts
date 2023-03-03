
import {DemoLightFlow as Demo} from "./advancedDemo/depthLight/DemoLightFlow";

//  import {DemoRTTBlend as Demo} from "./advancedDemo/base/DemoRTTBlend";

//  import {DemoRTT as Demo} from "./advancedDemo/base/DemoRTT";

let demoIns:Demo = new Demo();
function main():void
{
    console.log("-------------------------------- vat sys --- init ------------------------------------");
    demoIns.initialize();
    function mainLoop(now:any):void
    {
        demoIns.run();
        window.requestAnimationFrame(mainLoop);
    }
    window.requestAnimationFrame(mainLoop);
    console.log("-------------------------------- vat sys --- running -------------------------------------"); 
}
//
main();

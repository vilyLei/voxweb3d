//volume light,DemoLightFlow
// import * as DemoLightFlow from "./advancedDemo/depthLight/DemoLightFlow";
// import Demo = DemoLightFlow.advancedDemo.depthLight.DemoLightFlow;

import {DemoLightFlow as Demo} from "./advancedDemo/depthLight/DemoLightFlow";

//  volume fog
//  import * as DemoFogFlow from "./advancedDemo/depthFog4/DemoFogFlow";
//  import Demo = DemoFogFlow.advancedDemo.depthFog4.DemoFogFlow;

//  import * as DemoFogSph from "./advancedDemo/depthFog4/DemoFogSph";
//  import Demo = DemoFogSph.advancedDemo.depthFog4.DemoFogSph;

//  import * as DemoFogSph from "./advancedDemo/depthFog3/DemoFogSph";
//  import Demo = DemoFogSph.advancedDemo.depthFog3.DemoFogSph;

//  import * as DemoFogSph2 from "./advancedDemo/depthFog2/DemoFogSph2";
//  import Demo = DemoFogSph2.advancedDemo.depthFog2.DemoFogSph2;

//  import * as DemoFogSph from "./advancedDemo/depthFog2/DemoFogSph";
//  import Demo = DemoFogSph.advancedDemo.depthFog2.DemoFogSph;

//  import * as DemoSphBlend from "./advancedDemo/depthFog/DemoSphBlend";
//  import Demo = DemoSphBlend.advancedDemo.depthFog.DemoSphBlend;

//  import * as DemoSph from "./advancedDemo/depthFog/DemoSph";
//  import Demo = DemoSph.advancedDemo.depthFog.DemoSph;

//  import * as DemoBase from "./advancedDemo/depthFog/DemoBase";
//  import Demo = DemoBase.advancedDemo.depthFog.DemoBase;

//  import * as DemoRTTBlend from "./advancedDemo/base/DemoRTTBlend";
//  import Demo = DemoRTTBlend.advancedDemo.base.DemoRTTBlend;

//  import * as DemoRTT from "./advancedDemo/base/DemoRTT";
//  import Demo = DemoRTT.advancedDemo.base.DemoRTT;

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


/**
 * 渲染系统的基本用例demos
 * These are some examples for this renderer system
 */

import * as DemoMobileEvt from "./demo/DemoMobileEvt";
import Demo = DemoMobileEvt.demo.DemoMobileEvt;

//  import * as DemoRTT from "./demo/DemoRTT";
//  import Demo = DemoRTT.demo.DemoRTT;

//  import * as DemoFBOInstance from "./demo/DemoFBOInstance";
//  import Demo = DemoFBOInstance.demo.DemoFBOInstance;

//  import * as DemoMRT from "./demo/DemoMRT";
//  import Demo = DemoMRT.demo.DemoMRT;

//  import * as DemoCubeMapMRT from "./demo/DemoCubeMapMRT";
//  import Demo = DemoCubeMapMRT.demo.DemoCubeMapMRT;

//  import * as DemoDepthTex from "./demo/DemoDepthTex";
//  import Demo = DemoDepthTex.demo.DemoDepthTex;

//  import * as DemoMaterial from "./demo/DemoMaterial";
//  import Demo = DemoMaterial.demo.DemoMaterial;

//  import * as DemoParticleEruption from "./demo/DemoParticleEruption";
//  import Demo = DemoParticleEruption.demo.DemoParticleEruption;

//  import * as DemoVtx from "./demo/DemoVtx";
//  import Demo = DemoVtx.demo.DemoVtx;

//  import * as DemoSwapProcess from "./demo/DemoSwapProcess";
//  import Demo = DemoSwapProcess.demo.DemoSwapProcess;

//  import * as DemoDelEntity from "./demo/DemoDelEntity";
//  import Demo = DemoDelEntity.demo.DemoDelEntity;

//  import * as DemoText2D from "./demo/DemoText2D";
//  import Demo = DemoText2D.demo.DemoText2D;

//  import * as DemoTexUpdate from "./demo/DemoTexUpdate";
//  import Demo = DemoTexUpdate.demo.DemoTexUpdate;

//  import * as DemoKeyboardEvt from "./demo/DemoKeyboardEvt";
//  import Demo = DemoKeyboardEvt.demo.DemoKeyboardEvt;

//  import * as DemoParticle from "./demo/DemoParticle";
//  import Demo = DemoParticle.demo.DemoParticle;

//  import * as DemoContainer from "./demo/DemoContainer";
//  import Demo = DemoContainer.demo.DemoContainer;

//  import * as DemoMatContainer from "./demo/DemoMatContainer";
//  import Demo = DemoMatContainer.demo.DemoMatContainer;

//  import * as DemoContainerTransform from "./demo/DemoContainerTransform";
//  import Demo = DemoContainerTransform.demo.DemoContainerTransform;

//  import * as DemoFontText from "./demo/DemoFontText";
//  import Demo = DemoFontText.demo.DemoFontText;

//  import * as DemoDivControl from "./demo/DemoDivControl";
//  import Demo = DemoDivControl.demo.DemoDivControl;

//  import * as DemoDepthBlur from "./demo/DemoDepthBlur";
//  import Demo = DemoDepthBlur.demo.DemoDepthBlur;

//  import * as DemoScene from "./demo/DemoScene";
//  import Demo = DemoScene.demo.DemoScene;

//  import * as DemoGpuTexMana from "./demo/DemoGpuTexMana";
//  import Demo = DemoGpuTexMana.demo.DemoGpuTexMana;

//  import {DemoAPlane as Demo} from "./demo/DemoAPlane";

//  import * as DemoPrimitive from "./demo/DemoPrimitive";
//  import Demo = DemoPrimitive.demo.DemoPrimitive;

//  import * as DemoMultiRenderer from "./demo/DemoMultiRenderer";
//  import Demo = DemoMultiRenderer.demo.DemoMultiRenderer;

//  import {DemoEmptyRenderer as Demo} from "./demo/DemoEmptyRenderer";

//  import {DemoEmptyRendererScene as Demo} from "./demo/DemoEmptyRendererScene";


///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

//  import * as BoFrame from "./app/BoFrame";
//  import Demo = BoFrame.app.BoFrame;

let demoIns:Demo = new Demo();
let ins:any = demoIns;
if(ins.runBegin != undefined)
{
    function main1():void
    {
        console.log("------ demo --- init ------");
        ins.initialize();
        function mainLoop(now:any):void
        {
            ins.runBegin();
            ins.run();
            ins.runEnd();
            window.requestAnimationFrame(mainLoop);
        }
        window.requestAnimationFrame(mainLoop);
        console.log("------ demo --- running ------"); 
    }
    //
    main1();
}
else
{
    function main2():void
    {
        console.log("------ demo --- init ------");
        demoIns.initialize();
        function mainLoop(now:any):void
        {
            demoIns.run();
            window.requestAnimationFrame(mainLoop);
        }
        window.requestAnimationFrame(mainLoop);
        console.log("------ demo --- running ------"); 
    }
    //
    main2();
}

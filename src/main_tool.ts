(document as any).demoState = 1;

///////////////////////////////////////////////////////////////////////////////
//////////////////////////////     base    ////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

//  import {RemoveBlackBG as Demo} from "./tool/RemoveBlackBG";

 import {RemoveBlackBG2 as Demo} from "./tool/RemoveBlackBG2";

//  import {NormalMapVerifier as Demo} from "./tool/NormalMapVerifier";

//  import {NormalMapBuilder as Demo} from "./tool/NormalMapBuilder";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

document.title = "Vox APP";
let ins = new Demo() as any;
function main(): void {
    console.log("------ demo --- init ------");
    ins.initialize();
    if(ins.run != undefined) {
        let runFunc = ins.run.bind(ins);
        function mainLoop(now: any): void {
            runFunc();
            window.requestAnimationFrame(mainLoop);
        }
        window.requestAnimationFrame(mainLoop);
    }
    console.log("------ demo --- running ------");
}
main();

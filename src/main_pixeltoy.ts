(document as any).demoState = 1;
class VVF {
    isEnabled(): boolean {
        return true;
    }
}
let pwin: any = window;
pwin["VoxVerify"] = new VVF();

///////////////////////////////////////////////////////////////////////////////
//////////////////////////////     base    ////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

 import {DemoCloud as Demo} from "./pixelToy/cloud/DemoCloud";


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

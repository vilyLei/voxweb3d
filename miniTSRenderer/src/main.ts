import { BaseRendering as Demo } from "./demo/BaseRendering";
// import { TextureRendering as Demo } from "./demo/TextureRendering";
// import { Texture2Rendering as Demo } from "./demo/Texture2Rendering";
// import { ChangeColor as Demo } from "./demo/ChangeColor";
// import { GLSL1Test as Demo } from "./demo/GLSL1Test";

let demoIns: Demo = new Demo();
function main(): void {
	console.log("------ demo --- init ------");
	demoIns.initialize();
	function mainLoop(now: any): void {
		demoIns.run();
		window.requestAnimationFrame(mainLoop);
	}
	window.requestAnimationFrame(mainLoop);
	console.log("------ demo --- running ------");
}
main();
import { BaseRendering as Demo } from "./miniro/demo/BaseRendering";
// import { TextureRendering as Demo } from "./miniro/demo/TextureRendering";
// import { Texture2Rendering as Demo } from "./miniro/demo/Texture2Rendering";
// import { ChangeColor as Demo } from "./miniro/demo/ChangeColor";
// import { GLSL1Test as Demo } from "./miniro/demo/GLSL1Test";

let demoIns = new Demo();
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

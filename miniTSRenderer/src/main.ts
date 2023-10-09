console.log("running code...");
// /*
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
//*/
/*
import { Shader } from "./engine/Shader";
import { RenderableUnit } from "./engine/RenderableUnit";
import { Engine } from "./engine/Engine";

let vtxGLSLSrc0: string = `#version 300 es
precision highp float;
layout(location = 0) in vec3 a_vs;
void main(){
    gl_Position = vec4(a_vs,1.0);
}
`;

let fragGLSLSrc0: string = `#version 300 es
precision mediump float;
uniform vec4 params[3];
uniform vec4 u_color;
layout(location = 0) out vec4 FragColor;
void main(){
    vec2 pos = gl_FragCoord.xy/params[1].zw;
    FragColor = params[0] * (params[2] * vec4(pos.xy, 1.0, 1.0) + 0.01 * u_color);
}
`;
function main(): void {
	let engine = new Engine();
	engine.initialize();


	let unit = new RenderableUnit();

	const materialParams: any = {params: {value: new Float32Array([
        1.0, 1.0, 1.0, 1.0,			// 色彩强度
        0.5, 0.5,					// 中心位置
        800.0, 600.0,               // 绘制区域宽和高
        1.0, 1.0, 1.0, 1.0,			// 控制参数
    ])}};
	unit.material.params = materialParams;

	unit.material.initialize(new Shader(vtxGLSLSrc0, fragGLSLSrc0));
	engine.addRenderableUnit(unit);

	let time: number = 0.0;
	let timeX: number = 0.0;
	let timeY: number = 0.0;

	console.log("------ demo --- init ------");

	function mainLoop(now: any): void {

		engine.renderer.bgColor.g = Math.abs(Math.sin(time+=0.02));

		const vs = materialParams.params.value as Float32Array;
		vs[8] = Math.abs(Math.cos(timeX));
		vs[9] = Math.abs(Math.cos(timeY));
		timeX += 0.005;
		timeY += 0.01;

		engine.run();

		window.requestAnimationFrame(mainLoop);
	}
	window.requestAnimationFrame(mainLoop);
	console.log("------ demo --- running ------");
}
main();
//*/

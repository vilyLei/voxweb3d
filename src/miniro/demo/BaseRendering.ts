
import { Shader } from "../engine/material/Shader";
import { RenderableUnit } from "../engine/entity/RenderableUnit";
import { MiniREngine } from "../engine/MiniREngine";

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
uniform vec4 color;
layout(location = 0) out vec4 FragColor;
void main(){
    vec2 pos = gl_FragCoord.xy/params[1].zw;
    FragColor = params[0] * (params[2] * vec4(pos.xy, 1.0, 1.0) + 0.01 * color);
}
`;
/**
 * 基本测试 demo
 */
export class BaseRendering {
	private engine = new MiniREngine();
	private materialParams: any = {
		params: {
			value: new Float32Array([
				1.0, 1.0, 1.0, 1.0, // 色彩强度

				0.5,
				0.5, // 中心位置
				800.0,
				600.0, // 绘制区域宽和高

				1.0,
				1.0,
				1.0,
				1.0 // 控制参数
			])
		},
		color: {value: [50.0,50.0,50.0,1.0]}
	};
	constructor() {}

	initialize(): void {

		this.engine.initialize();

		let unit = new RenderableUnit();
		unit.material.params = this.materialParams;
		unit.material.initialize(new Shader(vtxGLSLSrc0, fragGLSLSrc0, "aaa"));

		this.engine.addRenderableUnit(unit);

		unit = new RenderableUnit();
		unit.material.params = this.materialParams;
		unit.material.initialize(new Shader(vtxGLSLSrc0, fragGLSLSrc0, "aaa"));

		this.engine.addRenderableUnit(unit);
	}

	private time = 0.0;
	private timeX = 0.0;
	private timeY = 0.0;

	run(): void {

		const vs = this.materialParams.params.value as Float32Array;
		vs[8] = Math.abs(Math.cos(this.timeX));
		vs[9] = Math.abs(Math.cos(this.timeY));

		this.timeX += 0.005;
		this.timeY += 0.01;

		this.engine.renderer.bgColor.g = Math.abs(Math.sin((this.time += 0.02)));
		this.engine.run();
	}
}

export default BaseRendering;

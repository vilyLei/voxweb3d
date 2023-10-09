
import { Shader } from "../engine/material/Shader";
import { RenderableUnit } from "../engine/entity/RenderableUnit";
import { MiniREngine } from "../engine/MiniREngine";
import {ImageTexture} from "../engine/texture/ImageTexture";

let vtxGLSLSrc0: string = `#version 300 es
precision highp float;
layout(location = 0) in vec3 a_vs;
void main(){
    gl_Position = vec4(a_vs,1.0);
}
`;

let fragGLSLSrc0: string = `#version 300 es
precision mediump float;
uniform sampler2D tex01;
uniform sampler2D tex02;
uniform vec4 param;
uniform vec4 color;
uniform float factor;
layout(location = 0) out vec4 FragColor;
void main(){
    vec2 pos = gl_FragCoord.xy/param.zw;
	vec4 tc01 = texture( tex01, pos );
	vec4 tc02 = texture( tex02, pos );
	vec4 tcolor = mix(tc01 , tc02, factor);
    FragColor = tcolor;
}
`;
/**
 * 多重纹理功能测试 demo
 */
export class Texture2Rendering {
	private engine = new MiniREngine();
	private materialParams: any = {
		param: {
			value: [1.0, 1.0, 800.0, 600.0] // 色彩强度
		},
		color: {
			value: [1.0, 1.0, 1.0, 1.0] // 色彩强度
		},
		factor: {value: 0.5},
		tex01: null,
		tex02: null,
	};
	constructor() {}

	initialize(): void {

		let htmlCanvas = document.createElement('canvas');
		htmlCanvas.width = 800;
		htmlCanvas.height = 600;
		document.body.appendChild(htmlCanvas);
		const rcfg: any = {canvas:htmlCanvas};

		this.engine.initialize(rcfg);

		let tex01 = new ImageTexture(this.engine.renderer.getGL());
		tex01.flipY = true;
		let img01 = new Image();
        img01.onload = (): void => {
			tex01.setDataFromImage(img01);
		}
        img01.src = "static/assets/default.jpg";
		this.materialParams.tex01 = {value: tex01};

		let tex02 = new ImageTexture(this.engine.renderer.getGL());
		tex02.flipY = true;
		let img02 = new Image();
        img02.onload = (): void => {
			tex02.setDataFromImage(img02);
		}
        img02.src = "static/assets/box.jpg";
		this.materialParams.tex02 = {value: tex02};

		let unit = new RenderableUnit();

		unit.material.params = this.materialParams;
		unit.material.initialize(new Shader(vtxGLSLSrc0, fragGLSLSrc0));

		unit.geometryBuffer.setVertexs(new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0]));

		this.engine.addRenderableUnit(unit);

		// 点击缩放大小
		document.onmousedown = evt => {

			let pw = 512,ph = 512;
			let vs = this.materialParams.param.value;
			vs[2] = pw;
			vs[3] = ph;
			this.engine.renderer.setSize(pw,ph);
		}
	}
	private time = 0.0;

	run(): void {

		this.materialParams.factor.value = Math.abs(Math.sin((this.time += 0.01)));
		this.engine.run();
	}
}

export default Texture2Rendering;

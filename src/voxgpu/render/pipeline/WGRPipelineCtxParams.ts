import { GPUBlendComponent } from "../../gpu/GPUBlendComponent";
import { GPUColorTargetState } from "../../gpu/GPUColorTargetState";
import { GPUDepthStencilState } from "../../gpu/GPUDepthStencilState";
import { GPUDevice } from "../../gpu/GPUDevice";
import { GPUFragmentState } from "../../gpu/GPUFragmentState";
import { GPUMultisampleObject } from "../../gpu/GPUMultisampleObject";
import { GPUPrimitiveState } from "../../gpu/GPUPrimitiveState";
import { GPURenderPipelineDescriptor } from "../../gpu/GPURenderPipelineDescriptor";
import { GPUVertexAttribute } from "../../gpu/GPUVertexAttribute";
import { GPUVertexBufferLayout } from "../../gpu/GPUVertexBufferLayout";
import { GPUVertexState } from "../../gpu/GPUVertexState";

interface WGRPipelineContextDefParam {
	blendMode?: string;
	blendModes?: string[];
	depthWriteEnabled?: boolean;
	primitiveState?: GPUPrimitiveState;
	depthStencil?: GPUDepthStencilState;
	faceCullMode?: string;
	depthStencilEnabled?: boolean;
}
interface WGRShderSrcType {
	vertShaderSrc: { code: string; uuid: string };
	fragShaderSrc: { code: string; uuid: string };
}
interface IWGRShadeSrcParam {
	uuid?: string;
	vertEntryPoint?: string;
	fragEntryPoint?: string;
	compEntryPoint?: string;
	code: string;
}
interface WGRPipelineParamType {
	sampleCount?: number;
	// msaaEnabled?: boolean;
	multisampleEnabled?: boolean;
	depthStencilEnabled?: boolean;
	fragmentEnabled?: boolean;
	shaderSrc?: IWGRShadeSrcParam;
	vertShaderSrc?: IWGRShadeSrcParam;
	fragShaderSrc?: IWGRShadeSrcParam;
	compShaderSrc?: IWGRShadeSrcParam;
	depthStencil?: GPUDepthStencilState;
}
class WGRPipelineCtxParams implements GPURenderPipelineDescriptor {
	buildDeferred = true;
	sampleCount = 1;
	multisampleEnabled = false;
	depthStencilEnabled = false;
	fragmentEnabled = true;
	shaderSrc?: IWGRShadeSrcParam;
	vertShaderSrc?: IWGRShadeSrcParam;
	fragShaderSrc?: IWGRShadeSrcParam;
	compShaderSrc?: IWGRShadeSrcParam;
	layout = "auto";
	vertex: GPUVertexState = {
		module: null,
		entryPoint: "main",
		buffers: []
	};
	fragment?: GPUFragmentState;
	primitive?: GPUPrimitiveState;
	depthStencil?: GPUDepthStencilState;
	multisample?: GPUMultisampleObject;
	constructor(param?: WGRPipelineParamType) {
		if (param) {
			const selfT = this as any;
			for (var k in param) {
				selfT[k] = (param as any)[k];
			}
			this.depthStencilEnabled = this.depthStencil ? true : this.depthStencilEnabled;
			if (this.depthStencilEnabled && !this.depthStencil) {
				this.depthStencil = {
					depthWriteEnabled: true,
					depthCompare: "less",
					format: "depth24plus"
					// format: "depth32float"
					// format: "depth24plus"
				};
			}
			if (this.fragmentEnabled) {
				this.fragment = {
					module: null,
					entryPoint: "main",
					targets: [
						{
							format: "bgra8unorm"
						}
					]
				};
			}
			this.primitive = {
				frontFace: "ccw",
				topology: "triangle-list",
				cullMode: "back"
			};
			if (this.multisampleEnabled) {
				this.multisample = {
					count: this.sampleCount
				};
			}
		}
	}
	setDepthStencilParam(state: GPUDepthStencilState): void {
		if (this.depthStencilEnabled) {
			this.depthStencil = state;
		}
	}
	setDepthStencil(state: GPUDepthStencilState): void {
		if (state) {
			if (!this.depthStencil) {
				this.depthStencil = state;
			}
			const src = state as any;
			const dst = this.depthStencil as any;
			for (var k in src) {
				dst[k] = src[k];
			}
		}
	}
	setDepthWriteEnabled(enabled: boolean): void {
		this.depthStencilEnabled = enabled;
		if (this.depthStencil) {
			this.depthStencil.depthWriteEnabled = enabled;
		}
		if (enabled) {
			if (!this.depthStencil) {
				this.depthStencil = {
					depthWriteEnabled: true,
					depthCompare: "less",
					format: "depth24plus"
				};
			}
		}
	}
	setDepthStencilFormat(format: string): void {
		if (this.depthStencil) {
			this.depthStencil.format = format;
		}
	}
	/**
	 *
	 * @param primitiveState cullMode, Possible values are: "back", "front", "none", the default value is "none".
	 * 						 frontFace, Possible values are: "cw", "ccw", the default value is "ccw".
	 * 						 topology, Possible values are: "triangle-strip", "triangle-list", "point-list", "line-list", "line-strip",
	 * 						 the default value is "triangle-list"
	 */
	setPrimitiveState(state: GPUPrimitiveState): void {
		if (state) {
			if (!this.primitive) {
				this.primitive = state;
			}
			switch (state.cullMode) {
				case "back":
				case "front":
				case "none":
					this.primitive.cullMode = state.cullMode;
					break;
			}
			switch (state.frontFace) {
				case "cw":
				case "ccw":
					this.primitive.frontFace = state.frontFace;
					break;
			}
			switch (state.topology) {
				case "triangle-strip":
				case "triangle-list":
				case "point-list":
				case "line-list":
				case "line-strip":
					this.primitive.topology = state.topology;
					break;
			}
		}
	}
	setTransparentBlendParam(targetIndex = 0): void {
		let color = {
			srcFactor: "src-alpha",
			dstFactor: "one-minus-src-alpha"
		};
		let alpha = {
			srcFactor: "zero",
			dstFactor: "one"
		};
		this.setBlendParam(color, alpha, targetIndex);
	}
	setBlendModes(modes: string[]): void {
		for (let i = 0; i < modes.length; ++i) {
			this.setBlendMode(modes[i], i);
		}
	}
	setBlendMode(mode: string, targetIndex = 0): void {

		let color = {
			srcFactor: "one",
			dstFactor: "zero"
		} as GPUBlendComponent;
		let alpha = {
			srcFactor: "one",
			dstFactor: "zero"
		} as GPUBlendComponent;

		switch (mode) {
			case "transparent":
				color = {
					srcFactor: "src-alpha",
					dstFactor: "one-minus-src-alpha"
				};
				alpha = {
					srcFactor: "zero",
					dstFactor: "one"
				};
				break;
			case "add":
				color = {
					srcFactor: "src-alpha",
					dstFactor: "one"
				};
				alpha = {
					srcFactor: "zero",
					dstFactor: "one"
				};
				break;
			case "alpha_add":
				color = {
					srcFactor: "one",
					dstFactor: "one-minus-src-alpha"
				};
				alpha = {
					srcFactor: "one",
					dstFactor: "one-minus-src-alpha"
				};
				break;

			// the default mode value is "solid":
			default:
				break;
		}
		this.setBlendParam(color, alpha, targetIndex);
	}
	setBlendParam(color: GPUBlendComponent, alpha: GPUBlendComponent, targetIndex = 0): void {
		if (this.fragmentEnabled) {
			const frag = this.fragment;
			const target = frag.targets[targetIndex];
			if (target.blend) {
				if (color) {
					target.blend.color = color;
				}
				if (alpha) {
					target.blend.alpha = alpha;
				}
			} else {
				target.blend = {
					color,
					alpha
				};
			}
		}
	}
	addFragmentColorTarget(colorState: GPUColorTargetState): void {
		if (this.fragmentEnabled && colorState) {
			const frag = this.fragment;
			frag.targets.push(colorState);
		}
	}
	setFragmentColorTarget(colorState: GPUColorTargetState, targetIndex = 0): void {
		if (this.fragmentEnabled && colorState) {
			const frag = this.fragment;
			frag.targets[targetIndex] = colorState;
		}
	}
	build(device: GPUDevice): void {
		let shdModule = this.shaderSrc
			? device.createShaderModule({
					label: "shd",
					code: this.shaderSrc.code
			  })
			: null;
		let vertShdModule = this.vertShaderSrc
			? device.createShaderModule({
					label: "vertShd",
					code: this.vertShaderSrc.code
			  })
			: shdModule;
		let fragShdModule = this.fragShaderSrc
			? device.createShaderModule({
					label: "fragShd",
					code: this.fragShaderSrc.code
			  })
			: shdModule;

		const vert = this.vertex;
		vert.module = vertShdModule;
		if (this.vertShaderSrc.vertEntryPoint) {
			vert.entryPoint = this.vertShaderSrc.vertEntryPoint;
		}

		const frag = this.fragment;
		if (frag) {
			frag.module = fragShdModule;
			if (this.fragShaderSrc.fragEntryPoint) {
				frag.entryPoint = this.fragShaderSrc.fragEntryPoint;
			}
		}
	}

	setVertexBufferArrayStrideAt(arrayStride: number, bufferIndex: number = 0): void {
		const vert = this.vertex;
		if (vert.buffers.length < 1) {
			this.addVertexBufferLayout({ arrayStride: 0, attributes: [], stepMode: "vertex" });
		}
		vert.buffers[bufferIndex].arrayStride = arrayStride;
	}
	/**
	 * @param attribute for example: { shaderLocation: 0, offset: 0, format: "float32x4" }
	 * @param bufferIndex an index of vertex.buffers
	 */
	addVertexBufferAttribute(attribute: GPUVertexAttribute, bufferIndex: number = 0): void {
		const vert = this.vertex;
		// console.log("vert.buffers: ", vert.buffers);
		if (vert.buffers.length < 1) {
			this.addVertexBufferLayout({ arrayStride: 0, attributes: [], stepMode: "vertex" });
		}
		let attributes = vert.buffers[bufferIndex].attributes;
		attributes.push(attribute);
	}
	/**
	 * @param vtxBufLayout for example: {arrayStride: 0, attributes: [], stepMode: "vertex"}
	 */
	addVertexBufferLayout(vtxBufLayout: GPUVertexBufferLayout): void {
		const vert = this.vertex;
		vert.buffers.push(vtxBufLayout);
	}
}
export { WGRPipelineContextDefParam, WGRShderSrcType, WGRPipelineParamType, WGRPipelineCtxParams };

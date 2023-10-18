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

interface IWGRShadeSrcParam {
	uuid?: string;
	vertEntryPoint?: string;
	fragEntryPoint?: string;
	compEntryPoint?: string;
	code: string;
}
interface IRPipelineParam {
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
	constructor(param?: IRPipelineParam) {
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
				}
			}
		}
	}
	setDepthStencilFormat(format: string): void {
		if (this.depthStencil) {
			this.depthStencil.format = format;
		}
	}
	/**
	 * Possible values are: "back", "front", "none", the default value is "none"
	 */
	setCullMode(mode: string): void {
		this.primitive.cullMode = mode;
	}
	setTransparentBlendParam(targetIndex = 0): void {
		let color = {
			srcFactor: 'src-alpha',
			dstFactor: 'one-minus-src-alpha',
		};
		let alpha = {
			srcFactor: 'zero',
			dstFactor: 'one'
		};
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
export { WGRPipelineCtxParams };

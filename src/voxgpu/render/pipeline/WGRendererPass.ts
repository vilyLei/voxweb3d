import Color4 from "../../../vox/material/Color4";
import { GPUCommandBuffer } from "../../gpu/GPUCommandBuffer";
import { GPUCommandEncoder } from "../../gpu/GPUCommandEncoder";
import { GPURenderPassColorAttachment } from "../../gpu/GPURenderPassColorAttachment";
import { GPURenderPassDescriptor } from "../../gpu/GPURenderPassDescriptor";
import { GPURenderPassEncoder } from "../../gpu/GPURenderPassEncoder";
import { GPUTexture } from "../../gpu/GPUTexture";
import { GPUTextureDescriptor } from "../../gpu/GPUTextureDescriptor";
import { GPUTextureView } from "../../gpu/GPUTextureView";
import { WebGPUContext } from "../../gpu/WebGPUContext";

interface WGRPassParams {
    multisampleEnabled: boolean;
    sampleCount: number;
    /**
     * 'depth24plus','depth32float'
     */
	depthFormat?: string;
}
class WGRendererPass {

    private mWGCtx: WebGPUContext;
    private mParams: WGRPassParams;
    private mDepthTexture: GPUTexture;

    colorView: GPUTextureView;
    passEncoder: GPURenderPassEncoder;
    commandEncoder: GPUCommandEncoder;
    clearColor = new Color4(0.0,0.0,0.0,1.0);
    constructor(wgCtx?: WebGPUContext) {
        if (wgCtx) {
            this.initialize(wgCtx);
        }
    }
	get depthTexture(): GPUTexture {
		return this.mDepthTexture;
	}
    initialize(wgCtx: WebGPUContext): void {
        this.mWGCtx = wgCtx;
    }
	getPassParams(): WGRPassParams {
		return this.mParams;
	}
    build(params: WGRPassParams): void {
        this.mParams = params;
        this.createRenderPassTexture(params);
    }
    private createRenderPassTexture(params: WGRPassParams): void {

        const ctx = this.mWGCtx;
        const device = ctx.device;
        const canvas = ctx.canvas;

        if (params && params.multisampleEnabled) {
            const texture = device.createTexture({
                size: [ctx.canvas.width, ctx.canvas.height],
                sampleCount: params.sampleCount,
                format: ctx.presentationFormat,
                usage: GPUTextureUsage.RENDER_ATTACHMENT
            });
            this.colorView = texture.createView();
        }

        const depthTexDesc = {
            size: [canvas.width, canvas.height],
            format: "depth24plus",
            usage: GPUTextureUsage.RENDER_ATTACHMENT
        } as GPUTextureDescriptor;
        if (params) {
            if(params.multisampleEnabled) depthTexDesc.sampleCount = params.sampleCount;
            if(params.depthFormat) depthTexDesc.format = params.depthFormat;
        }

        const depthTexture = device.createTexture(depthTexDesc);
        this.mDepthTexture = depthTexture;
		console.log(this);
		console.log("depthTexDesc: ", depthTexDesc, ", depthTexture: ", depthTexture);
    }
    runBegin(): void {
        const ctx = this.mWGCtx;
        if (ctx.enabled) {
            const device = ctx.device;

            this.commandEncoder = device.createCommandEncoder();
            const commandEncoder = this.commandEncoder;

            let rpassColorAttachment = {
                clearValue: this.clearColor,
                loadOp: "clear",
                storeOp: "store"
            } as GPURenderPassColorAttachment;

            if (this.mParams.multisampleEnabled) {
                rpassColorAttachment.view = this.colorView;
                rpassColorAttachment.resolveTarget = ctx.createCurrentView();
            } else {
                rpassColorAttachment.view = ctx.createCurrentView();
            }
            let colorAttachments: GPURenderPassColorAttachment[] = [rpassColorAttachment];
            const renderPassDescriptor: GPURenderPassDescriptor = {
                colorAttachments: colorAttachments,
                depthStencilAttachment: {
                    view: this.mDepthTexture.createView(),
                    depthClearValue: 1.0,
                    depthLoadOp: "clear",
                    depthStoreOp: "store"
                }
            };

            this.passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
        }
    }
    runEnd(): GPUCommandBuffer {

        const ctx = this.mWGCtx;
        if (ctx.enabled) {
            this.passEncoder.end();
            return this.commandEncoder.finish();
        }
        return null;
    }
}
export { WGRPassParams, WGRendererPass }


import { GPUDepthStencilState } from "../../gpu/GPUDepthStencilState";
import { GPUDevice } from "../../gpu/GPUDevice";
import { GPUFragmentState } from "../../gpu/GPUFragmentState";
import { GPUMultisampleObject } from "../../gpu/GPUMultisampleObject";
import { GPUPrimitiveState } from "../../gpu/GPUPrimitiveState";
import { GPURenderPipelineDescriptor } from "../../gpu/GPURenderPipelineDescriptor";
import { GPUVertexAttribute } from "../../gpu/GPUVertexAttribute";
import { GPUVertexBufferLayout } from "../../gpu/GPUVertexBufferLayout";
import { GPUVertexState } from "../../gpu/GPUVertexState";
interface IRShadeSrcParam {
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
    shaderSrc?: IRShadeSrcParam;
    vertShaderSrc?: IRShadeSrcParam;
    fragShaderSrc?: IRShadeSrcParam;
    compShaderSrc?: IRShadeSrcParam;
}
class RPipelineParams implements GPURenderPipelineDescriptor {
    sampleCount = 1;
    multisampleEnabled = false;
    depthStencilEnabled = false;
    fragmentEnabled = true;
    shaderSrc?: IRShadeSrcParam;
    vertShaderSrc?: IRShadeSrcParam;
    fragShaderSrc?: IRShadeSrcParam;
    compShaderSrc?: IRShadeSrcParam;
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
            if (this.depthStencilEnabled) {
                this.depthStencil = {
                    depthWriteEnabled: true,
                    depthCompare: "less",
                    format: "depth24plus"
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
                this.primitive = {
                    topology: "triangle-list",
                    cullMode: "back"
                };
            }
            if(this.multisampleEnabled) {
                this.multisample = {
                    count: this.sampleCount
                };
            }
        }
    }
    build(device: GPUDevice): void {

        let shdModule = this.shaderSrc ? device.createShaderModule({
            label: "shd",
            code: this.shaderSrc.code
        }) : null;
        let vertShdModule = this.vertShaderSrc ? device.createShaderModule({
            label: "vertShd",
            code: this.vertShaderSrc.code
        }) : shdModule;
        let fragShdModule = this.fragShaderSrc ? device.createShaderModule({
            label: "fragShd",
            code: this.fragShaderSrc.code
        }) : shdModule;

        const vert = this.vertex;
        vert.module = vertShdModule;
        if(this.vertShaderSrc.vertEntryPoint) {
            vert.entryPoint = this.vertShaderSrc.vertEntryPoint;
        }

        const frag = this.fragment;
        if(frag) {
            frag.module = fragShdModule;
            if(this.fragShaderSrc.fragEntryPoint) {
                frag.entryPoint = this.fragShaderSrc.fragEntryPoint;
            }
        }
    }
    
    setVertexBufferArrayStrideAt(arrayStride: number, bufferIndex: number = 0): void {
        const vert = this.vertex;
        if(vert.buffers.length < 1) {
            this.addVertexBufferLayout({arrayStride: 0, attributes: []});
        }
        vert.buffers[bufferIndex].arrayStride = arrayStride;
    }
    /**
     * @param attribute for example: { shaderLocation: 0, offset: 0, format: "float32x4" }
     * @param bufferIndex an index of vertex.buffers
     */
    addVertexBufferAttribute(attribute: GPUVertexAttribute, bufferIndex: number = 0): void {
        const vert = this.vertex;
        if(vert.buffers.length < 1) {
            this.addVertexBufferLayout({arrayStride: 0, attributes: []});
        }
        let attributes = vert.buffers[bufferIndex].attributes;
        attributes.push(attribute);
    }
    /**
     * @param vtxBufLayout for example: {arrayStride: 0, attributes: []}
     */
     addVertexBufferLayout(vtxBufLayout: GPUVertexBufferLayout): void {
        const vert = this.vertex;
        vert.buffers.push(vtxBufLayout);
    }
}
export { RPipelineParams }
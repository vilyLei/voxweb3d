import { GPUTextureDescriptor } from "./GPUTextureDescriptor";
import { GPUBufferDescriptor } from "./GPUBufferDescriptor";
import { GPUShaderModuleDescriptor } from "./GPUShaderModuleDescriptor";
import { GPUBindGroupDescriptor } from "./GPUBindGroupDescriptor";
import { GPUBindGroupLayoutDescriptor } from "./GPUBindGroupLayoutDescriptor";
import { GPUPipelineLayoutDescriptor } from "./GPUPipelineLayoutDescriptor";
import { GPURenderPipelineDescriptor } from "./GPURenderPipelineDescriptor";
import { GPUComputePipelineDescriptor } from "./GPUComputePipelineDescriptor";

import { GPUQueue } from "./GPUQueue";
import { GPUTexture } from "./GPUTexture";
import { GPUBuffer } from "./GPUBuffer";
import { GPUShaderModule } from "./GPUShaderModule";
import { GPUBindGroup } from "./GPUBindGroup";
import { GPUBindGroupLayout } from "./GPUBindGroupLayout";
import { GPURenderPipeline } from "./GPURenderPipeline";
import { GPUComputePipeline } from "./GPUComputePipeline";
import { GPUCommandEncoder } from "./GPUCommandEncoder";
import { GPUQuerySetDescriptor } from "./GPUQuerySetDescriptor";
import { GPUPipelineLayout } from "./GPUPipelineLayout";
import { GPUQuerySet } from "./GPUQuerySet";
import { GPURenderBundleEncoder } from "./GPURenderBundleEncoder";

interface GPUDevice {

	features?: any;
	limits?: any;
	lost?: any;

	queue: GPUQueue;

	createTexture(descriptor: GPUTextureDescriptor): GPUTexture;
	createBuffer(descriptor: GPUBufferDescriptor): GPUBuffer;
	createShaderModule(descriptor: GPUShaderModuleDescriptor): GPUShaderModule;
	createBindGroup(descriptor: GPUBindGroupDescriptor): GPUBindGroup;
	createBindGroupLayout(descriptor: GPUBindGroupLayoutDescriptor): GPUBindGroupLayout;
	createPipelineLayout(descriptor: GPUPipelineLayoutDescriptor): GPUPipelineLayout;
	createRenderPipeline(descriptor: GPURenderPipelineDescriptor): GPURenderPipeline;
	createComputePipeline(descriptor: GPUComputePipelineDescriptor): GPUComputePipeline;

	createRenderBundleEncoder(): GPURenderBundleEncoder;
	createQuerySet(descriptor: GPUQuerySetDescriptor): GPUQuerySet;
	createCommandEncoder(): GPUCommandEncoder;
}
export { GPUDevice };

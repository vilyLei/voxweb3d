// Defined by webpack.
declare namespace NodeJS {
	interface Process {
		readonly browser: boolean;
	}

	interface ProcessEnv {
		readonly NODE_ENV: "development" | "production" | "test";
	}
}
/**
 * The bitwise flags representing the allowed usages for the GPUBuffer.
 */
declare namespace GPUBufferUsage {

	/**
	 * The buffer can be mapped for reading. (Example: calling mapAsync() with GPUMapMode.READ).
	 * May only be combined with COPY_DST.
	 */
	const MAP_READ: number;				//      = 0x0001;
	/**
	 * The buffer can be mapped for writing. (Example: calling mapAsync() with GPUMapMode.WRITE).
	 * May only be combined with COPY_SRC.
	 */
    const MAP_WRITE: number;			//     = 0x0002;
	/**
	 * The buffer can be used as the source of a copy operation.
	 * (Examples: as the source argument of a copyBufferToBuffer() or copyBufferToTexture() call.)
	 */
    const COPY_SRC: number;				//      = 0x0004;
	/**
	 * The buffer can be used as the destination of a copy or write operation.
	 * (Examples: as the destination argument of a copyBufferToBuffer() or copyTextureToBuffer() call, or as the target of a writeBuffer() call.)
	 */
    const COPY_DST: number;				//      = 0x0008;
	/**
	 * The buffer can be used as an index buffer. (Example: passed to setIndexBuffer().)
	 */
    const INDEX: number;				//         = 0x0010;
	/**
	 * The buffer can be used as a vertex buffer. (Example: passed to setVertexBuffer().)
	 */
    const VERTEX: number;				//        = 0x0020;
	/**
	 * The buffer can be used as a uniform buffer.
	 * (Example: as a bind group entry for a GPUBufferBindingLayout with a buffer.type of "uniform".)
	 */
    const UNIFORM: number;				//       = 0x0040;
	/**
	 * The buffer can be used as a storage buffer.
	 * (Example: as a bind group entry for a GPUBufferBindingLayout with a buffer.type of "storage" or "read-only-storage".)
	 */
    const STORAGE: number;				//       = 0x0080;
	/**
	 * The buffer can be used as to store indirect command arguments.
	 * (Examples: as the indirectBuffer argument of a drawIndirect() or dispatchWorkgroupsIndirect() call.)
	 */
    const INDIRECT: number;				//      = 0x0100;
	/**
	 * The buffer can be used to capture query results.
	 * (Example: as the destination argument of a resolveQuerySet() call.)
	 */
    const QUERY_RESOLVE: number;		// = 0x0200;
}
declare namespace GPUTextureUsage {
	/**
	 * The texture can be used as the source of a copy operation.
	 * (Examples: as the source argument of a copyTextureToTexture() or copyTextureToBuffer() call.)
	 */
	const COPY_SRC: number;
	/**
	 * The texture can be used as the destination of a copy or write operation.
	 * (Examples: as the destination argument of a copyTextureToTexture() or copyBufferToTexture() call, or as the target of a writeTexture() call.)
	 */
	const COPY_DST: number;
	/**
	 * The texture can be bound for use as a sampled texture in a shader.
	 * (Example: as a bind group entry for a GPUTextureBindingLayout.)
	 */
	const TEXTURE_BINDING: number;
	/**
	 * The texture can be bound for use as a storage texture in a shader.
	 * (Example: as a bind group entry for a GPUStorageTextureBindingLayout.)
	 */
	const STORAGE_BINDING: number;
	/**
	 * The texture can be used as a color or depth/stencil attachment in a render pass.
	 * (Example: as a GPURenderPassColorAttachment.view or GPURenderPassDepthStencilAttachment.view.)
	 */
	const RENDER_ATTACHMENT: number;
}
/**
 * See: https://gpuweb.github.io/gpuweb/#typedefdef-gpushaderstageflags
 */
declare namespace GPUShaderStage {
	/**
	 * The bind group entry will be accessible to vertex shaders.
	 */
	const VERTEX: number;		//   = 0x1;
	/**
	 * The bind group entry will be accessible to fragment shaders.
	 */
    const FRAGMENT: number;		// = 0x2;
	/**
	 * The bind group entry will be accessible to compute shaders.
	 */
    const COMPUTE: number;		//  = 0x4;
}
declare type IndexArrayViewType = Uint32Array | Uint16Array;
declare type NumberArrayViewType = Float32Array | Int32Array | Int16Array | Uint8Array | Int8Array | IndexArrayViewType;
declare type NumberArrayType = number[] | Float32Array | Uint32Array | Uint16Array | Int32Array | Int16Array | Uint8Array | Int8Array;
declare type NumberArrayDataType = DataView | Float32Array | Uint32Array | Uint16Array | Int32Array | Int16Array | Uint8Array | Int8Array;
declare module "*.wgsl" {
	const shader: string;
	export default shader;
}
declare module "*.glsl" {
	const shader: string;
	export default shader;
}

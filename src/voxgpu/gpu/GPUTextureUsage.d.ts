export class GPUTextureUsage {
	/**
	 * The texture can be used as the source of a copy operation.
	 * (Examples: as the source argument of a copyTextureToTexture() or copyTextureToBuffer() call.)
	 */
	readonly COPY_SRC: number;
	/**
	 * The texture can be used as the destination of a copy or write operation.
	 * (Examples: as the destination argument of a copyTextureToTexture() or copyBufferToTexture() call, or as the target of a writeTexture() call.)
	 */
	readonly COPY_DST: number;
	/**
	 * The texture can be bound for use as a sampled texture in a shader.
	 * (Example: as a bind group entry for a GPUTextureBindingLayout.)
	 */
	readonly TEXTURE_BINDING: number;
	/**
	 * The texture can be bound for use as a storage texture in a shader.
	 * (Example: as a bind group entry for a GPUStorageTextureBindingLayout.)
	 */
	readonly STORAGE_BINDING: number;
	/**
	 * The texture can be used as a color or depth/stencil attachment in a render pass.
	 * (Example: as a GPURenderPassColorAttachment.view or GPURenderPassDepthStencilAttachment.view.)
	 */
	readonly RENDER_ATTACHMENT: number;
}

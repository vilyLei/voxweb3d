interface CoRendererState {
	
	readonly COLOR_MASK_ALL_TRUE: number;
	readonly COLOR_MASK_ALL_FALSE: number;
	readonly COLOR_MASK_RED_TRUE: number;
	readonly COLOR_MASK_GREEN_TRUE: number;
	readonly COLOR_MASK_BLUE_TRUE: number;
	readonly COLOR_MASK_ALPHA_TRUE: number;
	readonly COLOR_MASK_RED_FALSE: number;
	readonly COLOR_MASK_GREEN_FALSE: number;
	readonly COLOR_MASK_BLUE_FALSE: number;
	readonly COLOR_MASK_ALPHA_FALSE: number;

	readonly NORMAL_STATE: number;
	readonly BACK_CULLFACE_NORMAL_STATE: number;
	readonly FRONT_CULLFACE_NORMAL_STATE: number;
	readonly NONE_CULLFACE_NORMAL_STATE: number;
	readonly ALL_CULLFACE_NORMAL_STATE: number;
	readonly BACK_NORMAL_ALWAYS_STATE: number;
	readonly BACK_TRANSPARENT_STATE: number;
	readonly BACK_TRANSPARENT_ALWAYS_STATE: number;
	readonly NONE_TRANSPARENT_STATE: number;
	readonly NONE_TRANSPARENT_ALWAYS_STATE: number;
	readonly FRONT_CULLFACE_GREATER_STATE: number;
	readonly BACK_ADD_BLENDSORT_STATE: number;
	readonly BACK_ADD_ALWAYS_STATE: number;
	readonly BACK_ALPHA_ADD_ALWAYS_STATE: number;
	readonly NONE_ADD_ALWAYS_STATE: number;
	readonly NONE_ADD_BLENDSORT_STATE: number;
	readonly NONE_ALPHA_ADD_ALWAYS_STATE: number;
	readonly FRONT_ADD_ALWAYS_STATE: number;
	readonly FRONT_TRANSPARENT_STATE: number;
	readonly FRONT_TRANSPARENT_ALWAYS_STATE: number;
	readonly NONE_CULLFACE_NORMAL_ALWAYS_STATE: number;
	readonly BACK_ALPHA_ADD_BLENDSORT_STATE: number;
}
export { CoRendererState };

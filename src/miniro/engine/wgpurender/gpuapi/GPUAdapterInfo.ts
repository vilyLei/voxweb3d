interface GPUAdapterInfo {
	/**
	 * Experimental Read only
	 * The name of the family or class of GPUs the adapter belongs to. Returns an empty string if it is not available.
	 */
	architecture?: string;
	/**
	 * Experimental Read only
	 * A human-readable string describing the adapter. Returns an empty string if it is not available.
	 */
	description?: string;
	/**
	 * Experimental Read only
	 * A vendor-specific identifier for the adapter. Returns an empty string if it is not available.
	 */
	device?: string;
	/**
	 * Experimental Read only
	 * The name of the adapter vendor. Returns an empty string if it is not available.
	 */
	vendor?: string;
}
export { GPUAdapterInfo };

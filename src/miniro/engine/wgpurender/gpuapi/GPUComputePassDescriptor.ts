import { GPUQuerySet } from "./GPUQuerySet";

/**
 * see: https://gpuweb.github.io/gpuweb/#dictdef-gpucomputepasstimestampwrites
 * 		https://developer.mozilla.org/en-US/docs/Web/API/GPUCommandEncoder/beginComputePass#timestampwrites
 */
interface GPUComputePassTimestampWrites {
	/**
	 * Available values are: "beginning", "end"
	 */
	location: string;
	/**
	 * A number specifying the index position in the querySet that the timestamp will be written to.
	 */
	queryIndex: number;
	/**
	 * The GPUQuerySet, of type "timestamp", that the query results will be written to.
	 */
	querySet: GPUQuerySet;
}
interface GPUComputePassDescriptor {
	label?: string;

	timestampWrites: GPUComputePassTimestampWrites[];
}
export { GPUComputePassDescriptor };

import { GPUQuerySet } from "./GPUQuerySet";

interface GPUTimestampWriter {
	/**
	 * "begin" or "end"
	 */
	location: string;
	queryIndex: number;
	querySet: GPUQuerySet;
}
interface GPUComputePassDescriptor {
	label?: string;

	timestampWrites: GPUTimestampWriter[];
}
export { GPUComputePassDescriptor };

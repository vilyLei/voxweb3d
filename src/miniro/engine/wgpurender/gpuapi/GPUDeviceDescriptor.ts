import { GPUQueue } from "./GPUQueue";
/**
 * see: https://developer.mozilla.org/en-US/docs/Web/API/GPUAdapter/requestDevice
 * 		https://gpuweb.github.io/gpuweb/#gpudevicedescriptor
 */
interface GPUDeviceDescriptor {
	label?: string;

	defaultQueue?: GPUQueue;
	/**
	 * An array of strings representing additional functionality that you want supported by the returned GPUDevice.
	 * The requestDevice() call will fail if the GPUAdapter cannot provide these features.
	 * See GPUSupportedFeatures for a full list of possible features.
	 * This defaults to an empty array if no value is provided.
	 * In GPUFeatureName: https://gpuweb.github.io/gpuweb/#gpufeaturename
	 */
	requiredFeatures?: string[];
	/**
	 * An object containing properties representing the limits that you want supported by the returned GPUDevice.
	 * The requestDevice() call will fail if the GPUAdapter cannot provide these limits.
	 * Each key must be the name of a member of GPUSupportedLimits.
	 * This defaults to an empty object if no value is provided.
	 */
	requiredLimits?: string[];

}
export { GPUDeviceDescriptor };

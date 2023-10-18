import { GPUBuffer } from "../../gpu/GPUBuffer";
import { GPUSampler } from "../../gpu/GPUSampler";
import { GPUTextureView } from "../../gpu/GPUTextureView";
import { WGRUniform } from "./WGRUniform";
import { BufDataParamType} from "../pipeline/IWGRPipelineContext";
import { WGRUniformValue } from "./WGRUniformValue";

type WGRUniformTexParam = { texView: GPUTextureView, sampler?: GPUSampler };
type WGRUniformParam = { layoutName: string, groupIndex: number, values: WGRUniformValue[], texParams?: WGRUniformTexParam[] };
class WGRUniformWrapper {
	uniform: WGRUniform | null = null;
	bufDataParams?: BufDataParamType[];
	bufDataDescs?: { index: number; buffer: GPUBuffer; bufferSize: number }[];
	texParams?: { texView: GPUTextureView; sampler?: GPUSampler }[];
	usage = 0;
	groupIndex = 0;
}

interface IWGRUniformContext {

	createUniformsWithValues(params: WGRUniformParam[]): WGRUniform[]
	createUniformWithValues(layoutName: string, groupIndex: number, values: WGRUniformValue[], texParams?: WGRUniformTexParam[]): WGRUniform | null;
	createUniform(
		layoutName: string,
		groupIndex: number,
		bufDataParams?: { size: number, usage: number }[],
		texParams?: { texView: GPUTextureView, sampler?: GPUSampler }[]
	): WGRUniform | null;

	removeUniform(u: WGRUniform): void;
}
export { WGRUniformTexParam, WGRUniformWrapper, WGRUniformParam, BufDataParamType, IWGRUniformContext };

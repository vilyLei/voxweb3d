import AABB from "../../vox/geom/AABB";
import { GPUBuffer } from "../gpu/GPUBuffer";
import { VtxPipelinDescParam } from "../render/pipeline/IWGRPipelineContext";
interface WGGeomAttributeParam {
	shdVarName: string;
	data: NumberArrayViewType;
	strides?: number[];
	offset?: number;
}
class WGGeomAttribute {
	shdVarName = "";
	bindIndex = 0;
	strides = [3];
	offset = 0;
	data: NumberArrayViewType;
}
class WGGeomIndexBuffer {
	name? = "";
	data: IndexArrayViewType;
	constructor(param: { name?: string; data: IndexArrayViewType }) {
		this.name = param.name;
		this.data = param.data;
	}
}

class WGGeometry {
	name = "WGGeometry";

	readonly descParam: VtxPipelinDescParam = { vertex: { buffers: [] as GPUBuffer[], attributeIndicesArray: [] as number[][] } };
	attributes: WGGeomAttribute[];
	indexBuffer: WGGeomIndexBuffer;
	bounds: AABB;
	setIndexBuffer(param: { name?: string; data: IndexArrayViewType }): void {
		this.indexBuffer = new WGGeomIndexBuffer(param);
	}
	addAttribute(param: WGGeomAttributeParam): void {
		if (param) {
			const p = new WGGeomAttribute();
			const ab = p as any;
			for (var k in param) {
				ab[k] = (param as any)[k];
			}
			if (this.attributes) {
				this.attributes.push(p);
			} else {
				this.attributes = [p];
			}
		}
	}
	destroy(): void {}
}
export { WGGeomAttributeParam, WGGeomIndexBuffer, WGGeomAttribute, WGGeometry };

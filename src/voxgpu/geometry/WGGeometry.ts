import { GPUBuffer } from "../gpu/GPUBuffer";
import { VtxPipelinDescParam } from "../render/pipeline/IWGRPipelineContext";
interface WGGeomAttributeParam {

	shdVarName: string;
	data: NumberArrayViewType;
}
class WGGeomAttribute {

	shdVarName = "";
	bindIndex = 0;
	data: NumberArrayViewType;

}
class WGGeomIndexBuffer {

	name? = "";
	bindIndex = 0;
	data: IndexArrayViewType;

}

class WGGeometry {
	name = "WGGeometry";

	readonly descParam: VtxPipelinDescParam = { vertex: { buffers: [] as GPUBuffer[], attributeIndicesArray: [] as number[][] } };
	attributes: WGGeomAttribute[];
	indexBuffer: WGGeomIndexBuffer;

	addAttribute(param: WGGeomAttributeParam): void {
		if(param) {
			const p = new WGGeomAttribute();
			p.shdVarName = param.shdVarName;
			p.data = param.data;
			if(this.attributes) {
				this.attributes.push(p);
			}else {
				this.attributes = [p];
			}
		}
	}
}
export { WGGeomAttributeParam, WGGeomAttribute, WGGeometry }

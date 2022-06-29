import { GeometryModelDataType } from "../../modules/base/GeometryModelDataType";
import { DataFormat } from "../../schedule/base/DataUnit";
import { GeometryDataUnit } from "../../schedule/base/GeometryDataUnit";
import { SceneNode } from "./SceneNode";

class CTMSceneNode extends SceneNode {

	private m_index: number = 0;
	constructor() { super(); }

	load(urls: string[]): void {
		if (urls != null) {

			super.load(urls);
			
			this.m_index = 0;
			this.m_modelsTotal = urls.length;
			this.m_waitPartsTotal = this.m_modelsTotal;
			this.m_showTotal = 0;
			for (let i: number = 0; i < this.m_modelsTotal; ++i) {
				this.loadCTMByUrl(urls[i]);
			}
		}
	}

	private loadCTMByUrl(url: string): void {

		this.m_cospace.geometry.getCPUDataByUrlAndCallback(
			url,
			DataFormat.CTM,
			(unit: GeometryDataUnit, status: number): void => {
				let model: GeometryModelDataType = unit.data.models[0];
				if (model.normals == null) {
					console.error("model.normals == null, url: ", url);
				}

				this.initEntity(model, null, this.m_index);
				this.m_index++;

				if (this.m_index == this.m_modelsTotal) {
					this.m_waitPartsTotal = 0;
				}
			},
			true
		);
	}
}

export { CTMSceneNode };
import { GeometryModelDataType } from "../../modules/base/GeometryModelDataType";
import { FBXBufferLoader } from "../../modules/fbx/FBXBufferLoader";
import { FBXBufferObject } from "../../modules/fbx/FBXBufferObject";
import { SceneNode } from "./SceneNode";

class FBXSceneNode extends SceneNode {


	constructor() { super(); }

	load(urls: string[]): void {

		super.load( urls);
		this.loadFBXBySteps(urls[0]);
	}
	private loadFBXBySteps(url: string): void {

		this.m_partsTotal = 0;
		this.m_showTotal = 0;
		let fbxBufLoader = new FBXBufferLoader();
		fbxBufLoader.loadBySteps(
			url,
			(model: GeometryModelDataType, bufObj: FBXBufferObject, index: number, total: number, url: string): void => {

				// console.log("loadFBXBySteps(), model: ", index + "/" + total);
				// console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
				// console.log(new Float32Array([100, 0, 0, 0, 0, -0.000016292067955264296, -99.99999999999866, 0, 0, 99.99999999999866, -0.000016292067955264296, 0, 351.5144958496094, 0, 0, 1]));
				// // console.log(new Float32Array([100, 0, 0, 0, 0, -0.000016292067955264296, -99.99999999999866, 0, 0, 99.99999999999866, -0.000016292067955264296, 0, 0, 0, 0, 1]));
				// bufObj.transform.setData([100, 0, 0, 0, 0, -0.000016292067812173627, -100, 0, 0, 100, -0.000016292067812173627, 0, 351.5144958496094, 0, 0, 1]);
				// console.log(bufObj.transform.getLocalFS32());
				// bufObj.transform.setTranslationXYZ(351, 0, 0);
				this.m_modelsTotal = total;
				this.m_waitPartsTotal = total;
				this.initEntity(model, bufObj.transform);
				if ((index + 1) == total) {
					this.m_waitPartsTotal = 0;
				}
			}
		);
	}
	private loadFBX(): void {

		let url: string = "static/assets/fbx/test01.fbx";
		// url = "static/assets/fbx/box.fbx";
		// url = "static/private/fbx/test_500W.fbx";
		// url = "static/private/fbx/Samba_Dancing.fbx";

		let fbxBufLoader = new FBXBufferLoader();
		fbxBufLoader.load(
			url,
			(modelMap: Map<number, GeometryModelDataType>, url: string): void => {
				// this.m_scaleV.setXYZ(-2.0, -2.0, 2.0);
				// this.m_scaleV.setXYZ(56.0, 56.0, 56.0);
				//this.m_scaleV.setXYZ(2.0, 2.0, 2.0);
				// console.log("loadFBX(), modelMap: ",modelMap);
				this.m_partsTotal = 0;
				for (let [key, value] of modelMap) {
					this.m_partsTotal++;
					this.initEntity(value);
				}
				console.log("partsTotal: ", this.m_partsTotal);
				// 
				this.m_waitPartsTotal = 0;
			}
		);
	}
}

export { FBXSceneNode };

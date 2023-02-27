import { GeometryModelDataType } from "../../modules/base/GeometryModelDataType";
import { FBXBufferLoader } from "../../modules/fbx/FBXBufferLoader";
import { FBXBufferObject } from "../../modules/fbx/FBXBufferObject";
import { SceneNode } from "./SceneNode";

class FBXSceneNode extends SceneNode {
	private m_fbxBufLoader: FBXBufferLoader;
	constructor() { super(); }

	load(urls: string[]): void {

		super.load( urls);
		this.loadFBXBySteps(urls[0]);
	}
	private loadFBXBySteps(url: string): void {

		this.m_partsTotal = 0;
		this.m_showTotal = 0;
		let fbxBufLoader = new FBXBufferLoader();
		this.m_fbxBufLoader = fbxBufLoader;
		fbxBufLoader.loadBySteps(
			url,
			(model: GeometryModelDataType, bufObj: FBXBufferObject, index: number, total: number, url: string): void => {

				this.m_modelsTotal = total;
				this.m_waitPartsTotal = total;
				
				model.status = bufObj.errorStatus;

				this.initEntity(model, bufObj.transform, index);
				if ((index + 1) == total) {
					this.m_waitPartsTotal = 0;
				}
			},
			(progress: number, url: string):void => {
				let k = Math.round(100 * progress);
				this.showInfo("fbx file loading " + k + "%");
			}
		);
	}
	private m_mi: number = 0;
	mouseDown(evt: any): void {
		// console.log("mouse down");
		// this.m_fbxBufLoader.parseModelAt( this.m_mi );
		// this.m_mi ++;
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
				// this.m_scaleV.setXYZ(2.0, 2.0, 2.0);
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

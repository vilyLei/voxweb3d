
import RendererScene from "../../../vox/scene/RendererScene";
import { CoSpace } from "../../CoSpace";
import { ISceneNode } from "./ISceneNode";
// import { SceneNode } from "./SceneNode";
import { FBXSceneNode } from "./FBXSceneNode";
import DivLog from "../../../vox/utils/DivLog";

class VerifierScene {

	private m_cospace: CoSpace = null;
	private m_rscene: RendererScene = null;

	private m_waitSceneNodes: ISceneNode[] = [];
	private m_sceneNodes: ISceneNode[] = [];
	constructor() { }

	initialize(rscene: RendererScene, cospace: CoSpace): void {

		if (this.m_rscene == null) {

			this.m_rscene = rscene;
			this.m_cospace = cospace;
			DivLog.ShowLogOnce("请拖入模型文件(.ctm, .obj, .fbx)或文件夹");
		}
	}
	initTest(): void{
		let url: string = "static/assets/fbx/test01.fbx";
		url = "static/assets/fbx/box.fbx";
		// url = "static/private/fbx/test_500W.fbx";
		// url = "static/private/fbx/Samba_Dancing.fbx";
		this.addFBX( [url] );
	}
	private addFBX(urls: string[]): void {
		this.addNewNode(new FBXSceneNode(), urls);
	}
	private addCTM(urls: string[]): void {

	}
	private addNewNode(node: ISceneNode, urls: string[]): void {
		DivLog.ShowLogOnce("正在解析原数据...");
		node.initialize( this.m_rscene, this.m_cospace);
		node.load(urls);
		this.m_waitSceneNodes.push(node);
		this.m_sceneNodes.push(node);
	}
	isFinish(): boolean {
		return this.m_waitSceneNodes.length == 0;
	}
	clear(): void {
		if(this.isFinish()) {
			let nodes = this.m_sceneNodes;
			for (let i = 0; i < nodes.length; ++i) {
				const node = nodes[i];
				node.clear();
			}
			this.m_sceneNodes = [];
		}
	}
	run(): void {

		let nodes = this.m_waitSceneNodes;
		for (let i = 0; i < nodes.length; ++i) {
			const node = nodes[i];
			node.run();
			if(node.isFinish()) {
				nodes.splice(i, 1);
				i--;
			}
		}
	}
}

export { VerifierScene };

import IRendererScene from "../../vox/scene/IRendererScene";
import IRendererSceneNode from "./IRendererSceneNode";
import RendererSceneNode from "./RendererSceneNode";
import IRendererSceneGraph from "./IRendererSceneGraph";
import RendererParam from "./RendererParam";
import IRendererParam from "./IRendererParam";
import IRenderer from "./IRenderer";

export default class RSCGraph implements IRendererSceneGraph {
	private m_map: Map<number, IRendererSceneNode> = new Map();
	private m_nodes: IRendererSceneNode[] = [];

	rayPickFlag = false;

	constructor() {}
	clear(): void {
		const ls = this.m_nodes;
		let tot = ls.length;
		let i = 0;

		for (; i < tot; ++i) {
			ls[i].clear();
		}
		this.m_nodes = [];
		this.m_map.clear();
	}
	addSceneNode(node: IRendererSceneNode, index: number = -1): void {
		if (node != null && node.getRScene() != null) {
			const ls = this.m_nodes;
			let tot = ls.length;
			let i = 0;
			for (; i < tot; ++i) {
				if (ls[i] == node) {
					break;
				}
			}
			if (i >= tot) {
				const sc = node.getRScene();
				if (!this.m_map.has(sc.getUid())) {
					ls.push(node);
					this.m_map.set(sc.getUid(), node);
				}
			}
		}
	}
	getNodesTotal(): number {
		return this.m_nodes.length;
	}
	getNodes(): IRendererSceneNode[] {
		return this.m_nodes;
	}
	getNodeAt(i: number): IRendererSceneNode {
		if (i >= 0 && i < this.m_nodes.length) return this.m_nodes[i];
		return null;
	}
	getSceneAt(i: number): IRendererScene {
		if (i >= 0 && i < this.m_nodes.length) return this.m_nodes[i].getRScene();
		return null;
	}
	createRendererParam(div: HTMLDivElement = null): IRendererParam {
		return new RendererParam(div);
	}
	createRendererSceneParam(div: HTMLDivElement = null): IRendererParam {
		return new RendererParam(div);
	}
	protected createRScene(): IRendererScene {
		return null;
	}
	/**
	 * @param rparam IRendererParam instance, the default value is null
	 * @param renderProcessesTotal the default value is 3
	 * @param createNewCamera the default value is true
	 */
	createScene(rparam: IRendererParam = null, renderProcessesTotal: number = 3, createNewCamera: boolean = true): IRendererScene {
		if(this.m_nodes.length < 1) {
			let sc = this.createRScene();
			sc.initialize(rparam, renderProcessesTotal, createNewCamera);
			let node = new RendererSceneNode(sc);
			this.m_nodes.push(node);
			this.m_map.set(sc.getUid(), node);
			return sc;
		}
		return this.m_nodes[0].getRScene();
	}
	/**
	 * @param rparam IRendererParam instance, the default value is null
	 * @param renderProcessesTotal the default value is 3
	 * @param createNewCamera the default value is true
	 */
	createSubScene(rparam?: IRendererParam, renderProcessesTotal?: number, createNewCamera?: boolean): IRendererScene {
		if (this.m_nodes.length > 0) {
			let sc = this.m_nodes[0].getRScene().createSubScene(rparam, renderProcessesTotal, createNewCamera);
			let node = new RendererSceneNode(sc);
			this.m_nodes.push(node);
			this.m_map.set(sc.getUid(), node);
			return sc;
		}
		return null;
	}

	addEventListener(type: number, target: any, func: (evt: any) => void, captureEnabled: boolean = true, bubbleEnabled: boolean = false): void {
		if (this.m_nodes.length > 0) {
			this.m_nodes[0].getRScene().addEventListener(type, target, func, captureEnabled, bubbleEnabled);
		}
	}
	removeEventListener(type: number, target: any, func: (evt: any) => void): void {
		if (this.m_nodes.length > 0) {
			this.m_nodes[0].getRScene().removeEventListener(type, target, func);
		}
	}
	addScene(sc: IRendererScene): IRendererSceneNode {
		if (sc != null) {
			let ls = this.m_nodes;
			for (let i = 0; i < ls.length; ++i) {
				if (ls[i].getRScene() == sc) {
					return ls[i];
				}
			}

			let node = new RendererSceneNode(sc);
			ls.push(node);
			this.m_map.set(sc.getUid(), node);
			return node;
		}
		return null;
	}
	getNodeBySceneUid(uid: number): IRendererSceneNode {
		if (this.m_map.has(uid)) {
			return this.m_map.get(uid);
		}
		return null;
	}
	createNode(sc: IRendererScene): IRendererSceneNode {
		if (sc != null) {
			return new RendererSceneNode(sc);
		}
		return null;
	}
	run(): void {

		let list = this.m_nodes;
		let total = list.length;

		if (total > 0) {
			let pickFlag = true;
			let i = total - 1;

			const node = list[i] as RendererSceneNode;
			let scene = list[i].getRScene();
			if (node.p0Call0) node.p0Call0(scene, this);
			scene.runBegin(true, true);
			scene.update(false, true);
			pickFlag = scene.isRayPickSelected();
			this.rayPickFlag = pickFlag;
			if (node.p0Call1) node.p0Call1(scene, this);

			i -= 1;
			for (; i >= 0; --i) {
				const node = list[i] as RendererSceneNode;
				scene = list[i].getRScene();
				if (node.p0Call0) node.p0Call0(scene, this);
				scene.runBegin(false, true);
				scene.update(false, !pickFlag);
				pickFlag = pickFlag || scene.isRayPickSelected();
				this.rayPickFlag = pickFlag;
				if (node.p0Call1) node.p0Call1(scene, this);
			}
			/////////////////////////////////////////////////////// ---- mouseTest end.

			/////////////////////////////////////////////////////// ---- rendering begin.
			for (i = 0; i < total; ++i) {
				const node = list[i] as RendererSceneNode;
				scene = list[i].getRScene();
				if (node.p1Call0) node.p0Call0(scene, this);
				scene.renderBegin(node.contextResetEnabled);
				const idList = node.processIdList;
				if (idList == null) {
					scene.run(false);
				} else {
					for (let j = 0; j < idList.length; ++j) {
						scene.runAt(idList[j]);
					}
				}
				scene.runEnd();
				if (node.p1Call0) node.p0Call1(scene, this);
			}
		}
	}

	private m_autoRRun = false;
	fakeRun(autoCycle: boolean = true): void {
		console.log("corgraph fakeRun ...");
	}
	setAutoRunning(auto: boolean): IRendererSceneGraph {
		if (this.m_autoRRun != auto) {
			if (this.m_autoRRun) {
				let runFunc = this.run;
				this.run = this.fakeRun;
				this.fakeRun = runFunc;

				this.m_autoRRun = false;
			} else {
				this.m_autoRRun = true;

				let runFunc = this.fakeRun;
				this.fakeRun = this.run;
				this.run = runFunc;

				const func = (): void => {
					if (this.m_autoRRun) {
						this.fakeRun();
						window.requestAnimationFrame(func);
					}
				};
				window.requestAnimationFrame(func);
			}
		}
		return this;
	}

	isAutoRunning(): boolean {
		return this.m_autoRRun;
	}
}

import { ICoRScene } from "../../../voxengine/ICoRScene";
import { NVTransUI } from "../ui/NVTransUI";
import IRendererScene from "../../../../vox/scene/IRendererScene";
import { NormalEntityManager } from "./NormalEntityManager";
import IVector3D from "../../../../vox/math/IVector3D";

declare var CoRScene: ICoRScene;

class NVEntityGroup {

	private static s_uid = 0;
	protected m_uid = NVEntityGroup.s_uid++;
	protected m_enabled = true;
	protected m_pv: IVector3D = null;
	protected m_rscene: IRendererScene = null;
	protected m_visible = true;
	protected m_transUI: NVTransUI;
	protected m_runFlag = -1;

	entityManager: NormalEntityManager;
	constructor() { }

	initialize(rscene: IRendererScene, transUI: NVTransUI): void {

		if (this.m_rscene == null) {
			this.m_rscene = rscene;
			this.m_transUI = transUI;
			this.createNodes();
			this.m_pv = CoRScene.createVec3();
			rscene.runnableQueue.addRunner( this );
		}
	}
	protected createNodes(): void {
	}
	getUid(): number {
		return this.m_uid;
	}
	setVisible(v: boolean): void {
		this.m_visible = v;
	}
	isVisible(): boolean {
		return this.m_visible;
	}
	update(): void {
	}
	setRunFlag(flag: number): void {
		this.m_runFlag = flag;
	}
	getRunFlag(): number {
		return this.m_runFlag;
	}
	isRunning(): boolean {
		return this.m_enabled;
	}
	isStopped(): boolean {
		return !this.m_enabled;
	}
	run(): void {
	}
}
export { NVEntityGroup };

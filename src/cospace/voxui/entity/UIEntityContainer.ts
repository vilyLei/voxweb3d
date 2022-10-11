import { IUIEntity } from "./IUIEntity";
import { IUIEntityContainer } from "./IUIEntityContainer";
import { UIEntityBase } from "./UIEntityBase";

import { ICoRScene } from "../../voxengine/ICoRScene";
import IVector3D from "../../../vox/math/IVector3D";
declare var CoRScene: ICoRScene;

class UIEntityContainer extends UIEntityBase implements IUIEntityContainer {

	protected m_uientities: IUIEntity[] = [];
	constructor() { super(); }

	protected init(): void {
		if (this.isIniting()) {
			super.init();
			this.m_rcontainer = CoRScene.createDisplayEntityContainer();
		}
	}
	protected addedEntity(entity: IUIEntity): void {

	}
	protected removedEntity(entity: IUIEntity): void {

	}
	addEntity(entity: IUIEntity): void {
		if (entity != null) {
			let i = 0;
			for (; i < this.m_uientities.length; ++i) {
				if (this.m_uientities[i] == entity) break;
			}
			if (i >= this.m_uientities.length) {
				this.m_uientities.push(entity);
				entity.update();

				let container = entity.getRContainer();
				if (container != null) {
					this.m_rcontainer.addChild(container);
				}
				let ls = entity.getREntities();
				for (let k = 0; k < ls.length; ++k) {
					this.m_rcontainer.addEntity(ls[k]);
				}
				this.addedEntity(entity);
			}
		}
	}
	removeEntity(entity: IUIEntity): void {
		if (entity != null) {
			let i = 0;
			for (; i < this.m_uientities.length; ++i) {
				if (this.m_uientities[i] == entity) {
					this.m_uientities.splice(i, 1);

					let container = entity.getRContainer();
					if (container != null) {
						this.m_rcontainer.removeChild(container);
					}
					let ls = entity.getREntities();
					for (let k = 0; k < ls.length; ++k) {
						this.m_rcontainer.removeEntity(ls[k]);
					}
					this.removedEntity(entity);
					break;
				}
			}
		}
	}
	globalToLocal(pv: IVector3D): void {
		this.m_rcontainer.globalToLocal(pv);
	}
	localToGlobal(pv: IVector3D): void {
		this.m_rcontainer.localToGlobal(pv);
	}
	getEneitysTotal(): number {
		return this.m_uientities.length;
	}
}
export { UIEntityContainer };

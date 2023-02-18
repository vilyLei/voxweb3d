
import { IBillboard } from "../particle/entity/IBillboard";
import { IBillboardLine } from "../particle/entity/IBillboardLine";
import IBillboardFlareGroup from "../particle/entity/IBillboardFlareGroup";
import IBillboardFlowGroup from "../particle/entity/IBillboardFlowGroup";
import { ModuleLoader } from "../modules/loaders/ModuleLoader";

import { ICoParticle } from "./ICoParticle";
declare var CoParticle: ICoParticle;

interface I_CoParticle {
}
class I_CoParticle {

	private m_init = true;
	initialize(callback: (urls: string[]) => void = null, url: string = ""): boolean {
		this.m_init = !this.isEnabled();
		if (this.m_init) {
			this.m_init = false;
			if (url == "" || url === undefined) {
				url = "static/cospace/particle/CoParticle.umd.min.js";
			}
			new ModuleLoader(1, (): void => {
				if (callback != null && this.isEnabled()) callback([url]);
			}).load(url);

			return true;
		}
		return false;
	}
	isEnabled(): boolean {
		return typeof CoParticle !== "undefined";
	}
	createBillboard(): IBillboard {
		return CoParticle.createBillboard();
	}
	createBillboardLine(): IBillboardLine {
		return CoParticle.createBillboardLine();
	}
	createBillboardFlareGroup(): IBillboardFlareGroup {
		return CoParticle.createBillboardFlareGroup();
	}
	createBillboardFlowGroup(): IBillboardFlowGroup {
		return CoParticle.createBillboardFlowGroup();
	}
}
var VoxParticle = new I_CoParticle();
export { VoxParticle };

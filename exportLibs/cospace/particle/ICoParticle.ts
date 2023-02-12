
import { IBillboard } from "../particle/entity/IBillboard";
import { IBillboardLine } from "../particle/entity/IBillboardLine";
import IBillboardFlareGroup from "../particle/entity/IBillboardFlareGroup";
import IBillboardFlowGroup from "../particle/entity/IBillboardFlowGroup";

interface ICoParticle {
	createBillboard(): IBillboard;
	createBillboardLine(): IBillboardLine;
	createBillboardFlareGroup(): IBillboardFlareGroup;
	createBillboardFlowGroup(): IBillboardFlowGroup;
}
export { ICoParticle };

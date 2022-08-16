
import IBillboard from "../particle/entity/IBillboard";
import IBillboardFlareGroup from "../particle/entity/IBillboardFlareGroup";
import IBillboardFlowGroup from "../particle/entity/IBillboardFlowGroup";

interface ICoParticle {
	createBillboard(): IBillboard;
	createBillboardFlareGroup(): IBillboardFlareGroup;
	createBillboardFlowGroup(): IBillboardFlowGroup;
}
export { ICoParticle };

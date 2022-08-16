import Billboard from "../particle/entity/Billboard";
import BillboardFlareGroup from "../particle/entity/BillboardFlareGroup";
import BillboardFlowGroup from "../particle/entity/BillboardFlowGroup";

function createBillboard(): Billboard {
	return new Billboard();
}
function createBillboardFlareGroup(): BillboardFlareGroup {
	return new BillboardFlareGroup();
}
function createBillboardFlowGroup(): BillboardFlowGroup {
	return new BillboardFlowGroup();
}


export {
	createBillboard,
	createBillboardFlareGroup,
	createBillboardFlowGroup
}

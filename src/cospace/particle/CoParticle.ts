import { Billboard } from "../particle/entity/Billboard";
import { BillboardLine } from "../particle/entity/BillboardLine";
import BillboardFlareGroup from "../particle/entity/BillboardFlareGroup";
import BillboardFlowGroup from "../particle/entity/BillboardFlowGroup";

function createBillboard(): Billboard {
	return new Billboard();
}
function createBillboardLine(): BillboardLine {
	return new BillboardLine();
}
function createBillboardFlareGroup(): BillboardFlareGroup {
	return new BillboardFlareGroup();
}
function createBillboardFlowGroup(): BillboardFlowGroup {
	return new BillboardFlowGroup();
}


export {
	createBillboard,
	createBillboardLine,
	createBillboardFlareGroup,
	createBillboardFlowGroup
}

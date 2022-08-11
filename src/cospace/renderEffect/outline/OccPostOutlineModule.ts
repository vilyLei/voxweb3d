import OcclusionPostOutline from "../../../renderingtoy/mcase/outline/OcclusionPostOutline";
import IOcclusionPostOutline from "../../../renderingtoy/mcase/outline/IOcclusionPostOutline";

function create(): IOcclusionPostOutline {
	return new OcclusionPostOutline();
}

export{ OcclusionPostOutline, create }

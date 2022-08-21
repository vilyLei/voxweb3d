import Line from "./base/Line";
import ILine from "./base/ILine";
import IRayLine from "./base/IRayLine";
import RayLine from "./base/RayLine";
import ISegmentLine from "./base/ISegmentLine";
import SegmentLine from "./base/SegmentLine";
import IPlane from "./base/IPlane";
import Plane from "./base/Plane";
import ISphere from "./base/ISphere";
import Sphere from "./base/Sphere";


function createLine(): ILine {
	return new Line();
}
function createRayLine(): IRayLine {
	return new RayLine();
}
function createSegmentLine(): ISegmentLine {
	return new SegmentLine();
}
function createPlane(): IPlane {
	return new Plane();
}
function createSphere(): ISphere {
	return new Sphere();
}

export {
	
	Line,
	RayLine,
	SegmentLine,
	Plane,
	Sphere,

	createLine,
	createRayLine,
	createSegmentLine,
	createPlane,
	createSphere
}

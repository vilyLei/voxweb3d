import Line from "./base/Line";
import ILine from "./base/ILine";
import IRayLine from "./base/IRayLine";
import RayLine from "./base/RayLine";
import ISegmentLine from "./base/ISegmentLine";
import SegmentLine from "./base/SegmentLine";
import IPlane from "./base/IPlane";
import Plane from "./base/Plane";
import PlaneUtils from "./base/PlaneUtils";
import ISphere from "./base/ISphere";
import Sphere from "./base/Sphere";
import { Intersection } from "./base/Intersection";


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

	Intersection,
	Line,
	RayLine,
	SegmentLine,
	Plane,
	PlaneUtils,
	Sphere,

	createLine,
	createRayLine,
	createSegmentLine,
	createPlane,
	createSphere
}

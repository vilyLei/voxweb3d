import Line from "./base/Line";
import ILine from "./base/ILine";
import IRayLine from "./base/IRayLine";
import RayLine from "./base/RayLine";
import IPlane from "./base/IPlane";
import Plane from "./base/Plane";


function createLine(): ILine {
	return new Line();
}
function createRayLine(): IRayLine {
	return new RayLine();
}
function createPlane(): IPlane {
	return new Plane();
}

export {
	Line,
	RayLine,
	Plane,
	createLine,
	createRayLine,
	createPlane
}

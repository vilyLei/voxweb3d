import Line from "./base/Line";
import Plane from "./base/Plane";




function createLine(): void {
	new Line();
}
function createPlane(): void {
	new Plane();
}

export {
	Line,
	Plane,
	createLine
}

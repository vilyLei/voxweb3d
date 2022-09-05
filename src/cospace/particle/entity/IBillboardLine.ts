import IVector3D from "../../../vox/math/IVector3D";
import { IBillboardBase } from "./IBillboardBase";

interface IBillboardLine extends IBillboardBase {

	initializeSquareXOY(size: number): void;
	initializeRectXOY(bw: number, bh: number): void;
	
	initializeCircleXOY(radius: number, segsTotal: number, center?: IVector3D): void;
}
export { IBillboardLine }
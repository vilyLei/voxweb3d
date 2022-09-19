import IRawMesh from "../../../vox/mesh/IRawMesh";
import { IMeshBuilder } from "./IMeshBuilder";

interface IPlaneMeshBuilder extends IMeshBuilder {

	uvs: Float32Array;

	polyhedral: boolean;

	offsetU: number;
	offsetV: number;
	uScale: number;
	vScale: number;

	normalEnabled: boolean;
	flipVerticalUV: boolean;
	
	createCircle(radius: number, segsTotal: number, beginRad?: number, rangeRad?: number): IRawMesh;
	/**
	 * initialize a rectangle fix screen size plane ,and it parallel the 3d space XOY plane
	 * @param texList textures list, default value is null.
	 */
	createFixScreen(): IRawMesh;
	/**
	 * create a rectangle plane ,and it parallel the 3d space XOY plane
	 * @param minX the min x axis position of the rectangle plane.
	 * @param minZ the min y axis position of the rectangle plane.
	 * @param pwidth the width of the rectangle plane.
	 * @param height the height of the rectangle plane.
	 * @param texList textures list, default value is null.
	 */
	createXOY(minX: number, minY: number, pwidth: number, pheight: number): IRawMesh;
	/**
	 * create a square plane ,and it parallel the 3d space XOY plane
	 * @param size the width and height of the rectangle plane.
	 * @param texList textures list, default value is null.
	 */
	createXOYSquare(size: number): IRawMesh;
	/**
	 * create a rectangle plane ,and it parallel the 3d space XOZ plane
	 * @param minX the min x axis position of the rectangle plane.
	 * @param minZ the min z axis position of the rectangle plane.
	 * @param pwidth the width of the rectangle plane.
	 * @param plong the long of the rectangle plane.
	 * @param texList textures list, default value is null.
	 */
	createXOZ(minX: number, minZ: number, pwidth: number, plong: number): IRawMesh;
	/**
	 * create a rectangle plane ,and it parallel the 3d space YOZ plane
	 * @param minX the min x axis position of the rectangle plane.
	 * @param minZ the min z axis position of the rectangle plane.
	 * @param pwidth the width of the rectangle plane.
	 * @param plong the long of the rectangle plane.
	 * @param texList textures list, default value is null.
	 */
	createYOZ(minY: number, minZ: number, pwidth: number, plong: number): IRawMesh;
	/**
	 * create a square plane ,and it parallel the 3d space XOZ plane
	 * @param size the width and long of the rectangle plane.
	 * @param texList textures list, default value is null.
	 */
	createXOZSquare(size: number): IRawMesh;

	destroy(): void;
}
export { IPlaneMeshBuilder };

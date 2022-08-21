import IColor4 from "../../vox/material/IColor4";

interface ICoMaterial {

	createColor4(pr?: number, pg?: number, pb?: number, pa?: number): IColor4;
}
export { ICoMaterial };

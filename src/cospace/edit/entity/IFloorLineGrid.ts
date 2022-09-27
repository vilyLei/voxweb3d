import IVector3D from "../../../vox/math/IVector3D";
import IRendererScene from "../../../vox/scene/IRendererScene";
import IColor4 from "../../../vox/material/IColor4";

interface IFloorLineGrid {

	initialize(rscene: IRendererScene, rpi: number, minV: IVector3D, maxV: IVector3D, stepsTotal?: number, color?: IColor4):void;
	setVisible(v: boolean): void;
}

export { IFloorLineGrid }

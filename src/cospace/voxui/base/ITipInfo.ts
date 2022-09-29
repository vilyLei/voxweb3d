import IAABB from "../../../vox/geom/IAABB";
import IAABB2D from "../../../vox/geom/IAABB2D";
import IVector3D from "../../../vox/math/IVector3D";

interface ITipInfo {
	setContent(c: string): ITipInfo;
	getCotent(): string;
	alignLeft(): ITipInfo;
	alignRight(): ITipInfo;
	alignTop(): ITipInfo;
	alignBottom(): ITipInfo;
	getPos(mx: number, my: number, bounds: IAABB, tipBounds: IAABB, area?: IAABB2D): IVector3D;
	destroy(): void;
}

export { ITipInfo }


import IVector3D from "../../vox/math/IVector3D";
import { IMatrix4 } from "../../vox/math/IMatrix4";

import IRendererParam from "../../vox/scene/IRendererParam";
import { ICoRendererScene } from "./scene/ICoRendererScene";

import { ICoDisplayEntity } from "./entity/ICoDisplayEntity";
import { IShaderMaterial } from "./material/IShaderMaterial";

import { CoGeomDataType, CoTextureDataUnit, CoGeomDataUnit } from "../app/CoSpaceAppData";


interface CoVec3 {
    ONE: IVector3D;
    ZERO: IVector3D;
    X_AXIS: IVector3D;
    Y_AXIS: IVector3D;
    Z_AXIS: IVector3D;
	Distance(va: IVector3D, vb: IVector3D): number;
}
interface CoMouseEvent {
	
    readonly MOUSE_DOWN: number;// = 5001;
    readonly MOUSE_UP: number;// = 5002;
    readonly MOUSE_RIGHT_UP: number;// = 5003;
    readonly MOUSE_RIGHT_DOWN: number;// = 5004;
    readonly MOUSE_MOVE: number;// = 5005;
    readonly MOUSE_WHEEL: number;// = 5006;
    readonly MOUSE_OVER: number;// = 5007;
    readonly MOUSE_OUT: number;// = 5008;
    readonly MOUSE_CLICK: number;// = 5009;
    readonly MOUSE_RIGHT_CLICK: number;// = 5010;
    readonly MOUSE_DOUBLE_CLICK: number;// = 5011;
    readonly MOUSE_CANCEL: number;// = 5012;
    readonly MOUSE_MULTI_DOWN: number;// = 5013;
    readonly MOUSE_MULTI_UP: number;// = 5014;
    readonly MOUSE_MULTI_MOVE: number;// = 5015;
    readonly MOUSE_BG_DOWN: number;// = 5016;            //  mouse down do not hit any 3d object, only in stage
    readonly MOUSE_BG_UP: number;// = 5017;              //  mouse up do not hit any 3d object, only in stage
    readonly MOUSE_BG_CLICK: number;// = 5018;          //  mouse up do not hit any 3d object, only in stage
}

interface ICoRScene {

	Vector3D: CoVec3;
	MouseEvent: CoMouseEvent;

	createVec3(px?: number, py?: number, pz?: number, pw?: number): IVector3D;
	createMat4(pfs32?: Float32Array, index?: number): IMatrix4;
	createRendererSceneParam(div?: HTMLDivElement): IRendererParam;
	createRendererScene(): ICoRendererScene;

	createShaderMaterial(shd_uniqueName: string): IShaderMaterial;
	createDisplayEntityFromModel(model: CoGeomDataType, pmaterial?: IShaderMaterial): ICoDisplayEntity;
	createAxis3DEntity(size?: number): ICoDisplayEntity;
}
export { ICoRScene }

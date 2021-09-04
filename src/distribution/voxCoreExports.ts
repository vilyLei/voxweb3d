import Vector3D from "../vox/math/Vector3D";
import Matrix4 from "../vox/math/Matrix4";

import TextureProxy from "../vox/texture/TextureProxy";

import DisplayEntity from "../vox/entity/DisplayEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import DisplayEntityContainer from "../vox/entity/DisplayEntityContainer";
import {UILayoutBase} from "./uiManage/UILayoutBase";
import Stage3D from "../vox/display/Stage3D";
import CameraBase from "../vox/view/CameraBase";

import SelectionEvent from "../vox/event/SelectionEvent";
import CanvasTextureTool from "../orthoui/assets/CanvasTextureTool";
import ProgressDataEvent from "../vox/event/ProgressDataEvent";
import EventBase from "../vox/event/EventBase";
import SelectionBar from "../orthoui/button/SelectionBar";
import ProgressBar from "../orthoui/button/ProgressBar";

var VoxCore: any = {};

VoxCore["UILayoutBase"] = UILayoutBase;
VoxCore["Vector3D"] = Vector3D;
VoxCore["Matrix4"] = Matrix4;

VoxCore["Stage3D"] = Stage3D;
VoxCore["CameraBase"] = CameraBase;

VoxCore["TextureProxy"] = TextureProxy;

VoxCore["DisplayEntity"] = DisplayEntity;
VoxCore["Axis3DEntity"] = Axis3DEntity;
VoxCore["Plane3DEntity"] = Plane3DEntity;
VoxCore["Box3DEntity"] = Box3DEntity;
VoxCore["DisplayEntityContainer"] = DisplayEntityContainer;

VoxCore["SelectionEvent"] = SelectionEvent;
VoxCore["CanvasTextureTool"] = CanvasTextureTool;
VoxCore["ProgressBar"] = ProgressBar;
VoxCore["ProgressDataEvent"] = ProgressDataEvent;
VoxCore["EventBase"] = EventBase;
VoxCore["SelectionBar"] = SelectionBar;

class VoxCoreExport {
    constructor() {
        
    }
}
export {VoxCoreExport}

let pwindow: any = window;
pwindow["VoxCore"] = VoxCore;
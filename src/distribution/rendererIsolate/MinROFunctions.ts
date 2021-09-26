import RendererDevice from "../../vox/render/RendererDevice";
import Matrix4 from "../../vox/math/Matrix4";
import CameraBase from "../../vox/view/CameraBase";
import ImageTextureProxy from "../../vox/texture/ImageTextureProxy";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import Plane3DEntity from "../../vox/entity/Plane3DEntity";
import Box3DEntity from "../../vox/entity/Box3DEntity";
import DataMesh from "../../vox/mesh/DataMesh";

var pwindow: any = window;
if(pwindow["VoxCore"] == undefined) {
    pwindow["VoxCore"] = {};
}
var VoxCore = pwindow["VoxCore"];

VoxCore["RendererDevice"] = RendererDevice;

VoxCore["Matrix4"] = Matrix4;

VoxCore["CameraBase"] = CameraBase;

VoxCore["ImageTextureProxy"] = ImageTextureProxy;
VoxCore["DisplayEntity"] = DisplayEntity;
VoxCore["Plane3DEntity"] = Plane3DEntity;
VoxCore["Box3DEntity"] = Box3DEntity;
VoxCore["DataMesh"] = DataMesh;

class MinROFunctions {

    private m_camera: CameraBase = null;
    private m_imgTexture: ImageTextureProxy = null;
    private m_plane: Plane3DEntity = null;
    private m_box: Box3DEntity = null;
    private m_entity: DisplayEntity = null;
    private m_dataMesh: DataMesh = null;

    constructor() { }

    initialize(pmodule: any): void {

        let flag: boolean = false;
        if( flag ) {
            this.m_camera = new CameraBase();
            this.m_imgTexture = new ImageTextureProxy(32,32);
            this.m_entity = new DisplayEntity();
            this.m_plane = new Plane3DEntity();
            this.m_box = new Box3DEntity();
            this.m_dataMesh = new DataMesh();
        }
        console.log("MinROFunctions::initialize()......");
    }
    run(): void {

    }
    getModuleName():string {
        return "roFunctions";
    }
    getModuleClassName():string {
        return "roFunctions";
    }
    getRuntimeType():string {
        return "system_running";
    }
}

export {MinROFunctions};
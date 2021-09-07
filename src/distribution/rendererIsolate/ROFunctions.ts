
import Matrix4Pool from "../../vox/math/Matrix4Pool";

import TextureProxy from "../../vox/texture/TextureProxy";
import ImageTextureProxy from "../../vox/texture/ImageTextureProxy";

import DisplayEntity from "../../vox/entity/DisplayEntity";
import Plane3DEntity from "../../vox/entity/Plane3DEntity";
import Billboard3DEntity from "../../vox/entity/Billboard3DEntity";

import AABB2D from "../../vox/geom/AABB2D";
import Box3DEntity from "../../vox/entity/Box3DEntity";
import Sphere3DEntity from "../../vox/entity/Sphere3DEntity";
import Axis3DEntity from "../../vox/entity/Axis3DEntity";
import DataMesh from "../../vox/mesh/DataMesh";
//import CameraBase from "../../vox/view/CameraBase";

var pwindow: any = window;
if(pwindow["VoxCore"] == undefined) {
    pwindow["VoxCore"] = {};
}
var VoxCore = pwindow["VoxCore"];

VoxCore["AABB2D"] = AABB2D;
VoxCore["Matrix4Pool"] = Matrix4Pool;

VoxCore["TextureProxy"] = TextureProxy;
VoxCore["ImageTextureProxy"] = ImageTextureProxy;

VoxCore["DataMesh"] = DataMesh;

VoxCore["DisplayEntity"] = DisplayEntity;
VoxCore["Plane3DEntity"] = Plane3DEntity;
VoxCore["Billboard3DEntity"] = Billboard3DEntity;
VoxCore["Box3DEntity"] = Box3DEntity;
VoxCore["Sphere3DEntity"] = Sphere3DEntity;
VoxCore["Axis3DEntity"] = Axis3DEntity;


class ROFunctions {

    //private m_camera: CameraBase = new CameraBase(0);

    private m_imgTexture: ImageTextureProxy = new ImageTextureProxy(32,32);

    private m_dataMesh: DataMesh = new DataMesh();

    private m_entity: DisplayEntity = new DisplayEntity();
    private m_plane: Plane3DEntity = new Plane3DEntity();
    private m_billboard: Billboard3DEntity = new Billboard3DEntity();
    private m_box: Box3DEntity = new Box3DEntity();
    private m_sph: Sphere3DEntity = new Sphere3DEntity();
    private m_axis: Axis3DEntity = new Axis3DEntity();
    
    constructor() { }

    initialize(pmodule: any): void {

        //this.m_camera.lookAtRH(new Vector3D(100.0,0.0,0.0), new Vector3D(), Vector3D.Y_AXIS);

        this.m_dataMesh.initialize();

        this.m_plane.initializeXOZSquare(100.0);
        this.m_billboard.initialize(100.0,100.0, [this.m_imgTexture]);
        this.m_box.initializeCube(300.0,[this.m_imgTexture]);
        this.m_sph.initialize(300.0,30,30,[this.m_imgTexture]);
        this.m_axis.initialize(300.0);
        console.log("ROFunctions::initialize()......");
    }
    run(): void {
    }
}

export {ROFunctions};

import Matrix4 from "../../vox/math/Matrix4";
import MathConst from "../../vox/math/MathConst";
import AABB from "../../vox/geom/AABB";
import AABB2D from "../../vox/geom/AABB2D";
import Sphere from "../../vox/geom/Sphere";
import Plane from "../../vox/geom/Plane";
import RadialLine from "../../vox/geom/RadialLine";
import LineSegment from "../../vox/geom/LineSegment";
import StraightLine from "../../vox/geom/StraightLine";
import CameraBase from "../../vox/view/CameraBase";

import Matrix4Pool from "../../vox/math/Matrix4Pool";

import TextureProxy from "../../vox/texture/TextureProxy";
import ImageTextureProxy from "../../vox/texture/ImageTextureProxy";

import ShaderUniformData from "../../vox/material/ShaderUniformData";
import MaterialBase from "../../vox/material/MaterialBase";
import ShaderCodeMaterial from "../../vox/material/ShaderCodeMaterial";

import DataMesh from "../../vox/mesh/DataMesh";
import DracoMesh from "../../voxmesh/draco/DracoMesh";

import ROTransform from "../../vox/display/ROTransform";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import Plane3DEntity from "../../vox/entity/Plane3DEntity";
import Billboard3DEntity from "../../vox/entity/Billboard3DEntity";

import Box3DEntity from "../../vox/entity/Box3DEntity";
import Sphere3DEntity from "../../vox/entity/Sphere3DEntity";
import Axis3DEntity from "../../vox/entity/Axis3DEntity";
import Cylinder3DEntity from "../../vox/entity/Cylinder3DEntity";
import Line3DEntity from "../../vox/entity/Line3DEntity";
import DashedLine3DEntity from "../../vox/entity/DashedLine3DEntity";
import BoxFrame3D from "../../vox/entity/BoxFrame3D";
import FrustrumFrame3DEntity from "../../vox/entity/FrustrumFrame3DEntity";

var pwindow: any = window;
if(pwindow["VoxCore"] == undefined) {
    pwindow["VoxCore"] = {};
}
var VoxCore = pwindow["VoxCore"];

VoxCore["AABB"] = AABB;
VoxCore["AABB2D"] = AABB2D;
VoxCore["Matrix4"] = Matrix4;
VoxCore["MathConst"] = MathConst;
VoxCore["Sphere"] = Sphere;
VoxCore["Plane"] = Plane;
VoxCore["RadialLine"] = RadialLine;
VoxCore["LineSegment"] = LineSegment;
VoxCore["StraightLine"] = StraightLine;
VoxCore["CameraBase"] = CameraBase;

VoxCore["Matrix4Pool"] = Matrix4Pool;

VoxCore["TextureProxy"] = TextureProxy;
VoxCore["ImageTextureProxy"] = ImageTextureProxy;


VoxCore["ShaderUniformData"] = ShaderUniformData;
VoxCore["MaterialBase"] = MaterialBase;
VoxCore["ShaderCodeMaterial"] = ShaderCodeMaterial;

VoxCore["DataMesh"] = DataMesh;
VoxCore["DracoMesh"] = DracoMesh;

VoxCore["ROTransform"] = ROTransform;
VoxCore["DisplayEntity"] = DisplayEntity;
VoxCore["Plane3DEntity"] = Plane3DEntity;
VoxCore["Billboard3DEntity"] = Billboard3DEntity;
VoxCore["Box3DEntity"] = Box3DEntity;
VoxCore["Sphere3DEntity"] = Sphere3DEntity;
VoxCore["Axis3DEntity"] = Axis3DEntity;
VoxCore["Cylinder3DEntity"] = Cylinder3DEntity;
VoxCore["Line3DEntity"] = Line3DEntity;
VoxCore["DashedLine3DEntity"] = DashedLine3DEntity;
VoxCore["BoxFrame3D"] = BoxFrame3D;
VoxCore["FrustrumFrame3DEntity"] = FrustrumFrame3DEntity;

class ROFunctions {

    private m_camera: CameraBase = null;

    private m_imgTexture: ImageTextureProxy = new ImageTextureProxy(32,32);

    private m_dataMesh: DataMesh = new DataMesh();
    private m_dracoMesh: DracoMesh = new DracoMesh();

    private m_entity: DisplayEntity = new DisplayEntity();
    private m_plane: Plane3DEntity = new Plane3DEntity();
    private m_billboard: Billboard3DEntity = new Billboard3DEntity();
    private m_box: Box3DEntity = new Box3DEntity();
    private m_sph: Sphere3DEntity = new Sphere3DEntity();
    private m_axis: Axis3DEntity = new Axis3DEntity();
    private m_cyl: Cylinder3DEntity = new Cylinder3DEntity();
    private m_line: Line3DEntity = new Line3DEntity();
    private m_dashedLine: DashedLine3DEntity = new DashedLine3DEntity();
    private m_boxFrame: BoxFrame3D = new BoxFrame3D();
    private m_frustumFrame: FrustrumFrame3DEntity = new FrustrumFrame3DEntity();
    
    private m_uniformData: ShaderUniformData = new ShaderUniformData();
    private m_shaderCodeMaterial: ShaderCodeMaterial = new ShaderCodeMaterial();

    constructor() { }

    initialize(pmodule: any): void {

        let flag: boolean = false;
        if( flag ) {

            this.m_camera = new CameraBase();

            this.m_dataMesh.initialize();
            this.m_dracoMesh.initialize(null);
    
            this.m_plane.initializeXOZSquare(100.0);
            this.m_billboard.initialize(100.0,100.0, [this.m_imgTexture]);
            this.m_box.initializeCube(300.0,[this.m_imgTexture]);
            this.m_sph.initialize(300.0,30,30,[this.m_imgTexture]);
            this.m_axis.initialize(300.0);
            this.m_cyl.initialize(300.0,100,10);
            this.m_line.initialize(null,null);
            this.m_dashedLine.initializeLS(null,null);
            this.m_boxFrame.initialize(null, null);
            this.m_frustumFrame.initiazlize(null);
        }
        console.log("ROFunctions::initialize()......");
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

export {ROFunctions};
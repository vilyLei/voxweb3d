import RendererDevice from "../../vox/render/RendererDevice";

import MathConst from "../../vox/math/MathConst";
import Vector3D from "../../vox/math/Vector3D";
import Matrix4 from "../../vox/math/Matrix4";
import Matrix4Pool from "../../vox/math/Matrix4Pool";

import AABB from "../../vox/geom/AABB";
import AABB2D from "../../vox/geom/AABB2D";
import Sphere from "../../vox/geom/Sphere";
import Plane from "../../vox/geom/Plane";
import RadialLine from "../../vox/geom/RadialLine";
import LineSegment from "../../vox/geom/LineSegment";
import StraightLine from "../../vox/geom/StraightLine";
import CameraBase from "../../vox/view/CameraBase";

import Color4 from "../../vox/material/Color4";

import RendererState from "../../vox/render/RendererState";

import TextureProxy from "../../vox/texture/TextureProxy";
import ImageTextureProxy from "../../vox/texture/ImageTextureProxy";

import ShaderUniformProbe from "../../vox/material/ShaderUniformProbe";
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

import RendererParam from "../../vox/scene/RendererParam";
import RendererInstanceContext from "../../vox/scene/RendererInstanceContext";
import RendererInstance from "../../vox/scene/RendererInstance";
import EngineBase from "../../vox/engine/EngineBase";


var pwindow: any = window;
if(pwindow["VoxCore"] == undefined) {
    pwindow["VoxCore"] = {};
}
var VoxCore = pwindow["VoxCore"];

VoxCore["RendererDevice"] = RendererDevice;

VoxCore["MathConst"] = MathConst;
VoxCore["Vector3D"] = Vector3D;
VoxCore["Matrix4"] = Matrix4;
VoxCore["Matrix4Pool"] = Matrix4Pool;

VoxCore["AABB"] = AABB;
VoxCore["AABB2D"] = AABB2D;
VoxCore["MathConst"] = MathConst;
VoxCore["Sphere"] = Sphere;
VoxCore["Plane"] = Plane;
VoxCore["RadialLine"] = RadialLine;
VoxCore["LineSegment"] = LineSegment;
VoxCore["StraightLine"] = StraightLine;
VoxCore["CameraBase"] = CameraBase;

VoxCore["RendererState"] = RendererState;

VoxCore["Color4"] = Color4;

VoxCore["TextureProxy"] = TextureProxy;
VoxCore["ImageTextureProxy"] = ImageTextureProxy;

VoxCore["ShaderUniformData"] = ShaderUniformData;
VoxCore["ShaderUniformProbe"] = ShaderUniformProbe;
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

VoxCore["RendererParam"] = RendererParam;

/**
 * A empty engine instance example
 */
export class Vox3DEngine {
    private m_param: RendererParam = null;
    private m_engine: EngineBase = null;
    constructor() { }

    setParam(param: RendererParam): void {
        this.m_param = param;
    }
    initialize(pmodule: any): void {

        if(this.m_engine == null) {

            this.m_engine = new EngineBase();
            this.m_engine.initialize(this.m_param);
        }
    }
    
    getRenderer(): RendererInstance {
        return this.m_engine.rscene.getRenderer();
    }
    getRendererContext(): RendererInstanceContext {
        return this.m_engine.rscene.getRendererContext();
    }
    getEngine(): EngineBase {
        return this.m_engine;
    }
    run(): void {
        //this.m_engine.run();
    }

    getModuleName():string {
        return "vox3DEngine";
    }
    getModuleClassName():string {
        return "baseRenderer";
    }
    getRuntimeType():string {
        return "system_running";
    }
}
export default Vox3DEngine;
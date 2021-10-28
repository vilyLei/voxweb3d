
import Axis3DEntity from "../../../vox/entity/Axis3DEntity";
import Plane3DEntity from "../../../vox/entity/Plane3DEntity";
import Box3DEntity from "../../../vox/entity/Box3DEntity";

import MouseEvent from "../../../vox/event/MouseEvent";
import KeyboardEvent from "../../../vox/event/KeyboardEvent";

import Vector3D from "../../../vox/math/Vector3D";
import CameraViewRay from "../../../vox/view/CameraViewRay";
import { SpaceCullingMask } from "../../../vox/space/SpaceCullingMask";
import SelectionEvent from "../../../vox/event/SelectionEvent";
import SelectionBar from "../../../orthoui/button/SelectionBar";

import EngineBase from "../../../vox/engine/EngineBase";
import { TextureConst } from "../../../vox/texture/TextureConst";
import TextureProxy from "../../../vox/texture/TextureProxy";
import CubeMapMaterial from "../../../vox/material/mcase/CubeMapMaterial";
import MouseEventEntity from "../../../vox/entity/MouseEventEntity";
import DragAxisQuad3D from "../../../voxeditor/entity/DragAxisQuad3D";
import DisplayEntity from "../../../vox/entity/DisplayEntity";
import BoxFrame3D from "../../../vox/entity/BoxFrame3D";
import { RoadBuilder } from "../road/RoadBuilder";
import { PathTool } from "../road/PathTool";
import { PathCurveEditor } from "../road/PathCurveEditor";

import Line3DEntity from "../../../vox/entity/Line3DEntity";
import {RoadMesh} from "./RoadMesh";
import RoadSurfaceGeometry from "./RoadSurfaceGeometry";

class RoadGeometryBuilder {

    private m_initFlag: boolean = true;
    constructor() { }
    roadWidth: number = 120;
    
    offsetXYZ: Vector3D = new Vector3D();
    geometry: RoadSurfaceGeometry = null;
    initialize(): void {

        console.log("RoadGeometryBuilder::initialize()......");
        if( this.m_initFlag ) {

            this.m_initFlag = false;
        }
    }

    buildRoadSurface(mesh: RoadMesh, posTable: Vector3D[][], uScale: number = 1.0, vScale: number = 1.0, uvType: number = 0): RoadMesh {
        if(this.geometry == null) {
            this.geometry = new RoadSurfaceGeometry();
        }
        let geom: RoadSurfaceGeometry = this.geometry;

        geom.offsetXYZ.copyFrom( this.offsetXYZ );
        geom.uScale = uScale;
        geom.vScale = vScale;
        geom.roadWidth = this.roadWidth;
        geom.initialize(posTable, uvType);
        if(mesh == null) {
            mesh = new RoadMesh();
            mesh.changed = true;
        }
        else {
            mesh.changed = true;
        }
        mesh.vs = geom.getVS();
        mesh.uvs = geom.getUVS();
        mesh.setIVS( geom.getIVS() );
        return mesh;
    }    
}

export { RoadGeometryBuilder };
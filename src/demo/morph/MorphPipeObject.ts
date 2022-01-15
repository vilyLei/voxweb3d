
import Vector3D from "../../vox/math/Vector3D";
import Matrix4 from "../../vox/math/Matrix4";

import Tube3DEntity from "../../vox/entity/Tube3DEntity";
import TextureProxy from "../../vox/texture/TextureProxy";

import PipeGeometry from "../../voxmesh/geometry/primitive/PipeGeometry";
import Tube3DMesh from "../../vox/mesh/Tube3DMesh";
import MaterialBase from "../../vox/material/MaterialBase";
import MathConst from "../../vox/math/MathConst";
import { Bezier2Curve } from "../../vox/geom/curve/BezierCurve";

class MorphPipeObject {

    private m_pipeEntity: Tube3DEntity = null;
    private m_pipeMesh: Tube3DMesh = null;
    private m_pipeGeometry: PipeGeometry = null;
    private m_latitudeNum: number = 2;

    private m_rotV: Vector3D = new Vector3D();
    private m_scaleV: Vector3D = new Vector3D(1.0, 1.0, 1.0);
    private m_mat4A: Matrix4 = new Matrix4();
    private m_disRotV: Vector3D = new Vector3D(0.0, 0.0, 0.0);
    private m_bendIndex: number = 0;
    private m_rotAxis: Vector3D = new Vector3D();
    private m_bez2 = new Bezier2Curve();
    private m_bez2VS: number[];
    private m_scaleChangeFactor: number = 0.5;
    private m_scaleChangeAmplitude: number = 1.0;
    disRotV: Vector3D = new Vector3D(0.0, 0.0, 0.06);
    disScale: number = -0.05;
    morphTime: number = 0.0;

    constructor(radius: number, height: number, longitudeNum: number, latitudeNum: number, texList: TextureProxy[] = null, material: MaterialBase = null) {
        this.initialize(radius, height, longitudeNum, latitudeNum, texList, material);
    }
    private initialize(radius: number, height: number, longitudeNum: number, latitudeNum: number, texList: TextureProxy[], material: MaterialBase): void {

        this.m_latitudeNum = latitudeNum;
        this.m_bez2VS = new Array(latitudeNum + 1);
        this.m_pipeEntity = new Tube3DEntity();
        if (material != null) {
            this.m_pipeEntity.setMaterial(material);
        }
        this.m_bendIndex = Math.floor(this.m_latitudeNum * 0.5 * Math.random()) - 2;
        this.m_pipeEntity.showDoubleFace();
        this.m_pipeEntity.initialize(radius, height, longitudeNum, latitudeNum, texList, 1, 0.0);
        this.m_pipeMesh = this.m_pipeEntity.getMesh() as Tube3DMesh;
        this.m_pipeGeometry = this.m_pipeMesh.geometry.clone() as PipeGeometry;
        this.m_scaleChangeFactor = Math.random();
        this.m_scaleChangeAmplitude = Math.random() * 2.0 - 1.0;
        this.morphCalc(this.m_disRotV);
        this.m_pipeEntity.reinitialize();
        this.m_pipeEntity.updateMeshToGpu();
    }
    getEntity(): Tube3DEntity {
        return this.m_pipeEntity;
    }
    private morphCalc(rotV: Vector3D): void {

        this.m_pipeMesh.geometry.copyFrom(this.m_pipeGeometry);
        
        this.m_rotV.copyFrom(rotV);
        this.m_rotV.z = 0.0;
        this.m_scaleV.setXYZ(1.0, 1.0, 1.0);
        let mat4A: Matrix4 = this.m_mat4A;
        let total: number = this.m_latitudeNum;
        let factor: number = 1.0 - MathConst.Clamp(this.m_bendIndex / total, 0.0, 1.0);
        if (factor < 0.1) factor = 0.1;
        factor *= factor;
        let dScale: number = 0.0;
        
        let bez2 = this.m_bez2;
        //let bez2VS: number[] = new Array(11);
        bez2.calcCurveChangeYData(total, 1.0, 0.02, this.m_scaleChangeFactor, this.m_scaleChangeAmplitude, this.m_bez2VS);
        //console.log("### bez2VS: ",bez2VS);

        this.m_rotAxis.setXYZ(Math.cos( this.m_rotV.y ), 0.0, Math.sin( this.m_rotV.y ));
        this.m_rotAxis.normalize();
        for (let i: number = 0; i <= total; ++i) {

            //dScale = 1.0 - (i / total) * 0.98;
            dScale = this.m_bez2VS[i];
            this.m_scaleV.x = dScale;
            this.m_scaleV.z = dScale;

            mat4A.identity();
            mat4A.setScaleXYZ(this.m_scaleV.x, this.m_scaleV.y, this.m_scaleV.z);            
            mat4A.appendRotationPivot(this.m_rotV.z, this.m_rotAxis, null);
            this.m_rotV.z += rotV.z * factor;

            this.m_pipeEntity.transformCircleAt(i, mat4A);
        }
    }

    morph(): void {

        //if (this.m_pipeEntity.isInRenderer() && Math.abs(this.disRotV.z) > 0.002) {
        if (this.m_pipeEntity.isInRenderer()) {
            let factor: number = Math.sin(this.morphTime);
            // if(Math.abs(factor) < 0.001) {
            //     //this.disRotV.y = Math.random() * 6.28;
            //     this.disRotV.z = 0.20 * Math.random() - 0.10;
            // }
            this.m_disRotV.copyFrom(this.disRotV);
            this.m_disRotV.z *= factor;
            this.morphCalc(this.m_disRotV);
            this.m_pipeEntity.reinitialize();
            this.m_pipeEntity.updateMeshToGpu();
        }
        this.morphTime += 0.02;
    }

}
export { MorphPipeObject };
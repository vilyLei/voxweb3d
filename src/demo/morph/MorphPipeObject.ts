
import Vector3D from "../../vox/math/Vector3D";
import Matrix4 from "../../vox/math/Matrix4";

import Pipe3DEntity from "../../vox/entity/Pipe3DEntity";
import TextureProxy from "../../vox/texture/TextureProxy";

import PipeGeometry from "../../voxmesh/geometry/primitive/PipeGeometry";
import Pipe3DMesh from "../../vox/mesh/Pipe3DMesh";
import MaterialBase from "../../vox/material/MaterialBase";
import MathConst from "../../vox/math/MathConst";

class MorphPipeObject {

    private m_pipeEntity: Pipe3DEntity = null;
    private m_pipeMesh: Pipe3DMesh = null;
    private m_pipeGeometry: PipeGeometry = null;
    private m_latitudeNum: number = 2;

    private m_rotV: Vector3D = new Vector3D();
    private m_scaleV: Vector3D = new Vector3D(1.0, 1.0, 1.0);
    private m_mat4A: Matrix4 = new Matrix4();
    private m_disRotV: Vector3D = new Vector3D(0.0, 0.0, 0.0);
    private m_bendIndex: number = 0;
    disRotV: Vector3D = new Vector3D(0.0, 0.0, 0.06);
    disScale: number = -0.05;
    morphTime: number = 0.0;

    constructor(radius: number, height: number, longitudeNum: number, latitudeNum: number, texList: TextureProxy[] = null, material: MaterialBase = null) {
        this.initialize(radius, height, longitudeNum, latitudeNum, texList, material);
    }
    private initialize(radius: number, height: number, longitudeNum: number, latitudeNum: number, texList: TextureProxy[], material: MaterialBase): void {

        this.m_latitudeNum = latitudeNum;
        this.m_pipeEntity = new Pipe3DEntity();
        if (material != null) {
            this.m_pipeEntity.setMaterial(material);
        }
        this.m_bendIndex = Math.floor(this.m_latitudeNum * 0.5 * Math.random()) - 2;
        this.m_pipeEntity.showDoubleFace();
        this.m_pipeEntity.initialize(radius, height, longitudeNum, latitudeNum, texList, 1, 0.0);
        this.m_pipeMesh = this.m_pipeEntity.getMesh() as Pipe3DMesh;
        this.m_pipeGeometry = this.m_pipeMesh.geometry.clone() as PipeGeometry;

        this.morphCalc(this.m_disRotV, this.disScale);
        this.m_pipeEntity.reinitialize();
        this.m_pipeEntity.updateMeshToGpu();
    }
    getEntity(): Pipe3DEntity {
        return this.m_pipeEntity;
    }

    private morphCalc(rotV: Vector3D, dScale: number): void {

        this.m_pipeMesh.geometry.copyFrom(this.m_pipeGeometry);

        this.m_rotV.copyFrom(rotV);
        this.m_rotV.z = 0.0;
        this.m_scaleV.setXYZ(1.0, 1.0, 1.0);
        let mat4A: Matrix4 = this.m_mat4A;
        let total: number = this.m_latitudeNum;
        let factor: number = 1.0 - MathConst.Clamp( this.m_bendIndex / total, 0.0, 1.0);
        if(factor < 0.1) factor = 0.1;
        factor *= factor;

        for (let i: number = 0; i <= total; ++i) {

            mat4A.identity();
            mat4A.setScaleXYZ(this.m_scaleV.x, this.m_scaleV.y, this.m_scaleV.z);
            this.m_scaleV.x += dScale;
            this.m_scaleV.z += dScale;

            if(i > this.m_bendIndex) {
                mat4A.appendRotationZ(this.m_rotV.z);
                this.m_rotV.z += rotV.z * factor;
            }
            mat4A.appendRotationY(this.m_rotV.y);

            this.m_pipeEntity.transformCircleAt(i, mat4A);
        }
    }

    morph(): void {
        
        if (this.m_pipeEntity.isInRenderer() && Math.abs(this.disRotV.z) > 0.002) {
            let factor: number = Math.sin(this.morphTime);
            // if(Math.abs(factor) < 0.001) {
            //     //this.disRotV.y = Math.random() * 6.28;
            //     this.disRotV.z = 0.20 * Math.random() - 0.10;
            // }
            this.m_disRotV.copyFrom(this.disRotV);
            this.m_disRotV.z *= factor;
            this.morphCalc(this.m_disRotV, this.disScale);
            this.m_pipeEntity.reinitialize();
            this.m_pipeEntity.updateMeshToGpu();
        }
        this.morphTime += 0.02;
    }

}
export { MorphPipeObject };
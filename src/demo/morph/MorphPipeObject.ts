
import Vector3D from "../../vox/math/Vector3D";
import Matrix4 from "../../vox/math/Matrix4";

import Pipe3DEntity from "../../vox/entity/Pipe3DEntity";
import TextureProxy from "../../vox/texture/TextureProxy";

import PipeGeometry from "../../voxmesh/geometry/primitive/PipeGeometry";
import Pipe3DMesh from "../../vox/mesh/Pipe3DMesh";

class MorphPipeObject {

    private m_pipeEntity: Pipe3DEntity = null;    
    private m_pipeMesh: Pipe3DMesh = null;
    private m_pipeGeometry: PipeGeometry = null;
    private m_latitudeNum: number = 2;

    constructor(radius: number, height: number, longitudeNum: number, latitudeNum: number, texList: TextureProxy[] = null) {
        this.initialize(radius, height, longitudeNum, latitudeNum, texList);
    }
    private initialize(radius: number, height: number, longitudeNum: number, latitudeNum: number, texList: TextureProxy[]): void {

        this.m_latitudeNum = latitudeNum;
        this.m_pipeEntity = new Pipe3DEntity();
        this.m_pipeEntity.showDoubleFace();
        this.m_pipeEntity.initialize(radius, height, longitudeNum, latitudeNum, texList, 1, 0.0);
        this.m_pipeMesh = this.m_pipeEntity.getMesh() as Pipe3DMesh;
        this.m_pipeGeometry = this.m_pipeMesh.geometry.clone() as PipeGeometry;
        
        this.morphCalc(0.0, this.disScale);
        this.m_pipeEntity.reinitialize();
        this.m_pipeEntity.updateMeshToGpu();
    }
    getEntity(): Pipe3DEntity {
        return this.m_pipeEntity;
    }
    
    private m_rotV: Vector3D = new Vector3D();
    private m_scaleV: Vector3D = new Vector3D(1.0, 1.0, 1.0);
    private m_mat4: Matrix4 = new Matrix4();

    disRadius: number = 0.06;
    disScale: number = -0.05;
    morphTime: number = 0.0;

    private morphCalc(dRadius: number, dScale: number): void {

        this.m_pipeMesh.geometry.copyFrom( this.m_pipeGeometry );

        this.m_rotV.setXYZ(0.0, 0.0, 0.0);
        this.m_rotV.z += dRadius;
        this.m_scaleV.setXYZ(1.0, 1.0, 1.0);
        let mat4: Matrix4 = this.m_mat4;
        let total: number = this.m_latitudeNum + 1;
        for (let i: number = 1; i < total; ++i) {
            mat4.identity();
            mat4.setScaleXYZ(this.m_scaleV.x, this.m_scaleV.y, this.m_scaleV.z);
            mat4.setRotationEulerAngle(this.m_rotV.x, this.m_rotV.y, this.m_rotV.z);
            this.m_scaleV.x += dScale;
            this.m_scaleV.z += dScale;
            this.m_rotV.z += dRadius;
            this.m_pipeEntity.transformCircleAt(i, mat4);
        }
    }

    morph(): void {
        
        if(this.m_pipeEntity.isInRenderer()) {
            let factor: number = Math.sin(this.morphTime);
            this.morphCalc(this.disRadius * factor, this.disScale);
            this.m_pipeEntity.reinitialize();
            this.m_pipeEntity.updateMeshToGpu();            
        }
        this.morphTime += 0.02;
    }

}
export {MorphPipeObject};
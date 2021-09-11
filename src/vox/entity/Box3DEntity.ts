/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import Matrix4 from "../../vox/math/Matrix4";
import ROTransform from "../../vox/display/ROTransform";
import RendererState from "../../vox/render/RendererState";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import MaterialBase from '../../vox/material/MaterialBase';
import Default3DMaterial from "../../vox/material/mcase/Default3DMaterial";
import TextureProxy from "../../vox/texture/TextureProxy";
import { VtxNormalType } from "../../vox/mesh/VtxBufConst";
import Box3DMesh from "../../vox/mesh/Box3DMesh";

export default class Box3DEntity extends DisplayEntity {
    
    private m_normalType: number = VtxNormalType.FLAT;
    private m_minV: Vector3D = null;
    private m_maxV: Vector3D = null;
    private m_transMatrix: Matrix4 = null;
    private m_currMesh: Box3DMesh = null;

    normalScale: number = 1.0;
    // uvPartsNumber value is 4 or 6
    uvPartsNumber: number = 0;
    constructor(transform: ROTransform = null) {
        super(transform);
    }
    setVtxTransformMatrix(matrix: Matrix4): void {
        this.m_transMatrix = matrix;
    }
    useFlatNormal(): void {
        this.m_normalType = VtxNormalType.FLAT;
    }
    useGourandNormal(): void {
        this.m_normalType = VtxNormalType.GOURAND;
    }
    private createMaterial(texList: TextureProxy[]): void {
        if (this.getMaterial() == null) {
            let cm: Default3DMaterial = new Default3DMaterial();
            cm.setTextureList(texList);
            this.setMaterial(cm);
        }
        else {
            this.getMaterial().setTextureList(texList);
        }
    }
    showBackFace(): void {
        this.setRenderState(RendererState.BACK_CULLFACE_NORMAL_STATE);
    }
    showFrontFace(): void {
        this.setRenderState(RendererState.FRONT_CULLFACE_NORMAL_STATE);
    }
    showAllFace(): void {
        this.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
    }
    scaleUVFaceAt(faceI: number, u: number, v: number, du: number, dv: number): void {
        let mesh: Box3DMesh = this.getMesh() as Box3DMesh;
        if (mesh != null) {
            mesh.scaleUVFaceAt(faceI, u, v, du, dv);
        }
    }
    scaleUVSFaceAt(faceI: number, uvsLen8: Float32Array): void {
        let mesh: Box3DMesh = this.getMesh() as Box3DMesh;
        if (mesh != null) {
            mesh.setFaceUVSAt(faceI, uvsLen8);
        }
    }
    reinitializeMesh(): void {
        if (this.m_currMesh != null) {
            this.m_currMesh.reinitialize();
        }
    }
    /**
     * initialize a box geometry data and texture data
     * @param minV the min position of the box
     * @param maxV the max position of the box
     * @param texList  TextureProxy instance list
     */
    initialize(minV: Vector3D, maxV: Vector3D, texList: TextureProxy[] = null): void {
        this.m_minV = minV;
        this.m_maxV = maxV;
        this.createMaterial(texList);
        this.activeDisplay();
    }
    /**
     * initialize a box(geometry data and texture data) to a cube with the cube size value
     * @param cubeSize  cube size value
     * @param texList  TextureProxy instance list
     */
    initializeCube(cubeSize: number, texList: TextureProxy[] = null): void {
        cubeSize *= 0.5;
        this.m_minV = new Vector3D(-cubeSize, -cubeSize, -cubeSize);
        this.m_maxV = new Vector3D(cubeSize, cubeSize, cubeSize);
        this.createMaterial(texList);
        this.activeDisplay();
    }
    initializeSizeXYZ(widthSize: number, heightSize: number, longSize: number, texList: TextureProxy[] = null): void {
        this.m_minV = new Vector3D(-widthSize * 0.5, -heightSize * 0.5, -longSize * 0.5);
        this.m_maxV = new Vector3D(widthSize * 0.5, heightSize * 0.5, longSize * 0.5);
        this.createMaterial(texList);
        this.activeDisplay();
    }

    protected __activeMesh(material: MaterialBase): void {
        this.m_currMesh = this.getMesh() as Box3DMesh;
        if (this.m_currMesh == null) {
            this.m_currMesh = new Box3DMesh();
        }
        if (this.m_currMesh != null) {
            let mesh: Box3DMesh = this.m_currMesh;
            if (this.m_transMatrix != null) {
                mesh.setTransformMatrix(this.m_transMatrix);
            }
            mesh.normalType = this.m_normalType;
            mesh.normalScale = this.normalScale;
            mesh.vbWholeDataEnabled = this.vbWholeDataEnabled;
            mesh.uvPartsNumber = this.uvPartsNumber;
            mesh.setBufSortFormat(material.getBufSortFormat());
            mesh.initialize(this.m_minV, this.m_maxV);
            this.m_minV = null;
            this.m_maxV = null;
            this.setMesh(mesh);
            mesh.setTransformMatrix(null);
        }
        this.m_transMatrix = null;
    }
    protected updateMesh(): void {
        this.m_currMesh = this.getMesh() as Box3DMesh;
    }

    setFaceUVSAt(i: number, uvslen8: Float32Array, offset: number = 0): void {
        if (this.m_currMesh != null) {
            this.m_currMesh.setFaceUVSAt(i, uvslen8, offset);
        }
    }
    transformFaceAt(i: number, mat4: Matrix4): void {
        if (this.m_currMesh != null) {
            this.m_currMesh.transformFaceAt(i, mat4);
        }
    }
    getFaceCenterAt(i: number, outV: Vector3D): void {
        if (this.m_currMesh != null) {
            this.m_currMesh.getFaceCenterAt(i, outV);
        }
    }
    toString(): string {
        return "[Box3DEntity(uid = " + this.getUid() + ", rseFlag = " + this.__$rseFlag + ")";
    }
}
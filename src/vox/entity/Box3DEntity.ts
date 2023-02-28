/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import Matrix4 from "../../vox/math/Matrix4";
import IROTransform from "../../vox/display/IROTransform";
import RendererState from "../../vox/render/RendererState";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import Default3DMaterial from "../../vox/material/mcase/Default3DMaterial";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";
import { VtxNormalType } from "../../vox/mesh/VtxBufConst";
import Box3DMesh from "../../vox/mesh/Box3DMesh";
import Color4 from "../material/Color4";

export default class Box3DEntity extends DisplayEntity {

    private m_normalType: number = VtxNormalType.FLAT;
    private m_minV: Vector3D = new Vector3D(-50.0, -50.0, -50.0);
    private m_maxV: Vector3D = new Vector3D(50.0, 50.0, 50.0);
    private m_transMatrix: Matrix4 = null;
    private m_currMesh: Box3DMesh = null;
    private m_initFlag: boolean = true;
    vtxColor: Color4 = null;
    uScale: number = 1.0;
    vScale: number = 1.0;
    normalScale: number = 1.0;
    normalEnabled: boolean = false;
    // uvPartsNumber value is 4 or 6
    uvPartsNumber: number = 0;
    wireframe: boolean = false;
    shape: boolean = true;
    constructor(transform: IROTransform = null) {
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
    private createMaterial(texList: IRenderTexture[]): void {
        if (this.getMaterial() == null) {
            let cm: Default3DMaterial = new Default3DMaterial();
            cm.normalEnabled = this.normalEnabled;
            cm.vertColorEnabled = this.vtxColor != null;
            cm.setTextureList(texList);
            this.setMaterial(cm);
        }
        else if (texList != null && this.getMaterial().getTextureTotal() < 1) {
            this.getMaterial().setTextureList(texList);
        }
    }

    private initializeThis(texList: IRenderTexture[]): void {

        if (this.m_initFlag) {
            this.createMaterial(texList);
            this.activeDisplay();
        }
        else {
            let mesh: Box3DMesh = this.getMesh() as Box3DMesh;
            if (mesh != null) {
                mesh.initialize(this.m_minV, this.m_maxV);
            }
        }
        this.m_initFlag = false;
    }
    showBackFace(): void {
        this.setRenderState(RendererState.BACK_CULLFACE_NORMAL_STATE);
    }
    showFrontFace(): void {
        this.setRenderState(RendererState.FRONT_CULLFACE_NORMAL_STATE);
    }
    showDoubleFace(): void {
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
     * @param texList  IRenderTexture instance list
     */
    initialize(minV: Vector3D, maxV: Vector3D, texList: IRenderTexture[] = null): void {
        if (minV != null) this.m_minV.copyFrom(minV);
        if (maxV != null) this.m_maxV.copyFrom(maxV);

        this.initializeThis(texList);
    }
    /**
     * initialize a box(geometry data and texture data) to a cube with the cube size value
     * @param cubeSize  cube size value
     * @param texList  IRenderTexture instance list
     */
    initializeCube(cubeSize: number, texList: IRenderTexture[] = null): void {

        cubeSize *= 0.5;
        this.m_minV.setXYZ(-cubeSize, -cubeSize, -cubeSize);
        this.m_maxV.setXYZ(cubeSize, cubeSize, cubeSize);

        this.initializeThis(texList);
    }
    initializeSizeXYZ(widthSize: number, heightSize: number, longSize: number, texList: IRenderTexture[] = null): void {

        this.m_minV.setXYZ(-widthSize * 0.5, -heightSize * 0.5, -longSize * 0.5);
        this.m_maxV.setXYZ(widthSize * 0.5, heightSize * 0.5, longSize * 0.5);

        this.initializeThis(texList);
    }

    protected __activeMesh(material: IRenderMaterial): void {
        this.m_currMesh = this.getMesh() as Box3DMesh;
        if (this.m_currMesh == null) {
            this.m_currMesh = new Box3DMesh();
        }
        if (this.m_currMesh != null) {
            let mesh: Box3DMesh = this.m_currMesh;
            if (this.m_transMatrix != null) {
                mesh.setTransformMatrix(this.m_transMatrix);
            }
            mesh.vtxColor = this.vtxColor;
            mesh.uScale = this.uScale;
            mesh.vScale = this.vScale;
            mesh.wireframe = this.wireframe;
            mesh.shape = this.shape;
            mesh.normalType = this.m_normalType;
            mesh.normalScale = this.normalScale;
            mesh.vbWholeDataEnabled = this.vbWholeDataEnabled;
            mesh.uvPartsNumber = this.uvPartsNumber;
            mesh.setVtxBufRenderData(material);
            mesh.initialize(this.m_minV, this.m_maxV);
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
    destroy(): void {
        super.destroy();
        this.vtxColor = null;
        this.m_currMesh = null;
        this.m_initFlag = true;
    }
}
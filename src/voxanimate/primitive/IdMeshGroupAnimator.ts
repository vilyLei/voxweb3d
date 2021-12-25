/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import MathConst from "../../vox/math/MathConst";
import Vector3D from "../../vox/math/Vector3D";
import Matrix4 from "../../vox/math/Matrix4";
import ROTransform from "../../vox/display/ROTransform";
import RendererState from "../../vox/render/RendererState";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import MaterialBase from '../../vox/material/MaterialBase';
import VSTexturePosIdMaterial from "../../voxanimate/material/VSTexturePosIdMaterial";
import { TextureConst } from "../../vox/texture/TextureConst";
import TextureProxy from "../../vox/texture/TextureProxy";
import FloatTextureProxy from "../../vox/texture/FloatTextureProxy";
import TextureBlock from "../../vox/texture/TextureBlock";
import { IdGroupMesh } from "../../voxanimate/mesh/IdGroupMesh";
import MeshBase from "../../vox/mesh/MeshBase";

class IdMeshGroupAnimator extends DisplayEntity {

    private m_groupSrcMesh: MeshBase = null;
    private m_groupPositions: Vector3D[] = null;
    private m_transMatrix: Matrix4 = null;

    private m_posDataTex: FloatTextureProxy = null;
    private m_texSize: number = 64;
    private m_posTotal: number = 64;
    private m_texData: Float32Array = null;
    private m_idMaterial: VSTexturePosIdMaterial = null;
    private m_idDistance: number = 300;
    private m_unitTotal: number = 0;
    private m_idStep: number = 10;

    constructor(transform: ROTransform = null) {
        super(transform);
    }
    setGroupSrcMesh(srcMesh: MeshBase): void {
        this.m_groupSrcMesh = srcMesh;
    }
    getGroupSrcMesh(): MeshBase {
        return this.m_groupSrcMesh;
    }
    createDataTexture(textureBlock: TextureBlock, positionsTotal: number): void {
        if (positionsTotal > 0) {
            this.m_posTotal = positionsTotal;
            this.m_texSize = Math.sqrt(positionsTotal);
            this.m_texSize = MathConst.GetNearestCeilPow2(Math.sqrt(positionsTotal));
            if (this.m_texSize < 8) this.m_texSize = 8;

            let texSize: number = this.m_texSize;
            let posTex: FloatTextureProxy = textureBlock.createFloatTex2D(texSize, texSize);
            posTex.setWrap(TextureConst.WRAP_CLAMP_TO_EDGE);
            posTex.mipmapEnabled = false;
            posTex.minFilter = TextureConst.NEAREST;
            posTex.magFilter = TextureConst.NEAREST;
            let fs: Float32Array = new Float32Array(texSize * texSize * 4);
            posTex.setDataFromBytes(fs, 0, texSize, texSize);
            this.m_posDataTex = posTex;
            this.m_texData = fs;
        }
    }
    setPosData(posDataTex: FloatTextureProxy, posData: Float32Array, posTotal: number): void {
        if (posDataTex != null && posData != null) {
            this.m_texSize = posDataTex.getWidth();
            this.m_posTotal = posTotal;
            this.m_posDataTex = posDataTex;
            this.m_texData = posData;
        }
    }
    getPosDataTexture(): FloatTextureProxy {
        return this.m_posDataTex;
    }
    getPosData(): Float32Array {
        return this.m_texData;
    }
    getPosTotal(): number {
        return this.m_posTotal;
    }
    getDataTextureSize(): number {
        return this.m_texSize;
    }
    getDataTextureArea(): number {
        return this.m_texSize * this.m_texSize;
    }
    setPosAt(i: number, pos: Vector3D): void {
        i *= 4;
        this.m_texData[i++] = pos.x;
        this.m_texData[i++] = pos.y;
        this.m_texData[i] = pos.z;
    }
    getPosAt(i: number, pos: Vector3D): void {
        i *= 4;
        pos.x = this.m_texData[i++];
        pos.y = this.m_texData[i++];
        pos.y = this.m_texData[i];
    }
    moveIdDistanceOffset(distanceOffset: number): void {
        this.m_idDistance += distanceOffset;
        this.m_idMaterial.setMoveDistance(this.m_idDistance);
    }
    moveIdDistance(distance: number): void {
        this.m_idDistance = distance;
        this.m_idMaterial.setMoveDistance(distance);
    }
    setVtxTransformMatrix(matrix: Matrix4): void {
        this.m_transMatrix = matrix;
    }
    private createMaterial(texList: TextureProxy[]): void {
        
        let material = this.getMaterial() as VSTexturePosIdMaterial;
        if (material == null) {
            material = new VSTexturePosIdMaterial();
            material.setTexSize(this.m_texSize);
            material.setPositionsTotal(this.m_posTotal);
            material.setTextureList(texList);
            this.setMaterial(material);
        }
        else if(material.getTextureTotal() < 1){
            material.setTextureList(texList);
        }
        this.m_idMaterial = material;
    }
    showBackFace(): void {
        this.setRenderState(RendererState.FRONT_CULLFACE_NORMAL_STATE);
    }
    showFrontFace(): void {
        this.setRenderState(RendererState.NORMAL_STATE);
    }
    setGroupPositions(groupPositions: Vector3D[] = null): void {
        this.m_groupPositions = groupPositions.slice();
    }
    /**
     * initialize a box geometry data and texture data
     * @param minV the min position of the box
     * @param maxV the max position of the box
     * @param texList  TextureProxy instance list
     */
    initialize(unitTotal: number = 1, idStep: number = 10, texList: TextureProxy[] = null): void {
        if (texList == null) {
            texList = [this.m_posDataTex];
        }
        let len: number = texList.length;
        let texArr: TextureProxy[] = [];
        texArr[0] = this.m_posDataTex;
        let i: number = texList[0] != this.m_posDataTex ? 0 : 1;
        for (; i < len; ++i) {
            texArr.push(texList[i]);
        }
        texList = texArr;

        this.m_unitTotal = unitTotal;
        this.m_idStep = idStep;
        this.createMaterial(texList);
        this.activeDisplay();
    }
    protected __activeMesh(material: MaterialBase): void {
        let mesh: IdGroupMesh = null;
        if (this.getMesh() == null) {
            mesh = new IdGroupMesh();
        }
        else if (this.getMesh().getIVS() == null) {
            mesh = this.getMesh() as IdGroupMesh;
        }
        if (mesh != null) {

            mesh.srcMesh = this.m_groupSrcMesh;
            if (this.m_transMatrix != null) {
                mesh.setTransformMatrix(this.m_transMatrix);
            }
            mesh.setBufSortFormat(material.getBufSortFormat());
            mesh.initialize(this.m_unitTotal, this.m_idStep, this.m_groupPositions);
            this.setMesh(mesh);
            mesh.setTransformMatrix(null);
        }
        this.m_transMatrix = null;
    }
    destroy(): void {
        super.destroy();
        this.m_groupSrcMesh = null;
    }
}
export {IdMeshGroupAnimator}
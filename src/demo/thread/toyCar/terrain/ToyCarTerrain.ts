import Box3DEntity from "../../../../vox/entity/Box3DEntity";
import RendererScene from "../../../../vox/scene/RendererScene";
import Vector3D from "../../../../vox/math/Vector3D";
import Line3DEntity from "../../../../vox/entity/Line3DEntity";
import { TerrainData } from "./TerrainData";
import Axis3DEntity from "../../../../vox/entity/Axis3DEntity";
import { GeometryMerger } from "../../../../vox/mesh/GeometryMerger";
import { CommonMaterialContext } from "../../../../materialLab/base/CommonMaterialContext";
import DataMesh from "../../../../vox/mesh/DataMesh";
import DisplayEntity from "../../../../vox/entity/DisplayEntity";
import MaterialBase from "../../../../vox/material/MaterialBase";
import Color4 from "../../../../vox/material/Color4";
import Default3DMaterial from "../../../../vox/material/mcase/Default3DMaterial";

class ToyCarTerrain {

    constructor() { }

    private m_rscene: RendererScene = null;
    private m_materialCtx: CommonMaterialContext = null;
    private m_terrainData: TerrainData;

    initialize(scene: RendererScene, materialCtx: CommonMaterialContext, terrainData: TerrainData): void {
        if (this.m_rscene == null) {
            this.m_rscene = scene;
            this.m_materialCtx = materialCtx;
            this.m_terrainData = terrainData;

            this.initTerrain();
        }
    }

    private initTerrain(): void {

        let size: number = this.m_terrainData.gridSize;
        let minV = new Vector3D(-size * 0.5, 0, -size * 0.5);
        let maxV = new Vector3D(size * 0.5, size, size * 0.5);
        let color: Color4 = new Color4();
        let srcBox: Box3DEntity = new Box3DEntity();
        srcBox.vtxColor = color;
        srcBox.initialize(minV, maxV, [this.m_materialCtx.getTextureByUrl("static/assets/default.jpg")]);

        let obsMeshMerger: GeometryMerger = new GeometryMerger();
        let meshMerger1: GeometryMerger = new GeometryMerger();
        let meshMerger2: GeometryMerger = new GeometryMerger();

        ///*
        let tex0 = this.m_materialCtx.getTextureByUrl("static/assets/box_wood01.jpg");
        let tex1 = this.m_materialCtx.getTextureByUrl("static/assets/moss_01.jpg");
        let tex2 = this.m_materialCtx.getTextureByUrl("static/assets/moss_03.jpg");

        let obsMaterial: Default3DMaterial = new Default3DMaterial();
        obsMaterial.vertColorEnabled = true;
        obsMaterial.setTextureList([tex0]);
        obsMaterial.initializeByCodeBuf();

        let material1: Default3DMaterial = new Default3DMaterial();
        material1.vertColorEnabled = true;
        material1.setTextureList([tex1]);
        material1.initializeByCodeBuf();

        let material2: Default3DMaterial = new Default3DMaterial();
        material2.vertColorEnabled = true;
        material2.setTextureList([tex2]);
        material2.initializeByCodeBuf();

        let rn: number = this.m_terrainData.rn;
        let cn: number = this.m_terrainData.cn;
        let pv: Vector3D;
        for (let r: number = 0; r < rn; r++) {
            for (let c: number = 0; c < cn; c++) {
                color.setRGB3f(0.0 + 1.5 * c / cn, 1.0, 0.0 + 1.5 * r / rn);
                pv = this.m_terrainData.getGridPositionByRC(r, c);
                let flag: number = this.m_terrainData.getGridStatusByRC(r, c);
                let scale: number = flag > 0 ? 0.3 : 0.2;
                let box: Box3DEntity = new Box3DEntity();
                box.vtxColor = color;
                if (flag < 1) {
                    flag = Math.random() > 0.5 ? -1 : -2;
                }
                if (flag > 0) {
                    box.setXYZ(pv.x, pv.y + 0.8 * size * 0.2, pv.z);
                    box.setMaterial(obsMaterial);
                    box.initialize(minV, maxV, [tex0]);
                    box.setScaleXYZ(1.0, scale, 1.0);
                    obsMeshMerger.addEntity(box);
                }
                else {
                    box.setPosition(pv);
                    if (flag == -1) {
                        box.setMaterial(material1);
                        box.initialize(minV, maxV, [tex1]);
                        box.setScaleXYZ(1.0, scale, 1.0);
                        meshMerger1.addEntity(box);
                    }
                    else if (flag == -2) {
                        box.setMaterial(material2);
                        box.initialize(minV, maxV, [tex2]);
                        box.setScaleXYZ(1.0, scale, 1.0);
                        meshMerger2.addEntity(box);
                    }
                }
            }
        }
        //*/
        this.addMergedEntity(obsMeshMerger, obsMaterial);
        this.addMergedEntity(meshMerger1, material1);
        this.addMergedEntity(meshMerger2, material2);
    }
    addMergedEntity(meshMerger: GeometryMerger, material: MaterialBase): void {

        meshMerger.merger();
        let dataMesh: DataMesh = new DataMesh();
        dataMesh.setBufSortFormat(material.getBufSortFormat());
        dataMesh.initializeFromGeometry(meshMerger);

        let entity: DisplayEntity = new DisplayEntity();
        entity.setMaterial(material);
        entity.setMesh(dataMesh);
        this.m_rscene.addEntity(entity, 1);
    }
    run(): void {

    }
}
export { ToyCarTerrain }

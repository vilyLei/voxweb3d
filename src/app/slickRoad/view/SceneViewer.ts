import EngineBase from "../../../vox/engine/EngineBase";
import Plane3DEntity from "../../../vox/entity/Plane3DEntity";
import { VRDEntityBuilder } from "./VRDEntityBuilder";
import { RoadSceneData, RoadSegment, RoadSegmentMesh, RoadModel } from "../io/RoadSceneFileParser";
import DisplayEntity from "../../../vox/entity/DisplayEntity";

import LambertLightMaterial from "../../../vox/material/mcase/LambertLightMaterial";
import { MaterialContext } from "../../../materialLab/base/MaterialContext";
import Box3DEntity from "../../../vox/entity/Box3DEntity";
import Vector3D from "../../../vox/math/Vector3D";
import { SceneDataLoader } from "./SceneDataLoader";
import { ViewerTexSystem } from "./ViewerTexSystem";
import Line3DEntity from "../../../vox/entity/Line3DEntity";
import Axis3DEntity from "../../../vox/entity/Axis3DEntity";
import MaterialBase from "../../../vox/material/MaterialBase";
import Default3DMaterial from "../../../vox/material/mcase/Default3DMaterial";

class SceneViewer {

    constructor() { }

    private m_engine: EngineBase = null;
    private m_entityManager: VRDEntityBuilder = new VRDEntityBuilder();
    private m_materialCtx: MaterialContext = new MaterialContext();

    private m_rotV: Vector3D = new Vector3D(Math.random() * 360.0, Math.random() * 360.0, Math.random() * 360.0);
    private m_spdV: Vector3D = new Vector3D(Math.random() * 0.6 - 0.3, Math.random() * 0.6 - 0.3, Math.random() * 0.6 - 0.3);
    private m_target: DisplayEntity = null;

    private m_line: Line3DEntity = null;
    private m_scDataLoader: SceneDataLoader = new SceneDataLoader();
    private m_texSystem: ViewerTexSystem = new ViewerTexSystem();
    initialize(engine: EngineBase): void {

        console.log("SceneViewer::initialize()......");

        if (this.m_engine == null) {

            this.m_engine = engine;
            this.m_materialCtx.initialize(this.m_engine.rscene);
            this.m_texSystem.initialize(this.m_engine, this.m_materialCtx);

            ///*
            let material: LambertLightMaterial;
            material = new LambertLightMaterial();
            this.m_texSystem.useLambertMaterial(material, "box", true, false, false, true);
            material.fogEnabled = true;
            let box: Box3DEntity = new Box3DEntity();
            box.setMaterial(material);
            box.initializeCube(100);
            box.setXYZ(-100, 150, 0);
            box.setRotationXYZ(this.m_rotV.x, this.m_rotV.y, this.m_rotV.z);
            //plane.setScaleXYZ(3.0,3.0,3.0);
            this.m_engine.rscene.addEntity(box);
            this.m_target = box;

            material = new LambertLightMaterial();
            this.m_texSystem.useLambertMaterial(material, "box", true, false, true, true);
            material.fogEnabled = true;
            let plane: Plane3DEntity = new Plane3DEntity();
            plane.setMaterial(material);
            plane.initializeXOZ(-500.0, -500.0, 1000.0, 1000.0);
            plane.setXYZ(0, -150, 0);
            plane.setScaleXYZ(2.0, 2.0, 2.0);
            this.m_engine.rscene.addEntity(plane);

            this.initEnvBox();
            //*/
            // let axis = new Axis3DEntity();
            // axis.initialize(100);
            // this.m_engine.rscene.addEntity(axis);

            this.loadSceneData();
        }
    }

    private initEnvBox(): void {

        let material: LambertLightMaterial = new LambertLightMaterial();
        this.m_texSystem.useLambertMaterial(material, "box", false, false);
        material.fogEnabled = true;

        let envBox: Box3DEntity = new Box3DEntity();
        envBox.normalScale = -1.0;
        envBox.setMaterial(material);
        envBox.showFrontFace();
        envBox.initializeCube(4000.0);
        this.m_engine.rscene.addEntity(envBox, 1);
    }
    private loadSceneDataBURL(url: string): void {
        this.m_scDataLoader.load(url, (roadData: RoadSceneData): void => {
            this.createEntities(roadData);
        })
    }
    private loadSceneData(): void {
        //this.loadSceneDataBURL("static/assets/scene/vrdScene_02.vrd");
        this.loadSceneDataBURL("static/assets/scene/vrdScene_hightway.vrd");
    }
    private createEntities(roadData: RoadSceneData): void {

        let roadList: RoadModel[] = roadData.roadList;
        if (roadList != null) {

            let road: RoadModel;
            for (let i: number = 0; i < roadList.length; ++i) {
                road = roadList[i];
                if (road.segmentList != null && road.segmentList.length > 0) {
                    this.createRoadEntities(road);
                }
                else {
                    this.createRoadCurveLine(road);
                }
            }
        }
    }
    private createRoadCurveLine(road: RoadModel): void {

        let pls = new Line3DEntity();
        pls.dynColorEnabled = true;
        pls.initializeByPosList(road.curvePosList);
        this.m_engine.rscene.addEntity(pls);
    }

    getLambertMaterials(total: number): MaterialBase[] {

        let texNSList: string[] = ["fabric_01", "brick_n_256"];
        let materials: LambertLightMaterial[] = [new LambertLightMaterial(), new LambertLightMaterial()];
        for (let k: number = 0; k < materials.length; ++k) {
            this.m_texSystem.useLambertMaterial(materials[k], texNSList[k], true, false, true, true);
            materials[k].fogEnabled = true;
            materials[k].initializeByCodeBuf(true);
        }
        return materials;
    }
    getDefaultMaterials(total: number): MaterialBase[] {

        let texNSList: string[] = [
            "static/assets/roadSurface04.jpg",
            "static/assets/brick_d.jpg"
            ];
        let materials: Default3DMaterial[] = [new Default3DMaterial(), new Default3DMaterial()];
        for (let k: number = 0; k < materials.length; ++k) {
            materials[k].setTextureList([this.m_texSystem.getImageTexByUrl(texNSList[k])]);
            materials[k].initializeByCodeBuf(true);
        }
        return materials;
    }
    private createRoadEntities(road: RoadModel): void {

        let entities: DisplayEntity[] = this.m_entityManager.createRoadEntities(
            road,
            (total: number): MaterialBase[] => {
                //return this.getLambertMaterials(total);
                return this.getDefaultMaterials(total);
            });
        for (let k: number = 0; k < entities.length; ++k) {
            this.m_engine.rscene.addEntity(entities[k]);
        }

    }
    run(): void {
        // if (this.m_target != null) {
        //     this.m_rotV.addBy(this.m_spdV);
        //     this.m_target.setRotationXYZ(this.m_rotV.x, this.m_rotV.y, this.m_rotV.z);
        //     this.m_target.update();
        // }
        this.m_materialCtx.run();
    }
}

export { SceneViewer };
import EngineBase from "../../../vox/engine/EngineBase";
import Plane3DEntity from "../../../vox/entity/Plane3DEntity";
import DisplayEntity from "../../../vox/entity/DisplayEntity";

import LambertLightMaterial from "../../../vox/material/mcase/LambertLightMaterial";
import { DebugMaterialContext } from "../../../materialLab/base/DebugMaterialContext";
import Box3DEntity from "../../../vox/entity/Box3DEntity";
import Vector3D from "../../../vox/math/Vector3D";

import { SceneDataLoader } from "./SceneDataLoader";
import { ViewerTexSystem } from "./ViewerTexSystem";
import { VRDEntityBuilder } from "./VRDEntityBuilder";
import { RoadSceneData, RoadSegment, RoadSegmentMesh, RoadModel } from "../io/RoadSceneFileParser";

import Line3DEntity from "../../../vox/entity/Line3DEntity";
import Axis3DEntity from "../../../vox/entity/Axis3DEntity";
import MaterialBase from "../../../vox/material/MaterialBase";
import Default3DMaterial from "../../../vox/material/mcase/Default3DMaterial";
import AABB from "../../../vox/geom/AABB";

class SceneViewer {

    constructor() { }

    private m_engine: EngineBase = null;
    private m_materialCtx: DebugMaterialContext = new DebugMaterialContext();

    private m_rotV: Vector3D = new Vector3D(Math.random() * 360.0, Math.random() * 360.0, Math.random() * 360.0);
    private m_spdV: Vector3D = new Vector3D(Math.random() * 0.6 - 0.3, Math.random() * 0.6 - 0.3, Math.random() * 0.6 - 0.3);
    private m_target: DisplayEntity = null;

    private m_line: Line3DEntity = null;
    private m_scDataLoader: SceneDataLoader = new SceneDataLoader();
    private m_entityManager: VRDEntityBuilder = new VRDEntityBuilder();
    private m_texSystem: ViewerTexSystem = new ViewerTexSystem();
    private m_dropUrl: string = "";

    initialize(engine: EngineBase): void {

        console.log("SlickRoad SceneViewer::initialize()......");

        if (this.m_engine == null) {

            this.m_engine = engine;
            this.m_materialCtx.initialize(this.m_engine.rscene);
            this.m_texSystem.initialize(this.m_engine, this.m_materialCtx);

            let canvas: HTMLCanvasElement = this.m_engine.rscene.getCanvas()
            // canvas.addEventListener('drop', (e) => {
            //     console.log("canvas drop evt.", e);
            //     //dropCall
            // }, false);
            
            // --------------------------------------------- 阻止必要的行为 begin
            canvas.addEventListener("dragenter", (e) => {
                e.preventDefault();
                e.stopPropagation();
            }, false);

            canvas.addEventListener("dragover", (e) => {
                e.preventDefault();
                e.stopPropagation();
            }, false);

            canvas.addEventListener("dragleave", (e) => {
                e.preventDefault();
                e.stopPropagation();
            }, false);

            canvas.addEventListener("drop", (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("canvas drop evt.", e);
                this.receiveDropFile( e );
            }, false);
            // --------------------------------------------- 阻止必要的行为 end

            // document.addEventListener('drop', (e) => {
            //     console.log("document drop evt.");
            // }, false);
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
    private receiveDropFile(e: DragEvent): void {
        var df = e.dataTransfer;

        var dropFiles = [];

        if (df.items !== undefined) {
            // Chrome有items属性，对Chrome的单独处理
            for (var i = 0; i < df.items.length; i++) {
                var item = df.items[i];
                // 用webkitGetAsEntry禁止上传目录
                if (item.kind === "file" && item.webkitGetAsEntry().isFile) {
                    var file = item.getAsFile();
                    dropFiles.push(file);
                }
            }
        }
        console.log("dropFiles: ", dropFiles);
        if (dropFiles.length > 0) {
            const fileReader = new FileReader();
            // fileReader.readAsDataURL( dropFiles[0] )
            fileReader.readAsArrayBuffer(dropFiles[0]);
            fileReader.onload = (evt) => {
                //console.log("file: ", evt.target.result);
                // console.log("file: ", );
                this.rebuildRoad( <ArrayBuffer>fileReader.result );
            }
            fileReader.onerror = (evt) => {
                console.error("loadFile error, evt: ", evt);
            }
        }
    }
    private m_roadSegEntities: DisplayEntity[] = null;
    private rebuildRoad(dataBuf: ArrayBuffer): void {
        let sceneData = this.m_scDataLoader.createSceneData(dataBuf);
        this.createRoadDisplay( sceneData );
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
            this.createRoadDisplay(roadData);
        })
    }
    private loadSceneData(): void {
        this.loadSceneDataBURL("static/assets/scene/vrdScene_02.vrd");
        // this.loadSceneDataBURL("static/assets/scene/vrdScene_hightway.vrd");
    }
    private createRoadDisplay(roadData: RoadSceneData): void {

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
    private m_pls: Line3DEntity = null;

    private createRoadCurveLine(road: RoadModel): void {

        if(this.m_pls != null) {
            this.m_engine.rscene.removeEntity( this.m_pls );
            this.m_pls.destroy();
        }
        let pls = new Line3DEntity();
        pls.dynColorEnabled = true;
        pls.initializeByPosList(road.curvePosList);
        this.m_engine.rscene.addEntity(pls);
        this.m_pls = pls;
    }

    private createRoadEntities(road: RoadModel): void {
        let entities: DisplayEntity[] = this.m_roadSegEntities;
        if(entities != null) {
            for (let k: number = 0; k < entities.length; ++k) {
                this.m_engine.rscene.removeEntity( entities[k] );
                entities[k].destroy();
            }
        }
        entities = this.m_entityManager.createRoadEntities(
            road,
            (total: number): MaterialBase[] => {
                return this.getLambertMaterials(total);
                //return this.getDefaultMaterials(total);
            });
        this.m_roadSegEntities = entities;
        let aabb: AABB = new AABB();
        for (let k: number = 0; k < entities.length; ++k) {

            entities[k].update();
            this.m_engine.rscene.addEntity(entities[k]);

            if (k > 0) aabb.union(entities[k].getGlobalBounds());
            else aabb.copyFrom(entities[k].getGlobalBounds());
        }
        aabb.update();

        let cv = aabb.center;
        let offsetV: Vector3D = new Vector3D(-cv.x, -aabb.min.y + 50.0, -cv.z);
        let pos: Vector3D = new Vector3D();

        for (let k: number = 0; k < entities.length; ++k) {
            entities[k].offsetPosition(offsetV);
            entities[k].update();
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
}

export { SceneViewer };
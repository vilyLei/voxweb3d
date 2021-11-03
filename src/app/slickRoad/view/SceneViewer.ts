import BinaryLoader from "../../../vox/assets/BinaryLoader";
import EngineBase from "../../../vox/engine/EngineBase";
import Plane3DEntity from "../../../vox/entity/Plane3DEntity";
import { ViewerEntityManager } from "./ViewerEntityManager";
import { RoadSceneData, RoadSceneFileParser, RoadSegment, RoadSegmentMesh, RoadModel } from "../io/RoadSceneFileParser";
import TextureProxy from "../../../vox/texture/TextureProxy";
import DisplayEntity from "../../../vox/entity/DisplayEntity";

import Default3DMaterial from "../../../vox/material/mcase/Default3DMaterial";
import LambertLightMaterial from "../../../vox/material/mcase/LambertLightMaterial";
import { MaterialContext } from "../../../materialLab/base/MaterialContext";
import Box3DEntity from "../../../vox/entity/Box3DEntity";
import { TextureConst } from "../../../vox/texture/TextureConst";
import Vector3D from "../../../vox/math/Vector3D";

class SceneViewer {

    constructor() { }

    private m_engine: EngineBase = null;
    private m_entityManager: ViewerEntityManager = new ViewerEntityManager();
    private m_materialCtx: MaterialContext = new MaterialContext();
    private m_rotV: Vector3D = new Vector3D(Math.random() * 360.0, Math.random() * 360.0, Math.random() * 360.0);
    private m_spdV: Vector3D = new Vector3D(Math.random() * 0.6 - 0.3, Math.random() * 0.6 - 0.3, Math.random() * 0.6 - 0.3);
    private m_target: DisplayEntity = null;
    initialize(engine: EngineBase): void {

        console.log("SceneViewer::initialize()......");

        if (this.m_engine == null) {

            this.m_engine = engine;
            this.m_materialCtx.initialize(this.m_engine.rscene);
            this.m_entityManager.initialize(engine);
            let material: LambertLightMaterial;

            material = new LambertLightMaterial();
            this.useLambertMaterial(material, "box", true, false, false, true);
            material.fogEnabled = true;
            let box: Box3DEntity = new Box3DEntity();
            box.setMaterial(material);
            box.initializeCube(100);
            box.setRotationXYZ(this.m_rotV.x, this.m_rotV.y, this.m_rotV.z);
            //plane.setScaleXYZ(3.0,3.0,3.0);
            this.m_engine.rscene.addEntity(box);
            this.m_target = box;

            material = new LambertLightMaterial();
            this.useLambertMaterial(material, "box", true, false, true, true);
            material.fogEnabled = true;
            let plane: Plane3DEntity = new Plane3DEntity();
            plane.setMaterial(material);
            plane.initializeXOZ(-500.0, -500.0, 1000.0, 1000.0);
            plane.setXYZ(0, -150, 0);
            plane.setScaleXYZ(2.0, 2.0, 2.0);
            this.m_engine.rscene.addEntity(plane);


            this.loadSceneData();
            this.initEnvBox();
        }
    }

    private getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_engine.texLoader.getImageTexByUrl(purl, 0, false, false);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    private useLambertMaterial(material: LambertLightMaterial, ns: string, normalMapEnabled: boolean = true, displacementMap: boolean = true, shadowReceiveEnabled: boolean = false, aoMapEnabled: boolean = false): void {

        material.setMaterialPipeline(this.m_materialCtx.pipeline);

        material.diffuseMap = this.getImageTexByUrl("static/assets/disp/" + ns + "_COLOR.png");
        material.specularMap = this.getImageTexByUrl("static/assets/disp/" + ns + "_SPEC.png");
        if (normalMapEnabled) {
            material.normalMap = this.getImageTexByUrl("static/assets/disp/" + ns + "_NRM.png");
        }
        if (aoMapEnabled) {
            material.aoMap = this.getImageTexByUrl("static/assets/disp/" + ns + "_OCC.png");
        }
        if (displacementMap) {
            material.displacementMap = this.getImageTexByUrl("static/assets/disp/" + ns + "_DISP.png");
        }
        if (shadowReceiveEnabled) {
            material.shadowMap = this.m_materialCtx.vsmModule.getShadowMap();
        }
    }
    private initEnvBox(): void {

        let material: LambertLightMaterial = new LambertLightMaterial();
        this.useLambertMaterial(material, "box", false, false);
        material.fogEnabled = true;

        let envBox: Box3DEntity = new Box3DEntity();
        envBox.normalScale = -1.0;
        envBox.setMaterial(material);
        envBox.showFrontFace();
        envBox.initializeCube(4000.0);
        this.m_engine.rscene.addEntity(envBox);
    }
    private m_sceneDataParser: RoadSceneFileParser = new RoadSceneFileParser();
    private m_roadData: RoadSceneData = null;
    private loadSceneData(): void {
        let loader: BinaryLoader = new BinaryLoader();
        loader.uuid = "road_vrd";
        //loader.load("static/assets/scene/vrdScene.vrd", this);
        loader.load("static/assets/scene/vrdScene_02.vrd", this);
    }
    loaded(buffer: ArrayBuffer, uuid: string): void {
        console.log("loaded the road data.");
        this.m_sceneDataParser.parse(new Uint8Array(buffer));
        this.m_roadData = this.m_sceneDataParser.getSceneData();
        console.log("roadData: ", this.m_roadData);

        this.createEntities();
    }
    loadError(status: number, uuid: string): void {
    }
    private createEntities(): void {
        let roadData: RoadSceneData = this.m_roadData;

        // let tex0: TextureProxy = this.getImageTexByUrl("static/assets/roadSurface04.jpg");
        // let tex1: TextureProxy = this.getImageTexByUrl("static/assets/brick_d.jpg");
        // let texList: TextureProxy[] = [tex0, tex1];

        let texNSList: string[] = ["fabric_01", "brick_n_256"];

        let roadList: RoadModel[] = roadData.roadList;
        for (let i: number = 0; i < roadList.length; ++i) {
            let segs: RoadSegment[] = roadList[i].segmentList;
            for (let j: number = 0; j < segs.length; ++j) {
                let meshes: RoadSegmentMesh[] = segs[j].meshes;

                // let materials: Default3DMaterial[] = [new Default3DMaterial(), new Default3DMaterial()];
                // for(let k: number = 0; k < materials.length; ++k) {
                //     materials[k].setTextureList([texList[k]]);
                //     materials[k].initializeByCodeBuf(true);
                // }

                let materials: LambertLightMaterial[] = [new LambertLightMaterial(), new LambertLightMaterial()];
                for (let k: number = 0; k < materials.length; ++k) {
                    this.useLambertMaterial(materials[k], texNSList[k], true, false, true, true);
                    materials[k].fogEnabled = true;
                    materials[k].initializeByCodeBuf(true);
                }

                let entities: DisplayEntity[] = this.m_entityManager.createRoadSegEntitiesFromMeshesData(meshes, materials);
                for (let k: number = 0; k < entities.length; ++k) {
                    this.m_engine.rscene.addEntity(entities[k]);
                }
            }
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
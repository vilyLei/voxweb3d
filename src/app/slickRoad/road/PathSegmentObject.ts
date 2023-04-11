import Vector3D from "../../../vox/math/Vector3D";
import EngineBase from "../../../app/engine/EngineBase";

import { PathTool } from "./PathTool";
import { RoadMesh } from "../geometry/RoadMesh";
import { RoadGeometryBuilder } from "../geometry/RoadGeometryBuilder";
import { PathSegmentEntity } from "../entity/PathSegmentEntity";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";
import Default3DMaterial from "../../../vox/material/mcase/Default3DMaterial";
import { Pos3DPool } from "../base/Pos3DPool";
import { Pos3D } from "../base/Pos3D";
import { SegmentData } from "./segment/SegmentData";
import VtxDrawingInfo from "../../../vox/render/vtx/VtxDrawingInfo";

class PathSegmentObject {

    constructor() { }

    private m_initFlag: boolean = true;
    private m_selected: boolean = false;
    private m_engine: EngineBase = null;
    private m_offsetXYZ: Vector3D = new Vector3D(0, 0, 0);
    private m_pathTool: PathTool = new PathTool();
    private m_geomBuilder: RoadGeometryBuilder = new RoadGeometryBuilder();
    private m_dispEntities: PathSegmentEntity[] = [null, null, null, null, null, null];
    private m_wireframeEnabled: boolean = false;
    private m_segIndex: number = 0;
    posTotal: number = 0;
    initialize(engine: EngineBase): void {

        console.log("PathSegmentObject::initialize()......");
        if (this.m_initFlag) {

            this.m_initFlag = false;
            this.m_engine = engine;
            this.m_pathTool = new PathTool();
            this.m_geomBuilder = new RoadGeometryBuilder();
        }
    }
    setSegIndex(segIndex: number): void {
        this.m_segIndex = segIndex;
        for (let i: number = 0; i < this.m_dispEntities.length; ++i) {
            if (this.m_dispEntities[i] != null) {
                this.m_dispEntities[i].segIndex = this.m_segIndex;
            }
        }
    }
    getSegIndex(): number {
        return this.m_segIndex;
    }
    addEventListener(type: number, listener: any, func: (evt: any) => void): void {
        for (let i: number = 0; i < this.m_dispEntities.length; ++i) {
            if (this.m_dispEntities[i] != null) {
                this.m_dispEntities[i].addEventListener(type, listener, func);
            }
        }
    }
    removeEventListener(type: number, listener: any, func: (evt: any) => void): void {
        for (let i: number = 0; i < this.m_dispEntities.length; ++i) {
            if (this.m_dispEntities[i] != null) {
                this.m_dispEntities[i].removeEventListener(type, listener, func);
            }
        }
    }
    createEntities(total: number): void {
        for (let i: number = 0; i < total; ++i) {
            if (this.m_dispEntities[i] == null) {
                this.m_dispEntities[i] = new PathSegmentEntity();
                this.m_dispEntities[i].segIndex = this.getSegIndex();
            }
        }
    }
    isSelected(): boolean {
        return this.m_selected;
    }
    /**
     * 选中
     * @param sendEvtEnabled 是否发送选中的事件。 如果不发送事件，则只会改变状态。
     */
    select(sendEvtEnabled: boolean = false): void {
        this.m_selected = true;
        for (let i: number = 0; i < this.m_dispEntities.length; ++i) {
            if (this.m_dispEntities[i] != null) {
                this.m_dispEntities[i].select(sendEvtEnabled);
            }
        }
    }
    /**
     * 取消选中
     * @param sendEvtEnabled 是否发送选中的事件。 如果不发送事件，则只会改变状态。
     */
    deselect(sendEvtEnabled: boolean = false): void {
        this.m_selected = false;
        for (let i: number = 0; i < this.m_dispEntities.length; ++i) {
            if (this.m_dispEntities[i] != null) {
                this.m_dispEntities[i].deselect(sendEvtEnabled);
            }
        }
    }
    clear(): void {

        for (let i: number = 0; i < this.m_dispEntities.length; ++i) {
            if (this.m_dispEntities[i] != null) {
                this.m_engine.rscene.removeEntity(this.m_dispEntities[i]);
                this.m_dispEntities[i].destroy();
                this.m_dispEntities[i] = null;
            }
        }
    }
    setMouseEnabled(mouseEnabled: boolean): void {
        for (let i: number = 0; i < this.m_dispEntities.length; ++i) {
            if (this.m_dispEntities[i] != null) {
                this.m_dispEntities[i].mouseEnabled = mouseEnabled;
            }
        }
    }
    setVisible(visible: boolean): void {

        for (let i: number = 0; i < this.m_dispEntities.length; ++i) {
            if (this.m_dispEntities[i] != null) {
                this.m_dispEntities[i].setVisible(visible);
            }
        }
    }

    setWireframeEnabled(wireframeEnabled: boolean): void {

        if (this.m_wireframeEnabled !== wireframeEnabled) {
            this.m_wireframeEnabled = wireframeEnabled;
            for (let i: number = 0; i < this.m_dispEntities.length; ++i) {
                if (this.m_dispEntities[i] != null) {
                    this.reInitialize(this.m_dispEntities[i], true);
                }
            }
        }
    }
    distance: number = 0;
    private buildPathEntity(dispEntity: PathSegmentEntity, posTable: Vector3D[][], tex: IRenderTexture, uScale: number = 1.0, vScale: number = 1.0, uvType: number = 0): PathSegmentEntity {

        let mesh: RoadMesh = (dispEntity != null ? dispEntity.getMesh() : null) as RoadMesh;

        mesh = this.m_geomBuilder.buildRoadSurface(mesh, posTable, uScale, vScale, uvType);
        this.distance = mesh.distance;
        if (dispEntity == null || dispEntity.getMaterial() == null) {
            //console.log("create new road entity");

            let material = new Default3DMaterial();
            material.setTextureList([tex]);
            material.initializeByCodeBuf(true);
            mesh.setBufSortFormat(material.getBufSortFormat());
            mesh.wireframe = this.m_wireframeEnabled;
            mesh.initialize();
            if (dispEntity == null) {
                dispEntity = new PathSegmentEntity();
                dispEntity.segIndex = this.getSegIndex();
            }
            dispEntity.setMesh(mesh);
            dispEntity.setMaterial(material);
            this.m_engine.rscene.addEntity(dispEntity);
        } else {
            this.reInitialize(dispEntity);
        }
        return dispEntity;
    }
    private reInitialize(dispEntity: PathSegmentEntity, force: boolean = false): void {
        let mesh = dispEntity.getMesh() as RoadMesh;
        if (mesh != null && (mesh.changed || force)) {
            mesh.wireframe = this.m_wireframeEnabled;
            mesh.changed = false;
            mesh.initialize();
            let m = dispEntity.getMaterial();

            if(m != null && m.vtxInfo == null) {
                m.vtxInfo = new VtxDrawingInfo();
            }
            dispEntity.getDisplay().ivsCount = mesh.vtCount;
            m.vtxInfo.setIvsParam(0, mesh.vtCount);
            
            // dispEntity.setIvsParam(0, mesh.vtCount);

            dispEntity.updateMeshToGpu();
            dispEntity.updateBounds();
        }
    }
    getPathSegmentEntities(): PathSegmentEntity[] {

        let entities: PathSegmentEntity[] = this.m_dispEntities;
        let new_entities: PathSegmentEntity[] = [];
        for (let i: number = 0; i < entities.length; ++i) {
            if (entities[i] != null) {
                new_entities.push(entities[i]);
            }
        }
        return new_entities;
    }
    buildByPathSegments(segments: SegmentData[]): void {

        if (segments != null) {

            let entities: PathSegmentEntity[] = this.m_dispEntities;
            let data: SegmentData;
            for (let i: number = 0; i < segments.length; ++i) {
                data = segments[i];
                let tex = this.m_engine.texLoader.getTexByUrl(data.texturePath);
                entities[i] = this.buildPathEntity(entities[i], data.posTable, tex, data.uScale, data.vScale, data.uvType);
            }
        }
    }
    destroy(): void {
        if (!this.m_initFlag) {
            this.clear();
            this.m_engine = null;
            this.m_pathTool = null;
            this.m_geomBuilder = null;
            this.m_initFlag = true;
        }
    }
}

export { PathSegmentObject };
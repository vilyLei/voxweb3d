
import Axis3DEntity from "../../vox/entity/Axis3DEntity";
import Plane3DEntity from "../../vox/entity/Plane3DEntity";
import Box3DEntity from "../../vox/entity/Box3DEntity";

import MouseEvent from "../../vox/event/MouseEvent";
import KeyboardEvent from "../../vox/event/KeyboardEvent";

import Vector3D from "../../vox/math/Vector3D";
import CameraViewRay from "../../vox/view/CameraViewRay";
import { SpaceCullingMask } from "../../vox/space/SpaceCullingMask";
import SelectionEvent from "../../vox/event/SelectionEvent";
import SelectionBar from "../../orthoui/button/SelectionBar";

import EngineBase from "../../vox/engine/EngineBase";
import { TextureConst } from "../../vox/texture/TextureConst";
import TextureProxy from "../../vox/texture/TextureProxy";
import CubeMapMaterial from "../../vox/material/mcase/CubeMapMaterial";
import MouseEventEntity from "../../vox/entity/MouseEventEntity";
import DragAxisQuad3D from "../../voxeditor/entity/DragAxisQuad3D";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import BoxFrame3D from "../../vox/entity/BoxFrame3D";
import { RoadBuilder } from "./road/RoadBuilder";
import { PathTool } from "./road/PathTool";
import { PathCurveEditor } from "./road/PathCurveEditor";
import { RoadGeometryBuilder } from "./geometry/RoadGeometryBuilder";

import { Terrain } from "./terrain/Terrain";



import Line3DEntity from "../../vox/entity/Line3DEntity";
import DataMesh from "../../vox/mesh/DataMesh";
import { RoadFile } from "./io/RoadFile";

class Scene {

    constructor() { }

    private m_engine: EngineBase = null;
    readonly pathEditor: PathCurveEditor = new PathCurveEditor();
    private m_target: DisplayEntity = null;
    private m_frame: BoxFrame3D = new BoxFrame3D();
    private m_line: Line3DEntity = null;

    terrain: Terrain = new Terrain();
    geometryBuilder: RoadGeometryBuilder = new RoadGeometryBuilder();

    closePathBtn: SelectionBar = null;
    initialize(engine: EngineBase): void {

        console.log("Scene::initialize()......");
        if (this.m_engine == null) {

            this.m_engine = engine;

            this.m_engine.rscene.addEventListener(MouseEvent.MOUSE_BG_DOWN, this, this.mouseDown);
            this.m_engine.rscene.addEventListener(KeyboardEvent.KEY_DOWN, this, this.keyDown);

            this.pathEditor.initialize(engine);
            //  this.terrain.initialize(engine);

            // let axis = new Axis3DEntity();
            // axis.initialize(700);
            // this.m_engine.rscene.addEntity(axis);

            // this.m_line = new Line3DEntity();
            // this.m_line.dynColorEnabled = true;
            // this.m_line.initializeByPosList([new Vector3D(), new Vector3D(100,0.0,0.0)]);
            // this.m_engine.rscene.addEntity(this.m_line);

            
            let posOuterList = [new Vector3D(0, 0, -100), new Vector3D(100, 0, -100), new Vector3D(150, 0, -50)];
            let posInnerList = [new Vector3D(0, 0, 100), new Vector3D(100, 0, 100), new Vector3D(150, 0, 150)];

            let posTable: Vector3D[][] = [
                posInnerList,
                posOuterList
            ];

            //this.buildRoadSurface(posTable, 2.0,1.0);
            
            this.initEditor();
        }
    }
    private m_editEnabled: boolean = true;
    setEditEnabled(enabled: boolean): void {
        this.m_editEnabled = enabled;
    }
    getEditEnabled(): boolean {
        return this.m_editEnabled;
    }
    private initEditor(): void {

        let pls = new Line3DEntity();
        pls.dynColorEnabled = true;
        pls.initializeByPosList([new Vector3D(), new Vector3D(1.0, 0.0, 0.0)]);
        this.m_engine.rscene.addEntity(pls);
        this.m_line = pls;

    }
    private m_pos: Vector3D = new Vector3D();
    private mouseClick(evt: any): void {
        console.log("entity mouseClick...");

    }
    private m_dispList: DisplayEntity[] = [];

    private m_roadFile: RoadFile = new RoadFile();
    clear(): void {
        
        this.pathEditor.clear();
        this.m_line.setVisible(false);

        for (let i: number = 0; i < this.m_dispList.length; ++i) {
            this.m_engine.rscene.removeEntity(this.m_dispList[i]);
        }
        this.m_dispList = [];
        if(this.closePathBtn != null) {
            this.closePathBtn.deselect(false);
        }
    }
    saveData(): void {
        //  this.pathEditor.saveData();

        let posList: Vector3D[] = this.pathEditor.getPathPosList();
        let fileBuf: Uint8Array = this.m_roadFile.savePathData(posList,this.geometryBuilder.geometry);
        // for test
        this.m_roadFile.parsePathDataFromFileBuffer(fileBuf);
    }
    
    private m_pathTool: PathTool = new PathTool();

    private buildRoadSurface(posTable: Vector3D[][], tex: TextureProxy,uScale: number = 1.0, vScale: number = 1.0, uvType: number = 0): void {

        let mesh: DataMesh = this.geometryBuilder.buildRoadSurface(posTable, uScale, vScale, uvType);

        let mplane: Plane3DEntity = new Plane3DEntity();
        //mplane.initializeXOYSquare(50, [this.m_engine.texLoader.getTexByUrl("static/assets/roadSurface01.jpg")]);
        mplane.initializeXOYSquare(50, [tex]);

        mesh.setBufSortFormat( mplane.getMaterial().getBufSortFormat() );
        mesh.initialize();

        let surfaceEntity: DisplayEntity = new DisplayEntity();
        surfaceEntity.setMesh( mesh );
        surfaceEntity.setMaterial( mplane.getMaterial() );
        this.m_engine.rscene.addEntity(surfaceEntity);
        this.m_dispList.push(surfaceEntity);
    }
    private buildRoadShape(curvePosList: Vector3D[], dis: number = 60): void {

        let posListR: Vector3D[] = this.m_pathTool.expandXOZPath(curvePosList, dis, true);
        let posListL: Vector3D[] = this.m_pathTool.expandXOZPath(curvePosList, -dis, true);
        /*
        let pls = new Line3DEntity();
        pls.dynColorEnabled = true;
        pls.initializeByPosList(posListR);
        (pls.getMaterial() as any).setRGB3f(1.0, 0.8, 0.8);
        this.m_engine.rscene.addEntity(pls);
        this.m_dispList.push(pls);


        pls = new Line3DEntity();
        pls.dynColorEnabled = true;
        pls.initializeByPosList(posListL);
        (pls.getMaterial() as any).setRGB3f(0.3, 0.8, 1.0);
        this.m_engine.rscene.addEntity(pls);
        this.m_dispList.push(pls);
        //*/

        this.m_line.setVisible( false );
        let tex: TextureProxy;

        //  tex = this.m_engine.texLoader.getTexByUrl("static/assets/roadSurface03.jpg");
        //  this.buildRoadSurface([posListL,posListR],tex, 1.0,1.0, 0);

        tex = this.m_engine.texLoader.getTexByUrl("static/assets/roadSurface04.jpg");
        this.buildRoadSurface([posListL,posListR], tex, 1.0,1.0, 1);
    }
    private buildPathLine(curvePosList: Vector3D[]): void {

        if (curvePosList != null && curvePosList.length > 1) {
            let pls = this.m_line;
            this.m_line.setVisible(true);
            pls.initializeByPosList(curvePosList);
            pls.reinitializeMesh();
            pls.updateMeshToGpu();
            pls.updateBounds();
        }
    }
    private mouseDown(evt: any): void {

        console.log("scene mouse down");
        this.m_engine.interaction.viewRay.intersectPlane();
        let pv: Vector3D = this.m_engine.interaction.viewRay.position;
        
        if (this.m_line != null && this.pathEditor.getEditEnabled() && !this.pathEditor.isPathClosed()) {

            this.m_line.setVisible( true );
            let crossAxis: Axis3DEntity = new Axis3DEntity();
            crossAxis.initializeCross(20.0);
            crossAxis.setPosition(pv);
            this.m_engine.rscene.addEntity(crossAxis);
            this.m_dispList.push(crossAxis);

            this.pathEditor.appendPathPos(pv);
            this.pathEditor.buildPath();

            let posList: Vector3D[] = this.pathEditor.getPathPosList();
            this.buildPathLine(posList);
            if (this.pathEditor.isPathClosed()) {
                if(this.closePathBtn != null) {
                    this.closePathBtn.deselect(false);
                }
                this.buildRoadShape(posList);
            }
        }

    }
    private keyDown(evt: any): void {

        switch (evt.key) {
            default:
                break;
        }
    }
    
    update(): void {
    }
    run(): void {
        this.pathEditor.run();
    }
}

export { Scene };
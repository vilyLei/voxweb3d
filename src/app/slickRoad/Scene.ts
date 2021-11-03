
import MouseEvent from "../../vox/event/MouseEvent";
import Plane3DEntity from "../../vox/entity/Plane3DEntity";

import KeyboardEvent from "../../vox/event/KeyboardEvent";

import Vector3D from "../../vox/math/Vector3D";
import SelectionBar from "../../orthoui/button/SelectionBar";

import EngineBase from "../../vox/engine/EngineBase";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import BoxFrame3D from "../../vox/entity/BoxFrame3D";
import { PathCurveEditor } from "./road/PathCurveEditor";
import { RoadEntityBuilder } from "./road/RoadEntityBuilder";
import { RoadGeometryBuilder } from "./geometry/RoadGeometryBuilder";

import { Terrain } from "./terrain/Terrain";
import { RoadFile } from "./io/RoadFile";
import { ExportRoadNode, RoadSceneFile } from "./io/RoadSceneFile";
import { RoadSceneFileParser } from "./io/RoadSceneFileParser";

class Scene {

    constructor() { }

    private m_editEnabled: boolean = true;
    private m_engine: EngineBase = null;
    readonly roadEntityBuilder: RoadEntityBuilder = new RoadEntityBuilder();
    //private m_line: Line3DEntity = null;

    readonly pathEditor: PathCurveEditor = new PathCurveEditor();
    terrain: Terrain = new Terrain();
    readonly geometryBuilder: RoadGeometryBuilder = new RoadGeometryBuilder();

    closePathBtn: SelectionBar = null;
    initialize(engine: EngineBase): void {

        console.log("Scene::initialize()......");
        if (this.m_engine == null) {

            this.m_engine = engine;

            this.m_engine.rscene.addEventListener(MouseEvent.MOUSE_CLICK, this, this.mouseClick);
            this.m_engine.rscene.addEventListener(MouseEvent.MOUSE_BG_DOWN, this, this.mouseDown);
            this.m_engine.rscene.addEventListener(KeyboardEvent.KEY_DOWN, this, this.keyDown);

            this.pathEditor.initialize(engine);
            this.roadEntityBuilder.initialize(engine, this.pathEditor);
            
            this.terrain.initialize(engine);
            this.terrain.setVisible( false );
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
            // let plist: number[] = [0,1,2,3,4,5,6,7];
            // //plist = plist.splice(2,0,9);
            // // plist.splice(7,1);
            // console.log("XXX plist: ",plist);
            this.initEditor();

        }
    }
    
    setEditEnabled(enabled: boolean): void {
        this.m_editEnabled = enabled;
    }
    getEditEnabled(): boolean {
        return this.m_editEnabled;
    }
    private initEditor(): void {
    }
    private m_pos: Vector3D = new Vector3D();
    
    private m_dispList: DisplayEntity[] = [];

    private m_roadFile: RoadFile = new RoadFile();
    private m_roadFileParser: RoadSceneFileParser = new RoadSceneFileParser();
    clear(): void {

        this.roadEntityBuilder.clear();

        this.pathEditor.clear();
        //this.m_line.setVisible(false);

        for (let i: number = 0; i < this.m_dispList.length; ++i) {
            this.m_engine.rscene.removeEntity(this.m_dispList[i]);
        }
        this.m_dispList = [];
        if(this.closePathBtn != null) {
            this.closePathBtn.deselect(false);
        }
    }
    private m_scFile: RoadSceneFile = new RoadSceneFile();
    saveData(): void {
        
        if(this.pathEditor.getPathKeyPosTotal() > 1) {
            console.log("#### Save Data Begin...");
            let node: ExportRoadNode = new ExportRoadNode();
            node.pathPosList = this.pathEditor.getPathKeyPosList();
            node.curvePosList = this.pathEditor.getPathPosList();
            node.pathSegList = this.roadEntityBuilder.getSegList();
            let fs: Uint8Array = this.m_scFile.buildRoadFile( node );
            this.m_scFile.saveFile(fs);
            // // for test
            // this.m_roadFileParser.parse(fs);
        }
    }
    
    buildGeomData(): void {
        this.roadEntityBuilder.build();
    }
    private mouseClick(evt: any): void {
        //console.log("scene mouse click.");
    }
    private mouseDown(evt: any): void {

        //console.log("scene mouse mouseDown.");
        this.m_engine.interaction.viewRay.intersectPlane();
        let pv: Vector3D = this.m_engine.interaction.viewRay.position;
        
        this.pathEditor.appendPathPos(pv);

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
        this.roadEntityBuilder.run();
    }
}

export { Scene };
import Vector3D from "../../../vox/math/Vector3D";
import MouseEvent from "../../../vox/event/MouseEvent";
import KeyboardEvent from "../../../vox/event/KeyboardEvent";

import EngineBase from "../../../vox/engine/EngineBase";
import { PathCurveEditor } from "../road/PathCurveEditor";
import { RoadEntityBuilder } from "../road/RoadEntityBuilder";

import { Terrain } from "../terrain/Terrain";
import { SceneFileSystem } from "../io/SceneFileSystem";

class Scene {

    constructor() { }

    private m_editEnabled: boolean = true;
    private m_engine: EngineBase = null;
    private m_awake: boolean = false;

    readonly roadEntityBuilder: RoadEntityBuilder = new RoadEntityBuilder();
    readonly pathEditor: PathCurveEditor = new PathCurveEditor();

    readonly terrain: Terrain = new Terrain();
    //readonly geometryBuilder: RoadGeometryBuilder = new RoadGeometryBuilder();
    readonly fileSystem: SceneFileSystem = new SceneFileSystem();

    isAwake(): boolean {
        return this.m_awake;
    }
    wake(): void {

        if (!this.m_awake) {
            this.m_awake = true;

            this.m_engine.rscene.addEventListener(MouseEvent.MOUSE_BG_CLICK, this, this.mouseClick);

            // this.m_engine.rscene.addEventListener(MouseEvent.MOUSE_BG_DOWN, this, this.mouseDown);
            // this.m_engine.rscene.addEventListener(MouseEvent.MOUSE_BG_UP, this, this.mouseUp);

            this.m_engine.rscene.addEventListener(KeyboardEvent.KEY_DOWN, this, this.keyDown);
        }
    }
    sleep(): void {

        if (this.m_awake) {
            this.m_awake = false;

            this.m_engine.rscene.removeEventListener(MouseEvent.MOUSE_CLICK, this, this.mouseClick);

            // this.m_engine.rscene.removeEventListener(MouseEvent.MOUSE_BG_DOWN, this, this.mouseDown);
            // this.m_engine.rscene.removeEventListener(MouseEvent.MOUSE_BG_UP, this, this.mouseUp);

            this.m_engine.rscene.removeEventListener(KeyboardEvent.KEY_DOWN, this, this.keyDown);
        }
    }
    initialize(engine: EngineBase): void {

        console.log("Scene::initialize()......");
        if (this.m_engine == null) {

            this.m_engine = engine;

            this.pathEditor.initialize(engine, this.roadEntityBuilder.segObjManager);
            this.roadEntityBuilder.initialize(engine, this.pathEditor);

            this.terrain.initialize(engine);
            this.terrain.setVisible(false);
            this.fileSystem.initialize(this.pathEditor, this.roadEntityBuilder);

            this.wake();
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

        }
    }

    setEditEnabled(enabled: boolean): void {
        this.m_editEnabled = enabled;
        this.pathEditor.setEditEnabled(enabled);
        this.roadEntityBuilder.setEditEnabled(enabled);
    }
    getEditEnabled(): boolean {
        return this.m_editEnabled;
    }
    /**
     * 新建场景
     */
    newScene(): void {
    }
    /**
     * 删除清理场景
     */
    clearScene(): void {
        this.roadEntityBuilder.clear();
        this.pathEditor.clear();
    }
    buildGeomData(): void {
        this.roadEntityBuilder.build();
    }
    private mouseClick(evt: any): void {
        //console.log("scene mouse click.");
        this.m_engine.interaction.viewRay.intersectPlane();
        let pv: Vector3D = this.m_engine.interaction.viewRay.position;
        this.pathEditor.appendPathPos(pv);
    }
    /*
    private m_mouseSt0: Vector3D = new Vector3D();
    private m_mouseSt1: Vector3D = new Vector3D();
    private mouseDown(evt: any): void {

        this.m_mouseSt0.x = this.m_engine.stage3D.mouseX;
        this.m_mouseSt0.y = this.m_engine.stage3D.mouseY;
        this.m_mouseSt0.w = Date.now();

        //console.log("scene mouse mouseDown.");
        // this.m_engine.interaction.viewRay.intersectPlane();
        // let pv: Vector3D = this.m_engine.interaction.viewRay.position;

    }
    private mouseUp(evt: any): void {

        this.m_mouseSt1.x = this.m_engine.stage3D.mouseX;
        this.m_mouseSt1.y = this.m_engine.stage3D.mouseY;
        this.m_mouseSt1.w = Date.now();

        this.m_engine.interaction.viewRay.intersectPlane();
        let pv: Vector3D = this.m_engine.interaction.viewRay.position;

        if ((this.m_mouseSt1.w - this.m_mouseSt0.w) < 400) {
            if (Vector3D.Distance(this.m_mouseSt1, this.m_mouseSt0) < 5) {
                this.pathEditor.appendPathPos(pv);
            }
            // else {
            //     console.log("单击位置偏差太大");
            // }
        }
        // else {
        //     console.log("单击时间间隔太长");
        // }
    }
    //*/
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
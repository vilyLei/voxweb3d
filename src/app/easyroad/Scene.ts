
import RendererDevice from "../../vox/render/RendererDevice";
import RendererParam from "../../vox/scene/RendererParam";
import RendererState from "../../vox/render/RendererState";
import RenderStatusDisplay from "../../vox/scene/RenderStatusDisplay";
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
import {RoadBuilder} from "./RoadBuilder";
import {ExpandPathTool,RoadPath} from "./RoadPath";

import {Bezier2Curve, Bezier3Curve} from "../../vox/geom/curve/BezierCurve";
import Line3DEntity from "../../vox/entity/Line3DEntity";

class Scene {

    constructor() { }

    private m_engine: EngineBase = null;
    private m_roadBuilder: RoadBuilder = new RoadBuilder();

    private m_target: DisplayEntity = null;
    private m_frame: BoxFrame3D = new BoxFrame3D();
    private m_line: Line3DEntity = null;
    initialize(engine: EngineBase): void {

        console.log("Scene::initialize()......");
        if (this.m_engine == null) {

            this.m_engine = engine;
            
            this.m_engine.rscene.addEventListener(MouseEvent.MOUSE_BG_DOWN, this, this.mouseDown);
            this.m_engine.rscene.addEventListener(KeyboardEvent.KEY_DOWN, this, this.keyDown);
            
            ///*
            let plane: Plane3DEntity = new Plane3DEntity();
            plane.showDoubleFace();
            plane.uScale = 5.0;
            plane.vScale = 5.0;
            plane.initializeXOZSquare(2600.0, [this.m_engine.texLoader.getTexByUrl("static/assets/wood_02.jpg")]);
            plane.setXYZ(0.0, -200.0, 0.0);
            this.m_engine.rscene.addEntity(plane);
            /*
            let evtEntity: MouseEventEntity = new MouseEventEntity();
            evtEntity.copyMeshFrom(plane);
            evtEntity.copyMaterialFrom(plane);
            this.m_engine.rscene.addEntity(evtEntity);
            //evtEntity.addEventListener(MouseEvent.MOUSE_CLICK,this, this.mouseClick);
            //*/

            /*
            let size: number = 100.0;
            let box: Box3DEntity = new Box3DEntity();
            box.setRotationXYZ(Math.random() * 360.0, Math.random() * 360.0, Math.random() * 360.0);
            box.initialize(new Vector3D(-size, -size, -size), new Vector3D(size, size, size), [this.m_engine.texLoader.getTexByUrl("static/assets/brickwall_big.jpg")]);
            box.setXYZ(0.0, 0.0, 0.0);
            this.m_engine.rscene.addEntity(box);
            this.m_target = box;

            this.m_frame.initializeByAABB(box.getGlobalBounds());
            this.m_engine.rscene.addEntity( this.m_frame );
            //*/
            
            // let axis = new Axis3DEntity();
            // axis.initialize(700);
            // this.m_engine.rscene.addEntity(axis);


            // this.m_line = new Line3DEntity();
            // this.m_line.dynColorEnabled = true;
            // this.m_line.initializeByPosList([new Vector3D(), new Vector3D(100,0.0,0.0)]);
            // this.m_engine.rscene.addEntity(this.m_line);

            this.initEditor();

            //this.initRoad2();
            //this.initRoad3();

        }
    }

    private initRoad3(): void {

        let curvePosList: Vector3D[];
        let pathPosList: Vector3D[] = [
            new Vector3D(0.0,0.0,200.0)
            ,new Vector3D(500.0,200.0,0.0)
            ,new Vector3D(1000.0,0.0,800.0)
            //,new Vector3D(600.0,200.0,1300.0)
            //,new Vector3D(100.0,0.0,900.0)

            // new Vector3D(0.0,0.0,200.0)
            // ,new Vector3D(500.0,200.0,0.0)
            // ,new Vector3D(1000.0,0.0,800.0)
            // ,new Vector3D(600.0,200.0,1300.0)
            // ,new Vector3D(100.0,0.0,900.0)
        ];

        let path: RoadPath = this.m_roadBuilder.appendPath();
        path.setBezierCurveSegTotal(10);
        path.initializePosList(pathPosList);
        curvePosList = path.buildPathCurve(3,true);

        let pls = new Line3DEntity();
        pls.dynColorEnabled = true;
        pls.initializeByPosList( curvePosList );
        this.m_engine.rscene.addEntity( pls );



        let expandTool: ExpandPathTool = new ExpandPathTool();
        let posList2: Vector3D[] = expandTool.expandXOZ(curvePosList, 60,true);
        pls = new Line3DEntity();
        pls.dynColorEnabled = true;
        pls.initializeByPosList( posList2 );
        (pls.getMaterial() as any).setRGB3f(1.0,0.8,0.8);
        this.m_engine.rscene.addEntity( pls );

        // for(let i: number = 0; i < curvePosList.length; ++i) {
        //     pls = new Line3DEntity();
        //     pls.dynColorEnabled = true;
        //     pls.initializeByPosList( [curvePosList[i], new Vector3D(curvePosList[i].x,-80.0,curvePosList[i].z)] );
        //     (pls.getMaterial() as any).setRGB3f(0.3,0.7,0.7);
        //     this.m_engine.rscene.addEntity( pls );
        // }
        // for(let i: number = 0; i < posList2.length; ++i) {
        //     pls = new Line3DEntity();
        //     pls.dynColorEnabled = true;
        //     pls.initializeByPosList( [posList2[i], new Vector3D(posList2[i].x,-80.0,posList2[i].z)] );
        //     (pls.getMaterial() as any).setRGB3f(0.3,0.7,0.7);
        //     this.m_engine.rscene.addEntity( pls );
        // }
    }
    private initRoad2(): void {

        let curvePosList: Vector3D[];
        let pathPosList: Vector3D[] = [
            new Vector3D(0.0,0.0,200.0)
            ,new Vector3D(500.0,0.0,0.0)
            ,new Vector3D(1000.0,0.0,800.0)
            ,new Vector3D(600.0,0.0,1300.0)
            ,new Vector3D(100.0,0.0,900.0)

            // new Vector3D(0.0,0.0,200.0)
            // ,new Vector3D(500.0,200.0,0.0)
            // ,new Vector3D(1000.0,0.0,800.0)
            // ,new Vector3D(600.0,200.0,1300.0)
            // ,new Vector3D(100.0,0.0,900.0)
        ];

        let path: RoadPath = this.m_roadBuilder.appendPath();
        path.setBezierCurveSegTotal(10);
        path.initializePosList(pathPosList);
        curvePosList = path.buildPathCurve(2,true);

        let pls = new Line3DEntity();
        pls.dynColorEnabled = true;
        pls.initializeByPosList( curvePosList );
        this.m_engine.rscene.addEntity( pls );

        return;

        let bezCurve2A: Bezier2Curve = new Bezier2Curve();
        bezCurve2A.setSegTot(10);
        bezCurve2A.begin.setXYZ(0.0,0.0,200.0);
        bezCurve2A.end.setXYZ(500.0,0.0,0.0);
        bezCurve2A.ctrPos.setXYZ(100,0.0,0.0);
        bezCurve2A.updateCalc();

        curvePosList = bezCurve2A.getPosList();

        let ls = new Line3DEntity();
        ls.dynColorEnabled = true;
        //  ls.initializeByPosList(bezCurve2A.getPosList());
        //  this.m_engine.rscene.addEntity( ls );
        
        bezCurve2A.setSegTot(10);
        bezCurve2A.begin.setXYZ(500.0,0.0,0.0);
        bezCurve2A.end.setXYZ(1000.0,0.0,800.0);
        bezCurve2A.ctrPos.setXYZ(900,0.0,0.0);
        bezCurve2A.updateCalc();

        curvePosList = curvePosList.concat(bezCurve2A.getPosList());
        ls.initializeByPosList( curvePosList );
        this.m_engine.rscene.addEntity( ls );
    }
    private m_editEnabled: boolean = true;
    private m_closeEnabled: boolean = false;
    setEditEnabled(enabled: boolean): void {
        this.m_editEnabled = enabled;
    }
    getEditEnabled(): boolean {
        return this.m_editEnabled;
    }
    setCloseEnabled(enabled: boolean): void {
        this.m_closeEnabled = enabled;
    }
    getCloseEnabled(): boolean {
        return this.m_closeEnabled;
    }

    private m_path: RoadPath = null;
    private initEditor(): void {

        let path: RoadPath = this.m_roadBuilder.appendPath();
        this.m_path = path;
        path.setBezierCurveSegTotal(10);

        let pls = new Line3DEntity();
        pls.dynColorEnabled = true;
        pls.initializeByPosList( [new Vector3D(), new Vector3D(1.0,0.0,0.0)] );
        this.m_engine.rscene.addEntity( pls );
        this.m_line = pls;
        //let saxis: DragAxisQuad3D = new DragAxisQuad3D();
        //saxis.initialize(500.0, 5.0);
        //this.m_engine.rscene.addEntity(saxis);
    }
    private m_pos: Vector3D = new Vector3D();
    private mouseClick(evt: any): void {
        console.log("entity mouseClick...");

    }
    private m_buildEnd: boolean = false;
    private m_dispList: DisplayEntity[] = [];
    clear(): void {
        this.m_buildEnd = false;
        this.m_path.clear();
        this.m_line.setVisible(false);
        for(let i: number = 0; i < this.m_dispList.length; ++i) {
            this.m_engine.rscene.removeEntity( this.m_dispList[i] );
        }
        this.m_dispList = [];
        this.m_curvePosList = null;
    }
    private buildCurve(): Vector3D[] {

        let curvePosList: Vector3D[] = this.m_path.buildPathCurve(3, true, this.m_closeEnabled?10350:350);
        
        let pls = this.m_line;
        this.m_line.setVisible(true);
        pls.initializeByPosList( curvePosList );
        pls.reinitializeMesh();
        pls.updateMeshToGpu();
        pls.updateBounds();
        this.m_curvePosList = curvePosList;
        return curvePosList;
    }
    private editCurve(pv: Vector3D): void {

        if(this.m_buildEnd) {
            return;
        }

        if(this.m_editEnabled && this.m_path != null) {

            if(this.m_curvePosList != null && Vector3D.Distance(this.m_curvePosList[0], this.m_curvePosList[this.m_curvePosList.length - 1]) < 0.001) {
                console.log("curve is closed.");
                this.m_buildEnd = true;
                let list: Vector3D[] = this.m_path.getPosList();
                
                let expandTool: ExpandPathTool = new ExpandPathTool();
                list = expandTool.expandXOZ(this.m_curvePosList, 60,true);
                
                let pls = new Line3DEntity();
                pls.dynColorEnabled = true;
                pls.initializeByPosList( list );
                (pls.getMaterial() as any).setRGB3f(1.0,0.8,0.8);
                this.m_engine.rscene.addEntity( pls );
                this.m_dispList.push(pls);

                
                list = expandTool.expandXOZ(this.m_curvePosList, -60,true);
                pls = new Line3DEntity();
                pls.dynColorEnabled = true;
                pls.initializeByPosList( list );
                (pls.getMaterial() as any).setRGB3f(0.3,0.8,1.0);
                this.m_engine.rscene.addEntity( pls );
                this.m_dispList.push(pls);

                // list = this.m_path.getPosList();
                // list = list.slice(0);
                // list.push(list[0].clone());
                // list = expandTool.expandXOZ(list, 200,true);
                // let path: RoadPath = new RoadPath();
                // path.initializePosList(list);
                // path.setBezierCurveSegTotal(10);
                // list = path.buildPathCurve(3, true, 250);
                // pls = new Line3DEntity();
                // pls.dynColorEnabled = true;
                // pls.initializeByPosList( list );
                // (pls.getMaterial() as any).setRGB3f(0.0,0.8,0.0);
                // this.m_engine.rscene.addEntity( pls );

                // pls = new Line3DEntity();
                // pls.dynColorEnabled = true;
                // pls.initializeByPosList( this.m_path.getPosList() );
                // (pls.getMaterial() as any).setRGB3f(0.3,1.0,0.8);
                // this.m_engine.rscene.addEntity( pls );

                //this.m_line.setVisible(false);
                return;
            }
            let crossAxis: Axis3DEntity = new Axis3DEntity();
            crossAxis.initializeCross(20.0);
            crossAxis.setPosition(pv);
            this.m_engine.rscene.addEntity( crossAxis );

            this.m_dispList.push( crossAxis );

            this.m_path.appendPos(pv);
            if(this.m_path.getPosListLength() > 1) {
                
                this.m_curvePosList = this.buildCurve();
            }
        }
    }
    private m_posList: Vector3D[] = [];
    private m_curvePosList: Vector3D[] = null;
    private mouseDown(evt: any): void {

        console.log("scene mouse down");
        this.m_engine.viewRay.intersectPlane();
        let pv: Vector3D = this.m_engine.viewRay.position;
        this.editCurve( pv );

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
    }
}

export {Scene};
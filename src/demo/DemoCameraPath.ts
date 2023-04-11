
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RendererState from "../vox/render/RendererState";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";

import MouseEvent from "../vox/event/MouseEvent";
import KeyboardEvent from "../vox/event/KeyboardEvent";

import Vector3D from "../vox/math/Vector3D";
import CameraViewRay from "../vox/view/CameraViewRay";
import { SpaceCullingMask } from "../vox/space/SpaceCullingMask";
import SelectionEvent from "../vox/event/SelectionEvent";
import SelectionBar from "../orthoui/button/SelectionBar";

import {CameraScene} from "./scene/CameraScene";
import {CameraScenePath} from "./scene/CameraScenePath";
import EngineBase from "../app/engine/EngineBase";
import TextureConst from "../vox/texture/TextureConst";
import TextureProxy from "../vox/texture/TextureProxy";
import CubeMapMaterial from "../vox/material/mcase/CubeMapMaterial";

export class DemoCameraPath {

    constructor() { }

    private m_engine: EngineBase = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();

    private m_camScene: CameraScenePath = new CameraScenePath();

    initialize(): void {

        console.log("DemoCameraPath::initialize()......");
        if (this.m_engine == null) {

            //DivLog.SetDebugEnabled( true );
            RendererDevice.SHADERCODE_TRACE_ENABLED = false;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;

            let rparam: RendererParam = new RendererParam();
            rparam.setAttriAntialias(!RendererDevice.IsMobileWeb());
            rparam.setCamPosition(1800.0, 1800.0, 1800.0);
            rparam.setCamProject(45, 20.0, 9000.0);
            
            this.m_engine = new EngineBase();
            this.m_engine.initialize(rparam);

            this.m_statusDisp.initialize();
            
            this.m_engine.rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
            this.m_engine.rscene.addEventListener(KeyboardEvent.KEY_DOWN, this, this.keyDown);
            
            this.initBtns();
            
            ///*
            let plane: Plane3DEntity = new Plane3DEntity();
            plane.showDoubleFace();
            plane.uScale = 5.0;
            plane.vScale = 5.0;
            plane.initializeXOZSquare(1900.0, [this.m_engine.texLoader.getTexByUrl("static/assets/wood_02.jpg")]);
            plane.setXYZ(0.0, -300.0, 0.0);
            //this.m_rscene.addEntity(plane);

            let size: number = 3200.0;
            let disY: number = 0.5 * size;
            /*
            let bg_box: Box3DEntity = new Box3DEntity();
            bg_box.spaceCullMask = SpaceCullingMask.NONE;
            bg_box.uScale = 4.0;
            bg_box.vScale = 4.0;
            //metal_08
            bg_box.showFrontFace();
            bg_box.initialize(new Vector3D(-size, -size * 0.5, -size), new Vector3D(size, size * 0.7, size), [this.m_engine.texLoader.getTexByUrl("static/assets/brickwall_big.jpg")]);
            bg_box.setXYZ(0.0, 0.0, 0.0);
            this.m_engine.rscene.addEntity(bg_box);
            //*/

            this.update();
            this.useSixImageCubeTex();
            this.m_camScene.initialize( this.m_engine.rscene );
        }
    }

    private useSixImageCubeTex(): void {
        let urls = [
            "static/assets/hw_morning/morning_ft.jpg",
            "static/assets/hw_morning/morning_bk.jpg",
            "static/assets/hw_morning/morning_up.jpg",
            "static/assets/hw_morning/morning_dn.jpg",
            "static/assets/hw_morning/morning_rt.jpg",
            "static/assets/hw_morning/morning_lf.jpg"
        ];

        let cubeTex0: TextureProxy = this.m_engine.texLoader.getCubeTexAndLoadImg("static/assets/cubeMap", urls);

        this.createCubeBox( cubeTex0 );
        
    }
    private createCubeBox(cubeTex: TextureProxy): void {
        
        cubeTex.mipmapEnabled = true;
        cubeTex.minFilter = TextureConst.LINEAR_MIPMAP_LINEAR;
        cubeTex.magFilter = TextureConst.LINEAR;
        let cubeMaterial: CubeMapMaterial = new CubeMapMaterial(true);
        cubeMaterial.setTextureLodLevel( 2.0 );
        //cubeMaterial.setTextureList
        let size: number = 3200.0;
        let box: Box3DEntity = new Box3DEntity();
        box.useGourandNormal();
        box.showFrontFace();
        box.setMaterial(cubeMaterial);
        box.initialize(new Vector3D(-size, -size, -size), new Vector3D(size,size,size), [cubeTex]);
        this.m_engine.rscene.addEntity(box);
    }
    private mouseDown(evt: any): void {

        this.m_engine.interaction.viewRay.intersectPlane();
        let pv: Vector3D = this.m_engine.interaction.viewRay.position;

    }
    private keyDown(evt: any): void {
        
        switch (evt.key) {
            default:
                break;
        }
    }

    private m_timeoutId: any = -1;
    private update(): void {
        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }
        //this.m_timeoutId = setTimeout(this.update.bind(this),16);// 60 fps
        this.m_timeoutId = setTimeout(this.update.bind(this), 25);// 20 fps
        this.m_statusDisp.render();
    }

    private m_rot: Vector3D = new Vector3D();

    run(): void {
        
        this.m_statusDisp.update(false);
        
        this.m_camScene.run();
        this.m_engine.run();
        
    }

    private initBtns(): void {
        if(RendererDevice.IsMobileWeb()) {
            this.m_btnSize = 64;
        }
        let camBtn = this.createSelectBtn("changeView", "changeView", "First", "Third", true);
        camBtn = this.createSelectBtn("slideCamera", "slideCamera", "ON", "OFF", false);
        let minX: number = 1000;
        let pos: Vector3D = new Vector3D();
        for(let i: number = 0; i < this.m_btns.length; ++i) {
            this.m_btns[i].getPosition(pos);
            let px: number = this.m_btns[i].getRect().x + pos.x;
            if(px < minX) {
                minX = px;
            }
        }
        let dx: number = 30 - minX;
        for(let i: number = 0; i < this.m_btns.length; ++i) {
            this.m_btns[i].getPosition(pos);
            pos.x += dx;
            this.m_btns[i].setXY(pos.x, pos.y);
        }

    }

    private m_btnSize: number = 24;
    private m_btnPX: number = 162.0;
    private m_btnPY: number = 20.0;
    private m_btns: SelectionBar[] = [];
    
    private createSelectBtn(ns: string, uuid: string, selectNS: string, deselectNS: string, flag: boolean, visibleAlways: boolean = false): SelectionBar {

        let selectBar: SelectionBar = new SelectionBar();
        selectBar.uuid = uuid;
        selectBar.initialize(this.m_engine.uiScene, ns, selectNS, deselectNS, this.m_btnSize);
        selectBar.addEventListener(SelectionEvent.SELECT, this, this.selectChange);
        if (flag) {
            selectBar.select(false);
        }
        else {
            selectBar.deselect(false);
        }
        selectBar.setXY(this.m_btnPX, this.m_btnPY);
        this.m_btnPY += this.m_btnSize + 1;
        if (!visibleAlways) this.m_btns.push(selectBar);
        return selectBar;
    }
    private selectChange(evt: any): void {
        let selectEvt: SelectionEvent = evt as SelectionEvent;
        switch( selectEvt.uuid ) {
            case "changeView":
                    this.m_camScene.switchCamera( selectEvt.flag );
                break;
            case "slideCamera":
                    this.switchSlide( selectEvt.flag );
                break;
            default:
                break;
        }
    }
    private switchSlide(flag: boolean): void {
        
        if (flag) {
            this.m_engine.interaction.stageDragCtrl.enableSlide();
        }
        else {
            this.m_engine.interaction.stageDragCtrl.enableSwing();
        }
    }
}

export default DemoCameraPath;
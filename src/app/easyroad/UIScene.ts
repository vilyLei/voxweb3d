
import RendererDevice from "../../vox/render/RendererDevice";
import Vector3D from "../../vox/math/Vector3D";
import SelectionEvent from "../../vox/event/SelectionEvent";
import SelectionBar from "../../orthoui/button/SelectionBar";
import ProgressBar from "../../orthoui/button/ProgressBar";
import ProgressDataEvent from "../../vox/event/ProgressDataEvent";


import EngineBase from "../../vox/engine/EngineBase";
import {Scene} from "./Scene";

class UIScene {

    constructor() { }
    scene: Scene = null;
    private m_engine: EngineBase = null;

    private m_switchEditBtn: SelectionBar = null;
    private m_addPosBtn: SelectionBar = null;
    private m_showPosBtn: SelectionBar = null;
    private m_currPosCurvationFreezeBtn: SelectionBar = null;
    private m_closePathBtn: SelectionBar = null;

    private m_curvatureFactorHeadBtn: ProgressBar = null;
    private m_curvatureFactorTailBtn: ProgressBar = null;

    initialize(engine: EngineBase): void {
        
        console.log("UIScene::initialize()......");
        if (this.m_engine == null) {
            this.m_engine = engine;
            this.m_engine.rscene.setClearUint24Color(0x656565);
            this.initBtns();
            
            this.scene.closePathBtn = this.m_closePathBtn;
            this.scene.pathEditor.pathCtrlEntityManager.currPosCurvationFreezeBtn = this.m_currPosCurvationFreezeBtn;
            this.scene.pathEditor.pathCtrlEntityManager.curvatureFactorHeadBtn = this.m_curvatureFactorHeadBtn;
            this.scene.pathEditor.pathCtrlEntityManager.curvatureFactorTailBtn = this.m_curvatureFactorTailBtn;
            this.scene.setEditEnabled(this.m_switchEditBtn != null ? this.m_switchEditBtn.isSelected() : false);            
        }
    }
    run(): void {

    }
    private initBtns(): void {
        let dis: number = 24
        if(RendererDevice.IsMobileWeb()) {
            this.m_btnSize = 64;
            dis = 40;
        }
        let btn = this.createSelectBtn("清理场景", "clearScene", "ON", "OFF", true);
        btn = this.createSelectBtn("保存数据", "saveData", "ON", "OFF", false);
        this.m_btnPY += dis;
        btn = this.createSelectBtn("构建几何数据", "buildGeomData", "ON", "OFF", false);
        this.m_btnPY += dis;
        btn = this.createSelectBtn("编辑场景", "switchEdit", "ON", "OFF", false);
        this.m_switchEditBtn = btn;
        btn = this.createSelectBtn("添加位置", "switchAddPathPos", "ON", "OFF", true);
        this.m_addPosBtn = btn;
        this.m_btnPY += dis;
        btn = this.createSelectBtn("网格显示", "switchWireframe", "ON", "OFF", false);
        btn = this.createSelectBtn("控制点显示", "showPathCtrlPos", "ON", "OFF", true);
        this.m_showPosBtn = btn;
        btn = this.createSelectBtn("开启路径闭合", "closePath", "ON", "OFF", false);
        this.m_closePathBtn = btn;
        this.m_btnPY += dis;
        let proBtn = this.createProgressBtn("尾部曲率因子", "curvatureFactorTail", 0.3);
        this.m_curvatureFactorTailBtn = proBtn;
        proBtn = this.createProgressBtn("头部曲率因子", "curvatureFactorHead", 0.3);
        this.m_curvatureFactorHeadBtn = proBtn;
        btn = this.createSelectBtn("当前位置曲率冻结", "currCurvatureFreeze", "ON", "OFF", false);
        this.m_currPosCurvationFreezeBtn = btn;
        btn = this.createSelectBtn("所有位置曲率冻结", "allCurvatureFreeze", "ON", "OFF", false);
        this.m_btnPY += dis;
        btn = this.createSelectBtn("", "dragCamera", "拖动场景", "旋转场景", false);
        btn = this.createSelectBtn("摄像机控制", "cameraCtrl", "ON", "OFF", true);
        
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
    private m_verticalSpace: number = 2;
    private m_btns: SelectionBar[] = [];
    private m_proBtns: ProgressBar[] = [];
    private m_bgLength: number = 100.0;
    
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
        this.m_btnPY += this.m_btnSize + this.m_verticalSpace;
        if (!visibleAlways) this.m_btns.push(selectBar);
        return selectBar;
    }
    
    private createProgressBtn(ns: string, uuid: string, progress: number, visibleAlways: boolean = false): ProgressBar {

        let proBar: ProgressBar = new ProgressBar();
        proBar.uuid = uuid;
        proBar.initialize(this.m_engine.uiScene, ns, this.m_btnSize, this.m_bgLength);
        proBar.setProgress(progress, false);
        proBar.addEventListener(ProgressDataEvent.PROGRESS, this, this.valueChange);
        proBar.setXY(this.m_btnPX, this.m_btnPY);
        this.m_btnPY += this.m_btnSize + this.m_verticalSpace;
        if (!visibleAlways) this.m_proBtns.push(proBar);
        return proBar;
    }
    private valueChange(evt: any): void {

        let progEvt: ProgressDataEvent = evt as ProgressDataEvent;
        let value: number = progEvt.value;
        switch( progEvt.uuid ) {
            case "curvatureFactorHead":
                this.scene.pathEditor.pathCtrlEntityManager.setcurrPosCurvatureFactor(value, 0);
                break;
            case "curvatureFactorTail":
                this.scene.pathEditor.pathCtrlEntityManager.setcurrPosCurvatureFactor(value, 1);
                break;
            default:
                break;
        }
    }
    private selectChange(evt: any): void {

        let selectEvt: SelectionEvent = evt as SelectionEvent;
        let flag: boolean = false;
        switch( selectEvt.uuid ) {
            case "switchWireframe":
                this.scene.roadEntityBuilder.setWireframeEnabled( selectEvt.flag );
                break;
            case "currCurvatureFreeze":
                this.scene.pathEditor.pathCtrlEntityManager.setcurrPosCurvatureFreeze( selectEvt.flag );
                break;
            case "allCurvatureFreeze":
                this.scene.pathEditor.pathCtrlEntityManager.setAllPosCurvatureFreeze( selectEvt.flag );
                if(selectEvt.flag) {
                    this.m_currPosCurvationFreezeBtn.select(false);
                }
                else {
                    
                    this.m_currPosCurvationFreezeBtn.deselect(false);
                }
                break
            case "cameraCtrl":
                this.m_engine.interaction.cameraCtrlEnabled = selectEvt.flag;
                break;
            case "dragCamera":
                if(this.m_switchEditBtn.isSelected()) {
                    this.scene.setEditEnabled(!selectEvt.flag);
                }
                if (selectEvt.flag) {
                    this.m_engine.interaction.stageDragCtrl.enableSlide();
                }
                else {
                    this.m_engine.interaction.stageDragCtrl.enableSwing();
                }
                break;
            case "showPathCtrlPos":
                this.scene.pathEditor.pathCtrlEntityManager.setCtrlPosVisible(selectEvt.flag);
                break;
            case "switchAddPathPos":
                this.scene.pathEditor.setAddPosEnabled(selectEvt.flag);
                break;
            case "switchEdit":
                this.scene.pathEditor.setEditEnabled(selectEvt.flag);
                break;
            case "closePath":
                flag = this.scene.pathEditor.setCloseEnabled(selectEvt.flag);
                if(selectEvt.flag !== flag) {
                    if(flag) this.m_closePathBtn.select(false);
                    else this.m_closePathBtn.deselect(false);
                }
                break;
            case "clearScene":
                this.m_addPosBtn.select(false);
                this.m_showPosBtn.select(false);
                this.scene.clear();
                break;
            case "saveData":
                this.scene.saveData();
                break;
            case "buildGeomData":
                this.scene.buildGeomData();
                break;
            default:
                break;
        }
    }
}

export {UIScene};
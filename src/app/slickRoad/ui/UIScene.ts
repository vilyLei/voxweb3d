
import RendererDevice from "../../../vox/render/RendererDevice";
import Vector3D from "../../../vox/math/Vector3D";
import MouseEvent from "../../../vox/event/MouseEvent";
import SelectionEvent from "../../../vox/event/SelectionEvent";
import SelectionBar from "../../../orthoui/button/SelectionBar";
import ProgressBar from "../../../orthoui/button/ProgressBar";
import ProgressDataEvent from "../../../vox/event/ProgressDataEvent";

import EngineBase from "../../../vox/engine/EngineBase";
import {Scene} from "../scene/Scene";
import TextButton from "../../../orthoui/button/TextButton";
import Color4 from "../../../vox/material/Color4";

class UIScene {

    constructor() { }
    scene: Scene = null;
    private m_engine: EngineBase = null;

    private m_switchSceneEditBtn: SelectionBar = null;
    private m_ctrlAddPosBtn: SelectionBar = null;
    private m_showPosBtn: SelectionBar = null;
    private m_currPosCurvationFreezeBtn: SelectionBar = null;
    private m_closePathBtn: SelectionBar = null;

    private m_segTotalCtrlBtn: ProgressBar = null;

    private m_currRoadWidthBtn: ProgressBar = null;
    private m_currRoadWidthChangeFactorBtn: ProgressBar = null;
    private m_currRoadWidthFactorBtn: ProgressBar = null;
    private m_wholeWidthScaleBtn: ProgressBar = null;
    private m_curvatureFactorHeadBtn: ProgressBar = null;
    private m_curvatureFactorTailBtn: ProgressBar = null;

    initialize(engine: EngineBase): void {
        
        console.log("UIScene::initialize()......");
        if (this.m_engine == null) {
            this.m_engine = engine;
            this.m_engine.rscene.setClearUint24Color(0x656565);
            this.initBtns();

            //this.scene.pathEditor.pathCtrlEntityManager.ctrlAddPosBtn = this.m_ctrlAddPosBtn;
            this.scene.pathEditor.pathCtrlEntityManager.currPosCurvationFreezeBtn = this.m_currPosCurvationFreezeBtn;
            this.scene.pathEditor.pathCtrlEntityManager.segTotalCtrlBtn = this.m_segTotalCtrlBtn;
            this.scene.pathEditor.pathCtrlEntityManager.curvatureFactorHeadBtn = this.m_curvatureFactorHeadBtn;
            this.scene.pathEditor.pathCtrlEntityManager.curvatureFactorTailBtn = this.m_curvatureFactorTailBtn;

            this.scene.pathEditor.pathCtrlEntityManager.currRoadWidthBtn = this.m_currRoadWidthBtn;
            this.scene.pathEditor.pathCtrlEntityManager.currRoadWidthChangeFactorBtn = this.m_currRoadWidthChangeFactorBtn;
            this.scene.pathEditor.pathCtrlEntityManager.currRoadWidthFactorBtn = this.m_currRoadWidthFactorBtn;

            this.m_wholeWidthScaleBtn.setValue(0.25,true);
            this.scene.setEditEnabled(this.m_switchSceneEditBtn != null ? this.m_switchSceneEditBtn.isSelected() : false);            
        }
    }
    run(): void {

    }
    
    private m_btnSize: number = 24;
    private m_btnPX: number = 80.0;
    private m_btnPY: number = 95.0;
    private m_verticalSpace: number = 2;
    private m_selectBtns: SelectionBar[] = [];
    private m_btns: TextButton[] = [];
    private m_proBtns: ProgressBar[] = [];
    private m_bgLength: number = 100.0;
    private m_btnBgColor: Color4 = new Color4(1.0,1.0,1.0,0.3);
    private initBtns(): void {

        let dis: number = 6;
        this.m_btnSize = 20;
        this.m_verticalSpace = 3;
        if(RendererDevice.IsMobileWeb()) {
            this.m_btnSize = 64;
            dis = 40;
        }
        let fontColor0: Color4 = new Color4(0.1,1.0,1.0);
        let fontColor1: Color4 = new Color4(0.3,1.0,1.0);
        let fontColor2: Color4 = new Color4(1.0,0.0,1.0);
        let texBtn: TextButton;
        let selectBtn: SelectionBar;
        selectBtn = this.createSelectBtn("新建场景", "newScene", "开", "关", true);
        selectBtn = this.createSelectBtn("清理场景", "clearScene", "开", "关", true);
        this.m_btnPY += dis;
        selectBtn = this.createSelectBtn("模型储存", "saveGeomData", "开", "关", true, false, fontColor0);
        selectBtn = this.createSelectBtn("切线储存", "saveTVData", "开", "关", true, false, fontColor0);
        selectBtn = this.createSelectBtn("保存数据", "saveData", "开", "关", false, false, fontColor0);
        selectBtn = this.createSelectBtn("保存工程", "saveProject", "开", "关", false, false, fontColor0);

        this.m_btnPY += dis;
        //  selectBtn = this.createSelectBtn("构建几何数据", "buildGeomData", "开", "关", false);
        //  this.m_btnPY += dis;
        selectBtn = this.createSelectBtn("场景编辑", "switchSceneEdit", "开", "关", false);
        this.m_switchSceneEditBtn = selectBtn;
        this.m_btnPY += dis;
        
        this.m_btnBgColor.setRGBA4f(0.0,0.7,0.3,0.3);
        fontColor0.setRGB3f(1.3,1.0,0.0);
        fontColor2.setRGBA4f(2.1,0.7,3.7, 1.0);
        selectBtn = this.createSelectBtn("地形显示", "terrainShow", "开", "关", false, false, fontColor2);
        selectBtn.setOverColor(fontColor0);
        selectBtn.setOutColor(fontColor2);
        selectBtn.nameButton.setColor(selectBtn.nameButton.outColor);
        selectBtn = this.createSelectBtn("网格显示", "switchWireframe", "开", "关", false, false, fontColor2);
        selectBtn.setOverColor(fontColor0);
        selectBtn.setOutColor(fontColor2);
        selectBtn = this.createSelectBtn("控点显示", "showPathCtrlPos", "开", "关", true, false, fontColor2);
        selectBtn.setOverColor(fontColor0);
        selectBtn.setOutColor(fontColor2);
        this.m_btnBgColor.setRGBA4f(1.0,1.0,1.0,0.3);
        this.m_btnPY += dis;
        this.m_showPosBtn = selectBtn;
        selectBtn = this.createSelectBtn("路径闭合", "closePath", "开", "关", false, false, fontColor1);
        this.m_closePathBtn = selectBtn;
        selectBtn = this.createSelectBtn("增加控点", "ctrlAddPosBtn", "开", "关", true, false, fontColor1);
        this.m_ctrlAddPosBtn = selectBtn;
        this.m_btnPY += dis;
        texBtn = this.createTextBtn("删除对象", "delCurrObject", false, fontColor1);
        texBtn = this.createTextBtn("添加对象", "addCurrObject", false, fontColor1);
        this.m_btnPY += dis;
        let proBtn: ProgressBar;
        proBtn = this.createProgressBtn("路面宽度", "currRoadWidth", 0.15);
        this.m_currRoadWidthBtn = proBtn;
        proBtn = this.createProgressBtn("路宽变化", "currRoadWidthChangeFactor", 0.2);
        this.m_currRoadWidthChangeFactorBtn = proBtn;
        proBtn = this.createProgressBtn("路宽系数", "currRoadWidthFactor", 0.2);
        this.m_currRoadWidthFactorBtn = proBtn;
        proBtn = this.createProgressBtn("全局路宽", "wholeWidthScale", 0.2);
        this.m_wholeWidthScaleBtn = proBtn;
        proBtn = this.createProgressBtn("分段密度", "segTotalCtrl", 0.2);
        proBtn.step = 0.01;
        this.m_segTotalCtrlBtn = proBtn;
        this.m_btnPY += dis;
        proBtn = this.createProgressBtn("尾部弯度", "curvatureFactorTail", 0.3);
        this.m_curvatureFactorTailBtn = proBtn;
        proBtn = this.createProgressBtn("头部弯度", "curvatureFactorHead", 0.3);
        this.m_curvatureFactorHeadBtn = proBtn;
        proBtn = this.createProgressBtn("弯度夹角", "curvatureAngle", 0.0);
        proBtn = this.createProgressBtn("弯度朝向", "curvatureDirec", 0.0);
        selectBtn = this.createSelectBtn("当前弯度", "currCurvatureFreeze", "已冻结", "未冻结", false);
        this.m_currPosCurvationFreezeBtn = selectBtn;
        selectBtn = this.createSelectBtn("全局弯度", "allCurvatureFreeze", "已冻结", "未冻结", false);
        this.m_btnPY += dis;
        selectBtn = this.createSelectBtn("", "dragCamera", "拖动场景", "旋转场景", false);
        selectBtn = this.createSelectBtn("像机控制", "cameraCtrl", "开", "关", true);
        
        let minX: number = 1000;
        let pos: Vector3D = new Vector3D();
        for(let i: number = 0; i < this.m_selectBtns.length; ++i) {
            this.m_selectBtns[i].getPosition(pos);
            let px: number = this.m_selectBtns[i].getRect().x + pos.x;
            if(px < minX) {
                minX = px;
            }
        }
        for(let i: number = 0; i < this.m_proBtns.length; ++i) {
            this.m_proBtns[i].getPosition(pos);
            let px: number = this.m_proBtns[i].getRect().x + pos.x;
            if(px < minX) {
                minX = px;
            }
        }
        for(let i: number = 0; i < this.m_btns.length; ++i) {
            this.m_btns[i].getPosition(pos);
            let px: number = this.m_btns[i].getRect().x + pos.x;
            if(px < minX) {
                minX = px;
            }
        }

        let dx: number = 30 - minX;
        for(let i: number = 0; i < this.m_selectBtns.length; ++i) {
            this.m_selectBtns[i].getPosition(pos);
            pos.x += dx;
            this.m_selectBtns[i].setXY(pos.x, pos.y);
        }
        for(let i: number = 0; i < this.m_proBtns.length; ++i) {
            this.m_proBtns[i].getPosition(pos);
            pos.x += dx;
            this.m_proBtns[i].setXY(pos.x, pos.y);
        }
        for(let i: number = 0; i < this.m_btns.length; ++i) {
            this.m_btns[i].getPosition(pos);
            pos.x += dx;
            pos.x -= this.m_btns[i].getRect().width;
            this.m_btns[i].setXY(pos.x, pos.y);
        }

    }
    
    
    private createTextBtn(ns: string, uuid: string, visibleAlways: boolean = false, fontColor: Color4 = null): TextButton {

        let selectBtn: TextButton = new TextButton();
        selectBtn.fontBgColor.copyFrom(this.m_btnBgColor);
        selectBtn.uuid = uuid;
        if(fontColor != null)selectBtn.fontColor.copyFrom(fontColor);
        selectBtn.initialize(this.m_engine.uiScene, ns, this.m_btnSize);
        selectBtn.addEventListener(MouseEvent.MOUSE_DOWN, this, this.btnMouseDown);

        selectBtn.setXY(this.m_btnPX, this.m_btnPY);
        this.m_btnPY += this.m_btnSize + this.m_verticalSpace;
        if (!visibleAlways) this.m_btns.push(selectBtn);

        return selectBtn;
    }
    private createSelectBtn(ns: string, uuid: string, selectNS: string, deselectNS: string, flag: boolean, visibleAlways: boolean = false, fontColor: Color4 = null): SelectionBar {

        let selectBar: SelectionBar = new SelectionBar();
        selectBar.fontBgColor.copyFrom(this.m_btnBgColor);
        selectBar.uuid = uuid;
        if(fontColor != null) {
            selectBar.fontColor.copyFrom(fontColor);
        }
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
        if (!visibleAlways) this.m_selectBtns.push(selectBar);
        return selectBar;
    }
    
    private createProgressBtn(ns: string, uuid: string, progress: number, visibleAlways: boolean = false, fontColor: Color4 = null): ProgressBar {

        let proBar: ProgressBar = new ProgressBar();
        proBar.fontBgColor.copyFrom(this.m_btnBgColor);
        if(fontColor != null) proBar.fontColor.copyFrom(fontColor);
        else proBar.fontColor.setRGB3f(1.0, 1.0, 1.0);
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
            case "currRoadWidthChangeFactor":
                this.scene.pathEditor.pathCtrlEntityManager.setCurrWidthChangeFactor(value);
                break;
            case "currRoadWidthFactor":
                this.scene.pathEditor.pathCtrlEntityManager.setCurrWidthFactor(value);
                break;
            case "currRoadWidth":
                this.scene.pathEditor.pathCtrlEntityManager.setCurrWidth(value);
                break;
            case "wholeWidthScale":
                this.scene.pathEditor.setPathWholeWidthScale(value);
                break;
            case "segTotalCtrl":
                this.scene.pathEditor.pathCtrlEntityManager.setSegmentsTotalFactor(value);
                break;
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
    
    private btnMouseDown(evt: any): void {

        let mEvt: MouseEvent = evt as MouseEvent;
        switch( mEvt.uuid ) {
            case "addCurrObject":
                this.scene.pathEditor.insertCtrlPosFromCurrPos();
                break;
            case "delCurrObject":
                this.scene.pathEditor.delCurrCtrlPos();
                break;
            default:
                break;
        }
    }
    private selectChange(evt: any): void {

        let selectEvt: SelectionEvent = evt as SelectionEvent;
        let flag: boolean = false;
        switch( selectEvt.uuid ) {
            case "terrainShow":
                this.scene.terrain.setVisible( selectEvt.flag );
                break;
            case "switchWireframe":
                this.scene.roadEntityBuilder.segObjManager.setWireframeEnabled( selectEvt.flag );
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
                if(this.m_switchSceneEditBtn.isSelected()) {
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
            case "ctrlAddPosBtn":
                this.scene.pathEditor.setAddPosEnabled(selectEvt.flag);
                break;
            case "switchSceneEdit":
                //this.scene.pathEditor.setEditEnabled(selectEvt.flag);
                this.scene.setEditEnabled(selectEvt.flag);
                if(!selectEvt.flag) {
                    this.m_ctrlAddPosBtn.deselect(true);
                }
                break;
            case "closePath":
                flag = this.scene.pathEditor.setCloseEnabled(selectEvt.flag);
                if(selectEvt.flag !== flag) {
                    if(flag) this.m_closePathBtn.select(false);
                    else this.m_closePathBtn.deselect(false);
                }
                break;
            case "newScene":
                break;
            case "clearScene":
                this.clearScene();
                break;
            case "saveGeomData":
                this.scene.fileSystem.setSaveGeomEnabled(selectEvt.flag);
                break;
            case "saveData":
                this.scene.fileSystem.saveData();
                break;
            case "buildGeomData":
                this.scene.buildGeomData();
                break;
            default:
                break;
        }
    }
    private newScene(): void {
        this.scene.newScene();
    }
    private clearScene(): void {
        this.m_ctrlAddPosBtn.select(false);
        this.m_showPosBtn.select(false);
        this.m_closePathBtn.select(false);
        this.scene.clearScene();
    }
}

export {UIScene};
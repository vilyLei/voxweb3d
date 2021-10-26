
import RendererDevice from "../../vox/render/RendererDevice";
import Vector3D from "../../vox/math/Vector3D";
import SelectionEvent from "../../vox/event/SelectionEvent";
import SelectionBar from "../../orthoui/button/SelectionBar";

import EngineBase from "../../vox/engine/EngineBase";
import {Scene} from "./Scene";

class UIScene {

    constructor() { }
    scene: Scene = null;
    private m_engine: EngineBase = null;

    private m_switchEditBtn: SelectionBar = null;
    private m_addPosBtn: SelectionBar = null;
    private m_showPosBtn: SelectionBar = null;

    initialize(engine: EngineBase): void {
        
        console.log("UIScene::initialize()......");
        if (this.m_engine == null) {
            this.m_engine = engine;
            this.m_engine.rscene.setClearUint24Color(0x656565);
            this.initBtns();
            
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
        btn = this.createSelectBtn("编辑状态", "switchEdit", "ON", "OFF", false);
        this.m_switchEditBtn = btn;
        btn = this.createSelectBtn("添加位置", "switchAddPathPos", "ON", "OFF", true);
        this.m_addPosBtn = btn;
        btn = this.createSelectBtn("控制点显示", "showPathCtrlPos", "ON", "OFF", true);
        this.m_showPosBtn = btn;
        btn = this.createSelectBtn("拖动摄像机", "dragCamera", "ON", "OFF", false);
        btn = this.createSelectBtn("开启路径闭合", "closePath", "ON", "OFF", false);
        this.scene.closePathBtn = btn;
        this.m_btnPY += dis;
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
        console.log("selectEvt.uuid: ",selectEvt.uuid, selectEvt.flag);
        switch( selectEvt.uuid ) {
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
                this.scene.pathEditor.setCloseEnabled(selectEvt.flag);
                break;
            case "clearScene":
                this.m_addPosBtn.select(false);
                this.m_showPosBtn.select(false);
                this.scene.clear();
                break;
            case "saveData":
                this.scene.saveData();
                break;
            default:
                break;
        }
    }
    private switchEdit(flag: boolean): void {
        
        this.scene.setEditEnabled(flag);
    }
}

export {UIScene};
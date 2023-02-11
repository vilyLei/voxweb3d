import RendererDevice from "../../vox/render/RendererDevice";
import MouseEvent from "../../vox/event/MouseEvent";

import RendererParam from "../../vox/scene/RendererParam";
import RendererScene from "../../vox/scene/RendererScene";

import RendererSubScene from "../../vox/scene/RendererSubScene";
import ProgressBar from "../../orthoui/button/ProgressBar";
import ProgressDataEvent from "../../vox/event/ProgressDataEvent";
import CanvasTextureTool from "../../orthoui/assets/CanvasTextureTool";
import SelectionEvent from "../../vox/event/SelectionEvent";
import SelectionBar from "../../orthoui/button/SelectionBar";
import RGBColorPanel, { RGBColoSelectEvent } from "../../orthoui/panel/RGBColorPanel";
import Color4 from "../../vox/material/Color4";
import Vector3D from "../../vox/math/Vector3D";
import MathConst from "../../vox/math/MathConst";
import AABB2D from "../../vox/geom/AABB2D";
import Plane3DEntity from "../../vox/entity/Plane3DEntity";

// ns: string, uuid: string, selectNS: string, deselectNS: string, flag: boolean, visibleAlways: boolean = false
// ns: string, uuid: string, progress: number, visibleAlways: boolean = false
// ns: string, uuid: string, value: number, minValue: number, maxValue: number, visibleAlways: boolean = false
interface CtrlInfo {
    type: string;
    uuid: string;
    values: number[];
    flag: boolean;
    colorPick?: boolean;
}
type ItemCallback = (info: CtrlInfo) => void;
interface CtrlItemParam {

    name: string;
    uuid: string;
    callback: ItemCallback;
    /**
     * 存放 颜色值等参数
     */
    values?: number[];
    /**
     * 取值说明: "number_value"(数值调节按钮),"progress"(百分比调节按钮),"status_select"(状态选择按钮)
     */
    type: string;
    /**
     * 是否需要动态拾取颜色
     */
    colorPick?: boolean;
    /**
     * 状态选择按钮选中的状态名
     */
    selectNS?: string;
    /**
     * 状态选择按钮取消选中的状态名
     */
    deselectNS?: string;
    /**
     * 状态选中按钮初始状态
     */
    flag?: boolean;
    /**
     * 是否总是显示
     */
    visibleAlways?: boolean;
    /**
     * 百分比按钮(取值于0.0 -> 1.0)初始值
     */
    progress?: number;
    /**
     * 数值调节按钮的初始值
     */
    value?: number;
    /**
     * 数值调节按钮的取值范围最小值
     */
    minValue?: number;
    /**
     * 数值调节按钮的取值范围最大值
     */
    maxValue?: number;
}
class ItemObj {
    constructor() { }
    type = "";
    uuid = "";
    btn: SelectionBar | ProgressBar = null;
    desc: CtrlItemParam = null;
    color = [1.0, 1.0, 1.0];
    colorId = -1;
}
export default class ParamCtrlUI {

    private m_rscene: RendererScene = null;

    ruisc: RendererSubScene = null;
    rgbPanel: RGBColorPanel;

    constructor() { }

    initialize(rscene: RendererScene, buildDisplay: boolean = true): void {

        if (this.m_rscene == null) {

            this.m_rscene = rscene;;

            this.m_rscene.addEventListener(MouseEvent.MOUSE_BG_DOWN, this, this.mouseBgDown);


            CanvasTextureTool.GetInstance().initialize(this.m_rscene);
            CanvasTextureTool.GetInstance().initializeAtlas(1024, 1024, new Color4(1.0, 1.0, 1.0, 0.0), true);
            this.initUIScene(buildDisplay);
        }
    }
    close(): void {
        if (this.m_menuBtn != null) {
            this.menuCtrl(false);
            this.m_menuBtn.select(false);
            this.m_selectPlane.setVisible(false);
        }
    }
    open(): void {
        if (this.m_menuBtn != null) {
            this.menuCtrl(true);
            this.m_menuBtn.deselect(true);
        }
    }
    isOpen(): boolean {
        return this.m_menuBtn != null && !this.m_menuBtn.isSelected();
    }
    private initUIScene(buildDisplay: boolean): void {

        let rparam: RendererParam = new RendererParam();
        rparam.cameraPerspectiveEnabled = false;
        rparam.setCamProject(45.0, 0.1, 3000.0);
        rparam.setCamPosition(0.0, 0.0, 1500.0);

        let subScene: RendererSubScene = null;
        subScene = this.m_rscene.createSubScene() as RendererSubScene;
        subScene.initialize(rparam);
        subScene.enableMouseEvent(true);
        this.ruisc = subScene;
        let stage = this.m_rscene.getStage3D();
        this.ruisc.getCamera().translationXYZ(stage.stageHalfWidth, stage.stageHalfHeight, 1500.0);
        this.ruisc.getCamera().update();

        if (buildDisplay) {
            this.initUI();
        }

    }

    private initUI(): void {
        this.initCtrlBars();

    }
    private m_btnSize = 30;
    private m_bgLength = 200.0;
    private m_btnPX = 122.0;
    private m_btnPY = 10.0;
    private m_btnYSpace = 4.0;
    private m_pos = new Vector3D();
    private m_selectPlane: Plane3DEntity = null;

    private m_visiBtns: any[] = [];
    private m_btns: any[] = [];
    private m_menuBtn: SelectionBar = null;
    private m_minBtnX = 10000;
    private createSelectBtn(ns: string, uuid: string, selectNS: string, deselectNS: string, flag: boolean, visibleAlways: boolean = false): SelectionBar {

        let selectBar = new SelectionBar();
        selectBar.uuid = uuid;
        selectBar.initialize(this.ruisc, ns, selectNS, deselectNS, this.m_btnSize);
        selectBar.addEventListener(SelectionEvent.SELECT, this, this.selectChange);
        if (flag) {
            selectBar.select(false);
        }
        else {
            selectBar.deselect(false);
        }
        selectBar.setXY(this.m_btnPX, this.m_btnPY);
        this.m_btnPY += this.m_btnSize + this.m_btnYSpace;
        if (!visibleAlways) this.m_visiBtns.push(selectBar);
        this.m_btns.push(selectBar);

        let minX = this.m_btnPX + selectBar.getRect().x;
        if (minX < this.m_minBtnX) {
            this.m_minBtnX = minX;
        }
        return selectBar;
    }
    private createProgressBtn(ns: string, uuid: string, progress: number, visibleAlways: boolean = false): ProgressBar {

        let proBar = new ProgressBar();
        proBar.uuid = uuid;
        proBar.initialize(this.ruisc, ns, this.m_btnSize, this.m_bgLength);
        proBar.setProgress(progress, false);
        proBar.addEventListener(ProgressDataEvent.PROGRESS, this, this.valueChange);
        proBar.setXY(this.m_btnPX, this.m_btnPY);
        this.m_btnPY += this.m_btnSize + this.m_btnYSpace;
        if (!visibleAlways) this.m_visiBtns.push(proBar);
        this.m_btns.push(proBar);

        let minX = this.m_btnPX + proBar.getRect().x;
        if (minX < this.m_minBtnX) {
            this.m_minBtnX = minX;
        }
        return proBar;
    }

    private createValueBtn(ns: string, uuid: string, value: number, minValue: number, maxValue: number, visibleAlways: boolean = false): ProgressBar {

        let proBar = new ProgressBar();
        proBar.uuid = uuid;
        proBar.initialize(this.ruisc, ns, this.m_btnSize, this.m_bgLength);
        proBar.minValue = minValue;
        proBar.maxValue = maxValue;
        proBar.setValue(value, false);

        proBar.addEventListener(ProgressDataEvent.PROGRESS, this, this.valueChange);
        proBar.setXY(this.m_btnPX, this.m_btnPY);
        this.m_btnPY += this.m_btnSize + this.m_btnYSpace;
        if (!visibleAlways) this.m_visiBtns.push(proBar);
        this.m_btns.push(proBar);

        let minX = this.m_btnPX + proBar.getRect().x;
        if (minX < this.m_minBtnX) {
            this.m_minBtnX = minX;
        }
        return proBar;
    }
    private moveSelectToBtn(btn: ProgressBar | SelectionBar): void {

        let rect: AABB2D = btn.getRect();
        btn.getPosition(this.m_pos);
        this.m_pos.x += rect.x;
        this.m_selectPlane.setXYZ(this.m_pos.x, this.m_pos.y, -1.0);
        this.m_selectPlane.setScaleXYZ(rect.width, rect.height, 1.0);
        this.m_selectPlane.update();
        this.m_selectPlane.setVisible(true);
    }
    private initCtrlBars(): void {

        if (RendererDevice.IsMobileWeb()) {
            this.m_btnSize = 64;
            this.m_btnPX = 300;
            this.m_btnPY = 30;
        }
        if (RendererDevice.IsWebGL1()) {
            this.m_btnPX += 32;
            this.m_btnSize = MathConst.CalcCeilPowerOfTwo(this.m_btnSize);
        }
        this.m_menuBtn = this.createSelectBtn("", "menuCtrl", "Menu Open", "Menu Close", false, true);

        this.m_selectPlane = new Plane3DEntity();
        this.m_selectPlane.vertColorEnabled = true;
        this.m_selectPlane.color0.setRGB3f(0.0, 0.3, 0.0);
        this.m_selectPlane.color1.setRGB3f(0.0, 0.3, 0.0);
        this.m_selectPlane.color2.setRGB3f(0.0, 0.5, 0.5);
        this.m_selectPlane.color3.setRGB3f(0.0, 0.5, 0.5);
        this.m_selectPlane.initializeXOY(0, 0, 1.0, 1.0);
        this.ruisc.addEntity(this.m_selectPlane);
        this.m_selectPlane.setVisible(false);

        // console.log("XXXXXXXXXXXX this.m_minBtnX: ", this.m_minBtnX);
        let flag = RendererDevice.IsMobileWeb();
        this.rgbPanel = new RGBColorPanel();
        this.rgbPanel.initialize(flag ? 64 : 32, 4);
        this.rgbPanel.addEventListener(RGBColoSelectEvent.COLOR_SELECT, this, this.selectColor);
        this.rgbPanel.setXY(this.m_btnPX, this.m_btnPY);
        this.rgbPanel.close();
        this.ruisc.addContainer(this.rgbPanel, 1);
    }
    private m_btnMap: Map<string, ItemObj> = new Map();
    //"number_value"(数值调节按钮),"progress"(百分比调节按钮),"status_select"(状态选择按钮)
    addItem(param: CtrlItemParam): void {

        let map = this.m_btnMap;
        if (!map.has(param.uuid)) {
            let obj = new ItemObj();
            obj.desc = param;
            obj.type = param.type;
            obj.uuid = param.uuid;
            let t = param;
            let visibleAlways = t.visibleAlways ? t.visibleAlways : false;

            t.colorPick = t.colorPick ? t.colorPick : false;

            switch (param.type) {
                case "number_value":
                case "number":
                    t.value = t.value ? t.value : 0.0;
                    t.minValue = t.minValue ? t.minValue : 0.0;
                    t.maxValue = t.maxValue ? t.maxValue : 10.0;
                    obj.btn = this.createValueBtn(t.name, t.uuid, t.value, t.minValue, t.maxValue);
                    map.set(obj.uuid, obj);
                    if (!t.colorPick) {
                        param.callback({type: param.type, uuid: param.uuid, values: [t.value], flag: t.flag});
                    }
                    break;
                case "progress":
                    t.progress = t.progress ? t.progress : 0.0;
                    obj.btn = this.createProgressBtn(t.name, t.uuid, t.progress, visibleAlways);
                    map.set(obj.uuid, obj);
                    if (!t.colorPick) {
                        param.callback({type: param.type, uuid: param.uuid, values:[t.progress], flag:t.flag});
                    }
                    break;
                case "status":
                case "status_select":
                    t.flag = t.flag ? t.flag : false;
                    obj.btn = this.createSelectBtn(t.name, t.uuid, t.selectNS, t.deselectNS, t.flag, visibleAlways);
                    map.set(obj.uuid, obj);
                    param.callback({type: param.type, uuid: param.uuid, values:[], flag: t.flag});
                    break;
                default:
                    break;
            }
        }
    }
    addItems(params: CtrlItemParam[]): void {
        for(let i = 0; i < params.length; ++i) {
            this.addItem( params[i] );
        }
    }
    private menuCtrl(flag: boolean): void {

        if (flag && !this.m_visiBtns[0].isOpen()) {
            for (let i: number = 0; i < this.m_visiBtns.length; ++i) {
                this.m_visiBtns[i].open();
            }
            this.m_menuBtn.getPosition(this.m_pos);
            this.m_pos.x = this.m_btnPX;
            this.m_menuBtn.setPosition(this.m_pos);
        }
        else if (this.m_visiBtns[0].isOpen()) {
            for (let i: number = 0; i < this.m_visiBtns.length; ++i) {
                this.m_visiBtns[i].close();
            }
            this.m_menuBtn.getPosition(this.m_pos);
            this.m_pos.x = 0;
            this.m_menuBtn.setPosition(this.m_pos);
            this.m_selectPlane.setVisible(false);
        }
        if (this.rgbPanel != null) this.rgbPanel.close();
    }
    updateLayout(force: boolean = false): void {

        let dis = 5 - this.m_minBtnX;
        let pos = new Vector3D();
        let btns = force ? this.m_btns : this.m_visiBtns;

        for (let i = 0; i < btns.length; ++i) {
            btns[i].getPosition(pos);
            pos.x += dis;
            btns[i].setPosition(pos);
            btns[i].update();
        }
        this.rgbPanel.setXY(this.m_btnPX, this.m_btnPY);
    }

    private selectChange(evt: any): void {

        let selectEvt = evt as SelectionEvent;
        let flag = selectEvt.flag;
        let uuid = selectEvt.uuid;
        let map = this.m_btnMap;
        if (map.has(uuid)) {
            let obj = map.get(uuid);
            let param = obj.desc;
            let btn = obj.btn as SelectionBar;
            if (param.callback != null && param.flag != flag) {
                param.flag = flag;
                param.callback({type: param.type, uuid: uuid, values: [], flag: flag});
            }
            this.moveSelectToBtn(selectEvt.target);
        }
        if (this.rgbPanel != null) this.rgbPanel.close();
    }
    private m_currUUID = "";

    // materialStatusVersion: number = 0;
    private selectColor(evt: any): void {

        let currEvt = evt as RGBColoSelectEvent;
        console.log("selectColor, currEvt: ", currEvt);
        let uuid = this.m_currUUID;
        let map = this.m_btnMap;
        if (map.has(uuid)) {
            let obj = map.get(uuid);
            let param = obj.desc;
            if (param.colorPick) {
                obj.colorId = currEvt.colorId;
                let color = currEvt.color;
                let vs = obj.color;
                vs[0] = color.r;
                vs[1] = color.g;
                vs[2] = color.b;
                if (param.callback != null) {
                    let f = 1.0;
                    if (param.type == "progress") {
                        f = param.progress;
                    } else {
                        f = param.value;
                    }
                    console.log("select color f: ", f);
                    let cvs = vs.slice();
                    cvs[0] *= f; cvs[1] *= f; cvs[2] *= f;
                    param.callback({type: param.type, uuid: uuid, values: cvs, flag: true, colorPick: true});
                }
            }
        }
    }
    private valueChange(evt: any): void {

        let progEvt = evt as ProgressDataEvent;
        let value = progEvt.value;
        let uuid = progEvt.uuid;
        let map = this.m_btnMap;
        let changeFlag = this.m_currUUID != uuid;
        this.m_currUUID = uuid;
        console.log("valueChange, init...progEvt.status: ", progEvt.status, "changeFlag: ", changeFlag);
        if (map.has(uuid)) {
            let obj = map.get(uuid);
            let param = obj.desc;
            let btn = obj.btn as ProgressBar;
            if (progEvt.status == 2) {
                let dirty = false;
                if (param.type == "progress") {
                    // console.log("valueChange: ", param.progress,value);
                    if (param.callback != null && Math.abs(param.progress - value) > 0.00001) {
                        param.progress = value;
                        dirty = true;
                    }
                } else {
                    // console.log("valueChange: ", param.value,value);
                    if (param.callback != null && Math.abs(param.value - value) > 0.00001) {
                        param.value = value;
                        dirty = true;
                    }
                }
                if(dirty) {
                    if (param.colorPick) {
                        let cvs = obj.color.slice();
                        cvs[0] *= value; cvs[1] *= value; cvs[2] *= value;
                        param.callback({type: param.type, uuid: uuid, values: cvs, flag: true, colorPick: true});
                    } else {
                        param.callback({type: param.type, uuid: uuid, values: [value], flag: true});
                    }
                }
                if (this.rgbPanel != null && changeFlag) this.rgbPanel.close();
            } else if (progEvt.status == 0) {
                console.log("select the btn");
                if (param.colorPick) {
                    if (this.rgbPanel != null && this.rgbPanel.isClosed()) {
                        this.rgbPanel.open();
                    }
                    if (obj.colorId >= 0) this.rgbPanel.selectColorById(obj.colorId);
                } else {
                    if (this.rgbPanel != null) this.rgbPanel.close();
                }
            }
            this.moveSelectToBtn(progEvt.target);
        }
    }
    private mouseBgDown(evt: any): void {
        if (this.rgbPanel != null) this.rgbPanel.close();
    }
    
    addStatusItem(name: string, uuid: string, selectNS: string, deselectNS: string, flag: boolean, callback: ItemCallback, visibleAlways: boolean = true): void {
        let param: CtrlItemParam = {
            type: "status_select", name: name, uuid: uuid,
            selectNS: selectNS, deselectNS: deselectNS,
            flag: flag,
            visibleAlways: visibleAlways,
            callback: callback
        };

        this.addItem(param);
    }
    addProgressItem(name: string, uuid: string, progress: number, callback: ItemCallback, colorPick?: boolean, visibleAlways: boolean = true): void {
        let param: CtrlItemParam = {
            type: "progress", name: name, uuid: uuid,
            progress: progress,
            visibleAlways: visibleAlways,
            colorPick: colorPick,
            callback: callback
        };
        this.addItem(param);
    }

    addValueItem(name: string, uuid: string, value: number, minValue: number, maxValue: number, callback: ItemCallback, colorPick?: boolean, visibleAlways: boolean = true, values?: number[]): void {
        let param: CtrlItemParam = {
            type: "number_value", name: name, uuid: uuid,
            value: value,
            minValue: minValue,
            maxValue: maxValue,
            visibleAlways: visibleAlways,
            colorPick: colorPick,
            values: values,
            callback: callback
        };
        this.addItem(param);
    }
}
export { CtrlInfo, ItemCallback, CtrlItemParam, ParamCtrlUI };
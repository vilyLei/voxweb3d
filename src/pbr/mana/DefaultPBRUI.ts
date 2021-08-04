
import RendererDeviece from "../../vox/render/RendererDeviece";
import MouseEvent from "../../vox/event/MouseEvent";

import TextureProxy from "../../vox/texture/TextureProxy";
import { TextureConst } from "../../vox/texture/TextureConst";
import ImageTextureLoader from "../../vox/texture/ImageTextureLoader";

import RendererParam from "../../vox/scene/RendererParam";
import RendererScene from "../../vox/scene/RendererScene";

import DefaultPBRCase from "../../pbr/mana/DefaultPBRCase";

import RendererSubScene from "../../vox/scene/RendererSubScene";
import ProgressBar from "../../orthoui/demos/base/ProgressBar";
import ProgressDataEvent from "../../vox/event/ProgressDataEvent";
import CanvasTextureTool from "../../orthoui/demos/base/CanvasTextureTool";
import SelectionEvent from "../../vox/event/SelectionEvent";
import SelectionBar from "../../orthoui/demos/base/SelectionBar";
//import IPBRMaterial from "../material/IPBRMaterial";
import IPBRMaterial from "../material/IPBRMaterial";
import RGBColorPanel, { RGBColoSelectEvent } from "../../orthoui/panel/RGBColorPanel";
import Color4 from "../../vox/material/Color4";
import Vector3D from "../../vox/math/Vector3D";
import IPBRUI from "./IPBRUI";
import { ColorParamUnit } from "./PBRParamUnit";
import IPBRParamEntity from "./IPBRParamEntity";
import ColorRectImgButton from "../../orthoui/button/ColorRectImgButton";
import RendererState from "../../vox/render/RendererState";
import MathConst from "../../vox/math/MathConst";
import MaterialBase from "../../vox/material/MaterialBase";

export class DefaultPBRUI implements IPBRUI {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader = null;

    ruisc: RendererSubScene = null;

    rgbPanel: RGBColorPanel;

    metalBtn: ProgressBar;
    roughBtn: ProgressBar;
    noiseBtn: ProgressBar;
    reflectionBtn: ProgressBar;
    sideBtn: ProgressBar;
    surfaceBtn: ProgressBar;
    scatterBtn: ProgressBar;
    toneBtn: ProgressBar;
    f0ColorBtn: ProgressBar;
    albedoBtn: ProgressBar;
    ambientBtn: ProgressBar;
    specularBtn: ProgressBar;


    absorbBtn: SelectionBar;
    vtxNoiseBtn: SelectionBar;

    getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }

    initialize(rscene: RendererScene, texLoader: ImageTextureLoader, buildDisplay: boolean = true): void {

        if (this.m_rscene == null) {
            this.m_rscene = rscene;;

            this.m_rscene.addEventListener(MouseEvent.MOUSE_BG_DOWN, this, this.mouseBgDown);

            this.m_texLoader = texLoader;

            CanvasTextureTool.GetInstance().initialize(this.m_rscene);
            this.initUIScene(buildDisplay);
        }
    }
    close(): void {
        if (this.m_menuBtn != null) {
            this.menuCtrl(false);
            this.m_menuBtn.select(false);
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
        subScene = this.m_rscene.createSubScene();
        subScene.initialize(rparam);
        subScene.enableMouseEvent(true);
        this.ruisc = subScene;
        let stage = this.m_rscene.getStage3D();
        //this.ruisc.getCamera().translationXYZ(this.m_rscene.getViewWidth() * 0.5, this.m_rscene.getViewHeight() * 0.5, 1500.0);
        this.ruisc.getCamera().translationXYZ(stage.stageHalfWidth, stage.stageHalfHeight, 1500.0);
        this.ruisc.getCamera().update();

        if (buildDisplay) {
            this.initUI();
        }

    }

    private initUI(): void {

        this.initCtrlBars();

    }
    private m_paramEntity: IPBRParamEntity;
    setParamEntity(param: IPBRParamEntity): void {
        this.m_paramEntity = param;
        this.m_paramEntity.pbrUI = this;
        this.m_paramEntity.colorPanel = this.rgbPanel;
    }
    getParamEntity(): IPBRParamEntity {
        return this.m_paramEntity;
    }
    private m_btnSize: number = 24;
    private m_bgLength: number = 200.0;
    private m_btnPX: number = 102.0;
    private m_btnPY: number = 10.0;

    private m_btns: any[] = [];
    private m_menuBtn: SelectionBar = null;
    private createSelectBtn(ns: string, uuid: string, selectNS: string, deselectNS: string, flag: boolean, visibleAlways: boolean = false): SelectionBar {

        let selectBar: SelectionBar = new SelectionBar();
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
        this.m_btnPY += this.m_btnSize + 1;
        if (!visibleAlways) this.m_btns.push(selectBar);
        return selectBar;
    }
    private createProgressBtn(ns: string, uuid: string, progress: number, visibleAlways: boolean = false): ProgressBar {

        let proBar: ProgressBar = new ProgressBar();
        proBar.uuid = uuid;
        proBar.initialize(this.ruisc, ns, this.m_btnSize, this.m_bgLength);
        proBar.setProgress(progress, false);
        proBar.addEventListener(ProgressDataEvent.PROGRESS, this, this.valueChange);
        proBar.setXY(this.m_btnPX, this.m_btnPY);
        this.m_btnPY += this.m_btnSize + 1;
        if (!visibleAlways) this.m_btns.push(proBar);
        return proBar;
    }

    private createValueBtn(ns: string, uuid: string, value: number, minValue: number, maxValue: number, visibleAlways: boolean = false): ProgressBar {

        let proBar: ProgressBar = new ProgressBar();
        proBar.uuid = uuid;
        proBar.initialize(this.ruisc, ns, this.m_btnSize, this.m_bgLength);
        proBar.minValue = minValue;
        proBar.maxValue = maxValue;
        proBar.setValue(value, false);

        proBar.addEventListener(ProgressDataEvent.PROGRESS, this, this.valueChange);
        proBar.setXY(this.m_btnPX, this.m_btnPY);
        this.m_btnPY += this.m_btnSize + 1;
        if (!visibleAlways) this.m_btns.push(proBar);
        return proBar;
    }
    private initCtrlBars(): void {

        if (RendererDeviece.IsMobileWeb()) {
            this.m_btnSize = 64;
            this.m_btnPX = 280;
            this.m_btnPY = 30;
        }
        if (RendererDeviece.IsWebGL1()) {
            this.m_btnPX += 32;
            this.m_btnSize = MathConst.CalcCeilPowerOfTwo(this.m_btnSize);
        }
        this.m_menuBtn = this.createSelectBtn("", "menuCtrl", "Menu Open", "Menu Close", false, true);
        ///*
        this.metalBtn = this.createProgressBtn("metal", "metal", 0.5);
        this.roughBtn = this.createProgressBtn("rough", "rough", 0.5);
        this.noiseBtn = this.createProgressBtn("noise", "noise", 0.07);
        this.reflectionBtn = this.createProgressBtn("reflection", "reflection", 0.5);

        this.sideBtn = this.createValueBtn("side", "side", 1.0, 0.1, 30.0);
        this.surfaceBtn = this.createValueBtn("surface", "surface", 1.0, 0.1, 30.0);
        this.scatterBtn = this.createValueBtn("scatter", "scatter", 1.0, 0.1, 128.0);
        this.toneBtn = this.createValueBtn("tone", "tone", 2.0, 0.1, 128.0);

        this.absorbBtn = this.createSelectBtn("absorb", "absorb", "ON", "OFF", false);
        this.vtxNoiseBtn = this.createSelectBtn("vtxNoise", "vtxNoise", "ON", "OFF", false);

        this.f0ColorBtn = this.createValueBtn("F0Color", "F0Color", 1.0, 0.01, 32.0);
        this.albedoBtn = this.createValueBtn("albedo", "albedo", 0.2, 0.01, 5.0);
        this.ambientBtn = this.createValueBtn("ambient", "ambient", 0.1, 0.01, 1.0);
        this.specularBtn = this.createValueBtn("specular", "specular", 1.0, 0.01, 1.0);

        this.rgbPanel = new RGBColorPanel();
        this.rgbPanel.initialize(32, 4);
        this.rgbPanel.addEventListener(RGBColoSelectEvent.COLOR_SELECT, this, this.selectColor);
        this.rgbPanel.setXY(this.m_btnPX, this.m_btnPY);
        this.ruisc.addContainer(this.rgbPanel);
        this.rgbPanel.close();
        //*/

    }
    private selectColor(evt: any): void {
        let currEvt: RGBColoSelectEvent = evt as RGBColoSelectEvent;
        switch (this.m_currUUID) {
            case "F0Color":
                this.m_paramEntity.f0.setColor(currEvt.color, currEvt.colorId, -1);
                break;
            case "albedo":
                this.m_paramEntity.albedo.setColor(currEvt.color, currEvt.colorId, -1);
                break;
            case "ambient":
                this.m_paramEntity.ambient.setColor(currEvt.color, currEvt.colorId, -1);
                break;
            case "specular":
                this.m_paramEntity.specular.setColor(currEvt.color, currEvt.colorId, -1);
                break;
            default:
                break;
        }
    }
    private menuCtrl(flag: boolean): void {

        if (flag) {
            for (let i: number = 0; i < this.m_btns.length; ++i) {
                this.m_btns[i].open();
            }
            this.m_menuBtn.getPosition(this.m_pos);
            this.m_pos.x = this.m_btnPX;
            this.m_menuBtn.setPosition(this.m_pos);
        }
        else {
            for (let i: number = 0; i < this.m_btns.length; ++i) {
                this.m_btns[i].close();
            }
            this.m_menuBtn.getPosition(this.m_pos);
            this.m_pos.x = 0;
            this.m_menuBtn.setPosition(this.m_pos);
        }
        if (this.rgbPanel != null) this.rgbPanel.close();
    }
    private m_pos: Vector3D = new Vector3D();
    private selectChange(evt: any): void {

        let selectEvt: SelectionEvent = evt as SelectionEvent;
        let flag: boolean = selectEvt.flag;

        let material: IPBRMaterial = null;

        switch (selectEvt.uuid) {
            case "absorb":
                material = (this.m_paramEntity.getMaterial() as IPBRMaterial).clone();
                //material = new IPBRMaterial();
                //material.copyFrom(this.m_paramEntity.getMaterial());
                material.absorbEnabled = flag;
                this.m_paramEntity.absorbEnabled = flag;
                break;
            case "vtxNoise":
                //  material = new IPBRMaterial();
                //  material.copyFrom(this.m_paramEntity.getMaterial());
                material = (this.m_paramEntity.getMaterial() as IPBRMaterial).clone();
                material.normalNoiseEnabled = flag;
                this.m_paramEntity.vtxNoiseEnabled = flag;
                break;
            case "menuCtrl":
                this.menuCtrl(!flag);
                return;
                break;
            default:
                break;
        }
        if (material != null) {
            this.m_rscene.removeEntity(this.m_paramEntity.entity);
            material.initializeByCodeBuf(true);
            this.m_paramEntity.setMaterial(material);
            this.m_paramEntity.entity.setMaterial(material as any);
            this.m_rscene.addEntity(this.m_paramEntity.entity);
        }
        if (this.rgbPanel != null) this.rgbPanel.close();
    }
    private m_currUUID: string = "";
    private m_colorParamUnit: ColorParamUnit = null;
    private valueChange(evt: any): void {

        let progEvt: ProgressDataEvent = evt as ProgressDataEvent;
        let value: number = progEvt.value;
        if(this.m_paramEntity == null) {
            return;
        }
        let material: IPBRMaterial = this.m_paramEntity.getMaterial();
        let mirrorMaterial: IPBRMaterial = this.m_paramEntity.getMirrorMaterial();
        this.m_currUUID = progEvt.uuid;
        let colorParamUnit: ColorParamUnit;
        //  console.log("value: ",value);
        switch (progEvt.uuid) {
            case "metal":
                material.setMetallic(value);
                if (mirrorMaterial != null) mirrorMaterial.setMetallic(value);
                break;
            case "rough":
                material.setRoughness(value);
                if (mirrorMaterial != null) mirrorMaterial.setRoughness(value);
                break;
            case "noise":
                material.setPixelNormalNoiseIntensity(value);
                if (mirrorMaterial != null) mirrorMaterial.setPixelNormalNoiseIntensity(value);
                break;
            case "reflection":
                material.setReflectionIntensity(value);
                if (mirrorMaterial != null) mirrorMaterial.setReflectionIntensity(value);
                break;
            case "side":
                material.setSideIntensity(progEvt.value);
                if (mirrorMaterial != null) mirrorMaterial.setSideIntensity(progEvt.value);
                break;
            case "surface":
                material.setSurfaceIntensity(progEvt.value);
                if (mirrorMaterial != null) mirrorMaterial.setSurfaceIntensity(progEvt.value);
                break;
            case "scatter":
                material.setScatterIntensity(progEvt.value);
                if (mirrorMaterial != null) mirrorMaterial.setScatterIntensity(progEvt.value);
                break;
            case "tone":
                material.setToneMapingExposure(progEvt.value);
                if (mirrorMaterial != null) mirrorMaterial.setToneMapingExposure(progEvt.value);
                break;
            case "F0Color":
                colorParamUnit = this.m_paramEntity.f0;
                break;
            case "albedo":
                colorParamUnit = this.m_paramEntity.albedo;
                break;
            case "ambient":
                colorParamUnit = this.m_paramEntity.ambient;
                break;
            case "specular":
                colorParamUnit = this.m_paramEntity.specular;
                break;
            default:
                break;
        }
        if (colorParamUnit != null) {
            if (progEvt.status != 0) {
                if (this.m_colorParamUnit != colorParamUnit) {
                    colorParamUnit.selectColor();
                    this.m_colorParamUnit = colorParamUnit;
                    return;
                }
                colorParamUnit.setColor(null, -1, progEvt.value);
            }
            else {
                if (this.rgbPanel.isClosed()) {
                    this.rgbPanel.open();
                    colorParamUnit.selectColor();
                } else {
                    this.rgbPanel.close();
                }
            }
            return;
        }
        else {
            this.m_colorParamUnit = null;
        }
        if (this.rgbPanel != null) this.rgbPanel.close();
    }
    private mouseBgDown(evt: any): void {
        if (this.rgbPanel != null) this.rgbPanel.close();
    }
}

export default DefaultPBRUI;
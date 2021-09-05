
import RendererDevice from "../../vox/render/RendererDevice";
import MouseEvent from "../../vox/event/MouseEvent";

import TextureProxy from "../../vox/texture/TextureProxy";
import {TextureConst} from "../../vox/texture/TextureConst";
import ImageTextureLoader from "../../vox/texture/ImageTextureLoader";

import RendererParam from "../../vox/scene/RendererParam";
import RendererScene from "../../vox/scene/RendererScene";

import PBRLightsManager from "../../pbr/mana/PBRLightsManager";

import RendererSubScene from "../../vox/scene/RendererSubScene";
import ProgressBar from "../../orthoui/button/ProgressBar";
import ProgressDataEvent from "../../vox/event/ProgressDataEvent";
import CanvasTextureTool from "../../orthoui/assets/CanvasTextureTool";
import SelectionEvent from "../../vox/event/SelectionEvent";
import SelectionBar from "../../orthoui/button/SelectionBar";
import ColorLightsPBRMaterial from "../material/ColorLightsPBRMaterial";
import RGBColorPanel, { RGBColoSelectEvent } from "../../orthoui/panel/RGBColorPanel";
import Color4 from "../../vox/material/Color4";
import Vector3D from "../../vox/math/Vector3D";

export class PBRLightsUI
{
    constructor(){}
    private m_rscene:RendererScene = null;
    private m_texLoader:ImageTextureLoader = null;
    private m_meshMana:PBRLightsManager = null;
    private m_meshManas:PBRLightsManager[] = [];

    private m_sideScale: number = 0.5;
    private m_surfaceScale: number = 0.5;
    
    ruisc:RendererSubScene = null;
    getImageTexByUrl(purl:string,wrapRepeat:boolean = true,mipmapEnabled = true):TextureProxy
    {
        let ptex:TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if(wrapRepeat)ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    
    initialize(rscene:RendererScene, texLoader: ImageTextureLoader, meshMana: PBRLightsManager):void
    {
        console.log("PBRLightsUI::initialize()......");
        if(this.m_rscene == null)
        {
            this.m_rscene = rscene;;

            this.m_rscene.addEventListener(MouseEvent.MOUSE_BG_DOWN, this, this.mouseBgDown);
            new MouseEvent
            this.m_texLoader = texLoader;


            this.m_meshMana = meshMana;

            this.m_meshManas.push( this.m_meshMana );
            
            this.m_meshMana.material.woolEnabled = true;
            this.m_meshMana.material.toneMappingEnabled = true;
            this.m_meshMana.material.envMapEnabled = true;
            this.m_meshMana.material.specularBleedEnabled = true;
            this.m_meshMana.material.metallicCorrection = true;
            this.m_meshMana.material.absorbEnabled = false;
            this.m_meshMana.material.normalNoiseEnabled = false;
            this.m_meshMana.material.pixelNormalNoiseEnabled = true;
            /*
            let value: number = 0.2;
            this.m_meshMana.material.setColorScale(1.0,1.0);
            this.m_meshMana.material.setColorGlossiness(0.4);
            this.m_meshMana.material.setReflectionIntensity(0.01);
            this.m_meshMana.material.setMetallic(0.3);
            this.m_meshMana.material.setRoughness(0.0);
            this.m_meshMana.material.setAlbedoColor(0.9,0.0,0.9);
            this.m_meshMana.material.setAO(1.0);
            this.m_meshMana.material.setAmbientFactor(value,value,value);
            //*/
            /*
            //this.m_meshMana.material.setReflectionIntensity(0.1);
            //this.m_meshMana.material.setScatterIntensity(32.0);
            //this.m_meshMana.material.setColorGlossiness(0.8);
            this.m_meshMana.material.setMetallic(0.1);
            this.m_meshMana.material.setRoughness(0.8);
            //this.m_meshMana.material.setEnvSpecularColorFactor(0.0,0.0,0.0);
            //*/
            /*
            this.m_meshMana.material.setMetallic(1.0);
            this.m_meshMana.material.setAlbedoColor(0.8, 0.8,0.8);
            this.m_meshMana.material.setRoughness(0.99);
            this.m_meshMana.material.setAO(1.0);
            this.m_meshMana.material.setAmbientFactor(0.01,0.01,0.01);
            //this.m_meshMana.material.setEnvSpecularColorFactor(1.0,0.3,0.4);
            //*/
            //  this.m_meshMana.material.setMetallic(1.0);
            //  this.m_meshMana.material.setRoughness(0.7);
            //this.m_meshMana.material.setAlbedoColor(2.0, 2.0, 2.0);
            this.m_meshMana.material.setAmbientFactor(0.02, 0.02, 0.02);
            this.m_meshMana.material.setToneMapingExposure(2.0);
            this.m_meshMana.material.setReflectionIntensity(0.5);
            //  this.m_meshMana.material.setEnvMapLodMipMapLevel(3.0,4.0);
            //this.m_meshMana.material.setEnvSpecularColorFactor(0.0,3.0,0.0);
            this.m_meshManas[0].material.setSurfaceIntensity( this.m_surfaceScale );
            this.m_meshManas[0].material.setSideIntensity( this.m_sideScale );
            this.m_meshManas[0].material.setScatterIntensity( 1.0 );
            this.m_meshMana.material.setPixelNormalNoiseIntensity(0.07);
            //this.m_meshMana.material.setEnvSpecularColorFactor(0.0,0.0,0.0);

            this.initUI();
        }
    }
    close(): void {
        this.menuCtrl(false);
        this.m_menuBtn.select(false);
    }
    open(): void {
        this.menuCtrl(true);
        this.m_menuBtn.deselect(true);
    }
    private initUI(): void {
        
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
        CanvasTextureTool.GetInstance().initialize( this.m_rscene );
        
        
        this.initCtrlBars();

    }
    
    private m_btnSize: number = 24;
    private m_bgLength: number = 200.0;
    private m_btnPX: number = 102.0;
    private m_btnPY: number = 10.0;
    private m_rgbPanel: RGBColorPanel;
    private m_colorIntensity: number = 1.0;
    private m_F0Color: Color4 = new Color4(0.0,0.0,0.0);
    private m_albedoColor: Color4 = new Color4(0.2,0.2,0.2);
    private m_ambientColor: Color4 = new Color4(0.1,0.1,0.1);
    private m_specularColor: Color4 = new Color4(1.0,1.0,1.0);
    private m_btns: any[] = [];
    private m_menuBtn: SelectionBar = null;
    private createSelectBtn(ns:string, uuid: string, selectNS:string, deselectNS:string, flag: boolean, visibleAlways: boolean = false):SelectionBar {

        let selectBar: SelectionBar = new SelectionBar();
        selectBar.uuid = uuid;
        selectBar.initialize(this.ruisc, ns, selectNS, deselectNS,this.m_btnSize);
        selectBar.addEventListener(SelectionEvent.SELECT, this, this.selectChange);
        if(flag) {
            selectBar.select(false);
        }
        else {
            selectBar.deselect(false);
        }
        selectBar.setXY(this.m_btnPX, this.m_btnPY);
        this.m_btnPY += this.m_btnSize + 1;
        if(!visibleAlways)this.m_btns.push(selectBar);
        return selectBar;
    }
    private createProgressBtn(ns:string, uuid: string, progress: number, visibleAlways: boolean = false):ProgressBar {

        let proBar: ProgressBar = new ProgressBar();
        proBar.uuid = uuid;
        proBar.initialize( this.ruisc , ns, this.m_btnSize, this.m_bgLength);
        proBar.setProgress( progress, false );
        proBar.addEventListener(ProgressDataEvent.PROGRESS, this, this.progressChange);
        proBar.setXY(this.m_btnPX, this.m_btnPY);
        this.m_btnPY += this.m_btnSize + 1;
        if(!visibleAlways)this.m_btns.push(proBar);
        return proBar;
    }
    
    private createValueBtn(ns:string, uuid: string, value: number, minValue: number, maxValue: number, visibleAlways: boolean = false):ProgressBar {

        let proBar: ProgressBar = new ProgressBar();
        proBar.uuid = uuid;
        proBar.initialize( this.ruisc , ns, this.m_btnSize, this.m_bgLength);
        proBar.minValue = minValue;
        proBar.maxValue = maxValue;
        proBar.setValue( value, false );
        
        proBar.addEventListener(ProgressDataEvent.PROGRESS, this, this.progressChange);
        proBar.setXY(this.m_btnPX, this.m_btnPY);
        this.m_btnPY += this.m_btnSize + 1;
        if(!visibleAlways)this.m_btns.push(proBar);
        return proBar;
    }
    private initCtrlBars(): void {
        
        if(RendererDevice.IsMobileWeb()) {
            this.m_btnSize = 64;
            this.m_btnPX = 280;
            this.m_btnPY = 30;
        }
        this.m_menuBtn = this.createSelectBtn("","menuCtrl","Menu Open","Menu Close",false,true);

        this.createProgressBtn("metal","metal", this.m_meshMana.material.getMetallic());
        this.createProgressBtn("rough","rough", this.m_meshMana.material.getRoughness());
        this.createProgressBtn("noise","noise", 0.07);
        this.createProgressBtn("reflection","reflection", 0.5);

        this.createValueBtn("side","side", this.m_sideScale, 0.1, 30.0);
        this.createValueBtn("surface","surface", this.m_surfaceScale, 0.1, 30.0);
        this.createValueBtn("scatter","scatter", 1.0, 0.1, 128.0);

        this.createSelectBtn("absorb","absorb","ON","OFF",false);
        this.createSelectBtn("vtxNoise","vtxNoise","ON","OFF",false);
        this.createValueBtn("tone","tone", 2.0, 0.1, 128.0);
        this.createValueBtn("F0Color","F0Color", 1.0, 0.01, 32.0);
        this.createValueBtn("albedo","albedo", 0.2, 0.01, 5.0);
        this.createValueBtn("ambient","ambient", 0.1, 0.01, 1.0);
        this.createValueBtn("specular","specular", 1.0, 0.01, 1.0);
        //setEnvSpecularColorFactor

        this.m_rgbPanel = new RGBColorPanel();
        this.m_rgbPanel.initialize(32,4);
        this.m_rgbPanel.addEventListener(RGBColoSelectEvent.COLOR_SELECT, this, this.selectColor);
        this.m_rgbPanel.setXY(this.m_btnPX, this.m_btnPY);
        this.ruisc.addContainer(this.m_rgbPanel);
        this.m_rgbPanel.close();
        
    }
    private selectColor(evt: any): void {
        let currEvt: RGBColoSelectEvent = evt as RGBColoSelectEvent;
        switch(this.m_currUUID) {
            case "F0Color":
                this.m_F0Color.copyFrom(currEvt.color);
                this.m_meshManas[0].material.setF0(
                    this.m_F0Color.r * this.m_F0Color.a,
                    this.m_F0Color.g * this.m_F0Color.a,
                    this.m_F0Color.b * this.m_F0Color.a);
                break;
            case "albedo":
                this.m_albedoColor.copyFrom(currEvt.color);
                this.m_meshManas[0].material.setAlbedoColor(
                    this.m_albedoColor.r * this.m_albedoColor.a,
                    this.m_albedoColor.g * this.m_albedoColor.a,
                    this.m_albedoColor.b * this.m_albedoColor.a);
                break;
            case "ambient":
                this.m_ambientColor.copyFrom(currEvt.color);
                this.m_meshManas[0].material.setAmbientFactor(
                    this.m_ambientColor.r * this.m_ambientColor.a,
                    this.m_ambientColor.g * this.m_ambientColor.a,
                    this.m_ambientColor.b * this.m_ambientColor.a);
                break;
            case "specular":
                this.m_specularColor.copyFrom(currEvt.color);
                this.m_meshManas[0].material.setEnvSpecularColorFactor(
                    this.m_specularColor.r * this.m_specularColor.a,
                    this.m_specularColor.g * this.m_specularColor.a,
                    this.m_specularColor.b * this.m_specularColor.a);
                break;
            default:
                break;
        }
    }
    private menuCtrl(flag: boolean): void {
        if(flag) {
            for(let i: number = 0; i < this.m_btns.length; ++i) {
                this.m_btns[i].open();
            }
            this.m_menuBtn.getPosition(this.m_pos);
            this.m_pos.x = this.m_btnPX;
            this.m_menuBtn.setPosition(this.m_pos);
        }
        else {
            for(let i: number = 0; i < this.m_btns.length; ++i) {
                this.m_btns[i].close();
            }
            this.m_menuBtn.getPosition(this.m_pos);
            this.m_pos.x = 0;
            this.m_menuBtn.setPosition(this.m_pos);
        }
        this.m_rgbPanel.close();
    }
    private m_pos: Vector3D = new Vector3D();
    private selectChange(evt: any): void {
        
        let selectEvt: SelectionEvent = evt as SelectionEvent;
        let flag: boolean = selectEvt.flag;

        let material: ColorLightsPBRMaterial = null;
        
        switch(selectEvt.uuid) {
            case "absorb":
                material = new ColorLightsPBRMaterial();
                material.copyFrom( this.m_meshMana.material );
                material.absorbEnabled = flag;
                break;
            case "vtxNoise":
                material = new ColorLightsPBRMaterial();
                material.copyFrom( this.m_meshMana.material );
                material.normalNoiseEnabled = flag;
                break;
            case "menuCtrl":
                this.menuCtrl(!flag);
                /*
                if(!flag) {
                    for(let i: number = 0; i < this.m_btns.length; ++i) {
                        this.m_btns[i].open();
                    }
                    this.m_menuBtn.getPosition(this.m_pos);
                    this.m_pos.x = this.m_btnPX;
                    this.m_menuBtn.setPosition(this.m_pos);
                }
                else {
                    for(let i: number = 0; i < this.m_btns.length; ++i) {
                        this.m_btns[i].close();
                    }
                    this.m_menuBtn.getPosition(this.m_pos);
                    this.m_pos.x = 0;
                    this.m_menuBtn.setPosition(this.m_pos);
                }
                this.m_rgbPanel.close();
                //*/
                return;
                break;
            default:
                break;
        }
        if(material != null) {
            this.m_rscene.removeEntity( this.m_meshMana.entity );
            material.initializeByCodeBuf(true);
            this.m_meshMana.entity.setMaterial(material);
            this.m_rscene.addEntity( this.m_meshMana.entity );
            this.m_meshMana.material = material;
        }
        this.m_rgbPanel.close();
    }
    private m_currUUID:string = "";
    private progressChange(evt: any): void {
        
        let progEvt: ProgressDataEvent = evt as ProgressDataEvent;
        let progress: number = progEvt.progress;
        this.m_currUUID = progEvt.uuid;
        switch(progEvt.uuid) {
            case "metal":
                this.m_meshManas[0].material.setMetallic( progress );
                break;
            case "rough":
                this.m_meshManas[0].material.setRoughness( progress );
                break;
            case "noise":
                this.m_meshManas[0].material.setPixelNormalNoiseIntensity( progress );
                break;
            case "reflection":
                this.m_meshManas[0].material.setReflectionIntensity( progress );
                break;
            case "side":
                this.m_sideScale = progEvt.value;
                this.m_meshManas[0].material.setSideIntensity( this.m_sideScale );
                break;
            case "surface":
                this.m_surfaceScale = progEvt.value;
                this.m_meshManas[0].material.setSurfaceIntensity( this.m_surfaceScale );
                break;
            case "scatter":
                this.m_meshManas[0].material.setScatterIntensity( progEvt.value );
                break;
            case "tone":
                this.m_meshManas[0].material.setToneMapingExposure( progEvt.value );
                break;
            case "F0Color":
                this.m_F0Color.a = progEvt.value;
                if(progEvt.status != 0) {
                    this.m_meshManas[0].material.setF0(
                        this.m_F0Color.r * this.m_F0Color.a,
                        this.m_F0Color.g * this.m_F0Color.a,
                        this.m_F0Color.b * this.m_F0Color.a);
                }
                else {
                    if(this.m_rgbPanel.isClosed())this.m_rgbPanel.open();
                    else this.m_rgbPanel.close();
                }
                return;
                break;
            case "albedo":
                this.m_albedoColor.a = progEvt.value;
                if(progEvt.status != 0) {
                    this.m_meshManas[0].material.setAlbedoColor(
                        this.m_albedoColor.r * this.m_albedoColor.a,
                        this.m_albedoColor.g * this.m_albedoColor.a,
                        this.m_albedoColor.b * this.m_albedoColor.a);
                }
                else {
                    if(this.m_rgbPanel.isClosed())this.m_rgbPanel.open();
                    else this.m_rgbPanel.close();
                }
                return;
                break;
            case "ambient":
                this.m_ambientColor.a = progEvt.value;
                if(progEvt.status != 0) {
                    this.m_meshManas[0].material.setAmbientFactor(
                        this.m_ambientColor.r * this.m_ambientColor.a,
                        this.m_ambientColor.g * this.m_ambientColor.a,
                        this.m_ambientColor.b * this.m_ambientColor.a);
                }
                else {
                    if(this.m_rgbPanel.isClosed())this.m_rgbPanel.open();
                    else this.m_rgbPanel.close();
                }
                return;
                break;
            case "specular":
                this.m_specularColor.a = progEvt.value;
                if(progEvt.status != 0) {
                    this.m_meshManas[0].material.setEnvSpecularColorFactor(
                        this.m_specularColor.r * this.m_specularColor.a,
                        this.m_specularColor.g * this.m_specularColor.a,
                        this.m_specularColor.b * this.m_specularColor.a);
                }
                else {
                    if(this.m_rgbPanel.isClosed())this.m_rgbPanel.open();
                    else this.m_rgbPanel.close();
                }
                return;
                break;
            default:
            break;
        }
        this.m_rgbPanel.close();
    }
    private mouseBgDown(evt: any): void {
        this.m_rgbPanel.close();
    }
}
    
export default PBRLightsUI;
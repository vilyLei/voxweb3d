
import RendererDeviece from "../../vox/render/RendererDeviece";

import TextureProxy from "../../vox/texture/TextureProxy";
import {TextureConst} from "../../vox/texture/TextureConst";
import ImageTextureLoader from "../../vox/texture/ImageTextureLoader";

import RendererParam from "../../vox/scene/RendererParam";
import RendererScene from "../../vox/scene/RendererScene";

import PBRLightsManager from "../../pbr/mana/PBRLightsManager";

import RendererSubScene from "../../vox/scene/RendererSubScene";
import ProgressBar from "../../orthoui/demos/base/ProgressBar";
import ProgressDataEvent from "../../vox/event/ProgressDataEvent";
import CanvasTextureTool from "../../orthoui/demos/base/CanvasTextureTool";
import SelectionEvent from "../../vox/event/SelectionEvent";
import SelectionBar from "../../orthoui/demos/base/SelectionBar";
import ColorLightsPBRMaterial from "../material/ColorLightsPBRMaterial";

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

            this.m_texLoader = texLoader;


            this.m_meshMana = meshMana;

            this.m_meshManas.push( this.m_meshMana );
            
            this.m_meshMana.material.woolEnabled = true;
            this.m_meshMana.material.toneMappingEnabled = true;
            this.m_meshMana.material.envMapEnabled = true;
            this.m_meshMana.material.specularBleedEnabled = true;
            this.m_meshMana.material.metallicCorrection = true;
            this.m_meshMana.material.absorbEnabled = false;
            this.m_meshMana.material.normalNoiseEnabled = true;
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
    private m_btnPX: number = 150.0;
    private m_btnPY: number = 10.0;
    
    private createSelectBtn(ns:string, selectNS:string, deselectNS:string, flag: boolean, ):SelectionBar {

        let selectBar: SelectionBar = new SelectionBar();
        selectBar.uuid = ns;
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
        return selectBar;
    }
    private createBtn(ns:string, progress: number, value: number = 0.0):ProgressBar {

        let proBar: ProgressBar = new ProgressBar();
        proBar.uuid = ns;
        proBar.initialize( this.ruisc , ns, this.m_btnSize, this.m_bgLength);
        if(value < 0.001) {
            proBar.setProgress( progress, false );
        }
        else {
            proBar.setValue( value, false );
        }
        proBar.addEventListener(ProgressDataEvent.PROGRESS, this, this.progressChange);
        proBar.setXY(this.m_btnPX, this.m_btnPY);
        this.m_btnPY += this.m_btnSize + 1;
        return proBar;
    }
    
    private createValueBtn(ns:string, value: number, minValue: number, maxValue: number):ProgressBar {

        let proBar: ProgressBar = new ProgressBar();
        proBar.uuid = ns;
        proBar.initialize( this.ruisc , ns, this.m_btnSize, this.m_bgLength);
        proBar.minValue = minValue;
        proBar.maxValue = maxValue;
        proBar.setValue( value, false );
        
        proBar.addEventListener(ProgressDataEvent.PROGRESS, this, this.progressChange);
        proBar.setXY(this.m_btnPX, this.m_btnPY);
        this.m_btnPY += this.m_btnSize + 1;
        return proBar;
    }
    private initCtrlBars(): void {
        
        if(RendererDeviece.IsMobileWeb()) {
            this.m_btnSize = 64;
            this.m_btnPX = 280;
            this.m_btnPY = 30;
        }
        this.createBtn("metal", this.m_meshMana.material.getMetallic());
        this.createBtn("rough", this.m_meshMana.material.getRoughness());
        this.createBtn("noise", 0.07);
        this.createBtn("reflection", 0.5);

        this.createValueBtn("side", this.m_sideScale, 0.1, 30.0);
        this.createValueBtn("surface", this.m_surfaceScale, 0.1, 30.0);
        this.createValueBtn("scatter", 1.0, 0.1, 128.0);

        this.createSelectBtn("absorb","ON","OFF",false);
        this.createValueBtn("tone", 2.0, 0.1, 128.0);        
    }
    //private create
    private selectChange(evt: any): void {
        
        let selectEvt: SelectionEvent = evt as SelectionEvent;
        let flag: boolean = selectEvt.flag;

        let material: ColorLightsPBRMaterial = new ColorLightsPBRMaterial();
        material.copyFrom( this.m_meshMana.material );
        
        this.m_rscene.removeEntity( this.m_meshMana.entity );
        switch(selectEvt.uuid) {
            case "absorb":
                material.absorbEnabled = flag;
                break;
            default:
                break;
        }
        material.initializeByCodeBuf(true);
        this.m_meshMana.entity.setMaterial(material);
        this.m_rscene.addEntity( this.m_meshMana.entity );
        this.m_meshMana.material = material;
    }
    private progressChange(evt: any): void {
        
        let progEvt: ProgressDataEvent = evt as ProgressDataEvent;
        let progress: number = progEvt.progress;
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
            default:
            break;
        }
    }
}
    
export default PBRLightsUI;
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RGBColorPanel from "../../orthoui/panel/RGBColorPanel";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import MouseEvent from "../../vox/event/MouseEvent";
import MouseEvt3DDispatcher from "../../vox/event/MouseEvt3DDispatcher";
import DefaultPBRMaterial from "../material/DefaultPBRMaterial";
import IPBRUI from "./IPBRUI";
import {ColorParamUnit,AlbedoParamUnit,F0ColorParamUnit,AmbientParamUnit,SpecularParamUnit} from "./PBRParamUnit";
import IPBRParamEntity from "./IPBRParamEntity";

export default class PBRParamEntity implements IPBRParamEntity{

    private m_initFlag: boolean = true;

    entity: DisplayEntity;
    colorPanel: RGBColorPanel = null;
    pbrUI: IPBRUI = null;
    material: DefaultPBRMaterial = null;

    sideScale: number = 0.5;
    surfaceScale: number = 0.5;

    albedo: AlbedoParamUnit = new AlbedoParamUnit();
    f0: F0ColorParamUnit = new F0ColorParamUnit();
    ambient: AmbientParamUnit = new AmbientParamUnit();
    specular: SpecularParamUnit = new SpecularParamUnit();

    constructor() { }

    initialize(): void {
        if(this.m_initFlag) {
            this.m_initFlag = false;
            this.initMouseEvt();
            this.updateColor();
        }
    }
    updateColor(): void {
        if (this.colorPanel != null) {
            let material: DefaultPBRMaterial = this.material;

            let value: number = 0.1 + Math.random() * 0.5;
            this.albedo.initialize(material, this.pbrUI.albedoBtn, this.colorPanel, value, 0.01, 2.0);
            value = 0.1 + Math.random() * 0.5;
            this.f0.initialize(material, this.pbrUI.f0ColorBtn, this.colorPanel, value, 0.01, 1.0);
            value = 0.01 + Math.random() * 0.2;
            this.ambient.initialize(material, this.pbrUI.ambientBtn, this.colorPanel, value, 0.01, 1.0);
            value = 0.01 + Math.random() * 0.2;
            this.specular.initialize(material, this.pbrUI.specularBtn, this.colorPanel, value, 0.01, 1.0);

            this.pbrUI.noiseBtn.maxValue = 2.0;
            this.pbrUI.noiseBtn.step = 0.1;
            this.pbrUI.noiseBtn.setValue(0.07,false);

            this.pbrUI.sideBtn.minValue = 0.0;
            this.pbrUI.sideBtn.step = 0.1;
            this.pbrUI.sideBtn.maxValue = 32.0;
            this.pbrUI.sideBtn.setValue(1.0,false);

            this.pbrUI.surfaceBtn.minValue = 0.0;
            this.pbrUI.surfaceBtn.step = 0.1;
            this.pbrUI.surfaceBtn.maxValue = 32.0;
            this.pbrUI.surfaceBtn.setValue(1.0,false);

            this.pbrUI.scatterBtn.minValue = 0.1;
            this.pbrUI.scatterBtn.step = 0.1;
            this.pbrUI.scatterBtn.maxValue = 128.0;
            this.pbrUI.scatterBtn.setValue(1.0,false);

            this.pbrUI.toneBtn.minValue = 0.1;
            this.pbrUI.toneBtn.step = 0.1;
            this.pbrUI.toneBtn.maxValue = 128.0;
            this.pbrUI.toneBtn.setValue(2.0,false);
        }
    }
    
    select(): void {
        if (this.colorPanel != null) {

            this.albedo.selectColor();
            this.f0.selectColor();
            this.ambient.selectColor();
            this.specular.selectColor();

            this.pbrUI.metalBtn.setValue(this.material.getMetallic(), false);
            this.pbrUI.roughBtn.setValue(this.material.getRoughness(), false);
            this.pbrUI.noiseBtn.setValue(this.material.getPixelNormalNoiseIntensity(), false);
            this.pbrUI.reflectionBtn.setValue( this.material.getReflectionIntensity(), false);

            this.pbrUI.sideBtn.setValue(this.material.getSideIntensity(), false);
            this.pbrUI.surfaceBtn.setValue(this.material.getSideIntensity(), false);
            this.pbrUI.scatterBtn.setValue(this.material.getScatterIntensity(), false);
            this.pbrUI.toneBtn.setValue(this.material.getToneMapingExposure(), false);

            
            //  this.albedo.selectColor();
            //  this.f0.selectColor();
            //  this.ambient.selectColor();
            //  this.specular.selectColor();
        }
    }
    deselect(): void {

    }

    
    mouseOverListener(evt: any): void {
        //console.log("PBRParamEntity mouseOverListener");
    }
    mouseOutListener(evt: any): void {
        //console.log("PBRParamEntity mouseOutListener");
    }
    mouseDownListener(evt: any): void {
        //console.log("PBRParamEntity mouseDownListener");
    }
    mouseUpListener(evt: any): void {
        //console.log("PBRParamEntity mouseUpListener");
        this.pbrUI.setParamEntity( this );
        this.select();
    }

    private initMouseEvt(): void {

        this.entity.mouseEnabled = true;

        let dispatcher: MouseEvt3DDispatcher = new MouseEvt3DDispatcher();
        dispatcher.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownListener);
        dispatcher.addEventListener(MouseEvent.MOUSE_UP, this, this.mouseUpListener);
        dispatcher.addEventListener(MouseEvent.MOUSE_OVER, this, this.mouseOverListener);
        dispatcher.addEventListener(MouseEvent.MOUSE_OUT, this, this.mouseOutListener);
        this.entity.setEvtDispatcher(dispatcher);
    }

}
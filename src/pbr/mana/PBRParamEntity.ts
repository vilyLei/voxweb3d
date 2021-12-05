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
import IPBRMaterial from "../material/IPBRMaterial";
import IPBRUI from "./IPBRUI";
import {ColorParamUnit,AlbedoParamUnit,F0ColorParamUnit,AmbientParamUnit,SpecularParamUnit} from "./PBRParamUnit";
import IPBRParamEntity from "./IPBRParamEntity";
import RendererDevice from "../../vox/render/RendererDevice";

export default class PBRParamEntity implements IPBRParamEntity{

    private m_initFlag: boolean = true;
    private m_material: IPBRMaterial = null;
    private m_mirrorMaterial: IPBRMaterial = null;

    entity: DisplayEntity;
    colorPanel: RGBColorPanel = null;
    pbrUI: IPBRUI = null;

    albedo: AlbedoParamUnit = new AlbedoParamUnit();
    f0: F0ColorParamUnit = new F0ColorParamUnit();
    ambient: AmbientParamUnit = new AmbientParamUnit();
    specular: SpecularParamUnit = new SpecularParamUnit();
    
    absorbEnabled: boolean = false;
    vtxNoiseEnabled: boolean = false;

    constructor() { }

    initialize(): void {
        if( this.m_initFlag ) {
            this.m_initFlag = false;
            this.initMouseEvt();
            this.updateColor();
        }
    }
    updateColor(): void {
        if (this.colorPanel != null) {

            let material: IPBRMaterial = this.m_material;

            let value: number = 1.0 + Math.random() * 2.0;
            this.albedo.initialize(material, this.pbrUI.albedoBtn, this.colorPanel, value, 0.01, 16.0);
            value = 0.1 + Math.random() * 0.5;
            this.f0.initialize(material, this.pbrUI.f0ColorBtn, this.colorPanel, value, 0.01, 5.0);
            value = 0.01 + Math.random() * 0.2;
            this.ambient.initialize(material, this.pbrUI.ambientBtn, this.colorPanel, value, 0.01, 5.0);
            value = 0.01 + Math.random() * 0.2;
            this.specular.initialize(material, this.pbrUI.specularBtn, this.colorPanel, value, 0.01, 1.0);

            this.albedo.btn.step = 0.1;

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
    
    setMaterial(material: IPBRMaterial): void {
        this.m_material = material;
        this.albedo.material = material;
        this.f0.material = material;
        this.ambient.material = material;
        this.specular.material = material;
    }
    getMaterial(): IPBRMaterial {
        return this.m_material;
    }
    setMirrorMaterial(material: IPBRMaterial): void {
        this.m_mirrorMaterial = material;
        this.albedo.mirrorMaterial = material;
        this.f0.mirrorMaterial = material;
        this.ambient.mirrorMaterial = material;
        this.specular.mirrorMaterial = material;
    }
    getMirrorMaterial(): IPBRMaterial {
        return this.m_mirrorMaterial;
    }
    select(): void {
        if (this.colorPanel != null) {

            let material: IPBRMaterial = this.m_material;

            this.albedo.selectColor();
            this.f0.selectColor();
            this.ambient.selectColor();
            this.specular.selectColor();

            this.pbrUI.metalBtn.setValue( material.getMetallic(), false );
            this.pbrUI.roughBtn.setValue( material.getRoughness(), false );
            this.pbrUI.noiseBtn.setValue( material.getPixelNormalNoiseIntensity(), false );
            this.pbrUI.reflectionBtn.setValue( material.getReflectionIntensity(), false );

            this.pbrUI.sideBtn.setValue( material.getSideIntensity(), false );
            this.pbrUI.surfaceBtn.setValue( material.getSideIntensity(), false );
            this.pbrUI.scatterBtn.setValue( material.getScatterIntensity(), false );
            this.pbrUI.toneBtn.setValue( material.getToneMapingExposure(), false );

            if( this.absorbEnabled ) {
                this.pbrUI.absorbBtn.select(false);
            }
            else {
                this.pbrUI.absorbBtn.deselect(false);
            }
            if( this.vtxNoiseEnabled ) {
                this.pbrUI.vtxNoiseBtn.select(false);
            }
            else {
                this.pbrUI.vtxNoiseBtn.deselect(false);
            }
        }
    }
    deselect(): void {

    }

    private selectListener(evt: any): void {
        //console.log("PBRParamEntity mouseUpListener");
        this.pbrUI.setParamEntity( this );
        this.select();
    }

    private initMouseEvt(): void {

        this.entity.mouseEnabled = true;

        let dispatcher: MouseEvt3DDispatcher = new MouseEvt3DDispatcher();
        // if(RendererDevice.IsMobileWeb()) {
        //     dispatcher.addEventListener(MouseEvent.MOUSE_DOWN, this, this.selectListener);
        // }
        // else {
        //     dispatcher.addEventListener(MouseEvent.MOUSE_CLICK, this, this.selectListener);
        // }
        dispatcher.addEventListener(MouseEvent.MOUSE_CLICK, this, this.selectListener);
        this.entity.setEvtDispatcher(dispatcher);
    }

}
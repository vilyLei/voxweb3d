/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ProgressBar from "../../orthoui/demos/base/ProgressBar";
import RGBColorPanel from "../../orthoui/panel/RGBColorPanel";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import Color4 from "../../vox/material/Color4";
import DefaultPBRMaterial from "../material/DefaultPBRMaterial";
import IPBRUI from "./IPBRUI";

export class ColorParamUnit {
    name: string;
    material: DefaultPBRMaterial;
    color: Color4 = new Color4(0.0, 0.0, 0.0);
    identity: number = 1.0;
    colorId: number = 0;

    colorPanel: RGBColorPanel = null;
    btn: ProgressBar = null;
    constructor() {
    }
    initialize(material: DefaultPBRMaterial, pBtn: ProgressBar, colorPanel: RGBColorPanel, identity: number, minValue: number, maxValue: number): void {

        this.material = material;
        this.btn = pBtn;
        this.colorPanel = colorPanel;
        this.name = this.btn.uuid;

        let colorId: number = this.colorPanel.getRandomColorId();
        let color: Color4 = this.colorPanel.getColorById(colorId);
        this.identity = identity;
        this.btn.minValue = minValue;
        this.btn.maxValue = maxValue;
        this.btn.setValue(this.identity, false);
        this.setColor(color, colorId, identity);
    }

    setColor(color: Color4, id: number, identity: number): void {

        if (color != null) {
            this.color.copyFrom(color);
        }
        if (id >= 0) {
            this.colorId = id;
        }
        if (identity >= 0.0) {
            this.identity = identity;
        }
        this.setMaterialColor();
    }
    protected setMaterialColor(): void {
        
        let color = this.color;
        let id = this.colorId;
        let identity = this.identity;
        console.log(this.name + " setMaterialColor: ", color, id, identity);
        this.material.setEnvSpecularColorFactor(color.r * identity, color.g * identity, color.b * identity);
    }
    getColorid(): number {
        return this.colorId;
    }
    selectColor(): void {
        this.colorPanel.selectColorById(this.colorId);
    }
}

export class F0ColorParamUnit extends ColorParamUnit{
    constructor() {
        super();
    }
    protected setMaterialColor(): void {
        
        let color = this.color;
        let id = this.colorId;
        let identity = this.identity;
        console.log(this.name + " setMaterialColor: ", color, id, identity);
        this.material.setEnvSpecularColorFactor(color.r * identity, color.g * identity, color.b * identity);
    }
}

export class AmbientParamUnit extends ColorParamUnit{
    constructor() {
        super();
    }
    protected setMaterialColor(): void {
        
        let color = this.color;
        let id = this.colorId;
        let identity = this.identity;
        console.log(this.name + " setMaterialColor: ", color, id, identity);
        this.material.setEnvSpecularColorFactor(color.r * identity, color.g * identity, color.b * identity);
    }
}
export class SpecularParamUnit extends ColorParamUnit{
    constructor() {
        super();
    }
    protected setMaterialColor(): void {
        
        let color = this.color;
        let id = this.colorId;
        let identity = this.identity;
        console.log(this.name + " setMaterialColor: ", color, id, identity);
        this.material.setEnvSpecularColorFactor(color.r * identity, color.g * identity, color.b * identity);
    }
}

export default class PBRParamEntity {

    entity: DisplayEntity;
    colorPanel: RGBColorPanel = null;
    pbrUI: IPBRUI = null;
    material: DefaultPBRMaterial = null;

    sideScale: number = 0.5;
    surfaceScale: number = 0.5;

    albedo: ColorParamUnit = new ColorParamUnit();
    f0: F0ColorParamUnit = new F0ColorParamUnit();
    ambient: AmbientParamUnit = new AmbientParamUnit();
    specular: SpecularParamUnit = new SpecularParamUnit();

    constructor() { }
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
            this.pbrUI.noiseBtn.setValue(0.07,false);

            this.pbrUI.sideBtn.minValue = 0.0;
            this.pbrUI.sideBtn.maxValue = 32.0;
            this.pbrUI.sideBtn.setValue(1.0,false);

            this.pbrUI.surfaceBtn.minValue = 0.0;
            this.pbrUI.surfaceBtn.maxValue = 32.0;
            this.pbrUI.surfaceBtn.setValue(1.0,false);

            this.pbrUI.scatterBtn.minValue = 0.1;
            this.pbrUI.scatterBtn.maxValue = 128.0;
            this.pbrUI.scatterBtn.setValue(1.0,false);

            this.pbrUI.toneBtn.minValue = 0.1;
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
        }
    }
    deselect(): void {

    }


}
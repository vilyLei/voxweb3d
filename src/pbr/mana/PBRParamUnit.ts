/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ProgressBar from "../../orthoui/button/ProgressBar";
import RGBColorPanel from "../../orthoui/panel/RGBColorPanel";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import MouseEvent from "../../vox/event/MouseEvent";
import MouseEvt3DDispatcher from "../../vox/event/MouseEvt3DDispatcher";
import Color4 from "../../vox/material/Color4";
import IPBRMaterial from "../material/IPBRMaterial";
import IPBRUI from "./IPBRUI";

export class ColorParamUnit {
    name: string;
    material: IPBRMaterial;
    mirrorMaterial: IPBRMaterial;
    color: Color4 = new Color4(0.0, 0.0, 0.0);
    identity: number = 1.0;
    colorId: number = 0;

    colorPanel: RGBColorPanel = null;
    btn: ProgressBar = null;
    constructor() {
    }
    initialize(material: IPBRMaterial, pBtn: ProgressBar, colorPanel: RGBColorPanel, identity: number, minValue: number, maxValue: number): void {

        this.material = material;
        this.btn = pBtn;
        this.colorPanel = colorPanel;
        this.name = this.btn.uuid;
        this.btn.step = 0.1;
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
        //this.material.setEnvSpecularColorFactor(color.r * identity, color.g * identity, color.b * identity);
    }
    getColorid(): number {
        return this.colorId;
    }
    selectColor(): void {
        this.colorPanel.selectColorById(this.colorId);
        let color: Color4 = this.colorPanel.getColorById(this.colorId);
        //console.log(this.name + " selectColor: ", color,this.colorId, this.identity);
        this.btn.setValue(this.identity, false);
        this.selectColorInfo();
    }
    protected selectColorInfo(): void {
    }
}

export class AlbedoParamUnit extends ColorParamUnit{
    constructor() {
        super();
    }
    protected setMaterialColor(): void {
        
        let color = this.color;
        let id = this.colorId;
        let identity = this.identity;
        //console.log(this.name + " setMaterialColor: ", color, id, identity);
        this.material.setAlbedoColor(color.r * identity, color.g * identity, color.b * identity);
        if(this.mirrorMaterial != null)this.mirrorMaterial.setAlbedoColor(color.r * identity, color.g * identity, color.b * identity);
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
        //console.log(this.name + " setMaterialColor: ", color, id, identity);
        this.material.setF0(color.r * identity, color.g * identity, color.b * identity);
        if(this.mirrorMaterial != null)this.mirrorMaterial.setF0(color.r * identity, color.g * identity, color.b * identity);
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
        //console.log(this.name + " setMaterialColor: ", color, id, identity);
        this.material.setAmbientFactor(color.r * identity, color.g * identity, color.b * identity);
        if(this.mirrorMaterial != null)this.mirrorMaterial.setAmbientFactor(color.r * identity, color.g * identity, color.b * identity);
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
        //console.log(this.name + " setMaterialColor: ", color, id, identity);
        this.material.setEnvSpecularColorFactor(color.r * identity, color.g * identity, color.b * identity);
        if(this.mirrorMaterial != null)this.mirrorMaterial.setEnvSpecularColorFactor(color.r * identity, color.g * identity, color.b * identity);
    }
}

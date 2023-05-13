/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RGBColorPanel from "../../orthoui/panel/RGBColorPanel";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import IPBRMaterial from "../material/IPBRMaterial";
import IPBRUI from "./IPBRUI";
import {ColorParamUnit,F0ColorParamUnit,AmbientParamUnit,SpecularParamUnit} from "./PBRParamUnit";

export default interface IPBRParamEntity {

    entity: DisplayEntity;
    colorPanel: RGBColorPanel;
    pbrUI: IPBRUI;
    absorbEnabled: boolean;
    vtxNoiseEnabled: boolean;

    albedo: ColorParamUnit;
    f0: F0ColorParamUnit;
    ambient: AmbientParamUnit;
    specular: SpecularParamUnit;

    setMaterial(material: IPBRMaterial): void;
    getMaterial(): IPBRMaterial;    
    setMirrorMaterial(material: IPBRMaterial): void;
    getMirrorMaterial(): IPBRMaterial;

    select(): void;
    deselect(): void;

    updateColor(): void;
}
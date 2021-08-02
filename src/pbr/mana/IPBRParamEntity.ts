/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RGBColorPanel from "../../orthoui/panel/RGBColorPanel";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import DefaultPBRMaterial from "../material/DefaultPBRMaterial";
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

    setMaterial(material: DefaultPBRMaterial): void;
    getMaterial(): DefaultPBRMaterial;    
    setMirrorMaterial(material: DefaultPBRMaterial): void;
    getMirrorMaterial(): DefaultPBRMaterial;

    select(): void;
    deselect(): void;

    updateColor(): void;
}
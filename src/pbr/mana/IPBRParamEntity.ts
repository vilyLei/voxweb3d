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
    material: DefaultPBRMaterial;

    sideScale: number;
    surfaceScale: number;

    albedo: ColorParamUnit;
    f0: F0ColorParamUnit;
    ambient: AmbientParamUnit;
    specular: SpecularParamUnit;

    select(): void;
    deselect(): void;

    updateColor(): void;
}
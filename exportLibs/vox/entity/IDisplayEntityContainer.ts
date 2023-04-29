/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderEntityBase from "../../vox/render/IRenderEntityBase";
import IRenderEntityContainer from "../../vox/render/IRenderEntityContainer";
import ITransformEntity from "./ITransformEntity";

export default interface IDisplayEntityContainer extends IRenderEntityContainer {

    addEntity(entity: IRenderEntityBase | ITransformEntity): void;
    removeEntity(entity: IRenderEntityBase | ITransformEntity): void;
    addChild(child: IRenderEntityBase | ITransformEntity): void;
    removeChild(child: IRenderEntityBase | ITransformEntity): void;
}
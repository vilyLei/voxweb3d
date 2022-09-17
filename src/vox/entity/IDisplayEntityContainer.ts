/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderEntityContainer from "../../vox/render/IRenderEntityContainer";
import ITransformEntity from "./ITransformEntity";

export default interface IDisplayEntityContainer extends IRenderEntityContainer {

    addEntity(entity: ITransformEntity): void;
    removeEntity(entity: ITransformEntity): void;
    addChild(child: IDisplayEntityContainer): void;
    removeChild(child: IDisplayEntityContainer): void;
}
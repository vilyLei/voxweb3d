/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderEntityContainer from "../../vox/render/IRenderEntityContainer";

export default interface IDisplayEntityContainer extends IRenderEntityContainer {
    
    addChild(child: IDisplayEntityContainer): void;
    removeChild(child: IDisplayEntityContainer): void;
}
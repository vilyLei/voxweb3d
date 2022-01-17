/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderEntity from "../../vox/render/IRenderEntity";

interface IRenderableEntityBlock {
    
    readonly unitXOYPlane: IRenderEntity;

    initialize(): void;
    createEntity(): IRenderEntity;
}

export { IRenderableEntityBlock }
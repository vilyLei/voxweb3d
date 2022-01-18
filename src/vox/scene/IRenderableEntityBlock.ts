/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderEntity from "../../vox/render/IRenderEntity";

interface IRenderableEntityBlock {
    
    readonly screenPlane: IRenderEntity;
    readonly unitXOYPlane: IRenderEntity;
    readonly unitXOZPlane: IRenderEntity;
    readonly unitBox: IRenderEntity;

    initialize(): void;
    createEntity(): IRenderEntity;
}

export { IRenderableEntityBlock }
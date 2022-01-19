/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderEntity from "../../../vox/render/IRenderEntity";
import { IDataMesh } from "../../mesh/IDataMesh";

interface IRenderableEntityBlock {
    
    readonly screenPlane: IRenderEntity;
    readonly unitXOYPlane: IRenderEntity;
    readonly unitXOZPlane: IRenderEntity;
    readonly unitBox: IRenderEntity;

    initialize(): void;
    createEntity(): IRenderEntity;
    createMesh(): IDataMesh;
}

export { IRenderableEntityBlock }
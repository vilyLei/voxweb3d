/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import {PathNavigator} from "../../../../voxnav/tileTerrain/PathNavigator";
import { NavigationStatus } from "../../../../voxnav/tileTerrain/NavigationStatus";
import { CarEntityTransform } from "./CarEntityTransform";

interface IToyEntity {

    transform: CarEntityTransform;
    navigator: PathNavigator;
    boundsChanged: boolean;
    getStatus(): NavigationStatus;
    setEntityIndex(index: number): void
    getEntityIndex(): number;
    
    destroy(): void;
    updateTrans(fs32: Float32Array): void;
    updateBounds(): void;
}
export { IToyEntity };
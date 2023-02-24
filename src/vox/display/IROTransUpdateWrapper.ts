/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IEntityUpdate from "../../vox/scene/IEntityUpdate";
import ITransUpdater from "../../vox/scene/ITransUpdater";
import IEntityTransform from "../entity/IEntityTransform";

export default interface IROTransUpdateWrapper extends IEntityUpdate {
    
    /**
     * the default value is 0
     */
    __$transUpdate: number;
    __$target: IEntityTransform;

    destroy(): void;
    updateTo(): void;
    setUpdater(updater: ITransUpdater): void;
    update(): void;
}
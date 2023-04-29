/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IEntityUpdate from "../../vox/scene/IEntityUpdate";
import ITransUpdater from "../../vox/scene/ITransUpdater";
import IEntityTransform from "../entity/IEntityTransform";

export default class ROTransUpdateWrapper implements IEntityUpdate {
    
    private m_updater: ITransUpdater = null;
    /**
     * the default value is 0
     */
    __$transUpdate: number = 0;
    __$target: IEntityTransform = null;

    destroy(): void {       
        this.m_updater = null;
    }
    updateTo(): void {
        if (this.m_updater) {
            this.m_updater.addItem(this);
        }
    }
    setUpdater(updater: ITransUpdater): void {
        this.m_updater = updater;
    }
    update(): void {
        this.__$target.update();
        this.__$transUpdate = 0;
    }
}
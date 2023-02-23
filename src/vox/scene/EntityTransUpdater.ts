/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ITransUpdater from "./ITransUpdater";
import IEntityUpdate from "./IEntityUpdate";

class EntityTransUpdater implements ITransUpdater {
    private m_list: IEntityUpdate[];
    private m_index = 0;

    constructor(size: number = 8192) {
        this.m_list = new Array(size);
    }

    addItem(item: IEntityUpdate): void {
        if (item.__$transUpdate < 1) {
            item.__$transUpdate = 1;
            this.m_list[this.m_index] = item;
            this.m_index++;
        }
    }
    update(): void {
        for (let i = 0; i < this.m_index; ++i) {
            const t = this.m_list[i];
            if(t.__$transUpdate > 0) {
                t.update();
                t.__$transUpdate = 0;
            }
        }
        this.m_index = 0;
    }
    destroy(): void {
        this.m_index = 0;
        for (let i = 0; i < this.m_list.length; ++i) {
            this.m_list[i] = null;
        }
    }
}

export default EntityTransUpdater;
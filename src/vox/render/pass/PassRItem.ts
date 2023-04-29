/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderMaterial from "../IRenderMaterial";
import IPassProcess from "./IPassProcess";
import IPassRItem from "./IPassRItem";

export default class PassRItem implements IPassRItem {
    protected m_enabled = false;
    material: IRenderMaterial = null;
    rst: any = null;
    constructor() {
    }
    run(process: IPassProcess): void {
    }

    enable(): IPassRItem {
        this.m_enabled = true;
        return this;
    }
    disable(): IPassRItem {
        this.m_enabled = false;
        return this;
    }
    isEnabled(): boolean {
        return this.m_enabled;
    }
    initialize(): void {
        this.m_enabled = true;
    }
    destroy(): void {
        if (this.material != null) {
            this.material = null;
        }
        if (this.rst != null) {
            this.rst = null;
        }
    }
}
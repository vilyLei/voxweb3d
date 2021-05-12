
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import MouseEvt3DDispatcher from "../../vox/event/MouseEvt3DDispatcher";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import BoundsEntity from "../../vox/entity/BoundsEntity";

export default class BoundsButton extends BoundsEntity {
    constructor() {
        super();
    }
    private m_dispatcher: MouseEvt3DDispatcher = null;
    private m_disp: DisplayEntity = null;
    private m_width: number = 100.0;
    private m_height: number = 100.0;
    private m_posZ: number = 0.0;
    private m_boundsMin: Vector3D = new Vector3D(0.0, 0.0, 0.0);
    private m_boundsMax: Vector3D = new Vector3D(128.0, 128.0, 0.0);
    private initEvtBase(pw: number, ph: number): void {
        this.m_boundsMax.setXYZ(pw, ph, 0.0);
        this.initialize(this.m_boundsMin, this.m_boundsMax);

        this.m_dispatcher = new MouseEvt3DDispatcher();
        this.setEvtDispatcher(this.m_dispatcher);
    }
    initializeBtn2D(pw: number, ph: number): void {
        if (this.m_dispatcher == null) {
            this.m_width = pw;
            this.m_height = ph;
            this.initEvtBase(pw, ph);
        }
        else {
            this.m_width = pw;
            this.m_height = ph;
            this.m_boundsMax.setXYZ(pw, ph, 0.0);
        }
    }

    setBounds2D(pw: number, ph: number): void {
        if (this.m_dispatcher != null) {
            this.m_width = pw;
            this.m_height = ph;
            this.m_boundsMax.setXYZ(pw, ph, 0.0);
            this.setBounds(this.m_boundsMin, this.m_boundsMax);
        }
    }
    setUIDisplay(disp: DisplayEntity): void {
        if (disp != null) {
            this.m_disp = disp;
        }
    }
    getUIDisplay(): DisplayEntity {
        return this.m_disp;
    }
    setXY(px: number, py: number): void {
        if (this.m_disp != null) {
            this.m_disp.setXYZ(px, py, this.m_posZ);
            this.m_disp.update();
        }
        super.setXYZ(px, py, this.m_posZ);
        this.update();
    }
    setXYZ(px: number, py: number, pz: number): void {
        this.m_posZ = pz;
        if (this.m_disp != null) {
            this.m_disp.setXYZ(px, py, pz);
            this.m_disp.update();
        }
        super.setXYZ(px, py, pz);
        this.update();
    }

    addEventListener(type: number, listener: any, func: (evt: any) => void, captureEnabled: boolean = true, bubbleEnabled: boolean = false): void {
        if (this.m_dispatcher != null) {
            this.m_dispatcher.addEventListener(type, listener, func, captureEnabled, bubbleEnabled);
        }
    }
    removeEventListener(type: number, listener: any, func: (evt: any) => void): void {
        if (this.m_dispatcher != null) {
            this.m_dispatcher.removeEventListener(type, listener, func);
        }
    }
    destory(): void {
        super.destroy();
    }
}
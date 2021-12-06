/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import CameraBase from "../../vox/view/CameraBase";
import IRenderStage3D from "../../vox/render/IRenderStage3D";
import MouseEvent from "../../vox/event/MouseEvent";
import {CameraDragSwinger} from "../../voxeditor/control/CameraDragSwinger";

export default class CameraStageDragSwinger {
    constructor() { }

    private m_stage3D: IRenderStage3D = null;
    private m_dragSwinger: CameraDragSwinger = new CameraDragSwinger();
    private m_enabled: boolean = true;
    
    setAutoRotationEnabled(enabled: boolean): void {
        this.m_dragSwinger.autoRotationEnabled = enabled;
    }
    initialize(stage3D: IRenderStage3D, camera: CameraBase, bgMouseDown: boolean = true): void {
        if (this.m_stage3D == null) {
            this.m_stage3D = stage3D;
            this.m_dragSwinger.initialize(stage3D, camera);
            if(bgMouseDown) {
                stage3D.addEventListener(MouseEvent.MOUSE_BG_DOWN, this, this.mouseDownListener, true, false);
            }
            else {
                stage3D.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownListener, true, false);
            }
            stage3D.addEventListener(MouseEvent.MOUSE_UP, this, this.mouseUpListener, true, true);
        }
    }

    private mouseDownListener(evt: any): void {
        if(this.m_enabled) {
            this.m_dragSwinger.attach();
        }
    }
    private mouseUpListener(evt: any): void {
        this.m_dragSwinger.detach();
    }
    setEnabled(enabled: boolean): void {
        this.m_enabled = enabled;
    }
    detach(): void {
        this.m_dragSwinger.detach();
    }
    runWithYAxis(): void {
        this.m_dragSwinger.runWithYAxis();
    }
    runWithZAxis(): void {
        this.m_dragSwinger.runWithZAxis();
    }
}
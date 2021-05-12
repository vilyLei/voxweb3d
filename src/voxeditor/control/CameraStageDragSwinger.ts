/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import CameraBase from "../../vox/view/CameraBase";
import IRenderStage3D from "../../vox/render/IRenderStage3D";
import MouseEvent from "../../vox/event/MouseEvent";
import CameraDragSwinger from "../../voxeditor/control/CameraDragSwinger";

export default class CameraStageDragSwinger {
    constructor() { }

    private m_stage3D: IRenderStage3D = null;
    private m_dragSwinger: CameraDragSwinger = new CameraDragSwinger();
    initialize(stage3D: IRenderStage3D, camera: CameraBase): void {
        if (this.m_stage3D == null) {
            this.m_stage3D = stage3D;
            this.m_dragSwinger.initialize(stage3D, camera);
            stage3D.addEventListener(MouseEvent.MOUSE_BG_DOWN, this, this.mouseDownListener, true, false);
            stage3D.addEventListener(MouseEvent.MOUSE_UP, this, this.mouseUpListener, false, true);
        }
    }

    private mouseDownListener(evt: any): void {
        console.log("CameraStageDragSwinger mouseDownListener call...");
        this.m_dragSwinger.attach();
    }
    private mouseUpListener(evt: any): void {
        console.log("CameraStageDragSwinger mouseUpListener call...");
        this.m_dragSwinger.detach();
    }
    runWithYAxis(): void {
        this.m_dragSwinger.runWithYAxis();
    }
    runWithZAxis(): void {
        this.m_dragSwinger.runWithZAxis();
    }
}
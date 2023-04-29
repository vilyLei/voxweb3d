/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import {IRPStatus} from "./IRPStatus";
class RPStatus implements IRPStatus {
    
    sdkVer: number = 0;
    version: number = 0;
    drawCallTimes: number = 0;
    drawTrisNumber: number = 0;
    povNumber: number = 0;

    reset(): void {
        this.drawCallTimes = 0;
        this.drawTrisNumber = 0;
        this.povNumber = 0;
    }
}

export { RPStatus };
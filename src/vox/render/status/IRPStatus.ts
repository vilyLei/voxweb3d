/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

interface IRPStatus {
    
    version: number;
    drawCallTimes: number;
    drawTrisNumber: number;
    povNumber: number;
    reset(): void;
}

export {IRPStatus};
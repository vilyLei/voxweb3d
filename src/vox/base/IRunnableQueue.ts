/***************************************************************************/
/*                                                                         */
/*  Copyright 2019-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRunnable from "../../vox/base/IRunnable";

export default interface IRunnableQueue {

    addRunner(runner: IRunnable): void;
    removeRunner(runner: IRunnable): void;
    run(): void;
    destroy(): void;
}
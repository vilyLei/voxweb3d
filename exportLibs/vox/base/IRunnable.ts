/***************************************************************************/
/*                                                                         */
/*  Copyright 2019-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
interface IRunnable {
    setRunFlag(flag: number): void;
    getRunFlag(): number;
    isRunning(): boolean;
    isStopped(): boolean;
    run(): void;
}
export default IRunnable;
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

interface IRendererScene {
    getUid(): number;
    renderBegin(contextBeginEnabled: boolean): void
    runBegin(autoCycle: boolean, contextBeginEnabled: boolean): void;
    setRayTestEanbled(enabled: boolean): void;
    update(autoCycle: boolean, mouseEventEnabled: boolean): void;
    run(autoCycle: boolean): void;
    runEnd(): void;
    runAt(index: number): void
}
export default IRendererScene;

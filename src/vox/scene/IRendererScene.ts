/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderEntity from "../../vox/render/IRenderEntity";
interface IRendererScene {
    
    getUid(): number;
    renderBegin(contextBeginEnabled: boolean): void
    runBegin(autoCycle: boolean, contextBeginEnabled: boolean): void;
    setRayTestEanbled(enabled: boolean): void;
    update(autoCycle: boolean, mouseEventEnabled: boolean): void;
    run(autoCycle: boolean): void;
    runEnd(): void;
    runAt(index: number): void;

    /**
     * add an entity to the renderer process of the renderer instance
     * @param entity IRenderEntity instance(for example: DisplayEntity class instance)
     * @param processid this destination renderer process id
     * @param deferred if the value is true,the entity will not to be immediately add to the renderer process by its id
     */
    addEntity(entity: IRenderEntity, processIndex: number, deferred: boolean): void;
    removeEntity(entity: IRenderEntity): void;
}
export default IRendererScene;

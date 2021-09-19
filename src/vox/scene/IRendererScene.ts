/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderEntity from "../../vox/render/IRenderEntity";
import DisplayEntityContainer from "../../vox/entity/DisplayEntityContainer";
interface IRendererScene {
    
    getUid(): number;
    /**
     * @param contextBeginEnabled the default value is default
     */
    renderBegin(contextBeginEnabled: boolean): void
    /**
     * @param autoCycle the default value is true
     * @param contextBeginEnabled the default value is true
     */
    runBegin(autoCycle: boolean, contextBeginEnabled: boolean): void;
    setRayTestEanbled(enabled: boolean): void;
    update(autoCycle: boolean, mouseEventEnabled: boolean): void;
    run(autoCycle: boolean): void;
    runEnd(): void;
    runAt(index: number): void;
    isRayPickSelected(): boolean;
    /**
     * add an entity to the renderer process of the renderer instance
     * @param entity IRenderEntity instance(for example: DisplayEntity class instance)
     * @param processid this destination renderer process id
     * @param deferred if the value is true,the entity will not to be immediately add to the renderer process by its id
     */
    addEntity(entity: IRenderEntity, processIndex: number, deferred: boolean): void;
    removeEntity(entity: IRenderEntity): void;
    addContainer(child: DisplayEntityContainer, processIndex: number): void;
    removeContainer(child: DisplayEntityContainer): void;

    /**
     * @param type event type
     * @param target event listerner
     * @param func event listerner callback function
     * @param captureEnabled the default value is true
     * @param bubbleEnabled the default value is false
     */
    addEventListener(type: number, target: any, func: (evt: any) => void, captureEnabled: boolean, bubbleEnabled: boolean): void;
    /**
     * @param type event type
     * @param target event listerner
     * @param func event listerner callback function
     */
    removeEventListener(type: number, target: any, func: (evt: any) => void): void;
}
export default IRendererScene;

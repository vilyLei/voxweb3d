/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderEntityBase from "../render/IRenderEntityBase";

interface IREntityScene {

    getUid(): number;

    /**
     * add an entity to the renderer process of the renderer instance
     * @param entity IRenderEntityBase instance(for example: DisplayEntity class instance)
     * @param processid this destination renderer process id, the default value is 0
     * @param deferred if the value is true,the entity will not to be immediately add to the renderer process by its id.the default value is true
     */
    addEntity(entity: IRenderEntityBase, processid?: number, deferred?: boolean): void;
    /**
     * remove an entity from the renderer instance
     * @param entity IRenderEntityBase instance(for example: DisplayEntity class instance)
     */
    removeEntity(entity: IRenderEntityBase): void;

    /**
     * @param type event type
     * @param target event listerner
     * @param func event listerner callback function
     * @param captureEnabled the default value is true
     * @param bubbleEnabled the default value is false
     */
    addEventListener(type: number, target: any, func: (evt: any) => void, captureEnabled?: boolean, bubbleEnabled?: boolean): void;
    /**
     * @param type event type
     * @param target event listerner
     * @param func event listerner callback function
     */
    removeEventListener(type: number, target: any, func: (evt: any) => void): void;
}
export default IREntityScene;

/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

/**
 * to be used in the renderer runtime
 */
export default interface IRenderEntityBase {
    
    uuid: string;
    /**
     * mouse interaction enabled, the default value is false
     */
    mouseEnabled: boolean;
    /**
     * @returns value < 12 , the instance is a RenderEntity instance, otherwise it is a DisplayEntityContainer instance
     */
    getREType(): number;
    getUid(): number;
    setVisible(boo: boolean): void;
    getVisible(): boolean;
    isVisible(): boolean;
    update(): void;
    destroy(): void;
}

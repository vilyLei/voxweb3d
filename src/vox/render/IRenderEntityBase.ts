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
    /**
     * mouse interaction enabled, the default value is false
     */
    mouseEnabled: boolean;
    update(): void;
    destroy(): void;
    getUid(): number;
    setVisible(boo: boolean): void;
    getVisible(): boolean;
    isVisible(): boolean;
}

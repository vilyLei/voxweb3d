/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

interface IEntityUpdate {
    /**
     * the default value is 0
     */
    __$transUpdate: number;
    update(): void;
}

export default IEntityUpdate;
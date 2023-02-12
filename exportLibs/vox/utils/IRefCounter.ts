/***************************************************************************/
/*                                                                         */
/*  Copyright 2019-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
export default interface IRefCounter
{
    __$attachThis():void;
    __$detachThis():void;
    getAttachCount():number;
}
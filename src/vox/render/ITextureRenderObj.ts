/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

export namespace vox
{
    export namespace render
    {
        
        export interface ITextureRenderObj
        {
            run():void;
            getMid():number;
            __$attachThis():void;
            __$detachThis():void;
        }
        
    }
}
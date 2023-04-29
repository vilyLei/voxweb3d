/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

interface IRenderingColorMask {
    
    readonly ALL_TRUE: number;// the default value is 0;
    readonly ALL_FALSE: number;// the default value is 1;
    readonly RED_TRUE: number;// the default value is 2;
    readonly GREEN_TRUE: number;// the default value is 3;
    readonly BLUE_TRUE: number;// the default value is 4;
    readonly ALPHA_TRUE: number;// the default value is 5;
    readonly RED_FALSE: number;// the default value is 6;
    readonly GREEN_FALSE: number;// the default value is 7;
    readonly BLUE_FALSE: number;// the default value is 8;
    readonly ALPHA_FALSE: number;// the default value is 9;
}
export { IRenderingColorMask }
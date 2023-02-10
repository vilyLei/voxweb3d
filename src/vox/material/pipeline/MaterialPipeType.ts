
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
interface IMaterialPipeType {

}

enum MaterialPipeType {
    
    ENV_LIGHT_PARAM,
    ENV_AMBIENT_LIGHT,
    FOG,
    FOG_EXP2,
    VSM_SHADOW,
    GLOBAL_LIGHT
}

export {MaterialPipeType};
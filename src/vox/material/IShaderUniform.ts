/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShdProgram from "../../vox/material/ShdProgram";
import IRenderShader from "../../vox/render/IRenderShader";

export default interface IShaderUniform
{
    next:IShaderUniform;
    use(rc:IRenderShader):void;
    useByLocation(rc:IRenderShader,type:number,location:any,i:number):void;
    useByShd(rc:IRenderShader,shd:ShdProgram):void
    updateData():void;
    destroy():void;
}
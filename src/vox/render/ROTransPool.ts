
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as Matrix4T from "../../vox/geom/Matrix4";
import * as IShaderUniformT from "../../vox/material/IShaderUniform";

import Matrix4 = Matrix4T.vox.geom.Matrix4;
import IShaderUniform = IShaderUniformT.vox.material.IShaderUniform;

export namespace vox
{
    export namespace render
    {
        export class ROTransPool
        {
            private static s_transMap:Map<number,IShaderUniform> = new Map();

            static SetTransUniform(mat:Matrix4,uniform:IShaderUniform):void
            {
                ROTransPool.s_transMap.set(mat.getUid(), uniform);
            }
            static GetTransUniform(mat:Matrix4):IShaderUniform
            {
                return ROTransPool.s_transMap.get(mat.getUid());
            }
            static HasTransUniform(mat:Matrix4):boolean
            {
                return ROTransPool.s_transMap.has(mat.getUid());
            }
            static RemoveTransUniform(mat:Matrix4):void
            {
                ROTransPool.s_transMap.delete(mat.getUid());
            }
        }

    }
}
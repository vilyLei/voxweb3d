/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

export namespace vox
{
    export namespace scene
    {
        export class RSEntityFlag
        {
            static readonly DEFAULT:number = 0x7f00000;

            // 第27位存放是否在container里面
            // 在 container 内
            static readonly CONTAINER_FLAG:number = 0x80000000;// (1<<27)
            // 没在 container 内
            static readonly CONTAINER_NOT_FLAG:number = ~(0x80000000);// ~(1<<27)

            static AddContainerFlag(flag:number):number
            {
                return flag | RSEntityFlag.CONTAINER_FLAG;
            }
            static RemoveContainerFlag(flag:number):number
            {
                return flag & RSEntityFlag.CONTAINER_NOT_FLAG;
            }

            // 第0位到第19位总共20位存放自身在space中的 index id(1 到 1048575(0xFFFFF), 但是不会包含0xFFFFF)
            static readonly SPACE_FLAT:number = 0xFFFFF;
            static readonly SPACE_NOT_FLAT:number = ~0xFFFFF;


            // 第20位开始到26位为总共7位止存放在renderer中的状态数据(renderer unique id and others),
            // 最多可以支持同时构建64个renderer instance
            static readonly RENDERER_UID_FLAT:number = 0x7f00000;// (1<<20 | 1<<21 | 1<<22 | 1<<23 | 1<<24 | 1<<25 | 1<<26);
            static readonly RENDERER_UID_NOT_FLAT:number = ~0x7f00000;
            static AddRendererUid(flag:number, rawUid:number):number
            {
                return (flag & RSEntityFlag.RENDERER_UID_NOT_FLAT) | rawUid<<20;
            }
            static RemoveRendererUid(flag:number):number
            {
                return flag | RSEntityFlag.RENDERER_UID_FLAT;
            }
            static GetRendererUid(flag:number):number
            {
                return (flag & RSEntityFlag.RENDERER_UID_FLAT)>>20;
            }

            // 第28位开始到30位总共3位存放renderer 载入状态 的相关信息
            static readonly RENDERER_LOAD_FLAT:number = 0x70000000;// (1<<28 | 1<<29 | 1<<30);
            static readonly RENDERER_LOAD_NOT_FLAT:number = ~0x70000000;
            static AddRendererLoad(flag:number):number
            {
                return flag | RSEntityFlag.RENDERER_LOAD_FLAT;
            }
            static RemoveRendererLoad(flag:number):number
            {
                return flag & RSEntityFlag.RENDERER_LOAD_NOT_FLAT;
            }
            static readonly RENDERER_ADN_LOAD_FLAT:number = 0x7f00000 | 0x70000000;
        }
    }
}
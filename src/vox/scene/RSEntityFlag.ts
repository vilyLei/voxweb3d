/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
export default class RSEntityFlag {
    static readonly DEFAULT: number = 0x7f00000;
    // 第27位存放是否在container里面
    // 在 container 内
    static readonly CONTAINER_FLAG: number = 0x80000000;// (1<<27)
    // 没在 container 内
    static readonly CONTAINER_NOT_FLAG: number = -0x80000001;//~(0x80000000), ~(1<<27)
    static AddContainerFlag(flag: number): number {
        //return flag | RSEntityFlag.CONTAINER_FLAG;
        return flag | 0x80000000;
    }
    static RemoveContainerFlag(flag: number): number {
        //return flag & RSEntityFlag.CONTAINER_NOT_FLAG;
        return flag & -0x80000001;
    }
    // 第0位到第19位总共20位存放自身在space中的 index id(1 到 1048575(0xFFFFF), 但是不会包含0xFFFFF)
    static readonly SPACE_FLAG: number = 0xFFFFF;
    static readonly SPACE_NOT_FLAG: number = -0x100000;// ~0xFFFFF;
    static AddSpaceUid(flag: number, rawUid: number): number {
        return (flag & -0x100000) | rawUid;
    }
    static RemoveSpaceUid(flag: number): number {
        //return flag & RSEntityFlag.SPACE_NOT_FLAG;
        return flag & -0x100000;
    }
    static GetSpaceUid(flag: number): number {
        //return flag & RSEntityFlag.SPACE_FLAG;
        return flag & 0xFFFFF;
    }
    // 第20位开始到26位为总共7位止存放在renderer中的状态数据(renderer unique id and others),
    // 最多可以支持同时构建64个renderer instance
    static readonly RENDERER_UID_FLAG: number = 0x7F00000;// (1<<20 | 1<<21 | 1<<22 | 1<<23 | 1<<24 | 1<<25 | 1<<26);
    static readonly RENDERER_UID_NOT_FLAG: number = -0x7f00001;// ~0x7F00000;
    static readonly RENDERER_UID_INVALID: number = 127;// ~0x7F00000;
    static AddRendererUid(flag: number, rawUid: number): number {
        return (flag & -0x7f00001) | rawUid << 20;
    }
    static RemoveRendererUid(flag: number): number {
        //return flag | RSEntityFlag.RENDERER_UID_FLAG;
        return flag | 0x7F00000;
    }
    static GetRendererUid(flag: number): number {
        //return (flag & RSEntityFlag.RENDERER_UID_FLAG)>>20;
        flag = ((flag & 0x7F00000) >> 20);
        return flag < 127 ? flag : -1;
    }
    static TestRendererUid(flag: number): boolean {
        //return (flag & RSEntityFlag.RENDERER_UID_FLAG)>>20;
        flag = ((flag & 0x7F00000) >> 20);
        return flag < 127;
    }
    //0x40000000
    // 第30位存放 是否渲染运行时排序(rendering sort enabled) 的相关信息
    static readonly SORT_FLAG: number = 0x40000000;// (1<<30);
    static readonly SORT_NOT_FLAG: number = -0x40000001;// ~0x40000000;
    static AddSortEnabled(flag: number): number {
        //return flag | RSEntityFlag.SORT_FLAG;
        return flag | 0x40000000;
    }
    static RemoveSortEnabled(flag: number): number {
        //return flag & RSEntityFlag.SORT_NOT_FLAG;
        return flag & (-0x40000001);
    }
    static TestSortEnabled(flag: number): boolean {
        //return (flag & RSEntityFlag.SORT_FLAG) == RSEntityFlag.SORT_FLAG;
        return (flag & 0x40000000) == 0x40000000;
    }
    // 第28位开始到29位总共2位存放renderer 载入状态 的相关信息
    static readonly RENDERER_LOAD_FLAG: number = 0x30000000;// (1<<28 | 1<<29);
    static readonly RENDERER_LOAD_NOT_FLAG: number = -0x30000001;// ~0x30000000;
    static AddRendererLoad(flag: number): number {
        //return flag | RSEntityFlag.RENDERER_LOAD_FLAG;
        return flag | 0x30000000;
    }
    static RemoveRendererLoad(flag: number): number {
        //return flag & RSEntityFlag.RENDERER_LOAD_NOT_FLAG;
        return flag & (-0x30000001);
    }
    static readonly RENDERER_ADN_LOAD_FLAG: number = 0x37F00000;// 0x7f00000 | 0x30000000;
    static TestSpaceContains(flag: number): boolean {
        return (0xFFFFF & flag) > 0;
    }
    static TestSpaceEnabled(flag: number): boolean {
        return (0xFFFFF & flag) < 1;
    }
    static TestSpaceEnabled2(flag: number): boolean {
        // console.log("   TestSpaceEnabled2(), 0xFFFFF & flag: ", (0xFFFFF & flag));
        // console.log("                       (0x80000000 & flag) != 0x80000000: ", ((0x80000000 & flag) != 0x80000000));
        return (0xFFFFF & flag) < 1 && (0x80000000 & flag) != 0x80000000;
    }
    static TestContainerEnabled(flag: number): boolean {
        //return (RSEntityFlag.RENDERER_UID_FLAG & flag) == RSEntityFlag.RENDERER_UID_FLAG && (RSEntityFlag.CONTAINER_FLAG & flag) != RSEntityFlag.CONTAINER_FLAG;
        return (0x7F00000 & flag) == 0x7F00000 && (0x80000000 & flag) != 0x80000000;
    }
    static TestRendererEnabled(flag: number): boolean {
        //return (RSEntityFlag.RENDERER_ADN_LOAD_FLAG & flag) == RSEntityFlag.RENDERER_UID_FLAG && (RSEntityFlag.CONTAINER_FLAG & flag) != RSEntityFlag.CONTAINER_FLAG;
        return (0x37F00000 & flag) == 0x7F00000 && (0x80000000 & flag) != 0x80000000;
    }
}
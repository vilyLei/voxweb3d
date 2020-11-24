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
        export class RenderFilter
        {
			static readonly NEAREST:number = 4001;
            static readonly LINEAR:number = 4002;
            static readonly LINEAR_MIPMAP_LINEAR:number = 4003;
            static readonly NEAREST_MIPMAP_NEAREST:number = 4004;
            static readonly LINEAR_MIPMAP_NEAREST:number = 4005;
            static readonly NEAREST_MIPMAP_LINEAR:number = 4006;
		}
	}
}

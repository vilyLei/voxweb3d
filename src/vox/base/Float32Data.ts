/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

export namespace vox
{
    export namespace base
    {
		/////////////////////////////////////////////////////////////////////////////////////////////////
		export interface Float32Data
		{
			getCapacity():number;
			getLocalFS32():Float32Array;
			getFS32():Float32Array;
			getFSIndex():number;
		}		
	}
}

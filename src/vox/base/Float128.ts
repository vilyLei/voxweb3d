/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Float32Data from "../../vox/base/Float32Data";
//import Float32Data = Float32DataT.vox.base.Float32Data;

export namespace vox
{
    export namespace base
    {
		/////////////////////////////////////////////////////////////////////////////////////////////////
		export class Float128 implements Float32Data
		{
			private static ___InitData_0:Float32Array = new Float32Array([
				0.0, 0.0, 0.0, 0.0,0.0, 0.0, 0.0, 0.0,0.0, 0.0, 0.0, 0.0,0.0, 0.0, 0.0, 0.0,0.0, 0.0, 0.0, 0.0,0.0, 0.0, 0.0, 0.0,0.0, 0.0, 0.0, 0.0,0.0, 0.0, 0.0, 0.0,
				0.0, 0.0, 0.0, 0.0,0.0, 0.0, 0.0, 0.0,0.0, 0.0, 0.0, 0.0,0.0, 0.0, 0.0, 0.0,0.0, 0.0, 0.0, 0.0,0.0, 0.0, 0.0, 0.0,0.0, 0.0, 0.0, 0.0,0.0, 0.0, 0.0, 0.0,
				0.0, 0.0, 0.0, 0.0,0.0, 0.0, 0.0, 0.0,0.0, 0.0, 0.0, 0.0,0.0, 0.0, 0.0, 0.0,0.0, 0.0, 0.0, 0.0,0.0, 0.0, 0.0, 0.0,0.0, 0.0, 0.0, 0.0,0.0, 0.0, 0.0, 0.0,
				0.0, 0.0, 0.0, 0.0,0.0, 0.0, 0.0, 0.0,0.0, 0.0, 0.0, 0.0,0.0, 0.0, 0.0, 0.0,0.0, 0.0, 0.0, 0.0,0.0, 0.0, 0.0, 0.0,0.0, 0.0, 0.0, 0.0,0.0, 0.0, 0.0, 0.0
			]);
			private static ___InitData_1:Float32Array = new Float32Array([
				1.0, 1.0, 1.0, 1.0,1.0, 1.0, 1.0, 1.0,1.0, 1.0, 1.0, 1.0,1.0, 1.0, 1.0, 1.0,1.0, 1.0, 1.0, 1.0,1.0, 1.0, 1.0, 1.0,1.0, 1.0, 1.0, 1.0,1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0,1.0, 1.0, 1.0, 1.0,1.0, 1.0, 1.0, 1.0,1.0, 1.0, 1.0, 1.0,1.0, 1.0, 1.0, 1.0,1.0, 1.0, 1.0, 1.0,1.0, 1.0, 1.0, 1.0,1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0,1.0, 1.0, 1.0, 1.0,1.0, 1.0, 1.0, 1.0,1.0, 1.0, 1.0, 1.0,1.0, 1.0, 1.0, 1.0,1.0, 1.0, 1.0, 1.0,1.0, 1.0, 1.0, 1.0,1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0,1.0, 1.0, 1.0, 1.0,1.0, 1.0, 1.0, 1.0,1.0, 1.0, 1.0, 1.0,1.0, 1.0, 1.0, 1.0,1.0, 1.0, 1.0, 1.0,1.0, 1.0, 1.0, 1.0,1.0, 1.0, 1.0, 1.0
			]);
			private static __s_uid:number = 0;
			private m_uid:number = -1;
			private m_index:number = 0;
			private m_fs32:Float32Array = null;
			private m_localFS32:Float32Array = null;

			name:string = "Float128";

			constructor(pfs32:Float32Array = null,index:number = 0)
			{
				this.m_uid = Float128.__s_uid++;
				this.m_index = index;
				if(pfs32 != null)
				{
					this.m_fs32 = pfs32;
					this.m_localFS32 = this.m_fs32.subarray(index,index + 128);
				}
				else
				{
					this.m_fs32 = new Float32Array(128);
					this.m_fs32.set(Float128.___InitData_0,0);
					this.m_localFS32 = this.m_fs32;
				}
			}
			getCapacity():number
			{
				return 128;
			}
			getUid():number
			{
				return this.m_uid;
			}
			getLocalFS32():Float32Array
			{
				return this.m_localFS32;
			}
			getFS32():Float32Array
			{
				return this.m_fs32;
			}
			getFSIndex():number
			{
				return this.m_index;
			}
    		identity():void
    		{
				this.m_localFS32.set(Float128.___InitData_0,0);
			}
			
    		identityOne():void
    		{
				this.m_localFS32.set(Float128.___InitData_1,0);
    		}
    		
			setF32ArrAndIndex(fs32Arr:Float32Array,index:number = 0):void
			{
				if(fs32Arr != null)
				{
					this.m_fs32 = fs32Arr;
					this.m_index = index;
				}
			}
			setF32Arr(fs32Arr:Float32Array):void
			{
				if(fs32Arr != null)
				{
					this.m_fs32 = fs32Arr;
				}
			}
    		copyFromF32Arr(fs32Arr:Float32Array,index:number = 0):void
			{
				let subArr:Float32Array = fs32Arr.subarray(index, index + 128);
				this.m_fs32.set(subArr, this.m_index);
			}
    		copyFrom(mat_other:Float128):void
			{
				this.m_localFS32.set(mat_other.getLocalFS32(),0);
    		}
    		copyTo(mat_other:Float128):void
			{
				mat_other.copyFrom(this);
    		}
			copyRawDataTo(float_rawDataArr:Float32Array,rawDataLength:number = 4, index:number = 0):void
			{
				let c:number = 0;
    		    while (c < rawDataLength)
    		    {
					float_rawDataArr[c + index] = this.m_fs32[this.m_index + c];
					++c;
				}
			}
		    /////////////////////////////////////////////////////////////
		    toString():string
		    {
		        return "\n"+this.m_localFS32+"\n";
			}
			destroy():void
			{
				this.m_localFS32 = null;
				this.m_fs32 = null;
				this.m_index = -1;
			}
		}		
	}
}

/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Matrix4 from "../../vox/math/Matrix4";

class Matrix4Pool
{
    private static s_FLAG_BUSY:number = 1;
    private static s_FLAG_FREE:number = 0;
    private static s_matList:Matrix4[] = [];
    private static s_matFlagList:number[] = [];
    private static m_freeIdList:number[] = [];        
	private static s_mfs32Arr:Float32Array = null;
	private static s_baseUid:number = 0;
	private static s_maxUid:number = 0;
	private static s_mtotal:number = 0;
	static GetMatTotal():number
	{
		return Matrix4Pool.s_mtotal;
	}
	static GetFS32Arr():Float32Array
	{
		return Matrix4Pool.s_mfs32Arr;
	}
	static SetFS32Arr(fs32:Float32Array):void
	{
		Matrix4Pool.s_mfs32Arr = fs32;
		let total = Matrix4Pool.s_mtotal;
		let list:Matrix4[] = Matrix4Pool.s_matList;
		for(let i:number = 0; i < total; ++i)
		{
			list[i].setF32Arr(fs32);
		}
	}
    static GetFreeId()
    {
        if(Matrix4Pool.m_freeIdList.length > 0)
        {
            return Matrix4Pool.m_freeIdList.pop();
        }
        return -1; 
    }
	static Allocate(total:number):void
	{
		if(total < 1024)
		{
			total = 1024;
		}
		if(Matrix4Pool.s_mtotal < 1)
		{
			console.log("Matrix4Pool::Allocate(), Matrix total: "+total);
			Matrix4Pool.s_mtotal = total;
			Matrix4Pool.s_mfs32Arr = new Float32Array(total * 16);
			let i:number = 0;
			let mat:Matrix4 = new Matrix4(Matrix4Pool.s_mfs32Arr,i * 16);
			let uid:number = mat.getUid();
			Matrix4Pool.s_baseUid = uid;
			Matrix4Pool.s_maxUid = uid + total;
			for(; i < uid; ++i)
			{
				Matrix4Pool.s_matList.push( null );
            	Matrix4Pool.s_matFlagList.push(Matrix4Pool.s_FLAG_FREE);
			}
			Matrix4Pool.s_matList.push( mat );
			Matrix4Pool.s_matFlagList.push(Matrix4Pool.s_FLAG_FREE);
			Matrix4Pool.m_freeIdList.push(mat.getUid());
			for(i = 1; i < total; ++i)
			{
				mat = new Matrix4(Matrix4Pool.s_mfs32Arr,i * 16);
				Matrix4Pool.s_matList.push( mat );
            	Matrix4Pool.s_matFlagList.push(Matrix4Pool.s_FLAG_FREE);
				Matrix4Pool.m_freeIdList.push(mat.getUid());
			}
		}
	}
    static GetMatrix():Matrix4
    {
		let mat:Matrix4 = null;
        let index:number = Matrix4Pool.GetFreeId() - Matrix4Pool.s_baseUid;
        if(index >= 0)
        {
			mat = Matrix4Pool.s_matList[index];
			mat.identity();
			Matrix4Pool.s_matFlagList[index] = Matrix4Pool.s_FLAG_BUSY;
			//console.log("Get a free Matrix !!!");
		}
		else
		{
			//console.error("Matrix4Pool::GetMatrix(), Error Matrix4Pool is empty !!!");
			mat =  new Matrix4();
		}
        return mat;
    }
    static RetrieveMatrix(mat:Matrix4):void
    {
		if(mat != null)
		{
			let uid:number = mat.getUid();
			if(uid >= Matrix4Pool.s_baseUid && uid < Matrix4Pool.s_maxUid)
			{
				if(Matrix4Pool.s_matFlagList[uid - Matrix4Pool.s_baseUid] == Matrix4Pool.s_FLAG_BUSY)
				{
					Matrix4Pool.m_freeIdList.push(uid);
					Matrix4Pool.s_matFlagList[uid - Matrix4Pool.s_baseUid] = Matrix4Pool.s_FLAG_FREE;
				}
			}
		}
    }
}

export default Matrix4Pool;
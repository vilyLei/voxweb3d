/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
class TrackSeg
{
	constructor(){}
	// 记录自身起点距离整个路径起点的距离
	disA:number = 0.0;
	// 记录自身终点距离整个路径起点的距离
	disB:number = 0.0;
	// 记录自身的长度
	length:number = 0.0;
	// 记录自身的切向矢量
	tv:Vector3D = new Vector3D(1.0,0.0,0.0);
	// 记录自身起点的位置
	pos:Vector3D = new Vector3D();
}
/// <summary>
/// by Vily
/// 由最稀疏的点连接起来的路径管理器
/// 这个管理器可以让目标按照任意速度大小沿着这条路机构移动
/// 支持基于时间和路程的动态控制
/// </summary>
class PathTrack
{
	constructor(){}
	// 记录计算结果的状态
	public static readonly TRACK_ERROR:number = -1;
	// 在路径的端点
	public static readonly TRACK_BEGIN:number = 0;
	// 在路径中
	public static readonly TRACK_AMONG:number = 1;
	// 在路径的终点
	public static readonly TRACK_END:number = 2;
	//
	private _index:number = 0;
	// 记录总路程
	private _pathDis:number = 0;
	// 记录每一个折点在整个路径中的路程值
	private _posDisList:number[] = [];
	// 记录一点到下一点之间的连接段
	private _segs:TrackSeg[] = [];
	private _endSeg:TrackSeg = null;
	//
	private __tempV:Vector3D = new Vector3D();
	//
	addXYZ(px:number, py:number, pz:number):void
	{
		
		let seg = new TrackSeg();
		seg.pos.setTo(px, py, pz);
		let i = this._segs.length;
		if (i > 0) {
			//
			let preseg = this._segs[i - 1];
			preseg.tv.x = seg.pos.x - preseg.pos.x;
			preseg.tv.y = seg.pos.y - preseg.pos.y;
			preseg.tv.z = seg.pos.z - preseg.pos.z;
			preseg.length = preseg.tv.getLength();
			preseg.tv.normalize();
			
			this._pathDis += preseg.length;
			//
			preseg.disB = this._pathDis;
			
			seg.disA = this._pathDis;
			this._posDisList.push(this._pathDis);
		}else {
			seg.disA = 0;
			this._posDisList.push(0);
		}
		this._segs.push(seg);
		this._endSeg = seg;
	}
	getPathDistance():number
	{
		return this._pathDis;
	}
	getStepsTotal(stepDis:number):number
	{
		return Math.ceil(this._pathDis/stepDis);
	}
	etPosAt(outV:Vector3D,i:number):void
	{
		if (i >= 0 && i < this._segs.length) {
			outV.copyFrom(this._segs[i].pos);
		}
	}
	getCurrPosIndex():number
	{
		return this._index;
	}
	getPosTotal():number
	{
		return this._segs.length;
	}
	etSqrtDistancePosEnd(px:number, py:number, pz:number)
	{
		if (this._endSeg != null) {
			this.__tempV.x = px - this._endSeg.pos.x;
			this.__tempV.y = py - this._endSeg.pos.y;
			this.__tempV.z = pz - this._endSeg.pos.z;
			return this.__tempV.getLengthSquared();
		}
		return -1;
	}
	clear():void
	{
		this._segs.length = 0;
		this._posDisList.length = 0;
		this._pathDis = 0;
		this._index = 0;
		this._endSeg = null;
	}
	// 计算规则回到起点
	toBegin():void
	{
		this._index = 0;
	}
	/// <summary>
	/// 通过总路程来计算路径上对应的位置
	/// </summary>
	/// <param name="outV">存放计算结果: 路径上指定路程对应的位置坐标</param>
	/// <param name="pdis">在当前路径上运动的路程</param>
	/// <param name="recalc">是否对整个路径进行检测计算,默认是true</param>
	/// <returns>返回 TRACK_ERROR(-1)表示路径为空, TRACK_BEGIN(0)表示处在路径的起点,TRACK_AMONG(1)表示处在路径中,TRACK_END(2)表示处在路径的终点</returns>
	calcPosByDis(outV:Vector3D, pdis:number,recalc:boolean = true):number
	{
		let len:number = this._segs.length;
		//
		if (len > 0) {
			if (pdis >= this._pathDis) {
				this._index = len - 1;
				outV.copyFrom(this._segs[this._index].pos);
				// 表示到了尾部
				return PathTrack.TRACK_END;// 2;
			}else if(pdis <= this._segs[0].disA){
				outV.copyFrom(this._segs[0].pos);
				this._index = 0;
				// 表示到了起点
				return PathTrack.TRACK_BEGIN;// 0;
			}else {
				
				if (recalc) {
					this._index = 0;
					this.binQueryCloseLess(pdis, -1, len, this._posDisList, 0, len - 1);
				}else {
					this.binQueryCloseLess(pdis, this._index - 1, len, this._posDisList, 0, len - 1);
				}
				let seg = this._segs[this._index];
				pdis -= seg.disA;
				outV.x = seg.pos.x + seg.tv.x * pdis;
				outV.y = seg.pos.y + seg.tv.y * pdis;
				outV.z = seg.pos.z + seg.tv.z * pdis;
				// 表示在路径中
				return PathTrack.TRACK_AMONG;// 1;
			}
		}
		this._index = -1;
		// 获取失败
		return PathTrack.TRACK_ERROR;
	}
	/// <summary>
	/// 通过总路程来计算路径上对应的位置
	/// 注意，这个函数是计算连续路径的,会先在临近的路程段内搜寻查找
	/// </summary>
	/// <param name="outV">存放计算结果: 路径上指定路程对应的位置坐标</param>
	/// <param name="pdis">在当前路径上运动的路程</param>
	/// <param name="recalc">是否对整个路径进行检测计算,默认是true</param>
	/// <returns>返回 TRACK_ERROR(-1)表示路径为空, TRACK_BEGIN(0)表示处在路径的起点,TRACK_AMONG(1)表示处在路径中,TRACK_END(2)表示处在路径的终点</returns>
	calcNextPosByDis(outV:Vector3D, pdis:number,recalc:boolean = false):number
	{
		let len:number = this._segs.length;
		if (len > 0) {
			if (pdis >= this._pathDis) {
				this._index = len - 1;
				outV.copyFrom(this._segs[this._index].pos);
				// 表示到了尾部
				return PathTrack.TRACK_END;
			}else if(pdis <= this._segs[0].disA){
				outV.copyFrom(this._segs[0].pos);
				this._index = 0;
				// 表示到了起点
				return PathTrack.TRACK_BEGIN;
			}else {
				let seg = null;
				if (recalc) {
					this._index = 0;
					this.binQueryCloseLess(pdis, -1, len, this._posDisList, 0, len - 1);
				}else {
					// 检测 pdis 所表示的位置是不是在当前seg或者下一个seg之间
					seg = this._segs[this._index];
					if (seg.disA > pdis) {
						this._index = 0;
						this.binQueryCloseLess(pdis, -1, len, this._posDisList, 0, len - 1);
						seg = this._segs[this._index];
					}else {
						if (seg.disB<pdis) {
							seg = this._segs[this._index+1];
							if (seg.disB<pdis) {
								seg = null;
							}
						}
						if (seg == null) {
							//console.log("二分搜索临近点找到的..");
							this.binQueryCloseLess(pdis, this._index - 1, len, this._posDisList, 0, len - 1);
							seg = this._segs[this._index];
						}else {
							//console.log("在临近点找到的..");
						}
					}
				}
				
				pdis -= seg.disA;
				outV.x = seg.pos.x + seg.tv.x * pdis;
				outV.y = seg.pos.y + seg.tv.y * pdis;
				outV.z = seg.pos.z + seg.tv.z * pdis;
				// 表示在路径中
				return PathTrack.TRACK_AMONG;
			}
		}
		this._index = -1;
		// 获取失败
		return PathTrack.TRACK_ERROR;
	}
	/**
	 * 通过二分法来查找 pvs中小于 v并且距离v最近的元素序号
	 * 注意 i0必须 <= i1, 而且初始的i0必须是pvs搜索范围中第一个元素的序号减1,i1必须是pvs搜索范围中租后一个元素的序号加1
	 * @param		minI, 最小序号值
	 * @param		maxI, 最大序号值
	 * */
	binQueryCloseLess(v:number, i0:number, i1:number, pvs:number[],minI:number,maxI:number):void
	{
		//_steps ++;
		let i:number = Math.round(0.5 * (i0 + i1));
		if (pvs[i] < v) {
			if ((i + 1) <= maxI) {
				if ( pvs[i+1] < v ) {
					if ((i1 - i) > 1) {
						//console.log("小于v, v: ", v, ",pvs[" + i + "]: " + pvs[i]);
						this.binQueryCloseLess(v,i,i1,pvs,minI,maxI);
					}else {
						//console.log("小于v(已经寻找到了A ), v: ", v, ",pvs[" + i + "]: " + pvs[i]);
						this._index = i;
					}
				}else {
					//console.log("小于v(已经寻找到了B ), v: ", v, ",pvs[" + i + "]: " + pvs[i]);
					this._index = i;
				}
			}else {
				// 已经到尾部了
				//console.log("小于v(已经寻找到了C 且 已经到尾部了), v: ", v, ",pvs[" + i + "]: " + pvs[i]);
				this._index = i;
			}
			
		}else if (pvs[i] > v){
			if ((i - 1) >= minI) {
				//console.log("pvs[i],pvs[i-1]: ",pvs[i],pvs[i-1])
				if ( pvs[i-1] > v ) {
					if ((i - i0) > 1) {
						//console.log("大于v, v: ", v, ",pvs[" + i + "]: " + pvs[i]);
						this.binQueryCloseLess(v,i0,i,pvs,minI,maxI);
					}else {
						//console.log("大于v(已经寻找到了A ), v: ", v, ",pvs[" + i + "]: " + pvs[i]);
						this._index = i;
					}
				}else {
					// 因为要寻找小于v的最近的值
					i -= 1;
					//console.log("大于v(已经寻找到了B ), v: ", v, ",pvs[" + i + "]: " + pvs[i]);
					this._index = i;
				}
			}else {
				//console.log("大于v(已经到最小边界但是还是没有找到合适的), v: ", v, ",pvs[" + i + "]: " + pvs[i]);
				this._index = i;
			}
			//
		}else {
			// 恰好相等
			//console.log("恰好相等(已经寻找到了), v: ", v, ",pvs[" + i + "]: " + pvs[i]);
			this._index = i;
		}
	}
}
export default PathTrack;
export {TrackSeg,PathTrack};
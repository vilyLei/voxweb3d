/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../../vox/math/Vector3D";

/**
 * ec3d.geom.curve.CurveSrcCalc
 * 
 * 曲线源数据计算
 * 
 * @author Vily
 */
class CurveSrcCalc {
	/**
	 * 计算二次Bezier曲线
	 * */
	static CalcBezier2(vs: number[], tot: number, v0: Vector3D, v1: Vector3D, v2: Vector3D): void {
		//b(t) = (1-t)*(1-t)*p0 + 2*t*(1-t)*p1 + t * t * p2;
		let i: number = 0;
		let px: number = 0;
		let py: number = 0;
		let pz: number = 0;
		let k: number = 0;
		for (; i <= tot; ++i) {
			//
			k = i / tot;
			px = (1.0 - k) * (1.0 - k) * v0.x + 2 * k * (1.0 - k) * v1.x + k * k * v2.x;
			py = (1.0 - k) * (1.0 - k) * v0.y + 2 * k * (1.0 - k) * v1.y + k * k * v2.y;
			pz = (1.0 - k) * (1.0 - k) * v0.z + 2 * k * (1.0 - k) * v1.z + k * k * v2.z;
			//
			vs.push(px, py, pz);
		}
	}
	/**
	 * 计算二次Bezier曲线
	 * */
	static CalcBezier2ByProgress(vs: number[], k: number, v0: Vector3D, v1: Vector3D, v2: Vector3D): void {
		//b(t) = (1-t)*(1-t)*p0 + 2*t*(1-t)*p1 + t * t * p2;
		
		let px: number = 0;
		let py: number = 0;
		let pz: number = 0;
		
		px = (1.0 - k) * (1.0 - k) * v0.x + 2 * k * (1.0 - k) * v1.x + k * k * v2.x;
		py = (1.0 - k) * (1.0 - k) * v0.y + 2 * k * (1.0 - k) * v1.y + k * k * v2.y;
		pz = (1.0 - k) * (1.0 - k) * v0.z + 2 * k * (1.0 - k) * v1.z + k * k * v2.z;
		//
		vs.push(px, py, pz);
	}
	/**
	 * 计算三次Bezier曲线
	 * */
	static CalcBezier3(vs: number[], tot: number, v0: Vector3D, v1: Vector3D, v2: Vector3D, v3: Vector3D): void {
		//B(t) = p0*(1-t)^3 + 3*p1*t*(1-t)^2+3*p2*t^2*(1-t) + p3 * t^3
		let i: number = 0;
		let px: number = 0;
		let py: number = 0;
		let pz: number = 0;
		let k: number = 0;
		let ka1: number = 0;
		let ka2: number = 0;
		let ka3: number = 0;
		let kb2: number = 0;
		let kb3: number = 0;
		for (; i <= tot; i++) {
			//
			k = i / tot;
			ka1 = (1 - k);//(1-k)
			ka2 = ka1 * ka1;//(1-k)^2
			ka3 = ka1 * ka2;//(1-k)^3
			//
			kb2 = k * k;//k^2
			kb3 = k * kb2;//k^3
			//
			px = v0.x * ka3 + 3.0 * v1.x * k * ka2 + 3.0 * v2.x * kb2 * ka1 + v3.x * kb3;
			py = v0.y * ka3 + 3.0 * v1.y * k * ka2 + 3.0 * v2.y * kb2 * ka1 + v3.y * kb3;
			pz = v0.z * ka3 + 3.0 * v1.z * k * ka2 + 3.0 * v2.z * kb2 * ka1 + v3.z * kb3;
			//
			vs.push(px, py, pz);
		}
	}
	/**
	 * 计算三次Bezier曲线
	 * */
	static CalcBezier3ByProgress(vs: number[], k: number, v0: Vector3D, v1: Vector3D, v2: Vector3D, v3: Vector3D): void {
		//B(t) = p0*(1-t)^3 + 3*p1*t*(1-t)^2+3*p2*t^2*(1-t) + p3 * t^3
		let px: number = 0;
		let py: number = 0;
		let pz: number = 0;
		//let k: number = 0;
		let ka1: number = 0;
		let ka2: number = 0;
		let ka3: number = 0;
		let kb2: number = 0;
		let kb3: number = 0;
		
		ka1 = (1 - k);//(1-k)
		ka2 = ka1 * ka1;//(1-k)^2
		ka3 = ka1 * ka2;//(1-k)^3
		//
		kb2 = k * k;//k^2
		kb3 = k * kb2;//k^3
		//
		px = v0.x * ka3 + 3.0 * v1.x * k * ka2 + 3.0 * v2.x * kb2 * ka1 + v3.x * kb3;
		py = v0.y * ka3 + 3.0 * v1.y * k * ka2 + 3.0 * v2.y * kb2 * ka1 + v3.y * kb3;
		pz = v0.z * ka3 + 3.0 * v1.z * k * ka2 + 3.0 * v2.z * kb2 * ka1 + v3.z * kb3;
		//
		vs.push(px, py, pz);
	}
	// 通过切向量来计算生成三次曲线的数据
	// p(t) = (1-3*t^2+2*t^3) * p0 + t*(1-t)^2*v0 + (3*t^2 - 2*t^3) * p3 - t^2 * (1-t) * v3
	/**
	 * 通过关键顶点的切向量来计算生成三次曲线的数据
	 * @param vs 存放结果的vector
	 * @param tot 计算的步数
	 * @param v0 曲线的起点
	 * @param tv0 曲线起点的曲线切向的单位矢量
	 * @param v3 曲线的终点
	 * @param tv3 曲线终点的曲线切向的单位矢量
	 * */
	static CalcBezier3ByTV(vs: number[], tot: number, v0: Vector3D, tv0: Vector3D, v3: Vector3D, tv3: Vector3D): void {
		let i: number = 0;
		let px: number = 0;
		let py: number = 0;
		let pz: number = 0;
		let t: number = 0;
		let t2: number = 0;
		let t3: number = 0;
		let pt: number = 0;
		for (; i <= tot; ++i) {
			t = i / tot;
			t2 = t * t;
			t3 = t * t2;
			pt = 1.0 - t;
			px = (1.0 - 3.0 * t2 + 2 * t3) * v0.x + t * pt * pt * tv0.x + (3.0 * t2 - 2.0 * t3) * v3.x + t2 * pt * tv3.x;
			py = (1.0 - 3.0 * t2 + 2 * t3) * v0.y + t * pt * pt * tv0.y + (3.0 * t2 - 2.0 * t3) * v3.y + t2 * pt * tv3.y;
			pz = (1.0 - 3.0 * t2 + 2 * t3) * v0.z + t * pt * pt * tv0.z + (3.0 * t2 - 2.0 * t3) * v3.z + t2 * pt * tv3.z;
			//
			vs.push(px, py, pz);
		}
	}
}
class CurveBase {

	// 表示曲线类型: 1->直线, 2->二次曲线, 3->三次曲线
	protected m_curveType = 2;
	// 分段总数
	protected m_segTot: number = 5;
	// 记录曲线现阶段实际的曲线上的所有点的坐标,每三个元素表示一个点
	protected m_vs: number[] = [];
	/**
	 * 曲线的起点
	 */
	 begin: Vector3D = new Vector3D();
	 /**
	  * 曲线的终点
	  */
	 end: Vector3D = new Vector3D(100, 0, 0);
	constructor(){}
	
	/**
	 * 设置曲线的分段总数
	 * @param			tot		分段数量
	 * */
	setSegTot(tot: number): void {
		this.m_segTot = tot;
	}
	getSegTot(): number {
		return this.m_segTot;
	}
	getCurveType(): number {
		return this.m_curveType;
	}
	getVS(): number[] {
		return this.m_vs;
	}
	reset(): void {
		this.m_vs = [];
	}
	getPosList(posList: Vector3D[] = null): Vector3D[] {
		let k: number = 0;
		if(posList == null)
		{
			posList = new Array(this.m_vs.length / 3);
			for (let i: number = 0; i < this.m_vs.length; i += 3) {
				posList[k++] = new Vector3D(this.m_vs[i], this.m_vs[i + 1], this.m_vs[i + 2]);
			}
		}
		else {
			let pv: Vector3D;
			for (let i: number = 0; i < this.m_vs.length; i += 3) {
				pv = posList[k++];
				pv.setXYZ(this.m_vs[i], this.m_vs[i + 1], this.m_vs[i + 2]);
			}
		}
		return posList;
	}
	updateCalc() {
	}
	calcByProgress(k: number): void {
	}
	getPosTotal(): number {
		return this.m_vs.length / 3;
	}
}
/**
 * ec3d.geom.curve.Bezier2Curve
 * 
 * 二次Bezier曲线的逻辑对象
 * 
 * @author Vily
 */
class Bezier2Curve extends CurveBase {
	
	constructor() {
		super();
		this.m_curveType = 2;
	}	
	/**
	 * 控制点
	 */
	ctrPos: Vector3D = new Vector3D(100.0, 100.0, 0.0);
	updateCalc() {
		this.reset();
		CurveSrcCalc.CalcBezier2(this.m_vs, this.m_segTot, this.begin, this.ctrPos, this.end);
	}
	calcByProgress(k: number): void {
		this.reset();
		CurveSrcCalc.CalcBezier2ByProgress(this.m_vs, k, this.begin, this.ctrPos, this.end);
	}
	
}
class Bezier3Curve extends CurveBase {
	constructor() {
		super();
		this.m_curveType = 3;
	}
	/**
	 * 控制点A
	 */
	ctrAPos: Vector3D = new Vector3D(40, 40, 0);
	/**
	 * 控制点B
	 */
	ctrBPos: Vector3D = new Vector3D(70, 70, 0);
	/**
	 * 重新计算
	 */
	updateCalc(): void {
		this.reset();
		CurveSrcCalc.CalcBezier3(this.m_vs, this.m_segTot, this.begin, this.ctrAPos, this.ctrBPos, this.end);
	}
	calcByProgress(k: number): void {
		CurveSrcCalc.CalcBezier3ByProgress(this.m_vs, k, this.begin, this.ctrAPos, this.ctrBPos, this.end);
	}
}

export { CurveSrcCalc, Bezier2Curve, Bezier3Curve };
export default CurveSrcCalc;
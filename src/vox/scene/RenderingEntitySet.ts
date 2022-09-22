/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderEntity from "../../vox/render/IRenderEntity";
import MathConst from "../math/MathConst";
import IRenderingEntitySet from "./IRenderingEntitySet";
import IEntityQuery from "./IEntityQuery";

/**
 * 正在被渲染的可渲染实体的集合
 */
export default class RenderingEntitySet implements IRenderingEntitySet {

	private m_entities: IRenderEntity[] = new Array(2048);
	private m_total: number = 0;
	private m_flag = false;
	
	query(q: IEntityQuery): void {
		q.query(this.m_entities, this.m_total);
	}
	getTotal(): number {
		return this.m_total;
	}
	clear(): void {

		if(this.m_flag) {			
			this.m_flag = false;
			
			let len = this.m_entities.length;
			let ls = this.m_entities;
			for(let i = 0; i < len; ++i) {
				ls[i] = null;
			}
			this.m_total = 0;
		}
	}
	reset(total: number): void {
		this.m_flag = true;
		if(total > this.m_entities.length) {
			total = MathConst.GetNearestCeilPow2(total);
			this.m_entities = new Array(total);
		}
		this.m_total = 0;
	}
	addEntity(et: IRenderEntity): void {
		this.m_entities[this.m_total++] = et;
	}
}

/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderEntity from "../../vox/render/IRenderEntity";

/**
 * 从正在被渲染的可渲染实体的集合中筛选适合的可渲染实体行为规范
 */
export default interface IEntityQuery {
	query(entities: IRenderEntity[], total: number): void;
}

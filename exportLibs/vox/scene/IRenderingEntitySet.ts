/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IEntityQuery from "./IEntityQuery";

/**
 * 正在被渲染的可渲染实体的集合
 */
export default interface IRenderingEntitySet {
	
	query(q: IEntityQuery): void;
	getTotal(): number;
}

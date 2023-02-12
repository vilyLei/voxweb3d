/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IAABB from "../../vox/geom/IAABB";
import IRPONode from "../../vox/render/IRPONode";
import IRenderEntity from "../../vox/render/IRenderEntity";

export default interface IEntity3DNode {
	uid: number;
	rstatus: number;
	pcoEnabled: boolean;
	drawEnabled: boolean;
	prev: IEntity3DNode;
	next: IEntity3DNode;
	entity: IRenderEntity;
	bounds: IAABB;
	rayTestState: number;
	rpoNode: IRPONode;
	spaceId: number;
	// 记录上一次摄像机裁剪自身的状态
	camVisiSt: number;
	// 记录摄像机可见状态,大于0表示不可见
	camVisi: number;
	reset(): void;
}

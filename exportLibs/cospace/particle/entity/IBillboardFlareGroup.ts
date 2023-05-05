/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IBillboardGroup from "./IBillboardGroup";

export default interface IBillboardFlowGroup extends IBillboardGroup {

	createGroup(billboardTotal: number): void;
}

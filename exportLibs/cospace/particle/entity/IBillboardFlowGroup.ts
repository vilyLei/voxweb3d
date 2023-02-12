/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IBillboardGroup from "./IBillboardGroup";

export default interface IBillboardFlowGroup extends IBillboardGroup {

    createGroup(billboardTotal: number): void;
}

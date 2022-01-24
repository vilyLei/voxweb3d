/***************************************************************************/
/*                                                                         */
/*  Copyright 2019-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRPODisplay from "../../vox/render/IRPODisplay";

interface IRODisplaySorter {
    sortRODisplay(nodes: IRPODisplay[], nodesTotal: number): number;
}
export default IRODisplaySorter;
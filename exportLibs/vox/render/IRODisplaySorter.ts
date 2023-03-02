/***************************************************************************/
/*                                                                         */
/*  Copyright 2019-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRPOUnit from "../../vox/render/IRPOUnit";

interface IRODisplaySorter {
    sortRODisplay(nodes: IRPOUnit[], nodesTotal: number): number;
}
export default IRODisplaySorter;
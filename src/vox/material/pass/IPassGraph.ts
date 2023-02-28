/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IPassRNode from "./IPassRNode";
export default interface IPassGraph extends IPassRNode {
    
    initialize(): void;
}
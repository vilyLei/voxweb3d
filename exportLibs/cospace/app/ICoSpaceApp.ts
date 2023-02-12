/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

// import { ITaskCodeModuleParam } from "./schedule/base/ITaskCodeModuleParam";
// import { CoSpace } from "./CoSpace";

import { ICoSpaceAppIns } from "./ICoSpaceAppIns";
interface ICoSpaceApp {
    
	createInstance(): ICoSpaceAppIns;
}
export { ICoSpaceApp };

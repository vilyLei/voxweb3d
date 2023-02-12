
import IRenderEntity from "../../../vox/render/IRenderEntity";
import { IDataRecorde } from "./IDataRecorde";


/**
 * renderable space transforming history recorder
 */
interface ICoTransformRecorder extends IDataRecorde {
	/**
	 * 与saveEnd 协作存放当前状态，所以初始化target的时候就应该存放进来
	 * @param tars IRenderEntity instance list
	 */
	saveBegin(tars: IRenderEntity[]): void;
	/**
	 * 与saveBegin 协作存放当前状态，所以初始化target的时候就应该存放进来
	 * @param tars IRenderEntity instance list
	 */
	saveEnd(tars: IRenderEntity[]): void;
	getCurrList(): IRenderEntity[];
}

export { ICoTransformRecorder }

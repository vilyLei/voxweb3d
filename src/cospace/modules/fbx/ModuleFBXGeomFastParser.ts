
import { IThreadReceiveData } from "../thread/base/IThreadReceiveData";
import { BaseTaskInThread } from "../thread/control/BaseTaskInThread";
import { GeometryModelDataType } from "../base/GeometryModelDataType";
interface FBXDescriptorType {
    url: string;
  }
/**
 * 作为多线程 worker 内部执行的任务处理功能的实现类, 这个文件将会被单独打包
 */
class ModuleFBXGeomFastParser extends BaseTaskInThread {

    private m_parser = {}
    constructor() {
        super();
        console.log("ModuleFBXGeomFastParser::constructor()...");
    }
    receiveData(rdata: IThreadReceiveData<GeometryModelDataType, FBXDescriptorType>): void {
    }
}
// 这一句代码是必须有的
let ins = new ModuleFBXGeomFastParser();
export { ModuleFBXGeomFastParser };

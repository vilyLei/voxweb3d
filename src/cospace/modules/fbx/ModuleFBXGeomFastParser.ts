
import { IThreadReceiveData } from "../thread/base/IThreadReceiveData";
import { BaseTaskInThread } from "../thread/control/BaseTaskInThread";
import { GeometryModelDataType } from "../base/GeometryModelDataType";

import { FBXBufferLoader } from "../../modules/fbx/FBXBufferLoader";
import { FBXBufferObject } from "../../modules/fbx/FBXBufferObject";
import { TransST, ThreadWFST } from "../thread/base/ThreadWFST";
interface FBXModelDataType {
    models: GeometryModelDataType[];
    transform: Float32Array;
    index: number;
    total: number;
}
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
    receiveData(rdata: IThreadReceiveData<FBXModelDataType, FBXDescriptorType>): void {

        let fbxBufLoader = new FBXBufferLoader();
        fbxBufLoader.parseBufBySteps(
            rdata.streams[0],
            rdata.descriptor.url,
            (model: GeometryModelDataType, bufObj: FBXBufferObject, index: number, total: number, url: string): void => {

                let wfst = (index + 1) < total ? TransST.Running : TransST.Finish;

                rdata.wfst = ThreadWFST.ModifyTransStatus(rdata.wfst, wfst)
                let transfers: ArrayBuffer[] = [];
                if (model.indices != null) {
                    transfers.push(model.indices.buffer);
                }
                if (model.vertices != null) {
                    transfers.push(model.vertices.buffer);
                }
                if (model.uvsList != null) {
                    transfers.push(model.uvsList[0].buffer);
                }
                if (model.normals != null) {
                    transfers.push(model.normals.buffer);
                }

                let modelData: FBXModelDataType = {
                    models: [model],
                    transform: bufObj.transform.getLocalFS32(),
                    index: index,
                    total: total
                };
                transfers.push(modelData.transform.buffer);
                rdata.data = modelData;
                if (transfers.length > 0) {
                    this.postMessageToThread(rdata, transfers);
                } else {
                    this.postMessageToThread(rdata);
                }
            }
        );
    }
}
// 这一句代码是必须有的
let ins = new ModuleFBXGeomFastParser();
export { ModuleFBXGeomFastParser };

import { CTMGeomDataParser } from "./CTMGeomDataParser";
import { IThreadReceiveData } from "../thread/base/IThreadReceiveData";
import { BaseTaskInThread } from "../thread/control/BaseTaskInThread";
import { GeometryModelDataType, CTMDescriptorType } from "./CTMDescriptorType";
import { CTMTaskCMD } from "./CTMTaskCMD";
import { CTMFileBody } from "./CTMFile";

/**
 * 这个类的实例来解析，杜绝了异步加载带来的顺序错乱的问题
 */
class CTMDataParser extends BaseTaskInThread {
    constructor() {
        super(false);
    }
    parseMeshData(
        rdata: IThreadReceiveData<GeometryModelDataType, CTMDescriptorType>,
        dataBuf: Uint8Array
    ): void {
        let parser = new CTMGeomDataParser();
        let fileBody: CTMFileBody = null;
        try {

			let losstime = Date.now();
            fileBody = parser.parserBinaryData(dataBuf);
			console.log("ctm decode lossTime: ", (Date.now() - losstime));

            // const readerBuf = new FileReader();
            // readerBuf.onload = (e) => {
            //     parser.parserStringData(<string>readerBuf.result)
            // };
            // readerBuf.readAsText(new Blob([dataBuf]));
        } catch (e) {
            console.error("CTM parse error, url: ", rdata.descriptor.url, rdata);
        }
        //console.log("ModuleCTMGeomParser::receiveData(),rdata: ", rdata);
        let transfers: ArrayBuffer[] = [dataBuf.buffer];
        if (fileBody != null) {

            let len: number = fileBody.uvMaps.length;

            let uvsList: Float32Array[] = [];
            for (let i: number = 0; i < len; ++i) {
                uvsList.push(fileBody.uvMaps[i].uv);
                transfers.push(fileBody.uvMaps[i].uv.buffer);
            }
            // 因为 uv 和 下面三个数据实际公用一个buffer
            // transfers.push(fileBody.vertices);
            // transfers.push(fileBody.normals);
            // transfers.push(fileBody.indices);
            len = fileBody.indices.length;
            if (len < 65536) {
                // 以下操作为了节省显存
                let ivs = new Uint16Array(fileBody.indices.buffer);
                let ls = fileBody.indices;
                for (let i = 0; i < len; ++i) {
                    ivs[i] = ls[i];
                }
                fileBody.indices = ivs.subarray(0, len);
            }
            rdata.data = {
                uvsList: uvsList,
                vertices: fileBody.vertices,
                normals: fileBody.normals,
                indices: fileBody.indices
            };

        } else {
            rdata.data = {
                uvsList: null,
                vertices: null,
                normals: null,
                indices: null
            };
        }
        this.postMessageToThread(rdata, transfers);
    }
}
/**
 * 作为多线程 worker 内部执行的任务处理功能的实现类, 这个文件将会被单独打包
 */
class ModuleCTMGeomParser extends BaseTaskInThread {

    private m_parser = new CTMDataParser();
    constructor() {
        super();
        console.log("ModuleCTMGeomParser::constructor()...");
    }
    receiveData(
        rdata: IThreadReceiveData<GeometryModelDataType, CTMDescriptorType>
    ): void {
        switch (rdata.taskCmd) {
            case CTMTaskCMD.PARSE:
                let dataBuf = rdata.streams[0] as Uint8Array;
                //this.parseMeshData(rdata, dataBuf);
                this.m_parser.parseMeshData(rdata, dataBuf);
                break;
            case CTMTaskCMD.LOAD_AND_PARSE:
                let beginTime: number = Date.now();
                this.loadMeshDataByUrl(
                    rdata.descriptor.url,
                    (buf: ArrayBuffer, url: string): void => {
                        // 创建一个实例来解析，杜绝了异步加载带来的顺序错乱的问题，保证解析的是加载结束后获得的数据
                        let parser = new CTMDataParser();
                        try {
                            console.log("load lossTime: ", (Date.now() - beginTime));
                            parser.parseMeshData(rdata, new Uint8Array(buf));
                        } catch (e) {

                        }
                    },
                    (status: number, url: string): void => {
                        console.error("loaded ctm mesh data error, url: ", url);
                    }
                );
                break;
            default:
                break;
        }
    }
    private async loadMeshDataByUrl(
        url: string,
        loadedCall: (buf: ArrayBuffer, url: string) => void,
        loadErrorCall: (status: number, url: string) => void,
        headRange: string = ""
    ) {
        // console.log("loadBinBuffer, headRange != '': ", headRange != "");
        const reader = new FileReader();
        reader.onload = (e) => {
            loadedCall(<ArrayBuffer>reader.result, url);
        };
        const request = new XMLHttpRequest();
        request.open("GET", url, true);
        if (headRange != "") {
            request.setRequestHeader("Range", headRange);
        }
        request.responseType = "blob";
        request.onload = (e) => {
            // console.log("loaded binary buffer request.status: ", request.status, e);
            if (request.status <= 206) {
                reader.readAsArrayBuffer(request.response);
            } else {
                loadErrorCall(request.status, url);
            }
        };
        request.onerror = (e) => {
            console.error(
                "load error binary buffer request.status: ",
                request.status
            );
            loadErrorCall(request.status, url);
        };
        request.send(null);
    }
    getTaskClass(): number {
        return 101;
    }
}
// 这一句代码是必须有的
let ins = new ModuleCTMGeomParser();
export { ModuleCTMGeomParser };

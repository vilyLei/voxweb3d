import { IThreadReceiveData } from "../thread/base/IThreadReceiveData";
import { BaseTaskInThread } from "../thread/control/BaseTaskInThread";
import { GeometryModelDataType, OBJModelDataType, OBJDescriptorType } from "./OBJDescriptorType";
import { ObjDataParser } from "../../../vox/assets/ObjDataParser";

/**
 * 作为多线程 worker 内部执行的任务处理功能的实现类, 这个文件将会被单独打包
 */
class ModuleOBJGeomParser extends BaseTaskInThread {

    constructor() {
        super();
        console.log("ModuleOBJGeomParser::constructor()...");
    }
    
	private parseFromStr(
        rdata: IThreadReceiveData<OBJModelDataType, OBJDescriptorType>,
        dataStr: string
        ): void {
        let models: GeometryModelDataType[] = [];
		let objParser = new ObjDataParser();
        let objMeshes = null;
        let transfers: ArrayBuffer[] = [];
        try {
            objMeshes = objParser.Parse( dataStr );
        }catch(e) {
            console.error("parse obj geom model data error.");
        }
        if(objMeshes != null) {
            let len: number = objMeshes.length;
            for (let i: number = 0; i < len; ++i) {
                const geom: any = objMeshes[i].geometry;
                const model = this.createModel( geom );
                if(model.vertices != null) {
                    transfers.push(model.indices);
                    transfers.push(model.vertices);
                    transfers.push(model.normals);
                    for(let j = 0, lj = model.uvsList.length; j < lj; ++j) {
                        transfers.push( model.uvsList[j] );
                    }
                }
                models.push(model);
            }
        }
        let modelData: OBJModelDataType = {
            models: models
        };

        rdata.data = modelData;
        if(transfers.length > 0) {
            this.postMessageToThread(rdata, transfers);
        }else {            
            this.postMessageToThread(rdata);
        }
	}
    
	private createModel(geom: any): GeometryModelDataType {

		let vtxTotal = geom.vertices.length;
		let vtCount = vtxTotal / 3;
        if(vtCount >= 3) {
            let indices: Uint16Array | Uint32Array = null;
            if(indices == null) {
                indices = vtCount <= 65535 ? new Uint16Array(vtCount) : new Uint32Array(vtCount);
        
                for (let i: number = 0; i < vtCount; ++i) {
                    indices[i] = i;
                }
            }
            if(geom.normals == null || geom.normals == undefined) {
                console.error("parse obj geom model normals data error.");
            }
            let model: GeometryModelDataType = {
                uvsList: [ new Float32Array(geom.uvs) ],
                vertices: new Float32Array(geom.vertices),
                normals: new Float32Array(geom.normals),
                indices: indices
            };
            return model;
        }else {
            let model: GeometryModelDataType = {
                uvsList: null,
                vertices: null,
                normals: null,
                indices: null
            };
            return model;
        }

	}
    receiveData(
        rdata: IThreadReceiveData<OBJModelDataType, OBJDescriptorType>
    ): void {

        let dataBuf = rdata.streams[0];
        const readerBuf = new FileReader();
		readerBuf.onload = (e) => {
			this.parseFromStr( rdata, <string>readerBuf.result );
		};
        readerBuf.readAsText( new Blob([dataBuf]) );

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
        return 103;
    }
}
// 这一句代码是必须有的
let ins = new ModuleOBJGeomParser();
export { ModuleOBJGeomParser };

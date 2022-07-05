import { IThreadReceiveData } from "../thread/base/IThreadReceiveData";
import { BaseTaskInThread } from "../thread/control/BaseTaskInThread";
import { PNG } from "pngjs"
import { PNGDescriptorType } from "./PNGDescriptorType";

/**
 * 作为多线程 worker 内部执行的任务处理功能的实现类, 这个文件将会被单独打包
 */
class ModulePNGParser extends BaseTaskInThread {

    constructor() {
        super();
        console.log("ModulePNGParser::constructor()...");
    }
    receiveData(
        rdata: IThreadReceiveData<Uint8Array, PNGDescriptorType>
    ): void {
        try {
            let pngBuf: Buffer = new Buffer(rdata.streams[0] as Uint8Array);
			let time = Date.now();
            new PNG({ filterType: 4 }).parse(pngBuf, (err: Error, png: PNG) => {
				console.log("png parsing lost time: ", Date.now() - time, "ms");
                rdata.data = png.data;
				rdata.descriptor.width = png.width;
				rdata.descriptor.height = png.height;
                let transfers: ArrayBuffer[] = [png.data.buffer];
                console.log("a png file parsing finish, png.data: ",png.data);
                this.postMessageToThread(rdata, transfers);
            });
        }catch(e) {
            rdata.streams[0] = null;
            console.error("a png file parsing error!!!, e: ",e);
            this.postMessageToThread(rdata);
        }
    }

    getTaskClass(): number {
        return 104;
    }
}
// 这一句代码是必须有的
let ins = new ModulePNGParser();
export { ModulePNGParser };

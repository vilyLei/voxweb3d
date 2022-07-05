
// thread code example, for parsing a special thread task data(equal getTaskClass() value)

function TaskMultNum() {
    console.log("TaskMultNum instance init run ...");

    this.receiveData = function (data) {
        
        console.log("TaskMultNum::receiveData(),data: ", data);

        let fs32 = data.streams[0];
        let vdata = 1;
        for (let i = 0; i < fs32.length; ++i) {
            vdata *= fs32[i];
        }
        
        data.data = vdata;
        postMessage(data);
    }
    // 对于独立的从外部加载到worker中的js代码文件，在worker中运行，则必须有如下代码
    ThreadCore.initializeExternModule(this);
}
// 对于独立的从外部加载到worker中的js代码文件，在worker中运行，则必须有如下实例化代码
let workerIns_TaskMultNum = new TaskMultNum();
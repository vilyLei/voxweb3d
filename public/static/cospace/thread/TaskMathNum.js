
// thread code example, for parsing a special thread task data(equal getTaskClass() value)

function TaskMathNum() {
    console.log("TaskMathNum instance init run ...");

    this.receiveData = function (data) {
        
        console.log("TaskMathNum::receiveData(),data.taskCmd: ", data.taskCmd);
        
        let fs32 = data.streams[0];
        let vdata = this.mathCalc(fs32, data.taskCmd);

        data.data = vdata;
        postMessage(data);
    }
    this.mathCalc = function (fs32, taskCmd) {
        let vdata = fs32[0];
        let len = fs32.length;
        let i = 1;
        switch (taskCmd) {
            case "MATH_ADD":
                for (i = 0; i < len; ++i) {
                    vdata += fs32[i];
                }
                break;
            case "MATH_SUB":
                for (i = 1; i < len; ++i) {
                    vdata -= fs32[i];
                }
                break;
            case "MATH_DIV":
                for (i = 0; i < len; ++i) {
                    vdata /= fs32[i];
                }
                break;
            case "MATH_MUL":
                for (i = 0; i < len; ++i) {
                    vdata *= fs32[i];
                }
                break;
            default:
                break;
        }
        return vdata;
    }

    // 对于独立的从外部加载到worker中的js代码文件，在worker中运行，则必须有如下代码
    ThreadCore.initializeExternModule(this);
}
// 对于独立的从外部加载到worker中的js代码文件，在worker中运行，则必须有如下实例化代码
let workerIns_TaskMathNum = new TaskMathNum();
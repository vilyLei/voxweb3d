// thread code example, for parsing a special thread task data(equal getTaskClass() value)

function TaskAddNum() {
    console.log("(Sub worker JS File Code) TaskAddNum instance init run ...");
    let mathLib = null;
    let sortLib = null;
    
    function appleExternalModule(data) {

        let haveMathLib = typeof MathLib === 'function';
        // console.log("(Sub worker JS File Code) typeof MathLib: ", (typeof MathLib));
        if(mathLib != null) {
            let inputValue = Math.round(Math.random() * 5000) + 7;
            let powValue = mathLib.getNearestCeilPow2(inputValue);
            console.log("(Sub worker(" + data.threadIndex + ") JS File Code) MathLib inputValue: ",inputValue,", pow2Value: ", powValue);
        }else if(haveMathLib) {
            mathLib = new MathLib();
        }

        let haveSortLib = typeof SortLib === 'function';
        console.log("(Sub worker JS File Code) typeof SortLib: ", (typeof SortLib));
        if(sortLib != null)  {
            let list = [{dis:100},{dis:10}, {dis:300}, {dis:150}];
            sortLib.sortByDis(0, list.length - 1,list);
            console.log("(Sub worker JS File Code) sort by dis, list: ",list);
        } else if(haveSortLib) {
            sortLib = new SortLib();
        }
    }
    this.receiveData = function (data) {
        
        console.log("(Sub worker(" + data.threadIndex + ") JS File Code)TaskAddNum::receiveData(),data: ", data);

        appleExternalModule(data);


        let fs32 = data.streams[0];
        let vdata = 0;
        for (let i = 0; i < fs32.length; ++i) {
            vdata += fs32[i];
        }

        data.data = vdata;
        postMessage(data);
    }
    // 对于独立的从外部加载到worker中的js代码文件，在worker中运行，则必须有如下代码
    ThreadCore.initializeExternModule(this);
}
// 对于独立的从外部加载到worker中的js代码文件，在worker中运行，则必须有如下实例化代码
let workerIns_TaskAddNum = new TaskAddNum();
/***************************************************************************/
/*                                                                         */
/*  Copyright 2019-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
interface IStableArrayNode
{
    value:number;
    uid:number;
}
class StableArrayNode implements IStableArrayNode
{
    value:number = 0;
    uid:number = -1;
    constructor(){}
}
class StableArray
{

    private m_range:number = 0;
    private m_nodesTotal:number = 0;
    private m_nodesArrSize:number = 0;
    private m_nodes:IStableArrayNode[] = null;
    private m_node:IStableArrayNode = null;

    private m_freeIdList:number[] = [];
    private m_holder:IStableArrayNode = null;
    private m_appendEnabled:boolean = false;
    private m_beginI:number = 0;
    private m_currI:number = 0;
    constructor(){}

    initialize(stableSize:number):void
    {
        if(stableSize > 0)
        {
            this.m_nodesTotal = 0;
            this.m_nodesArrSize = stableSize;
            this.m_holder = new StableArrayNode();

            this.m_holder.value = this.m_appendEnabled ? 0xfffff:-0xfffff;
            this.m_holder.uid = -1;
            this.m_nodes = new Array(stableSize);
            this.m_freeIdList = new Array(stableSize);
            for(let i:number = 0; i < this.m_nodesArrSize; ++i)
            {
                this.m_nodes[i] = this.m_holder;
                this.m_freeIdList[i] = i;
            }
        }
    }
    getSize():number
    {
        return this.m_nodesArrSize;
    }
    getNodesTotal():number
    {
        return this.m_nodesTotal;
    }
    addNode(node:IStableArrayNode):void
    {
        if(node.uid < 1)
        {
            if(this.m_freeIdList.length > 0)
            {
                let uid:number = this.m_freeIdList.pop();
                this.m_nodes[uid] = node;
                node.uid = uid;
                this.m_nodesTotal++;
            }
            else
            {
                let uid:number = this.m_nodesTotal;
                this.m_nodes.push(node);
                node.uid = uid;
                this.m_nodesTotal++;
                this.m_nodesArrSize = this.m_nodesTotal;
            }
            this.m_range = this.m_nodesTotal;
        }
    }
    removeNode(node:IStableArrayNode):void
    {
        if(node.uid >= 0 && this.m_nodesTotal > 0)
        {
            this.m_nodes[node.uid] = this.m_holder;
            this.m_freeIdList.push(node.uid);
            
            if((this.m_range - 1) == node.uid)
            {
                this.m_range--;
                console.log("XXXX remove last Node");
            }
            node.uid = -1;
            this.m_nodesTotal--;
        }
    }
    adjustSize():void
    {
        let appendEnabled:boolean = this.m_appendEnabled;
        let kd:number = Math.abs(this.m_nodesArrSize - this.m_nodesTotal)/this.m_nodesArrSize;
        if(kd > 0.3)
        {
            if(this.m_nodesArrSize > this.m_nodesTotal)
            {
                let len:number = Math.round((1.0 - kd) * this.m_nodesArrSize) + 1;
                len = len > 4?len:4;
                // 也可以沿用原来的数组，只是紧凑的防止在一起而已。这样就不用开辟新的内存空间了
                // 实际上每一次sort就是一次紧凑排列的过程
                // 所以如下的操作实际上是可以再优化的
                let srcNodes:IStableArrayNode[] = this.m_nodes;
                let dstNodes:IStableArrayNode[] = new Array(len);
                this.m_freeIdList = new Array((len - this.m_nodesTotal));
                let k:number = appendEnabled?0:this.m_freeIdList.length;
                let i:number = 0;
                this.m_beginI = k;
                for(; i < this.m_nodesArrSize; ++i)
                {
                    if(srcNodes[i].uid >= 0)
                    {
                        dstNodes[k] = srcNodes[i];
                        srcNodes[i] = null;
                        ++k;
                    }
                }
                
                if(appendEnabled)
                {
                    i = 0;
                    for(; k < len; ++k)
                    {
                        dstNodes[k] = this.m_holder;
                        this.m_freeIdList[i] = k;
                        ++i;
                    }
                }else{
                    len = len - this.m_nodesTotal;
                    k = 0;
                    for(; k < len; ++k)
                    {
                        dstNodes[k] = this.m_holder;
                        this.m_freeIdList[k] = k;
                    }
                }
                this.m_nodes = dstNodes;
                this.m_nodesArrSize = dstNodes.length;
                this.m_range = this.m_nodesTotal;
                //  console.log("this.m_nodes: ",this.m_nodes);
                //  console.log("this.m_nodes.length: ",this.m_nodes.length,this.m_nodesArrSize);
            }
        }
    }
    showInfo():void
    {
        let info:string = "";
        for(let i:number = 0; i < this.m_nodesArrSize; ++i)
        {
            let node:IStableArrayNode = this.m_nodes[i];
            info += "("+node.value+","+node.uid+"),";
            //info += node.value+",";
        }
        console.log("StableArray info: \n",info);
    }
    getBegin():IStableArrayNode
    {
        this.m_currI = this.m_beginI;
        return this.m_nodes[this.m_beginI];
    }
    getNext():IStableArrayNode
    {
        if(this.m_currI < this.m_range)
        {
            return this.m_nodes[++this.m_currI];
        }
        return null;
    }
    sort():void
    {
        if(this.m_range > 0)
        {
            let nodes:IStableArrayNode[] = this.m_nodes;
            if(this.m_appendEnabled)
            {
                //console.log("SSS AAA, total,range: ",this.m_nodesTotal,this.m_range);
                // 每次都是大范围排序消耗大性能弱(因为实际数量变化幅度大)
                // 所以需要一个新的数组来找到实际的元素，再用这个数组来排序有数据的范围内来排序
                this.snsort(0,this.m_range - 1);
                this.m_beginI = 0;
                for(let i:number = 0; i < this.m_nodesTotal; ++i)
                {
                    nodes[i].uid = i;
                }
                this.m_range = this.m_nodesTotal;
            }
            else
            {
                this.m_beginI = this.m_nodesArrSize - this.m_nodesTotal;
                //console.log("SSS BBB, this.m_beginI: ",this.m_beginI,", total,range: ",this.m_nodesTotal,this.m_range);
                
                this.snsort(0,this.m_nodesArrSize - 1);
                this.m_range = this.m_beginI + this.m_nodesTotal;
                let i:number = this.m_beginI;
                for(; i < this.m_range; ++i)
                {
                    nodes[i].uid = i;
                }
            }
            this.m_currI = this.m_beginI;
            //console.log("SSS BBB end, this.m_beginI: ",this.m_beginI,", total,range: ",this.m_nodesTotal,this.m_range);
        }
    }
    private sorting(low:number,high:number):number
    {
        let arr:IStableArrayNode[] = this.m_nodes;
        this.m_node = arr[low];
        while(low < high)
        {
            while(low < high && arr[high].value >= this.m_node.value)
            {
                --high;
            }
            arr[low] = arr[high];
            while(low < high && arr[low].value <= this.m_node.value)
            {
                ++low;
            }
            arr[high] = arr[low];
        }
        arr[low] = this.m_node;
        return low;
    }
    private snsort(low:number,high:number):void
    {
        if(low < high)
        {
            let pos:number = this.sorting(low, high);
            this.snsort(low, pos - 1);
            this.snsort(pos + 1, high);
        }
    }

    getNodeByUid(uid:number):IStableArrayNode
    {
        return this.m_nodes[uid];
    }
}
export default StableArray;
export {IStableArrayNode,StableArrayNode,StableArray};
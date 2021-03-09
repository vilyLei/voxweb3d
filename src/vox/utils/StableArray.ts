/***************************************************************************/
/*                                                                         */
/*  Copyright 2019-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

export namespace vox
{
    export namespace utils
    {
        
        export class StableArrayNode
        {
            value:number = 0;
            uid:number = -1;
            constructor(){}
        }
        export class StableArray
        {

            private static S_BUSY:number = 1;
            private static S_FREE:number = 0;
        
            private m_nodesTotal:number = 0;
            private m_nodesArrSize:number = 0;
            private m_nodes:StableArrayNode[] = null;
            private m_node:StableArrayNode = null;

            private m_freeIdList:number[] = [];

            private m_holder:StableArrayNode = null;
            constructor(){}

            initialize(stableSize:number):void
            {
                if(stableSize > 0)
                {
                    this.m_nodesTotal = 0;
                    this.m_nodesArrSize = stableSize;
                    this.m_holder = new StableArrayNode();
                    this.m_holder.value = -0xfffff;
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
            addNode(node:StableArrayNode):void
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
                }
            }
            removeNode(node:StableArrayNode):void
            {
                if(node.uid >= 0 && this.m_nodesTotal > 0)
                {
                    this.m_nodes[node.uid] = this.m_holder;
                    this.m_freeIdList.push(node.uid);
                    node.uid = -1;
                    this.m_nodesTotal--;
                }
            }
            adjustSize():void
            {
                let appendEnabled:boolean = false;
                let kd:number = Math.abs(this.m_nodesArrSize - this.m_nodesTotal)/this.m_nodesArrSize;
                if(kd > 0.3)
                {
                    if(this.m_nodesArrSize > this.m_nodesTotal)
                    {
                        let len:number = Math.round((1.1 - kd) * this.m_nodesArrSize);
                        len = len > 4?len:4;
                        let srcNodes:StableArrayNode[] = this.m_nodes;
                        let dstNodes:StableArrayNode[] = new Array(len);
                        this.m_freeIdList = new Array((len - this.m_nodesTotal));
                        let k:number = appendEnabled?0:this.m_freeIdList.length;
                        let i:number = 0;
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
                    let node:StableArrayNode = this.m_nodes[i];
                    //info += "("+node.value+","+node.uid+"),";
                    info += node.value+",";
                }
                console.log("StableArray info: \n",info);
            }
            sort():void
            {
                this.snsort(0,this.m_nodesArrSize - 1);
                let nodes:StableArrayNode[] = this.m_nodes;
                for(let i:number = 0; i < this.m_nodesArrSize; ++i)
                {
                    if(nodes[i].uid >= 0)nodes[i].uid = i;
                }
            }
            private sorting(low:number,high:number):number
            {
                let arr:StableArrayNode[] = this.m_nodes;
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

            getNodeByUid(uid:number):StableArrayNode
            {
                return this.m_nodes[uid];
            }
        }
    }
}
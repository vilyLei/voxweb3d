import { DataUnitReceiver } from "./base/DataUnitReceiver";
import { DataUnit } from "./base/DataUnit";
import { ListPool } from "./base/ListPool";

class UnitReceiverNode {
  private m_receivers: DataUnitReceiver[] = [];
  private m_flag: boolean = true;
  uuid: number;
  unit: DataUnit;
  constructor(){}

  addReceiver(r: DataUnitReceiver): void {
    this.m_receivers.push(r);
  }
  removeReceiver(r: DataUnitReceiver): void {

    let list = this.m_receivers;
    for(let i: number = 0, len: number = list.length; i < len; ++i) {
      if(r == list[i]) {
        list.splice(i, 1);
        break;
      }
    }
  }
  
  testUnit(): boolean {
    if(this.m_flag) {
      if(this.unit.isCpuPhase()) {
        console.log("a data unit is enabled in the cpu phase.");
        let list = this.m_receivers;
        for(let i: number = 0, len: number = list.length; i < len; ++i) {
          const r = list[i];
          if(r.dataUnitUUID > 0 && r.listUUID > 0) {
            r.receiveDataUnit(this.unit, 1);
          }
        }
        this.m_flag = false;
        return true;
      }
      return false;
    }
    return true;
  }
  destroy(receiverPool: ListPool, nodeMap: Map<number, UnitReceiverNode>): void {
    console.log("destroy an UnitReceiverNode instance.");
    let list = this.m_receivers;
    for(let i: number = 0, len: number = list.length; i < len; ++i) {
      const r = list[i];
      receiverPool.removeItem(r);
    }
    nodeMap.delete(this.uuid);
    this.uuid = 0;
    this.m_receivers = null;
  }
}
class ReceiverSchedule {

  private m_nodeMap: Map<number, UnitReceiverNode> = new Map();
  private m_nodes: UnitReceiverNode[] = [];
  private m_receiverPool: ListPool = new ListPool();
  private m_receiversTotal: number = 0;

  constructor() {
  }
  testUnit(unit: DataUnit): boolean {
    if(unit != null) {
      let node = this.m_nodeMap.get( unit.getUUID() );
      if(node != null) {
        return node.testUnit();
      }
    }
    return false;
  }
  addReceiver(receiver: DataUnitReceiver, unit: DataUnit): void {
    if(unit != null) {
      if(this.m_receiverPool.hasnotItem(receiver)) {

        let node:UnitReceiverNode;
        if(this.m_nodeMap.has( unit.getUUID() )) {
          node = this.m_nodeMap.get( unit.getUUID() );
        }else {
          node = new UnitReceiverNode();
          node.unit = unit;
          node.uuid = unit.getUUID();      
          this.m_nodes.push(node);
          this.m_nodeMap.set(unit.getUUID(), node);
        }
        receiver.dataUnitUUID = unit.getUUID();
        let listUUID = receiver.listUUID;
        this.m_receiverPool.addItem(receiver);
        if(listUUID == receiver.listUUID) {          
          throw("ReceiverSchedule::addReceiver() is the illegal operation !!!");
        }
        node.addReceiver( receiver );
        this.m_receiversTotal ++;
      }
    }
  }
  removeReceiver(receiver: DataUnitReceiver): void {
    if(receiver.dataUnitUUID > 0 && receiver.listUUID > 0) {
      if(this.m_receiverPool.hasItem(receiver)) {
        let node = this.m_nodeMap.get( receiver.dataUnitUUID );
        node.removeReceiver( receiver );
        this.m_receiverPool.removeItem(receiver);
        this.m_receiversTotal --;
      }
    }
    // 去除掉依赖
    receiver.dataUnitUUID = 0;
    receiver.listUUID = 0;
  }
  getReceiversTotal(): number {
    return this.m_receiversTotal;
  }
  run(): void {
    if(this.m_receiversTotal > 0) {
      
      let list = this.m_nodes;
      let flag: boolean;
      let node: UnitReceiverNode;
      for(let i: number = 0, len: number = list.length; i < len; ++i) {
        node = list[i];
        flag = node.testUnit();
        if(flag) {
          this.m_receiversTotal --;
          list.splice(i, 1);
          node.destroy(this.m_receiverPool, this.m_nodeMap);
          i--;
          len--;
        }
      }
    }
  }
  destroy(): void {
  }
}

export { ReceiverSchedule };

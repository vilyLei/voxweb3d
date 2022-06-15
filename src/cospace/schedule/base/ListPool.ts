
import { ListPoolItem } from "./ListPoolItem";
class ListPool {
    private m_list: ListPoolItem[] = [null];
    private m_total: number = 1;
    private m_freeUUIDs: number[] = [];
    constructor() {
    }
    
    hasItemByUUID(listUUID: number): boolean {
        if(listUUID > 0 && listUUID < this.m_total) {
            this.m_list[listUUID] != null;
        }
        return false;
    }
    hasItem(item: ListPoolItem): boolean {
        if(item != null && item.listUUID > 0 && item.listUUID < this.m_total) {
            this.m_list[item.listUUID] == item;
        }
        return false;
    }
    hasnotItem(item: ListPoolItem): boolean {
        if(item != null && item.listUUID > 0 && item.listUUID < this.m_total) {
            this.m_list[item.listUUID] != item;
        }
        return true;
    }
    getItemByUUID(listUUID: number): ListPoolItem {
        if(listUUID > 0 && listUUID < this.m_total) {
            this.m_list[listUUID];
        }
        return null;
    }
    addItem(item: ListPoolItem): void {
      if(item != null) {
        if(item.listUUID == 0) {
            if(this.m_freeUUIDs.length > 0) {
                item.listUUID = this.m_freeUUIDs.pop();
                this.m_list[item.listUUID] = item;
            }else {
                item.listUUID = this.m_total;
                this.m_total ++;
                this.m_list.push(item);
            }
        }
        else {
            throw("ListPool::addItem() is the illegal operation !!!");
        }
      }
    }
    removeItem(item: ListPoolItem): void {
        if(item != null && item.listUUID > 0) {
            if(this.m_list[item.listUUID] != item) {
                throw("ListPool::removeItem() is the illegal operation !!!");
            }
            this.m_freeUUIDs.push( item.listUUID );
            this.m_list[item.listUUID] = null;
            item.listUUID = 0;
            -- this.m_total;
        }
      }
  
  }

export { ListPoolItem, ListPool };

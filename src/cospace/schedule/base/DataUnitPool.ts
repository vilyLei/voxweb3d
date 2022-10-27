import { DataUnitLock, DataUnit } from "./DataUnit";
import { GeometryDataUnit } from "./GeometryDataUnit";

class DataUnitWrapper<T extends DataUnit = DataUnit> {
    uuid: number;
    url: string;
    unit: T;
    constructor(){}
}
class DataUnitPool<T extends DataUnit> {
    private static s_inited: boolean = true;
    // 因为不是高频操作，所以可以用map
    private m_urlPool: Map<string, DataUnitWrapper<T>> = new Map();
    private m_idPool: Map<number, DataUnitWrapper<T>> = new Map();
    constructor(){
        if(DataUnitPool.s_inited) {
            DataUnitPool.s_inited = false;
            // 这样做的目的是为了让有效uuid从1开始
            this.createUnit();
        }
    }
    createUnit(): DataUnit {
        DataUnitLock.lockStatus = 207;
        let unit = new DataUnit();
        return unit;
    }
    createGeometryUnit(): GeometryDataUnit {
        DataUnitLock.lockStatus = 207;
        let unit = new GeometryDataUnit();
        return unit;
    }
    hasUnitByUrl(url: string): boolean {
        return this.m_urlPool.has(url);
    }
    hasUnitByUUID(uuid: number): boolean {
        return this.m_idPool.has(uuid);
    }
    addUnit(url: string, unit: T): void {
        if(url != "" && unit != null && !this.m_urlPool.has(url)) {
            
            let wrapper = new DataUnitWrapper<T>();
            wrapper.uuid = unit.getUUID();
            wrapper.url = url;
            wrapper.unit = unit;
            this.m_urlPool.set(url, wrapper);
            this.m_idPool.set(unit.getUUID(), wrapper);
        }
    }
    removeUnit(unit: T): void {
        if(unit != null && this.m_idPool.has(unit.getUUID())) {

            let wrapper = this.m_idPool.get(unit.getUUID());
            this.m_idPool.delete(wrapper.uuid);
            this.m_urlPool.delete(wrapper.url);
            // TODO(lyl): 暂时这样写
            wrapper.unit = null;
        }
    }
    removeUnitByUUID(uuid: number): void {
        if(this.m_idPool.has(uuid)) {

            let wrapper = this.m_idPool.get( uuid );
            this.m_idPool.delete(wrapper.uuid);
            this.m_urlPool.delete(wrapper.url);
            // TODO(lyl): 暂时这样写
            wrapper.unit = null;
        }
    }
    removeUnitByUrl(url: string): void {
        if(this.m_urlPool.has(url)) {

            let wrapper = this.m_urlPool.get( url );
            this.m_idPool.delete(wrapper.uuid);
            this.m_urlPool.delete(wrapper.url);
            // TODO(lyl): 暂时这样写
            wrapper.unit = null;
        }
    }
    getUnitByUrl(url: string): T {
        let wrapper = this.m_urlPool.get(url);
        if(wrapper != null) {
            return wrapper.unit;
        }
        return null;
    }
    getUnitByUUID(uuid: number): T {
        let wrapper = this.m_idPool.get(uuid);
        if(wrapper != null) {
            return wrapper.unit;
        }
        return null;
    }
}
export { DataUnitPool };

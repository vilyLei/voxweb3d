interface CtrlInfo {
    type: string;
    uuid: string;
    values: number[];
    flag: boolean;
    colorPick?: boolean;
}
type ItemCallback = (info: CtrlInfo) => void;
export {CtrlInfo, ItemCallback};
function SortLib() {
    
    function sorting(low, high, arr) {
        //标记位置为待排序数组段的low处也就时枢轴值
        rsn = arr[low];
        while (low < high) {
            //  如果当前数字已经有序的位于我们的枢轴两端，我们就需要移动它的指针，是high或是low
            while (low < high && arr[high].dis >= rsn.dis) {
                --high;
            }
            // 如果当前数字不满足我们的需求，我们就需要将当前数字移动到它应在的一侧
            arr[low] = arr[high];
            while (low < high && arr[low].dis <= rsn.dis) {
                ++low;
            }
            arr[high] = arr[low];
        }
        arr[low] = rsn;
        return low;
    }
    function snsort(low, high, arr) {
        if (low < high) {
            let pos = sorting(low, high, arr);
            snsort(low, pos - 1, arr);
            snsort(pos + 1, high, arr);
        }
    }
    this.sortByDis = function(low, high, arr) {
        snsort(low, high, arr);
    }
}
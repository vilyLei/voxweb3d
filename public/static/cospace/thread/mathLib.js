// thread code example, for parsing a special thread task data(equal getTaskClass() value)

function MathLib() {
    
    this.getNearestCeilPow2 = function(int_n) {
        let x = 1;
        while (x < int_n) {
            x <<= 1;
        }
        return x;
    }
}
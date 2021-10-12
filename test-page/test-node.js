var LIMIT = 10000000;
var arr = new Array(LIMIT);
console.time("Array insert time");
for (var i = 0; i < LIMIT; i++) {
    arr[i] = i;
}
arr.push(-1);
console.timeEnd("Array insert time");
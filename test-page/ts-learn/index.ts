//
function firstElement<Type>(arr: Type[]) {
    return arr[0];
}

function firstElement1<Type extends any[]>(arr: Type) {
    return arr[0];
}

const a = firstElement([1, 2, 3]);
//a is number
const b = firstElement1([1, 2, 3]);
// b is any
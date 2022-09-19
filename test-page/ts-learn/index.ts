

interface ReadonlyStringArray {
    readonly [index: number]: string;
}

let myAry: ReadonlyStringArray = {};

myAry[2] = 'Hello';
//Error ReadonlyStringArray should not reassign
"use strict";
function multiplyAll(values, factor) {
    if (!values) {
        return values;
    }
    else {
        return values.map(x => x * factor);
    }
}
function example(x, y) {
    if (x === y) {
        // x and y should be string
        x.toLocaleLowerCase();
        y.toLocaleLowerCase();
    }
    else {
        // x string | number;
        // y string | boolean;
        console.log(x);
    }
}
function multiplyValue(container, factor) {
    if (container.value != null) {
        // container.value should be number
        console.log(container.value * factor);
    }
}
;
;
function move(animal) {
    if ('swim' in animal) {
        // animal should be Fish
        return animal.swim();
    }
    // animal should be Bird
    animal.fly();
}
function logValue(val) {
    if (val instanceof Date) {
        // val should be Date
        console.log(val.toUTCString());
    }
    else {
        // val should be string
        console.log(val.toUpperCase());
    }
}
let x = Math.random() < 0.5 ? 10 : "Hello World!";
x = 1;
// after x should be number;
x = "goodbye";
// after x should be string
function isFish(pet) {
    return pet.swim !== undefined;
}
function move2(animal) {
    if (isFish(animal)) {
        // animal should be Fish
        return animal.swim();
    }
    // animal should be Bird
    animal.fly();
}
function caclArea(shape) {
    if (shape.kind === 'circle') {
        return (shape.radius ** 2) * Math.PI;
    }
    else {
        return shape.sideLength ** 2;
    }
}

function multiplyAll(values: number[] | undefined, factor: number) {
    if (!values) {
        return values;
    } else {
        return values.map(x => x * factor)
    }
}


function example(x: string | number, y: string | boolean) {
    if (x === y) {
        // x and y should be string
        x.toLocaleLowerCase();
        y.toLocaleLowerCase();
    } else {
        // x string | number;
        // y string | boolean;
        console.log(x);
    }
}

interface Container {
    value: number | null | undefined;
}

function multiplyValue(container: Container, factor: number) {
    if (container.value != null) {
        // container.value should be number
        console.log(container.value * factor);
    }
}


interface Fish { swim: () => void };
interface Bird { fly: () => void };

function move(animal: Fish | Bird) {
    if ('swim' in animal) {
        // animal should be Fish
        return animal.swim();
    }
    // animal should be Bird
    animal.fly();
}


function logValue(val: Date | string) {
    if (val instanceof Date) {
        // val should be Date
        console.log(val.toUTCString());
    } else {
        // val should be string
        console.log(val.toUpperCase())
    }
}

let x = Math.random() < 0.5 ? 10 : "Hello World!";

x = 1;
// after x should be number;

x = "goodbye";
// after x should be string

function isFish(pet: Fish | Bird): pet is Fish {
    return (pet as Fish).swim !== undefined;
}

function move2(animal: Fish | Bird) {
    if (isFish(animal)) {
        // animal should be Fish
        return animal.swim();
    }
    // animal should be Bird
    animal.fly();
}

// interface Shape {
//     kind: "circle" | "square";
//     radius?: number;
//     sideLength?: number;
// }

interface Circle {
    kind: 'circle';
    radius: number;
}

interface Square {
    kind: 'square';
    sideLength: number;
}

type Shape = Circle | Square;

function caclArea(shape: Shape): number {
    if (shape.kind === 'circle') {
        return (shape.radius ** 2) * Math.PI
    } else {
        return shape.sideLength ** 2;
    }
}
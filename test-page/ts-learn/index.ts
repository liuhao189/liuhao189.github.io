
type GreetFunction = (a: string) => void;

function greeter(fn: GreetFunction) {
    fn("Hello World");
}

type DescribableFunction = {
    desc: string;
    (a: number): boolean;
}

function doSomeThing(fn: DescribableFunction) {
    return `${fn.desc} + ${fn(6)}`
}

type SomeConstructor = {
    new(s: string): SomeConstructor;
}

function fn(ctor: SomeConstructor) {
    return new ctor('Hello')
}

function firstElement<T>(arr: T[]): T | undefined {
    return arr[0];
}

const str = firstElement(['one']);
const num = firstElement([6]);


function map<Input, Output>(arr: Input[], func: (arg: Input) => Output): Output[] {
    return arr.map(func);
}

const parsed = map([1, 2, 3], n => n * 2);
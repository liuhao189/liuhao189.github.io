

type voidFunc = () => void;

const f1: voidFunc = () => {
    return true;
}

const f2: voidFunc = () => '111';
const f3: voidFunc = function () {
    return { age: 111 }
}


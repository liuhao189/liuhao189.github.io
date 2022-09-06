

function fail(msg: string): never {
    throw new Error(msg);
}

fail('one')
# Typescript-Two

## 缩小类型范围

TS使用静态类型分析运行时值，它在JS的运行时控制流(if/else，条件三元，循环，真实性检查)上覆盖类型分析，这些都会影响类型。

在代码的if检测中，TS看到typeof padding === 'number'，TS会将这些代码认为类型守护。

```ts
function padLeft(padding:number|string,input:string){
  if(typeof padding === 'numbr') {
    // number now
    return ' '.repeat(padding) + input;
  } 
  // string now
  return padding + input;
}
```

## typeof类型守护

JS支持typeof运算符来返回值的基本类型。

TS期望返回的数值集合：string，number，bigint，boolean，symbol，undefined，object，function。


## 真值缩小

在JS中，if会强制转换条件为boolean。

false值：0，NaN，""，0n，null，undefined。

可以使用Boolean函数或!!来强制转换。

```ts
function printAll(strs: string | string[] | null) {
  if(strs && typeof strs === 'object') {
    //string[]
  }else if (typeof strs === 'string') {
    //string
  }
}
```

## 参考文档

https://www.typescriptlang.org/docs/handbook/2/narrowing.html
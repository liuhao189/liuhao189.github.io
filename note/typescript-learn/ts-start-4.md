# 通过类型创建类型

TS的类型系统很强大，因为它允许通过其它类型来定义新类型。

这个想法最简单的形式是泛型，我们实际上有各种各样的类型运算符可以使用，也可以用我们已经拥有的值来表示类型。

通过组合各种类型的运算符，我们可以以简洁，可维护的方式表示复杂的操作和值。

## 泛型

软件工程的一个主要部分是构建组件，这些组件不仅具有定义明确且一致的API，而且还具有可重用性。能够处理当前数据和未来数据的组件。

在C#或JAVA中，创建可重用组件的主要工具之一是泛型。使用泛型可以使得组件不仅作用于单一类型，可以作用于一组类型。

```ts
function indetity<Type>(arg: Type): Type { 
  return arg;
}
```

在函数体中，泛型类型会被编译器认为可能是所有类型。

```ts
function loggingIdentity<Type>(arg: Type): Type {
  console.log(arg.length);// Property length does not exist on type 'Type'
  return arg;
}
```


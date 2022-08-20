# Rust语言入门

## 变量和赋值

默认情况下，变量是不可变的。这是为了安全性和并发性。但是，您仍然可以选择使得变量可变。

```
fn main() {
  let x = 5;
  println!("The value of x is: {x}");
  x = 6;
  println!("The value of x is: {x}");
}
// Error 
// cannot assign twice to immutable variable `x`
```

在变量名前增加mut的关键词可以指定变量可改变。

```
    let mut x = 5;
    println!("The value of x is {x}");
    x = 6;
    println!("The value of x is {x}");
```

## 常量

常量和不可变变量的区别：

1、常量不可使用mut关键字。使用const关键字来声明。

2、值必须是可注解的。我理解是编译时确定。

3、常量可定义在任何作用域，包括全局作用域。

4、常量仅可设置为常量表达式，而不是只能在运行时计算的值。
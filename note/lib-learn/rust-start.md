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

2、值必须是可注解的。

3、常量可定义在任何作用域，包括全局作用域。

4、常量仅可设置为常量表达式，而不是只能在运行时计算的值。

RUST的常量一般以大写字母加下划线来命名，编译器可以在编译时执行有限的计算，这允许我们将值设置为容易理解和校验的值。

常量在整个程序的生命周期中都存在，一般定义应用程序级别的需要被多个部分访问的值。eg：最高分数，光速等。

## 覆盖

可以声明一个与之前变量同名的新变量，第二个变量会覆盖第一个变量。

```
fn main() {
  let x = 5;
  let x = x+1;
  {
    let x = x * 2;
    println!("The value of x in the inner scope is {x}");
  }
  println!("The value of x in is {x}");
}
// inner scope 12
// out scope 6
```

## 数据类型

记住，Rust是静态类型的语言，这意味着Rust需要在编译时知道所有变量的类型。

一般情况下，编译器可以从变量的值或变量的使用方式来推测变量的类型，但是某些情况下，我们需要显式指定变量类型。

```
let guess:u32 = "42".parse().expect("Not a number!");
```


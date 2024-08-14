---
title: Taiqi Lang 学习笔记 基础篇
date: 2024-08-01 14:15:05
updated: 2024-08-04 16:29:44
comments: true
index_img: https://s1.imagehub.cc/images/2024/08/04/e558265eb0ef6d44d0a5fbd769169f78.jpg
---
## Taiqi简介

**Taichi**是一种专为高性能并行计算而设计的特定领域语言，内嵌于Python中。
在编写计算密集型任务时，用户只需遵循一组额外的规则，并使用`@ti.func`和`@ti.kernel`这两个装饰器，就能充分利用Taichi的高性能计算功能。
这些装饰器指示太一接管计算任务，并使用其即时（JIT）编译器将装饰函数编译为机器代码。因此，对这些函数的调用可在多核CPU或GPU上执行，与本地Python代码相比，可实现 50~100 倍的加速。

> [官方文档](https://taichi-lang.cn/)

### 语言特性

+ 高性能并行计算
+ 自动微分
+ 灵活数据布局
+ 空间稀疏数据结构

## 安装

Taichi 是一个 PyPI 包
```sh
pip install taichi
```

## 初始化

```pythno
import taichi as ti
ti.init(arch=ti.gpu)
```
>参数`arch`指定将执行编译代码的后端。此后端可以是`ti.cpu`或`ti.gpu` 。如果指定了该`ti.gpu`选项，Taichi 将尝试按以下顺序使用 GPU 后端：`ti.cuda`、`ti.vulkan`和`ti.opengl/ti.Metal`。如果没有可用的 GPU 架构，CPU 将用作后端。也可以直接指定后端，若不可以则报错

## Taichi 内核 与 Taichi 函数

Taichi 和 Python 的语法相似，但它们并不完全相同。为了区分 Taichi 代码和原生 Python 代码，我们使用了两个装饰器，`@ti.kernel`以及`@ti.func`

只有被`@ti.kernel`以及`@ti.func`修饰的才属 Taichi 的作用域，其他均为 Python 的作用域

+ Taichi 内核`@ti.kernel`是 Taichi 运行时接管任务的入口点，它们必须由 Python 代码直接调用，不允许从另一个内核内部或从 Taichi 函数内部调用内核
+ Taichi 函数`@ti.func`是内核的构建块，只能由另一个 Taichi 函数或内核调用

> Taiqi内核和Taiqi函数在编译的时候会捕获Python作用于中的全局变量，并将其绑定作为**常量**传递至Taiqi作用域，而不会感知其值的变化

{% note warning %}
从原生 Python 代码（Python 作用域）中调用 Taichi 函数会导致 Taichi 引发语法错误
{% endnote %}

```python
import taichi as ti
ti.init(arch=ti.gpu)

@ti.func
def inv_square(x):  # A Taichi function
    return 1.0 / (x * x)

@ti.kernel
def partial_sum(n: int) -> float:  # A Taichi kernel
    total = 0.0
    for i in range(1, n + 1):
        total += inv_square(n)
    return total

print(partial_sum(1000))
print(inv_square(1.0))  # Syntax error
```

> 可以在单个 Taichi 程序中定义多个内核。这些内核彼此独立，并按照首次调用的顺序进行编译和执行。编译后的内核会被缓存，以减少后续调用的启动开销

### 参数

一个内核可以接受多个参数。但是不能将任意 Python 对象传递给内核。这是因为 Python 对象可以是动态的，并且可能包含 Taichi 编译器无法识别的数据

内核可以接受各种参数类型，包括标量、 ti.types.matrix() 、 ti.types.vector() 、 ti.types.struct() 、 ti.types.ndarray() 和 ti.template() .这些参数类型可以轻松地将数据从 Python 作用域传递到 Taichi 作用域。可以在 ti.types 模块中找到支持的类型

## 数据类型

Taichi 是一种**静态类型**编程语言，这意味着 Taichi 范围内变量的类型是在编译时确定的。这意味着一旦声明变量，就不能为其分配不同类型的值

Taichi 中的`ti.types`模块定义了所有支持的数据类型。这些数据类型分为两组：**原始数据类型**和**复合数据类型**

### 原始数据类型

Taichi 中的原始数据类型是标量，它们是构成复合数据类型的最小单位。这些类型用指示其类别的字母表示，后跟指示其位精度的数字。有符号整数是`i`，无符号整数是`u`，浮点数是`f`。精度位可以是`8`、`16`、`32` 或` 64`

不同后端对 Taichi 原始类型的支持可能有所不同。有关详细信息，参阅下表

![taiqi_type](https://s1.imagehub.cc/images/2024/08/03/e56759ff026db32620ccab8538f2b918.png)

Taichi 作用域中的数字文字具有默认的整数或浮点类型，允许你在调用`init()`时指定默认的基本数据类型，并在 Taichi 作用域和 Taichi 数据容器中使用两个名称`int`和`float`分别用作默认整数和浮点类型的别名

```python
ti.init(default_ip=ti.i64)  # Sets the default integer type to ti.i64
ti.init(default_fp=ti.f64)  # Sets the default floating-point type to ti.f64

x = ti.field(float, 5)
# Is equivalent to:
x = ti.field(ti.f64, 5)

@ti.kernel
def example_cast() -> int:  # the returned type is ti.i64
    x = 3.14    # x is of ti.f64 type
    y = int(x)  # equivalent to ti.i64(x)
    return y
```

Taichi 作用域中的数字文字具有默认的整数或浮点类型。例如，如果默认浮点类型为`ti.f32`，则数字文字 3.14159265358979 将转换为精度约为 7 位十进制数字的 32 位浮点数。为了保证工程模拟等应用的高精度，建议将`default_fp`设置`ti.f64`

### 显式类型转换

Taiqi 中一旦声明变量，就不能为其分配不同类型的值。因此，当**值**的原始数据类型无法用于赋值或计算时，可以将值切换到不同的数据类型。（并非切换**变量**的数据类型）

```python
variable = ti.cast(variable, type)
```

`ti.cast()`函数允许您将给定值转换为特定的目标类型

```python
@ti.kernel
def foo():
    a = 3.14
    b = ti.cast(a, ti.i32)  # 3
    c = ti.cast(b, ti.f32)  # 3.0
```
也可使用`ti.f32`和`ti.i64`等基本类型，直接对标量变量执行类型转换

```python
@ti.kernel
def foo():
    a = 3.14
    x = int(a)    # 3
    y = float(a)  # 3.14
    z = ti.i32(a)  # 3
    w = ti.f64(a)  # 3.14
```

### 隐式类型转化

{% note warning %}
一般来说，隐式类型转换可能是错误的重要来源。因此，Taichi 强烈反对使用此机制，并建议您为所有变量和操作显式指定所需的数据类型
{% endnote %}

#### 二元运算中的隐式类型转换规则（优先级由高到低）：

1. 整数 + 浮点 -> 浮点数
2. 低精度位 + 高精度位 -> 高精度位
3. 带符号整数 + 无符号整数 -> 无符号整数

> 出现规则冲突时，最高优先级的规则适用

例外：

+ 位移运算返回 lhs (左侧) 数据类型
+ 逻辑运算返回`i32`
+ 比较运算返回`i32`

#### 赋值时的隐式类型转换

当为具有不同数据类型的变量赋值时，会执行隐式类型转换，如果该值的精度高于目标变量，则会显示一条警告，指示潜在的精度损失

```python
@ti.kernel
def foo():
    a = 3.14
    a = 1
    print(a)  # 1.0 without warning
    
    b = 1
    b = 3.14
    print(b) # 3 warning
```

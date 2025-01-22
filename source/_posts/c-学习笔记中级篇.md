---
index_img: https://s1.imagehub.cc/images/2025/01/10/e1d9469d8dfc8935c6fe11f5f91627be.png
title: C++学习笔记中级篇
date: 2025-01-22 20:51:14
updated: 2025-01-22 20:51:14
tags:
  - C++
categories:
  - 学习笔记
comments: true
---
## 1 内存四区

C++程序在执行时，将内存大方向划分为**4个区域**

- 代码区：存放函数体的二进制代码，由操作系统进行管理的
- 全局区：存放全局变量和静态变量以及常量
- 栈区：由编译器自动分配释放, 存放函数的参数值,局部变量等
- 堆区：由程序员分配和释放,若程序员不释放,程序结束时由操作系统回收

### 1.1 代码区

存放程序执行的机器指令

代码区是**共享**的，共享的目的是对于频繁被执行的程序，只需要在内存中有一份代码即可
代码区是**只读**的，使其只读的原因是防止程序意外地修改了它的指令

### 1.2 全局区

存放全局变量，全局/局部静态变量，全局常量，字符串常量

> 全局区和代码区的生命周期贯穿整个程序的运行期间

### 1.3 栈区

存放函数的参数值，局部变量/常量等，由编译器自动分配释放

### 1.4 堆区

由程序员分配释放,若程序员不释放,程序结束时由操作系统回收

### 1.5 new 与 delete

利用`new 数据类型`在堆区开辟数据，使用`delete 指针`释放内存

> 利用`new`创建数据时，返回对应的指针

**示例：**

```c++
int main() {

	int *p = new int(10);
	cout << *p << endl;
	delete p;
	
	int* arr = new int[10];
	delete[] arr;  //释放数组 delete 后加 []
}
```

## 2 引用

### 2.1 引用的基本使用

**语法：** `数据类型& 别名 = 原名`

> 引用的本质是一个**指针常量**

**示例：**

```C++
int main() {

	int a = 10;
	int &b = a;  // 引用必须初始化且不能改变

	b = 100;

	cout << "a = " << a << endl;  // 100

	return 0;
}
```

### 2.2 引用与函数

> 引用传参与指针传参效果相同

**示例：**
```C++
void mySwap(int& a, int& b) {
	int temp = a;
	a = b;
	b = temp;
}

int main() {

	int a = 10;
	int b = 20;

	mySwap0(a, b);
	cout << "a:" << a << " b:" << b << endl;

	return 0;
}

```

**示例：**
```C++
int& test() {
	static int a = 20;
	return a;  // 函数返回a的引用而不只是a的值
}

int main() {

	int& ref = test();
	cout << "ref = " << ref << endl;
	
	test() = 1000;  //返回引用的函数可以做为左值
	cout << "ref = " << ref << endl;
	
	return 0;
}
```

### 2.3 const修饰引用

**作用：**常量引用主要用来修饰形参，防止误操作

**示例：**
```C++
void showValue(const int& v) {
	cout << v << endl;
}

int main() {

	int a = 10;
	showValue(a);
	
	return 0;
}
```
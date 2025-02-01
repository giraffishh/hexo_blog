---
index_img: https://s1.imagehub.cc/images/2025/01/10/e1d9469d8dfc8935c6fe11f5f91627be.png
title: C++学习笔记中级篇
date: 2025-01-22 20:51:14
updated: 2025-02-01 23:40:08
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

存放全局变量，全局/局部静态变量，全局常量，字面值常量（就是写在代码里面的常量如字符串）

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

* 非常量引用只能绑定到可修改的左值（lvalue），例如变量。
* 常量引用可以绑定到常量、临时对象（如字面值）以及可修改的左值。

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

## 3 类和对象

C++面向对象的三大特性为：**封装**、**继承**、**多态**

### 3.1 封装

#### 3.1.1  类

将属性和行为作为一个整体，将具有相同性质的对象，我们可以抽象称为类

**语法：** `class 类名{   访问权限： 属性  / 行为  };`

#### 3.1.1 访问权限

类在设计时，可以把属性和行为放在不同的权限下，加以控制

1. public        	公共权限，类内可以访问， 类外可以访问，继承的可以访问
2. protected	保护权限，类内可以访问 ，类外不可以访问，继承的可以访问
3. private		私有权限，类内可以访问 ，类外不可以访问，继承的也不可以访问


```C++
class Person
{
public:
	string m_Name;

protected:
	string m_Car;

private:
	int m_Password;

public:
	void func()
	{
		m_Name = "张三";
		m_Car = "拖拉机";
		m_Password = 123456;
	}
};

int main() {

	Person p;	//实例化一个对象
	p.m_Name = "李四";
	//p.m_Car = "奔驰";  //保护权限类外访问不到
	//p.m_Password = 123; //私有权限类外访问不到

	return 0;
}
```

#### 3.1.2 struct 和 class 区别

在C++中`struc`t和`class`区别就在于默认的访问权限不同

* `struc`默认权限为公共
* `class`默认权限为私有

#### 3.1.3 属性设置为私有

将所有属性设置为私有，通过行为来读写，可以自己控制读写权限，检测数据的有效性

可以在方法后加`const`强制只读，不修改成员属性

**示例：**
```C++
class Person {
public:

	//姓名设置可读可写
	void setName(string name) {
		m_Name = name;
	}
	string getName() const
	{
		return m_Name;
	}


	//获取年龄 
	int getAge()
	{
		return m_Age;
	}
	//设置年龄
	void setAge(int age) {
		if (age < 0 || age > 150) {
			cout << "你个老妖精!" << endl;
			return;
		}
		m_Age = age;
	}

	//情人设置为只写
	void setLover(string lover) {
		m_Lover = lover;
	}

private:
	string m_Name; //可读可写  姓名
	int m_Age; //只读  年龄
	string m_Lover; //只写  情人
};
```

#### 3.1.4 类分文件编写

头文件写方法声明和属性，cpp写定义，在需要调用的地方包含对应的头文件即可

**示例：**
```C++
// person.h
#pragma once  // 防止头文件被多次包含
#include <iostream>
using namespace std;

class Person
{
public:
	string get_name() const;
	int get_age() const;
	void set_name(string name);
	void set_age(int age);
	void set_lover(string lover);

private:
	string m_name;
	int m_age = 0;
	string m_lover;
};
```
```C++
// person.cpp
#include "person.h"

void Person::set_name(string name){
	m_name = name;
}
string Person::get_name() const{
	return m_name;
}
int Person::get_age() const{
	return m_age;
}
void Person::set_age(int age)
{
	if (age < 0 || age > 150)
	{
		cout << "你个老妖精!" << endl;
		return;
	}
	m_age = age;
}
void Person::set_lover(string lover)
{
	m_lover = lover;
}
```
```C++
// index.cpp
#include "person.h"

int main() {

	Person p;
	//姓名设置
	p.set_name("张三");
	cout << "姓名： " << p.get_name() << endl;

	//年龄设置
	p.set_age(50);
	cout << "年龄： " << p.get_age() << endl;

	//情人设置
	p.set_lover("苍井");
	//cout << "情人： " << p.m_Lover << endl;  //只写属性，不可以读取

    return 0;
}
```

### 3.2 对象的初始化和清理

#### 3.2.1 构造函数和析构函数

**构造函数**和**析构函数**将会被编译器自动调用，完成对象初始化和清理工作，这是编译器强制要我们做的事情，因此如果我们不提供构造和析构函数，编译器会提供空实现的函数

**构造函数语法：**`类名(){}`

1. 没有返回值, 函数名与类名相同
2. 构造函数可以有参数，因此可以发生重载
3. 自动调用且只会调用一次

**析构函数语法：** `~类名(){}`

1. 没有返回值, 函数名与类名相同
2. 不可以有参数，不可以发生重载
3. 自动调用且只会调用一次

#### 3.2.2 构造函数的分类及调用

按参数分为： 有参构造和无参构造

按类型分为： 普通构造和拷贝构造

**示例：**

```C++
class Person {
public:
	//无参（默认）构造函数
	Person() {
		cout << "无参构造函数!" << endl;
	}
	//有参构造函数
	Person(int a) {
		age = a;
		cout << "有参构造函数!" << endl;
	}
	//拷贝构造函数
	Person(const Person& p) {
		age = p.age;
		cout << "拷贝构造函数!" << endl;
	}
	//析构函数
	~Person() {
		cout << "析构函数!" << endl;
	}
public:
	int age;
};

int main() {

	//2.1  括号法，常用
	Person p; //调用无参构造函数，不能加括号，否则与函数声明歧义
	Person p1(10);
	Person p2(p1);
	
	//2.2 显式法
	Person p3 = Person(10); 
	Person p4 = Person(p3);
	//Person(10)单独写就是匿名对象  当前行结束之后，马上析构
	
	//2.3 隐式转换法
	Person p5 = 10;
	Person p6 = p5;
	
	return 0;
}
```

> 在函数值传参 / 返回对象 的时候，均会触发拷贝构造
> 编译器会默认提供 默认拷贝构造函数 / 默认构造函数 / 析构函数
> 若写了有参构造，编译器就不提供默认构造
> 若写了拷贝构造，编译器就不提供默认拷贝构造函数 / 默认构造函数 

#### 3.2.3 深拷贝与浅拷贝

**浅拷贝：**将属性简单赋值拷贝到新对象，如默认拷贝操作
**深拷贝：**在堆区重新申请空间，进行拷贝操作

当属性中包含指针，浅拷贝将旧对象拥有的指针简单拷贝赋值到新对象，使两个对象拥有的指针指向同一块内存，在析构函数中释放内存时，就会出现内存重复释放的错误

因此要重写拷贝函数，重新申请内存实现深拷贝

**示例：**
```C++
class Person
{
public:
	// 有参构造函数
	Person(int height)
	{
		m_height = new int(height);
	}

	// 拷贝构造函数（深拷贝）
	Person(const Person& p)
	{
		m_height = new int(*p.m_height);
	}

	// 析构函数
	~Person()
	{
		if (m_height != nullptr)
		{
			delete m_height;
			m_height = nullptr; // 避免悬空指针
		}
	}

	int* m_height;
};

int main()
{
	Person p1(180);
	Person p2(p1);

	return 0;
}
```

#### 3.2.4 初始化列表

用来初始化属性

**语法：**`构造函数()：属性1(值1),属性2（值2）... {}`

**示例：**

```C++
class Person {
public:

	// 传统方式初始化
	//Person(int a, int b, int c) {
	//	m_A = a;
	//	m_B = b;
	//	m_C = c;
	//  // 构造函数主体
	//}

	// 初始化列表方式初始化
	Person(int a, int b, int c) :m_A(a), m_B(b), m_C(c) {
		// 构造函数主体
	}
	
private:
	int m_A;
	int m_B;
	int m_C;
};
```

#### 3.2.5 类对象作为类成员

C++类中的成员可以是另一个类的对象，我们称该成员为 对象成员

**示例：**

```C++
class A {}
class B
{
    A a；
}
```

#### 3.2.6 静态成员

静态成员就是在成员前加上关键字`static`

静态成员变量

   *  所有对象共享同一份数据，在编译阶段分配内存
   *  类内声明，类外初始化

静态成员函数

   *  所有对象共享同一个函数
   *  静态成员函数只能访问静态成员变量（否则无法区分使用的属性是哪个对象）

**示例1 ：**静态成员变量

```C++
class Person
{
public:
	static int m_A;

private:
	static int m_B; // 静态成员变量也是有访问权限的（初始化除外）
};
int Person::m_A = 10;
int Person::m_B = 10;

int main() {

	Person p1;
	
	// 静态成员变量两种访问方式
	// 1、通过对象
	cout << "p1.m_A = " << p1.m_A << endl;
	// 2、通过类名
	cout << "m_A = " << Person::m_A << endl;
	
	return 0;
}
```

**示例2：**静态成员函数

```C++
class Person
{

public:
	static void func()
	{
		m_A = 100;
		//m_B = 100; //错误，不可以访问非静态成员变量
	}

	static int m_A;
	int m_B;
};
int Person::m_A = 10;

int main() {

	//静态成员变量两种访问方式
	//1、通过对象
	Person p1;
	p1.func();

	//2、通过类名
	Person::func();

	return 0;
}
```
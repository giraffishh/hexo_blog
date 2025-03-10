---
title: Java学习笔记基础篇
date: 2025-03-10 12:06:17
updated: 2025-03-10 12:06:16
tags:
  - Java
categories:
  - 学习笔记
comments: true
---
## 注释

`//` `/* … */`

## 8种基础数据类型

* Integral types: `byte`, `short`, `int`, `long`
* Floating-point types: `float`, `double`
* The `boolean` data type
* The `char` data type

## 变量类型

* 局部变量
* 成员变量(实例变量) - 默认权限`default`或声明权限`public`、`protected`、`private`
* 静态变量(类变量) - 可以通过类名访问

> `default`权限可以同包访问

## 常用input与output

**Output:**

```Java
System.out.print("Hello, ");  // 不换行
System.out.println("World!"); // 换行
System.out.printf("My name is %s, and I am %d years old.\n", "Alice", 25); // 格式化输出
```

|  格式符|  说明|
|---|---|
|  %d|  整数（int, long）|
|  %f|  浮点数（float, double）|
|  %s|  字符串（String）|
|  %c|  字符（char）|
|  %b|  布尔值（boolean）|

**Input:**

```Java
Scanner scanner = new Scanner(System.in);

String name = scanner.nextLine();  // 读取一行，以按下Enter结束
int num = scanner.nextInt(); // 读取返回整数，空格或Enter结束
double number = scanner.nextDouble();  // 读取返回浮点数，空格或Enter结束
char ch = scanner.next().charAt(0);  // 读取返回字符串，空格或Enter结束，并取字符串第一个字符

scanner.close()  // 建议，关闭System.in输入流，释放内存
```

## 条件语句

* `if … else if … else … `
* `(a > b) ? a : b`
* `switch … case … default … `
* `｜｜`和`&&`
> 如果`case`中没有`break`也会出现“贯穿”（fall-through）

## 循环语句

* `while`
* `do … while … `
* `for`

控制关键字:
* `break`
* `continue`

Java5引入遍历数组的增强`for`:
```Java
for(声明语句 : 表达式)
{
   //代码句子
}
```

例子:
```Java
public class Test {
   public static void main(String[] args){
      int [] numbers = {10, 20, 30, 40, 50};
 
      for(int x : numbers ){
         System.out.print( x );
         System.out.print(",");
      }
      System.out.print("\n");
      String [] names ={"James", "Larry", "Tom", "Lacy"};
      for( String name : names ) {
         System.out.print( name );
         System.out.print(",");
      }
   }
}
```

## Java Number & Math 类

`Number`和`Math`类属于`java.lang`包，无需`import`

## Java Number 类

所有的包装类（Integer、Long、Byte、Double、Float、Short）都是抽象类 Number 的子类。

| 包装类    | 基本数据类型 |
|----------|------------|
| Boolean  | boolean    |
| Byte     | byte       |
| Short    | short      |
| Integer  | int        |
| Long     | long       |
| Character| char       |
| Float    | float      |
| Double   | double     |

> 这种由编译器特别支持的包装称为装箱，所以当内置数据类型被当作对象使用的时候，编译器会把内置类型装箱为包装类。相似的，编译器也可以把一个对象拆箱为内置类型。

| 方法 | 返回类型 | 说明 |
|------|----------|------|
| **类型转换方法** | | |
| `byteValue()` | `byte` | 以 `byte` 类型返回数值 |
| `shortValue()` | `short` | 以 `short` 类型返回数值 |
| `intValue()` | `int` | 以 `int` 类型返回数值 |
| `longValue()` | `long` | 以 `long` 类型返回数值 |
| `floatValue()` | `float` | 以 `float` 类型返回数值 |
| `doubleValue()` | `double` | 以 `double` 类型返回数值 |
| **其他方法** | | |
| `toString()` | `String` | 返回数值的字符串形式（继承自 `Object`） |
| `equals(Object obj)` | `boolean` | 判断两个 `Number` 对象是否相等（继承自 `Object`） |
| `hashCode()` | `int` | 返回 `Number` 对象的哈希码（继承自 `Object`） |

**示例：**
```java
public class NumberExample {
    public static void main(String[] args) {
        // 创建不同类型的 Number 对象
        Integer intObj = 100;
        Double doubleObj = 99.99;
        Float floatObj = 12.5f;
        Long longObj = 100000L;

        // 类型转换方法
        System.out.println("Integer 转换为 double: " + intObj.doubleValue());
        System.out.println("Double 转换为 int: " + doubleObj.intValue());
        System.out.println("Float 转换为 long: " + floatObj.longValue());

        // 获取 Number 的哈希值
        System.out.println("Integer 哈希值: " + intObj.hashCode());
        System.out.println("Double 哈希值: " + doubleObj.hashCode());

        // Number 的 equals 方法
        System.out.println("intObj 和 longObj 是否相等: " + intObj.equals(longObj));
        System.out.println("doubleObj 和 new Double(99.99) 是否相等: " + doubleObj.equals(new Double(99.99)));
    }
}
```

### Java Math 类

Java 的 Math 包含了用于执行基本数学运算的属性和方法，如初等指数、对数、平方根和三角函数。
Math 的方法都被定义为 static 形式，通过 Math 类可以在主函数中直接调用。

| 方法 | 说明 |
|------|------|
| **取整操作** | |
| `Math.ceil(double a)` | 返回大于等于 `a` 的最小整数（向上取整） |
| `Math.floor(double a)` | 返回小于等于 `a` 的最大整数（向下取整） |
| `Math.round(float a)` | 四舍五入，返回 `long` 或 `int` |
| `Math.abs(x)` | 取绝对值，`x` 可为 `int、long、float、double` |
| **最大值/最小值** | |
| `Math.max(x, y)` | 返回 `x` 和 `y` 中的较大值 |
| `Math.min(x, y)` | 返回 `x` 和 `y` 中的较小值 |
| **幂运算与根号** | |
| `Math.pow(a, b)` | 计算 `a^b`（a 的 b 次幂） |
| `Math.sqrt(x)` | 计算 `√x`（平方根） |
| `Math.cbrt(x)` | 计算 `³√x`（立方根） |
| **指数与对数** | |
| `Math.exp(x)` | 计算 `e^x`（自然指数函数） |
| `Math.log(x)` | 计算 `ln(x)`（自然对数） |
| `Math.log10(x)` | 计算 `log₁₀(x)`（以 10 为底的对数） |
| **三角函数** | |
| `Math.sin(x)` | 计算 `x` 的正弦（`x` 以弧度为单位） |
| `Math.cos(x)` | 计算 `x` 的余弦 |
| `Math.tan(x)` | 计算 `x` 的正切 |
| `Math.asin(x)` | 计算 `x` 的反正弦 |
| `Math.acos(x)` | 计算 `x` 的反余弦 |
| `Math.atan(x)` | 计算 `x` 的反正切 |
| **角度与弧度转换** | |
| `Math.toRadians(deg)` | 角度转弧度 |
| `Math.toDegrees(rad)` | 弧度转角度 |
| **随机数** | |
| `Math.random()` | 返回 `[0.0, 1.0)` 范围的随机数 |

> `round()`方法的算法为`Math.floor(x+0.5)`，遇到负数如`Math.round(-11.5)`的结果为 -11

**示例：**
```java
public class MathExample {
    public static void main(String[] args) {
        // 1. 基本数学运算
        System.out.println("绝对值: " + Math.abs(-10));
        System.out.println("最大值: " + Math.max(10, 20));
        System.out.println("最小值: " + Math.min(10, 20));

        // 2. 幂运算
        System.out.println("2 的 3 次方: " + Math.pow(2, 3));
        System.out.println("平方根: " + Math.sqrt(16));
        System.out.println("立方根: " + Math.cbrt(27));

        // 3. 取整
        System.out.println("向上取整: " + Math.ceil(4.3));
        System.out.println("向下取整: " + Math.floor(4.9));
        System.out.println("四舍五入: " + Math.round(4.5));

        // 4. 三角函数
        System.out.println("sin(30°): " + Math.sin(Math.toRadians(30)));
        System.out.println("cos(60°): " + Math.cos(Math.toRadians(60)));
        System.out.println("tan(45°): " + Math.tan(Math.toRadians(45)));

        // 5. 随机数
        System.out.println("随机数 (0~1): " + Math.random());
        System.out.println("随机整数 (1~100): " + (int) (Math.random() * 100 + 1));

        // 6. 对数与指数
        System.out.println("自然对数 log(10): " + Math.log(10));
        System.out.println("以 10 为底的对数 log10(1000): " + Math.log10(1000));
        System.out.println("e 的 2 次方: " + Math.exp(2));
    }
}
```

## Java数组、Arrays类与ArrayList

### 数组

**声明数组变量**

```java
dataType[] arrayRefVar;   // 首选的方法

dataType arrayRefVar[];  // 效果相同，但不是首选方法
```

**创建数组**

Java语言使用new操作符来创建数组

```java
dataType[] arrayRefVar = new dataType[arraySize];

// 或者指定初始化时的值
dataType[] arrayRefVar = {value0, value1, ..., valuek};  
```

### Arrays类

| 方法 | 说明 |
|------|------|
| **数组输出** | |
| `Arrays.toString(array)` | 以字符串形式返回一维数组内容 |
| `Arrays.deepToString(array)` | 以字符串形式返回多维数组内容 |
| **数组排序** | |
| `Arrays.sort(array)` | 对数组进行升序排序 |
| `Arrays.sort(array, Comparator c)` | 使用指定比较器对对象数组排序 |
| `Arrays.parallelSort(array)` | 并行排序，适用于大数组，提升性能 |
| **数组搜索** | |
| `Arrays.binarySearch(array, key)` | 在 **排序后的数组** 中查找 `key`，返回索引（找不到返回负值） |
| **数组填充** | |
| `Arrays.fill(array, value)` | 用 `value` 填充整个数组 |
| `Arrays.fill(array, from, to, value)` | 用 `value` 填充 `[from, to)` 范围的元素 |
| **数组复制** | |
| `Arrays.copyOf(array, newLength)` | 复制数组，并调整长度 |
| `Arrays.copyOfRange(array, from, to)` | 复制数组的 `[from, to)` 子范围 |
| **数组比较** | |
| `Arrays.equals(array1, array2)` | 判断两个 **一维数组** 是否相等 |
| `Arrays.deepEquals(array1, array2)` | 判断两个 **多维数组** 是否相等 |
| **数组转换** | |
| `Arrays.asList(array)` | 将数组转换为 `List`（适用于对象数组） |
| **流操作（Java 8+）** | |
| `Arrays.stream(array)` | 将数组转换为 `Stream` 流，以便使用流操作 |
| `Arrays.parallelPrefix(array, operator)` | 计算并行前缀操作 |

**示例：**
```Java
import java.util.Arrays;
import java.util.List;
import java.util.stream.IntStream;

public class ArraysExample {
    public static void main(String[] args) {
        // 1. 数组输出
        int[] numbers = {5, 3, 8, 1, 2};
        System.out.println("原始数组: " + Arrays.toString(numbers));

        // 2. 数组排序
        Arrays.sort(numbers);
        System.out.println("排序后: " + Arrays.toString(numbers));

        // 3. 二分查找 (必须先排序)
        int index = Arrays.binarySearch(numbers, 3);
        System.out.println("数字 3 的索引: " + index);

        // 4. 数组填充
        int[] filledArray = new int[5];
        Arrays.fill(filledArray, 7);
        System.out.println("填充后: " + Arrays.toString(filledArray));

        // 5. 部分填充
        int[] partialFilled = {1, 2, 3, 4, 5};
        Arrays.fill(partialFilled, 1, 4, 9); // 填充索引 [1, 4) 的元素
        System.out.println("部分填充后: " + Arrays.toString(partialFilled));

        // 6. 数组复制
        int[] copiedArray = Arrays.copyOf(numbers, 7); // 长度变为 7
        System.out.println("复制后: " + Arrays.toString(copiedArray));

        int[] copiedRange = Arrays.copyOfRange(numbers, 1, 4); // 复制索引 [1, 4)
        System.out.println("复制范围: " + Arrays.toString(copiedRange));

        // 7. 数组比较
        int[] array1 = {1, 2, 3};
        int[] array2 = {1, 2, 3};
        int[] array3 = {1, 2, 4};
        System.out.println("数组是否相等 (array1 和 array2): " + Arrays.equals(array1, array2));
        System.out.println("数组是否相等 (array1 和 array3): " + Arrays.equals(array1, array3));

        // 8. 将数组转换为 List
        String[] strArray = {"Alice", "Bob", "Charlie"};
        List<String> strList = Arrays.asList(strArray);
        System.out.println("转换为 List: " + strList);

        // 9. 使用流（Java 8+）
        int sum = Arrays.stream(numbers).sum();
        System.out.println("数组元素总和: " + sum);

        // 10. 并行排序（适用于大数组）
        int[] largeArray = {10, 5, 8, 2, 7};
        Arrays.parallelSort(largeArray);
        System.out.println("并行排序后: " + Arrays.toString(largeArray));

        // 11. 多维数组的深度输出
        int[][] matrix = {
            {1, 2, 3},
            {4, 5, 6}
        };
        System.out.println("二维数组: " + Arrays.deepToString(matrix));

        // 12. 深度比较多维数组
        int[][] matrix2 = {
            {1, 2, 3},
            {4, 5, 6}
        };
        System.out.println("二维数组是否相等: " + Arrays.deepEquals(matrix, matrix2));
    }
}
```

### ArrayList

ArrayList 是 Java 集合框架（Java Collections Framework）中的一个类，实现了 `List` 接口，位于 `java.util` 包下。它提供了动态数组的实现，能够根据需要自动调整大小。ArrayList 是非同步的（不是线程安全的）。

ArrayList 的主要特点：
- 基于动态数组实现，自动扩容
- 实现了 List 接口，拥有 List 的所有功能
- 允许存储任何类型的对象，包括 null
- 提供随机访问（通过索引）功能，访问元素的时间复杂度为 O(1)
- 插入和删除操作可能需要移动元素，时间复杂度为 O(n)

#### ArrayList 与数组比较

| 特性 | ArrayList | 数组 |
|------|-----------|------|
| **大小** | 动态，可以自动增长或缩小 | 固定，创建时必须指定大小且不可改变 |
| **类型安全** | 使用泛型可以确保类型安全 | 只能存储同一类型元素 |
| **存储类型** | 只能存储对象，不能存储基本数据类型 | 可以存储基本数据类型和对象 |
| **API** | 提供丰富的方法（add, remove, contains等） | 仅提供基本操作和length属性 |
| **性能** | 需要额外的方法调用和类型检查，性能略低 | 访问元素更直接，性能较高 |
| **内存使用** | 由于需要存储对象，会有额外的开销 | 更加紧凑，特别是对基本类型 |
| **便利性** | 提供更多便利功能，如动态调整大小 | 需要手动处理扩容、缩容等操作 |
| **线程安全** | 不是线程安全的 | 不是线程安全的 |
| **迭代器** | 提供迭代器和增强for循环支持 | 只能使用索引或增强for循环 |

#### ArrayList 的创建

```java
// 创建不指定类型的ArrayList（不推荐）
ArrayList list1 = new ArrayList();

// 使用泛型创建指定类型的ArrayList
ArrayList<String> list2 = new ArrayList<String>();

// 使用Java 7引入的钻石操作符
ArrayList<String> list3 = new ArrayList<>();

// 创建时指定初始容量
ArrayList<Integer> list4 = new ArrayList<>(20);

// 通过其他集合创建ArrayList
ArrayList<Integer> list5 = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5));
```

#### 添加元素

```java
ArrayList<String> fruits = new ArrayList<>();

// 在末尾添加元素
fruits.add("苹果");
fruits.add("香蕉");
fruits.add("橙子");

// 在指定位置添加元素
fruits.add(1, "葡萄");  // ["苹果", "葡萄", "香蕉", "橙子"]

// 添加多个元素（集合）
List<String> moreFruits = Arrays.asList("西瓜", "芒果");
fruits.addAll(moreFruits);  // ["苹果", "葡萄", "香蕉", "橙子", "西瓜", "芒果"]

// 在指定位置添加多个元素
fruits.addAll(2, Arrays.asList("梨", "樱桃"));  // ["苹果", "葡萄", "梨", "樱桃", "香蕉", "橙子", "西瓜", "芒果"]
```

#### 访问元素

```java
ArrayList<String> fruits = new ArrayList<>(Arrays.asList("苹果", "香蕉", "橙子"));

// 通过索引访问元素
String firstFruit = fruits.get(0);  // "苹果"

// 获取列表大小
int size = fruits.size();  // 3

// 检查元素是否存在
boolean hasApple = fruits.contains("苹果");  // true
boolean hasGrape = fruits.contains("葡萄");  // false

// 查找元素索引
int index = fruits.indexOf("香蕉");  // 1
int lastIndex = fruits.lastIndexOf("香蕉");  // 查找最后一次出现的索引

// 检查列表是否为空
boolean isEmpty = fruits.isEmpty();  // false
```

#### 修改元素

```java
ArrayList<String> fruits = new ArrayList<>(Arrays.asList("苹果", "香蕉", "橙子"));

// 修改指定索引的元素
fruits.set(1, "葡萄");  // ["苹果", "葡萄", "橙子"]
```

#### 删除元素

```java
ArrayList<String> fruits = new ArrayList<>(Arrays.asList("苹果", "香蕉", "橙子", "香蕉"));

// 删除第一次出现的指定元素
fruits.remove("香蕉");  // ["苹果", "橙子", "香蕉"]

// 删除指定索引的元素
fruits.remove(0);  // ["橙子", "香蕉"]

// 删除满足条件的元素（Java 8+）
fruits.removeIf(fruit -> fruit.equals("香蕉"));  // ["橙子"]

// 清空列表
fruits.clear();  // []
```

#### 遍历元素

```java
ArrayList<String> fruits = new ArrayList<>(Arrays.asList("苹果", "香蕉", "橙子"));

// 使用for循环
for (int i = 0; i < fruits.size(); i++) {
    System.out.println(fruits.get(i));
}

// 使用增强for循环
for (String fruit : fruits) {
    System.out.println(fruit);
}

// 使用Iterator迭代器
Iterator<String> iterator = fruits.iterator();
while (iterator.hasNext()) {
    System.out.println(iterator.next());
}

// 使用Java 8的forEach方法和Lambda表达式
fruits.forEach(fruit -> System.out.println(fruit));

// 更简洁的方法引用形式
fruits.forEach(System.out::println);
```

#### 排序

```java
ArrayList<String> fruits = new ArrayList<>(Arrays.asList("橙子", "苹果", "香蕉"));

// 使用Collections.sort()进行自然排序
Collections.sort(fruits);  // ["苹果", "橙子", "香蕉"]

// 使用自定义比较器
Collections.sort(fruits, Collections.reverseOrder());  // ["香蕉", "橙子", "苹果"]

// Java 8+ 使用ArrayList的sort方法
fruits.sort(Comparator.naturalOrder());  // ["苹果", "橙子", "香蕉"]
fruits.sort(Comparator.reverseOrder());  // ["香蕉", "橙子", "苹果"]

// 使用自定义比较器（按字符串长度排序）
fruits.sort(Comparator.comparingInt(String::length));
```

#### 转换为数组

```java
ArrayList<String> fruits = new ArrayList<>(Arrays.asList("苹果", "香蕉", "橙子"));

// 转换为Object数组
Object[] objectArray = fruits.toArray();

// 转换为指定类型的数组
String[] stringArray1 = fruits.toArray(new String[0]);
String[] stringArray2 = fruits.toArray(new String[fruits.size()]);

// Java 11+更简洁的方式
String[] stringArray3 = fruits.toArray(String[]::new);
```

#### 性能注意事项

1. **随机访问**：ArrayList的随机访问性能很好，时间复杂度为O(1)
2. **添加元素**：在末尾添加元素通常很快O(1)，但可能会触发扩容操作
3. **插入/删除元素**：在中间插入或删除元素需要移动后面的元素，时间复杂度为O(n)
4. **初始容量**：如果预先知道大致元素数量，指定初始容量可以减少扩容操作
5. **迭代**：迭代过程中修改列表（add/remove）会导致`ConcurrentModificationException`

#### 适用场景

ArrayList适合以下场景：
- 需要频繁随机访问元素
- 主要在列表末尾添加/删除元素
- 对存储空间要求不高
- 不需要频繁在列表中间插入/删除元素
- 不需要线程安全

不适合的场景（考虑使用LinkedList）：
- 频繁在列表中间或开头插入/删除元素
- 需要高效的栈、队列或双端队列操作

## Java 方法

### 方法的定义
```java
修饰符 返回值类型 方法名(参数类型 参数名){
    ...
    方法体
    ...
    return 返回值;
}
```
> 方法命名应使用小驼峰如`addTest`

* **修饰符**：修饰符，这是可选的，告诉编译器如何调用该方法。定义了该方法的访问类型。
* **返回值类型** ：方法可能会返回值。returnValueType 是方法返回值的数据类型。有些方法执行所需的操作，但没有返回值。在这种情况下，returnValueType 是关键字void。
* **方法名**：是方法的实际名称。方法名和参数表共同构成方法签名。
* **参数类型**：参数像是一个占位符。当方法被调用时，传递值给参数。这个值被称为实参或变量。参数列表是指方法的参数类型、顺序和参数的个数。参数是可选的，方法可以不包含任何参数。
* **方法体**：方法体包含具体的语句，定义该方法的功能。

### 方法重载
重载的方法必须拥有**不同的参数列表**。你不能仅仅依据修饰符或者返回类型的不同来重载方法。

### 构造方法
构造方法（Constructor）是用于创建类的对象的特殊方法。当使用 new 关键字创建对象时，构造方法会自动调用，用来初始化对象的属性。

构造方法特点：
* **方法名与类名相同**：构造方法的名字必须和类名一致。
* **没有返回类型**：构造方法没有返回类型，连 void 也不能写。
* **在创建对象时自动调用**：每次使用 new 创建对象时，都会自动调用构造方法。
* **可以重载**：可以为同一个类定义多个构造方法，但这些构造方法的参数列表必须不同（即构成重载）。
不管你是否自定义构造方法，所有的类都有构造方法，因为 Java 自动提供了一个默认构造方法，默认构造方法的访问修饰符和类的访问修饰符相同(类为 public，构造函数也为 public；类改为 protected，构造函数也改为 protected)，一旦你定义了自己的构造方法，默认构造方法就会失效。

**示例:**
```Java
// 一个简单的构造函数
class MyClass {
  int x;
 
  // 以下是构造函数
  MyClass(int i ) {
    x = i;
  }
}
```

构造方法中的`this`关键字:

1. 引用当前对象的属性或方法
2. 调用另一个构造方法

**示例:**
```Java
public Person(String name) {
    this(name, 0); // 调用另一个双参数的构造方法
}

public Person(String name, int age) {
    this.name = name;
    this.age = age;
}
```
### 可变参数

可变参数允许程序员定义一个方法，该方法可以接受零个或多个相同类型的参数。

**声明:**
```java
returnType methodName(dataType... parameterName) {
    // 方法体
}
```
* 可变参数必须是方法的最后一个参数
* 一个方法中只能有一个可变参数

**示例:**

```Java
public class VarargsWithArrayExample {
    // 声明一个带有可变参数的方法
    public static int sum(int... numbers) {
        int total = 0;
        for (int num : numbers) {
            total += num;
        }
        return total;
    }
    
    public static void main(String[] args) {
         // 直接传递多个值给可变参数方法
        int result1 = sum(1, 2, 3, 4, 5);
        System.out.println("Sum of individual elements: " + result1);  // 15
        
        // 将整个数组直接传递给可变参数方法
        int[] myArray = {1, 2, 3, 4, 5};
        int result = sum(myArray);
        System.out.println("Sum of array elements: " + result);  // 15
    }
}
```

### 参数默认值

Java方法的参数**没有默认值**，但可以通过其他方法来实现类似的功能

1. 方法重载
```java
public class DefaultValueExample {
    public void display(String name, int age, String city) {
        System.out.println("Name: " + name);
        System.out.println("Age: " + age);
        System.out.println("City: " + city);
    }
    
    // 带有"默认"city参数的重载方法
    public void display(String name, int age) {
        display(name, age, "Beijing"); // 使用"北京"作为city的默认值
    }
    
    // 带有"默认"age和city参数的重载方法
    public void display(String name) {
        display(name, 18, "Beijing"); // 使用18作为age的默认值，"北京"作为city的默认值
    }
    
    public static void main(String[] args) {
        DefaultValueExample example = new DefaultValueExample();
        example.display("Zhang San", 25, "Shanghai"); // 全部指定参数
        example.display("Li Si", 30);                // city使用默认值
        example.display("Wang Wu");                  // age和city使用默认值
    }
}
```

2. 可变参数
```java
public class OptionalParamExample {
    public void process(String name, Object... options) {
        int age = (options.length > 0 && options[0] != null) ? (int) options[0] : 18;
        String city = (options.length > 1 && options[1] != null) ? (String) options[1] : "Beijing";
        
        System.out.println("Name: " + name);
        System.out.println("Age: " + age);
        System.out.println("City: " + city);
    }
    
    public static void main(String[] args) {
        OptionalParamExample example = new OptionalParamExample();
        example.process("Zhang San", 25, "Shanghai"); // 全部指定参数
        example.process("Li Si", 30);                // city使用默认值
        example.process("Wang Wu");                  // age和city使用默认值
    }
}
```

3. Java8中的Option类
```java
public class OptionalExample {
    public void greet(String name, Optional<Integer> age, Optional<String> city) {
        System.out.println("Name: " + name);
        System.out.println("Age: " + age.orElse(18)); // 如果age存在则使用它，否则使用默认值18
        System.out.println("City: " + city.orElse("Beijing")); // 如果city存在则使用它，否则使用默认值"北京"
    }
    
    public static void main(String[] args) {
        OptionalExample example = new OptionalExample();
        example.greet("Zhang San", Optional.of(25), Optional.of("Shanghai")); // 全部指定参数
        example.greet("Li Si", Optional.of(30), Optional.empty());           // city使用默认值
        example.greet("Wang Wu", Optional.empty(), Optional.empty());        // age和city使用默认值
    }
}
```


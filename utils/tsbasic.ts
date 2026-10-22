/*
TypeScript
TypeScript (TS) is a superset of JavaScript that adds static typing and other features to JavaScript. 
TypeScript code is compiled/transpiled into JavaScript before execution.

TypeScript vs JavaScript
TypeScript											JavaScript
Statically typed									Dynamically typed
Errors can be caught at compile time				Many errors occur at runtime
Supports interfaces, enums, generics, etc.			Does not natively support these TS features
.ts file											.js file
Must be compiled to JavaScript						Runs directly in browser/Node.js

Example:
js:
let age = 25;
age = "25"; // Allowed

ts:
let age: number = 25;
age = "25"; // Compile-time error

install:
npm install -g typescript


1. Types in TypeScript
let username: string = "Rahul";
let age: number = 22;
let isLoggedIn: boolean = true;
let scores: number[] = [80, 90, 95];
Common TypeScript types:

Type				Example
string				"Hello"
number				100, 3.14
boolean				true, false
string[]			["React", "Node"]
any					Can hold almost any value
unknown				Any value, but must be checked before safe use
void				Usually used for functions that return no meaningful value
null				null
undefined			undefined

==================================
let user: {
  name: string;
  age: number;
  isAdmin: boolean;
} = {
  name: "Rahul",
  age: 22,
  isAdmin: false,
};
This ensures the object has the expected properties and value types.
====================================
2. Interfaces
An interface defines the structure an object should follow.
interface User {
  id: number;
  name: string;
  email: string;
}

const user1: User = {
  id: 1,
  name: "Rahul",
  email: "rahul@example.com",
};
If a required property is missing or has the wrong type, TypeScript reports an error.
======================================
Readonly properties
Use readonly when a property should not be reassigned after initialization.
interface Product {
  readonly id: number;
  name: string;
}

const product: Product = {
  id: 101,
  name: "Laptop",
};

product.name = "Desktop"; // ✅
// product.id = 102;      // ❌ Error

======================================
Extending interfaces
An interface can extend another interface.
interface Person {
  name: string;
}

interface Employee extends Person {
  salary: number;
}

const employee: Employee = {
  name: "Rahul",
  salary: 50000,
};
Here, Employee includes both name and salary.
=========================================









*/
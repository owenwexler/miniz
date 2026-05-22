# What is Mini-Z?
Mini-Z is a lightweight single-file minimal schema-validation library designed for use in AlpineJS and other such frameworks that do not have a build step or package management.  

Mini-Z uses Bun for testing.  This is the only thing Mini-Z uses Bun for as the point of Mini-Z's existence is to be single-file and dependency-free.  The Bun test runner is as minimal of a testing framework as it gets in the JavaScript/TypeScript ecosystem. 

# Why not just use Zod or Yup?
Zod and Yup are packages and require package managers and a build step to install.  Mini-Z provides schema validation at the JavaScript level for most use cases in a single-file package that does not need a build step.  Just copy a single file into your project and import it into your Alpine scripts.  

# Stack
LANGUAGE: JavaScript
RUNTIME: Bun (for testing only)
TEST RUNNER: Bun::Test

# Why Mini-Z Uses JavaScript Instead Of TypeScript
Mini-Z is designed to validate schemas at the business logic-level for stacks centered around AlpineJS, Datastar, and other libraries that do not have a build step or package management where TypeScript may not be supported at the level where this library is used, so Mini-Z stays written in JavaScript for compatibility reasons.  Nonetheless, the type definitions are extensively documented through comments and JSDocs and the whole point of the package is to validate schemas and provide type safety.  We believe in type safety regardless of whether TypeScript is used or not.

# Setup Instructions
- Install Bun if you haven't already
- Run ```bun install``` to install development dependencies.
- Run ```bun tests``` to run the tests.
- That's it.

# The Rest
Refer to CLAUDE.md for code style and other particulars.

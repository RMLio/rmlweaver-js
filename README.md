# RMLWeaver-JS -

**RMLWeaver-JS** is a Node.js tool designed to execute dot files using npm. Dot files are commonly used for describing directed graphs. This tool efficiently performs dot file operations using RxJS streams.

## Usage


### Execute a Dot File

To execute a dot file, use:

Example
Execute a dot/ttl file with:

```
npm run execute_dot ${file}
```

To run in debug mode add argument -debug
Like
```
npm run execute_dot -- ${file} -debug
```

### Execute tests

To execute the tests, use:

```
npm test
```

### Todo:
- LeftJoin and RightJoin.
- More file types for source and target.
- (Not Sure) Fix that extend operator does not push a value if the value for the template is missing. (Test 2c)
- Optimize code
- Write benchmarks.

## Acknowledgement
This proof of concept algebraic mapping engine is implemented by [Tristan Verbeken](https://github.com/TR1VER)


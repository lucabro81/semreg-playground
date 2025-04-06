# SemReg Playground

A simple playground application for experimenting with [semreg](https://github.com/lucabro81/semreg), a semantic regular expression library that helps create readable and maintainable regular expressions.

## Table of Contents

- [Features](#features)
- [How to Use](#how-to-use)
- [Development](#development)
- [Credits](#credits)
- [Todo](#todo)

## Features

- **Live Preview**: See your regex results in real-time as you type
- **Semantic Regex Creation**: Use natural language and composition to build complex regex patterns
- **Syntax Highlighting**: Includes a simple regex highlighter based on [Regex Colorizer](https://github.com/slevithan/regex-colorizer) by Steven Levithan

## How to Use

1. Enter your semreg expression in the left panel
2. View the resulting regular expression in the right panel
3. The syntax highlighter will automatically color-code the regular expression pattern for better readability

## Development

This project is built using:

- Next.js
- TypeScript
- Tailwind CSS
- Web Workers for sandboxed evaluation

## Credits

- [semreg](https://github.com/lucabro81/semreg) - The semantic regular expression library
- [Regex Colorizer](https://github.com/slevithan/regex-colorizer) by Steven Levithan - Inspiration for the regex highlighting functionality

## Todo

- Implement the reverse process (from regex to semreg)
- Add string validation functionality using the generated regular expressions
- Implement autocompletion for semreg functions

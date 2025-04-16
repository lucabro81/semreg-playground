# SemReg Playground

A simple playground application for experimenting with [semreg](https://github.com/lucabro81/semreg), a semantic regular expression library that helps create readable and maintainable regular expressions.

## Table of Contents

- [Features](#features)
- [How to Use](#how-to-use)
- [Development](#development)
- [Credits](#credits)
- [Planned Features (Todo)](#planned-features-todo)
- [Known Bugs (Todo)](#known-bugs-todo)

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

## Planned Features (Todo)

- Implement the reverse process (from regex to semreg, similar to a translator)
- Add string validation functionality using the generated regular expressions
- Manage tab key behavior in the input area (like standard text editors)
- Add an 'Apply' button to the documentation panel to insert operators into the input text
- Add a small help modal explaining the main features of the playground

## Known Bugs (Todo)

- Autocomplete suggestions currently show even when navigating text with arrow keys (should only show while typing word characters)
- Selecting an autocomplete suggestion does not trigger the text evaluation/regex update
- Autocomplete selection on mobile displays incorrect text fragments alongside the chosen suggestion
- Horizontal scrolling occurs on mobile layout

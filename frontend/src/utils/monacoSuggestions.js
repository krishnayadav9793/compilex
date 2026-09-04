// A tracker to ensure we only register providers once per language
const registeredLanguages = new Set();

const KEYWORDS = {
  cpp: [
    "alignas", "alignof", "and", "and_eq", "asm", "atomic_cancel", "atomic_commit", 
    "atomic_noexcept", "auto", "bitand", "bitor", "bool", "break", "case", "catch", 
    "char", "char8_t", "char16_t", "char32_t", "class", "compl", "concept", "const", 
    "consteval", "constexpr", "constinit", "const_cast", "continue", "co_await", 
    "co_return", "co_yield", "decltype", "default", "delete", "do", "double", 
    "dynamic_cast", "else", "enum", "explicit", "export", "extern", "false", "float", 
    "for", "friend", "goto", "if", "inline", "int", "long", "mutable", "namespace", 
    "new", "noexcept", "not", "not_eq", "nullptr", "operator", "or", "or_eq", 
    "private", "protected", "public", "reflexpr", "register", "reinterpret_cast", 
    "requires", "return", "short", "signed", "sizeof", "static", "static_assert", 
    "static_cast", "struct", "switch", "template", "this", "thread_local", "throw", 
    "true", "try", "typedef", "typeid", "typename", "union", "unsigned", "using", 
    "virtual", "void", "volatile", "wchar_t", "while", "xor", "xor_eq"
  ],
  c: [
    "auto", "break", "case", "char", "const", "continue", "default", "do", "double", 
    "else", "enum", "extern", "float", "for", "goto", "if", "inline", "int", "long", 
    "register", "restrict", "return", "short", "signed", "sizeof", "static", "struct", 
    "switch", "typedef", "union", "unsigned", "void", "volatile", "while", "_Alignas", 
    "_Alignof", "_Atomic", "_Bool", "_Complex", "_Generic", "_Imaginary", "_Noreturn", 
    "_Static_assert", "_Thread_local"
  ],
  python: [
    "False", "None", "True", "and", "as", "assert", "async", "await", "break", "class", 
    "continue", "def", "del", "elif", "else", "except", "finally", "for", "from", 
    "global", "if", "import", "in", "is", "lambda", "nonlocal", "not", "or", "pass", 
    "raise", "return", "try", "while", "with", "yield"
  ],
  java: [
    "abstract", "assert", "boolean", "break", "byte", "case", "catch", "char", "class", 
    "const", "continue", "default", "do", "double", "else", "enum", "extends", "final", 
    "finally", "float", "for", "goto", "if", "implements", "import", "instanceof", 
    "int", "interface", "long", "native", "new", "package", "private", "protected", 
    "public", "return", "short", "static", "strictfp", "super", "switch", "synchronized", 
    "this", "throw", "throws", "transient", "try", "void", "volatile", "while"
  ],
  javascript: [
    "break", "case", "catch", "class", "const", "continue", "debugger", "default", 
    "delete", "do", "else", "export", "extends", "finally", "for", "function", "if", 
    "import", "in", "instanceof", "new", "return", "super", "switch", "this", "throw", 
    "try", "typeof", "var", "void", "while", "with", "yield", "let", "static", "yield", 
    "await", "async", "null", "undefined", "true", "false"
  ]
};

const SNIPPETS = {
  cpp: [
    {
      label: "main",
      detail: "int main() method",
      insertText: "int main() {\n\t${1}\n\treturn 0;\n}",
      documentation: "Standard main function entry point for C++."
    },
    {
      label: "cout",
      detail: "std::cout stream statement",
      insertText: "std::cout << ${1:output} << std::endl;",
      documentation: "Standard output stream with newline."
    },
    {
      label: "cin",
      detail: "std::cin input statement",
      insertText: "std::cin >> ${1:variable};",
      documentation: "Standard input stream."
    },
    {
      label: "vector",
      detail: "std::vector declaration",
      insertText: "std::vector<${1:int}> ${2:v};",
      documentation: "Standard template library vector sequence container."
    },
    {
      label: "sort",
      detail: "std::sort sequence",
      insertText: "std::sort(${1:v}.begin(), ${1:v}.end());",
      documentation: "Sorts the elements in the range [first,last) into ascending order."
    },
    {
      label: "include_cpp",
      detail: "#include standard boilerplate",
      insertText: "#include <iostream>\n#include <vector>\n#include <algorithm>\n\nusing namespace std;\n",
      documentation: "Includes iostream, vector, and algorithm namespaces."
    },
    {
      label: "include_cp",
      detail: "Competitive Programming boilerplate",
      insertText: "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n\tios_base::sync_with_stdio(false);\n\tcin.tie(NULL);\n\t${1}\n\treturn 0;\n}",
      documentation: "Optimized boilerplate template for fast I/O in competitive programming."
    },
    {
      label: "fori",
      detail: "Standard index loop",
      insertText: "for (int i = 0; i < ${1:n}; i++) {\n\t${2}\n}",
      documentation: "Standard loop incrementing from index 0 to n."
    }
  ],
  c: [
    {
      label: "main",
      detail: "int main() method",
      insertText: "int main() {\n\t${1}\n\treturn 0;\n}",
      documentation: "Standard main function entry point for C."
    },
    {
      label: "printf",
      detail: "printf() function call",
      insertText: "printf(\"${1:%s}\\n\", ${2:var});",
      documentation: "Formatted output to stdout."
    },
    {
      label: "scanf",
      detail: "scanf() function call",
      insertText: "scanf(\"${1:%d}\", &${2:var});",
      documentation: "Reads formatted input from stdin."
    },
    {
      label: "include_c",
      detail: "#include C libraries boilerplate",
      insertText: "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n",
      documentation: "Includes C standard IO, library utilities, and string manipulation."
    },
    {
      label: "fori",
      detail: "C loop template",
      insertText: "for (int i = 0; i < ${1:n}; i++) {\n\t${2}\n}",
      documentation: "C index-based iteration block."
    }
  ],
  python: [
    {
      label: "main",
      detail: "if __name__ == '__main__':",
      insertText: "if __name__ == '__main__':\n\t${1:main()}",
      documentation: "Python standard boilerplate for script execution block."
    },
    {
      label: "def",
      detail: "def function_name():",
      insertText: "def ${1:func_name}(${2:params}):\n\t${3:pass}",
      documentation: "Defines a new function statement."
    },
    {
      label: "class",
      detail: "class ClassName:",
      insertText: "class ${1:ClassName}:\n\tdef __init__(self${2}):\n\t\t${3:pass}",
      documentation: "Defines a class constructor template."
    },
    {
      label: "print",
      detail: "print() function call",
      insertText: "print(${1:value})",
      documentation: "Prints values to standard console output stream."
    },
    {
      label: "for_range",
      detail: "for i in range():",
      insertText: "for ${1:i} in range(${2:n}):\n\t${3:pass}",
      documentation: "Loop iterating over a range sequence."
    },
    {
      label: "list_comp",
      detail: "List comprehension template",
      insertText: "[${1:x} for ${1:x} in ${2:iterable} if ${3:condition}]",
      documentation: "Constructs a python list comprehension expression."
    }
  ],
  java: [
    {
      label: "main_class",
      detail: "public class Main { ... }",
      insertText: "public class Main {\n\tpublic static void main(String[] args) {\n\t\t${1}\n\t}\n}",
      documentation: "Generates Main class declaration containing the entry method."
    },
    {
      label: "sysout",
      detail: "System.out.println();",
      insertText: "System.out.println(${1:output});",
      documentation: "Standard System console print stream statement."
    },
    {
      label: "scanner",
      detail: "Scanner input instantiation",
      insertText: "import java.util.Scanner;\n\nScanner sc = new Scanner(System.in);\n${1:int n = sc.nextInt();}",
      documentation: "Imports utility Scanner and instantiates read standard input."
    },
    {
      label: "fori",
      detail: "Java integer loop template",
      insertText: "for (int i = 0; i < ${1:n}; i++) {\n\t${2}\n}",
      documentation: "Standard integer index counter loop."
    }
  ],
  javascript: [
    {
      label: "clg",
      detail: "console.log() statement",
      insertText: "console.log(${1:item});",
      documentation: "Prints items to browser console developer inspector."
    },
    {
      label: "arrfn",
      detail: "Arrow function expression",
      insertText: "const ${1:funcName} = (${2:params}) => {\n\t${3}\n};",
      documentation: "Declares a javascript lambda arrow function assignment."
    },
    {
      label: "fori",
      detail: "Standard JS loop template",
      insertText: "for (let i = 0; i < ${1:array}.length; i++) {\n\tconst ${2:item} = ${1:array}[i];\n\t${3}\n}",
      documentation: "Standard JS index-based loop configuration."
    },
    {
      label: "promise",
      detail: "new Promise((res, rej) => {})",
      insertText: "new Promise((resolve, reject) => {\n\t${1}\n})",
      documentation: "Creates a new async Promise workflow handler."
    }
  ]
};

// Common standard methods / classes to simulate complete Intellisense
const COMMON_LIBS = {
  cpp: [
    { label: "std::vector", detail: "STL Vector", documentation: "Dynamic array sequence container." },
    { label: "std::map", detail: "STL Map", documentation: "Sorted associative container containing key-value pairs." },
    { label: "std::set", detail: "STL Set", documentation: "Container that stores unique elements in a sorted order." },
    { label: "std::unordered_map", detail: "STL Unordered Map", documentation: "Hash map associative container containing key-value pairs." },
    { label: "std::unordered_set", detail: "STL Unordered Set", documentation: "Hash table of unique elements." },
    { label: "std::max", detail: "STL max algorithm", documentation: "Returns the larger of two values." },
    { label: "std::min", detail: "STL min algorithm", documentation: "Returns the smaller of two values." },
    { label: "std::abs", detail: "STL abs function", documentation: "Returns absolute value of number." },
    { label: "std::string", detail: "STL String class", documentation: "Standard string text representation." }
  ],
  c: [
    { label: "printf", detail: "stdio output function", documentation: "Print formatted data to stdout." },
    { label: "scanf", detail: "stdio input function", documentation: "Read formatted data from stdin." },
    { label: "malloc", detail: "stdlib allocation", documentation: "Allocates memory size in bytes dynamically." },
    { label: "free", detail: "stdlib memory cleanup", documentation: "Deallocates dynamically allocated memory block." },
    { label: "strlen", detail: "string function", documentation: "Returns number of characters in a string." }
  ],
  python: [
    { label: "print", detail: "Built-in function", documentation: "Prints objects to the text stream file." },
    { label: "len", detail: "Built-in function", documentation: "Returns length (number of items) of an object." },
    { label: "range", detail: "Built-in function", documentation: "Generates arithmetic progression sequence of integers." },
    { label: "input", detail: "Built-in function", documentation: "Reads a line from standard input console." },
    { label: "int", detail: "Built-in class", documentation: "Converts number/string representation to an integer object." },
    { label: "str", detail: "Built-in class", documentation: "Converts object to its text string representation." },
    { label: "list", detail: "Built-in class", documentation: "Creates a mutable sequence list object." },
    { label: "dict", detail: "Built-in class", documentation: "Creates a key-value pair map dictionary object." },
    { label: "set", detail: "Built-in class", documentation: "Creates an unordered set collection of unique elements." },
    { label: "append", detail: "List method", documentation: "Appends element to the end of the current list list.append(x)." },
    { label: "split", detail: "String method", documentation: "Splits string by delimiters into a list sequence." }
  ],
  java: [
    { label: "System.out.println", detail: "Console print statement", documentation: "Prints line representation to standard output stream." },
    { label: "String", detail: "java.lang.String", documentation: "Represents constant character string sequences." },
    { label: "Integer.parseInt", detail: "java.lang.Integer parse helper", documentation: "Parses text string argument into primitive integer type." },
    { label: "Math.max", detail: "java.lang.Math max helper", documentation: "Returns greater of two values." },
    { label: "Math.min", detail: "java.lang.Math min helper", documentation: "Returns lesser of two values." },
    { label: "ArrayList", detail: "java.util.ArrayList class", documentation: "Resizable-array implementation of List interface." }
  ],
  javascript: [
    { label: "console.log", detail: "Console printing helper", documentation: "Prints debug info to browser environment terminal." },
    { label: "JSON.stringify", detail: "JSON serialization utility", documentation: "Converts Javascript values to JSON string layout representation." },
    { label: "JSON.parse", detail: "JSON deserialization utility", documentation: "Parses JSON format string to construct native object graph value." },
    { label: "Math.max", detail: "Math math max function", documentation: "Returns the largest of given arguments." },
    { label: "Math.min", detail: "Math math min function", documentation: "Returns the smallest of given arguments." },
    { label: "setTimeout", detail: "Async scheduling timer", documentation: "Schedules callback execution after specified delay milliseconds." }
  ]
};

export const registerCustomSuggestions = (monaco) => {
  const languages = ["cpp", "c", "python", "java", "javascript"];

  languages.forEach((lang) => {
    // Prevent duplicate registrations across remounts
    if (registeredLanguages.has(lang)) return;

    monaco.languages.registerCompletionItemProvider(lang, {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        };

        const suggestions = [];

        // 1. Add Keywords
        if (KEYWORDS[lang]) {
          KEYWORDS[lang].forEach((kw) => {
            suggestions.push({
              label: kw,
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: kw,
              range: range,
              detail: `Keyword`
            });
          });
        }

        // 2. Add Snippets
        if (SNIPPETS[lang]) {
          SNIPPETS[lang].forEach((snip) => {
            suggestions.push({
              label: snip.label,
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: snip.insertText,
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              range: range,
              detail: snip.detail || `Snippet`,
              documentation: snip.documentation
            });
          });
        }

        // 3. Add Common library methods/classes
        if (COMMON_LIBS[lang]) {
          COMMON_LIBS[lang].forEach((lib) => {
            suggestions.push({
              label: lib.label,
              kind: lib.label.includes(".") ? monaco.languages.CompletionItemKind.Method : monaco.languages.CompletionItemKind.Class,
              insertText: lib.label,
              range: range,
              detail: lib.detail,
              documentation: lib.documentation
            });
          });
        }

        return { suggestions: suggestions };
      }
    });

    registeredLanguages.add(lang);
    console.log(`[MonacoSuggestions] Registered autocomplete items for: ${lang}`);
  });
};

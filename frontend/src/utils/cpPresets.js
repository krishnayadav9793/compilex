export const BOILERPLATES = {
  cpp: `#include <iostream>
using namespace std;

int main() {
    // Enter your C++ code here
    cout << "Hello, World!" << endl;
    return 0;
}
`,
  c: `#include <stdio.h>

int main() {
    // Enter your C code here
    printf("Hello, World!\\n");
    return 0;
}
`,
  python: `# Enter your Python code here
print("Hello, World!")
`,
  java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        // Enter your Java code here
        System.out.println("Hello, World!");
    }
}
`,
  javascript: `// Enter your JavaScript code here
console.log("Hello, World!");
`
};

export const CP_TEMPLATES = {
  cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

void solve() {
    // Read input and implement CP solution
    
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    solve();
    return 0;
}
`,
  c: `#include <stdio.h>
#include <stdlib.h>

int main() {
    // Read input and implement CP solution
    
    return 0;
}
`,
  python: `import sys

def solve():
    input_data = sys.stdin.read().split()
    if not input_data:
        return
    # Write your CP solution here


if __name__ == "__main__":
    solve()
`,
  java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read input and implement CP solution
        
    }
}
`,
  javascript: `const fs = require('fs');

function solve() {
    const input = fs.readFileSync(0, 'utf-8').trim();
    if (!input) return;
    // Write your CP solution here
}

solve();
`
};

export const PRESETS = [
  {
    title: "Maximum Subarray (Kadane's)",
    statement: `Given an integer array 'nums', find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.

Input format:
A single line of space-separated integers representing 'nums'.

Output format:
A single integer representing the maximum subarray sum.`,
    input: `-2 1 -3 4 -1 2 1 -5 4`,
    solutions: {
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int x;
    vector<int> nums;
    while (cin >> x) {
        nums.push_back(x);
    }
    if (nums.empty()) return 0;
    int maxSum = nums[0];
    int currentSum = nums[0];
    for (size_t i = 1; i < nums.size(); i++) {
        currentSum = max(nums[i], currentSum + nums[i]);
        maxSum = max(maxSum, currentSum);
    }
    cout << maxSum << endl;
    return 0;
}`,
      python: `import sys

def main():
    input_data = sys.stdin.read().split()
    if not input_data:
        return
    nums = [int(x) for x in input_data]
    max_sum = current_sum = nums[0]
    for x in nums[1:]:
        current_sum = max(x, current_sum + x)
        max_sum = max(max_sum, current_sum)
    print(max_sum)

if __name__ == "__main__":
    main()`,
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/).map(Number);

if (input.length > 0 && !isNaN(input[0])) {
    let maxSum = input[0];
    let currentSum = input[0];
    for (let i = 1; i < input.length; i++) {
        currentSum = Math.max(input[i], currentSum + input[i]);
        maxSum = Math.max(maxSum, currentSum);
    }
    console.log(maxSum);
}`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int maxSum = sc.nextInt();
        int currentSum = maxSum;
        while (sc.hasNextInt()) {
            int x = sc.nextInt();
            currentSum = Math.max(x, currentSum + x);
            maxSum = Math.max(maxSum, currentSum);
        }
        System.out.println(maxSum);
    }
}`,
      c: `#include <stdio.h>

int main() {
    int x;
    if (scanf("%d", &x) != 1) return 0;
    int maxSum = x;
    int currentSum = x;
    while (scanf("%d", &x) == 1) {
        currentSum = (x > currentSum + x) ? x : (currentSum + x);
        if (currentSum > maxSum) maxSum = currentSum;
    }
    printf("%d\\n", maxSum);
    return 0;
}`
    }
  },
  {
    title: "Two Sum",
    statement: `Given an array of integers 'nums' and an integer 'target', return the 0-based indices of the two numbers such that they add up to target.
Print the indices separated by a space.

Input format:
Line 1: Target value
Line 2: Array elements separated by space.`,
    input: `9\n2 7 11 15`,
    solutions: {
      cpp: `#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

int main() {
    int target;
    if (!(cin >> target)) return 0;
    vector<int> nums;
    int val;
    while (cin >> val) nums.push_back(val);
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); i++) {
        int comp = target - nums[i];
        if (seen.count(comp)) {
            cout << seen[comp] << " " << i << endl;
            return 0;
        }
        seen[nums[i]] = i;
    }
    return 0;
}`,
      python: `import sys

def main():
    lines = sys.stdin.read().splitlines()
    if not lines: return
    target = int(lines[0].strip())
    nums = [int(x) for x in lines[1].strip().split()]
    seen = {}
    for i, num in enumerate(nums):
        comp = target - num
        if comp in seen:
            print(f"{seen[comp]} {i}")
            return
        seen[num] = i

if __name__ == "__main__":
    main()`,
      javascript: `const fs = require('fs');
const lines = fs.readFileSync(0, 'utf-8').trim().split('\\n');
if (lines.length >= 2) {
    const target = parseInt(lines[0].trim());
    const nums = lines[1].trim().split(/\\s+/).map(Number);
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const comp = target - nums[i];
        if (map.has(comp)) {
            console.log(\`\${map.get(comp)} \${i}\`);
            break;
        }
        map.set(nums[i], i);
    }
}`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int target = sc.nextInt();
        List<Integer> nums = new ArrayList<>();
        while (sc.hasNextInt()) {
            nums.add(sc.nextInt());
        }
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < nums.size(); i++) {
            int comp = target - nums.get(i);
            if (seen.containsKey(comp)) {
                System.out.println(seen.get(comp) + " " + i);
                return;
            }
            seen.put(nums.get(i), i);
        }
    }
}`,
      c: `#include <stdio.h>

int main() {
    int target;
    if (scanf("%d", &target) != 1) return 0;
    int nums[1000];
    int n = 0;
    while (scanf("%d", &nums[n]) == 1) {
        n++;
    }
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (nums[i] + nums[j] == target) {
                printf("%d %d\\n", i, j);
                return 0;
            }
        }
    }
    return 0;
}`
    }
  },
  {
    title: "Valid Parentheses",
    statement: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.
Print 'true' if valid, else 'false'.`,
    input: `()[]{}`,
    solutions: {
      cpp: `#include <iostream>
#include <string>
#include <stack>
using namespace std;

int main() {
    string s;
    if (!(cin >> s)) return 0;
    stack<char> st;
    bool ok = true;
    for (char c : s) {
        if (c == '(') st.push(')');
        else if (c == '{') st.push('}');
        else if (c == '[') st.push(']');
        else if (st.empty() || st.top() != c) { ok = false; break; }
        else st.pop();
    }
    if (!st.empty()) ok = false;
    cout << (ok ? "true" : "false") << endl;
    return 0;
}`,
      python: `import sys

s = sys.stdin.read().strip()
mapping = {')': '(', '}': '{', ']': '['}
stack = []
ok = True
for char in s:
    if char in '({[':
        stack.append(char)
    elif char in mapping:
        if not stack or stack[-1] != mapping[char]:
            ok = False
            break
        stack.pop()
if stack:
    ok = False
print("true" if ok else "false")`,
      javascript: `const fs = require('fs');
const s = fs.readFileSync(0, 'utf-8').trim();
const stack = [];
const map = { ')': '(', '}': '{', ']': '[' };
let ok = true;
for (const ch of s) {
    if (ch === '(' || ch === '{' || ch === '[') stack.push(ch);
    else if (map[ch]) {
        if (stack.length === 0 || stack[stack.length - 1] !== map[ch]) {
            ok = false; break;
        }
        stack.pop();
    }
}
if (stack.length > 0) ok = false;
console.log(ok ? "true" : "false");`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNext()) return;
        String s = sc.next();
        Stack<Character> st = new Stack<>();
        boolean ok = true;
        for (char c : s.toCharArray()) {
            if (c == '(') st.push(')');
            else if (c == '{') st.push('}');
            else if (c == '[') st.push(']');
            else if (st.isEmpty() || st.pop() != c) {
                ok = false;
                break;
            }
        }
        if (!st.isEmpty()) ok = false;
        System.out.println(ok ? "true" : "false");
    }
}`,
      c: `#include <stdio.h>
#include <string.h>
#include <stdbool.h>

int main() {
    char s[1000];
    if (scanf("%999s", s) != 1) return 0;
    char stack[1000];
    int top = -1;
    bool ok = true;
    for (int i = 0; s[i] != '\\0'; i++) {
        char c = s[i];
        if (c == '(') stack[++top] = ')';
        else if (c == '{') stack[++top] = '}';
        else if (c == '[') stack[++top] = ']';
        else if (top < 0 || stack[top--] != c) {
            ok = false;
            break;
        }
    }
    if (top >= 0) ok = false;
    printf("%s\\n", ok ? "true" : "false");
    return 0;
}`
    }
  }
];

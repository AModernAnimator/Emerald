const consoleDiv = document.getElementById('console');
const input = document.getElementById('input');

const variables = {};
let inBlockComment = false;

function writeOutput(message, type = 'log') {
  const div = document.createElement('div');
  div.textContent = message;
  div.className = type;
  consoleDiv.appendChild(div);
  consoleDiv.scrollTop = consoleDiv.scrollHeight;
}

function showHelp() {
  writeOutput('logix language help:');
  writeOutput('--------------------');
  writeOutput('set "name" to \'value\'        → create variable');
  writeOutput('log <value or variable>      → print output');
  writeOutput('upper <text>                 → uppercase text');
  writeOutput('reverse <text>               → reverse text');
  writeOutput('math <expression>            → math with variables');
  writeOutput('if <cond> then <command>     → conditional');
  writeOutput('while <cond> do <command>    → loop');
  writeOutput('-- comment                   → single line comment');
  writeOutput('/-- ... --/                  → multi line comment');
  writeOutput('/help                        → show this help');
}

function resolveVars(text) {
  return text.replace(/"([^"]+)"/g, (_, name) => {
    return variables[name] ?? `"${name}"`;
  });
}

function evalCondition(cond) {
  try {
    const resolved = resolveVars(cond);
    return Function(`return (${resolved})`)();
  } catch {
    writeOutput('invalid condition', 'error');
    return false;
  }
}

function runCommand(raw) {
  let command = raw.trim();
  if (!command) return;

  // multi-line comments
  if (command.startsWith('/--')) {
    inBlockComment = true;
    return;
  }
  if (command.endsWith('--/')) {
    inBlockComment = false;
    return;
  }
  if (inBlockComment) return;

  // single-line comment
  if (command.startsWith('--')) return;

  // help
  if (command === '/help') {
    showHelp();
    return;
  }

  // if statement
  if (command.startsWith('if ')) {
    const match = command.match(/^if (.+) then (.+)$/);
    if (match && evalCondition(match[1])) {
      runCommand(match[2]);
    }
    return;
  }

  // while loop
  if (command.startsWith('while ')) {
    const match = command.match(/^while (.+) do (.+)$/);
    if (match) {
      let safety = 1000;
      while (evalCondition(match[1]) && safety-- > 0) {
        runCommand(match[2]);
      }
    }
    return;
  }

  // set variable
  const setMatch = command.match(/^set "([^"]+)" to '([^']*)'$/);
  if (setMatch) {
    const name = setMatch[1];
    let value = setMatch[2];
    value = isNaN(value) ? value : Number(value);
    variables[name] = value;
    writeOutput(`set ${name} = ${value}`, 'variable');
    return;
  }

  const parts = command.split(' ');
  const cmd = parts[0];
  const args = parts.slice(1).join(' ');

  switch (cmd) {
    case 'log':
      writeOutput(resolveVars(args));
      break;
    case 'upper':
      writeOutput(resolveVars(args).toUpperCase());
      break;
    case 'reverse':
      writeOutput(resolveVars(args).split('').reverse().join(''));
      break;
    case 'math':
      try {
        writeOutput(eval(resolveVars(args)));
      } catch {
        writeOutput('invalid math expression', 'error');
      }
      break;
    default:
      writeOutput(`unknown command: ${cmd}`, 'error');
  }
}

input.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    runCommand(input.value);
    input.value = '';
  }
});

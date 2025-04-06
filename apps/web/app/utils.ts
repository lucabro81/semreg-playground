export function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
}

// Regular expression for tokenizing regex
// ref.: https://github.com/slevithan/regex-colorizer
// more specifically: https://github.com/slevithan/regex-colorizer/blob/a2f649687a997759f3386d39abc6048011e668bc/src/index.js#L7
const unicodePropX = '[pP] { (?<property> (?: [A-Za-z_]+ = )? [A-Za-z_]+ ) }';
const cuxTokenX = String.raw`c [A-Za-z] | u (?: [\dA-Fa-f]{4} | { [\dA-Fa-f]+ } ) | x [\dA-Fa-f]{2}`;
const octalRange = '[0-3][0-7]{0,2}|[4-7][0-7]?';
const regexToken = new RegExp(String.raw`
  \[\^?(?:[^\\\]]+|\\.?)*]?
| \\(?:0(?:${octalRange})?|[1-9]\d*|${cuxTokenX}|k(?:<(?<backrefName>\w+)>)?|${unicodePropX}|.?)
| \((?:\?(?:<(?:[=!]|(?<captureName>[A-Za-z_]\w*)>)|[:=!]))?
| (?:[?*+]|\{\d+(?:,\d*)?\})\??
| [^.?*+^$[\]{}()|\\]+
| .
`.replace(/\s+/g, ''), 'gs');

function isCapturingGroupOpen(token: string): boolean {
  return token === '(';
}

function isNonCapturingGroupOpen(token: string): boolean {
  return token === '(?:' || token === '(?!' || token === '(?=';
}

function isGroupClose(token: string): boolean {
  return token === ')';
}

function isCharClass(token: string): boolean {
  return token.startsWith('[') && token.endsWith(']');
}

function isCharClassNegated(token: string): boolean {
  return token.startsWith('[^') && token.endsWith(']');
}

function isCharClassIncomplete(token: string): boolean {
  return (token.startsWith('[') || token.startsWith('[^')) && !token.endsWith(']');
}

function isEscapeSequence(token: string): boolean {
  return token.startsWith('\\') && token.length > 1;
}

function isOperator(token: string): boolean {
  return /^[|{}?*+.]$/.test(token)
}

export function analyzeRegex(pattern: string): string {
  let result = '';

  const openGroups: { isCapturing: boolean }[] = [];
  let match;
  regexToken.lastIndex = 0;

  while ((match = regexToken.exec(pattern)) !== null) {
    const token = match[0];
    let skip = false;

    let tokenClass = '';
    if (isCapturingGroupOpen(token)) {
      openGroups.push({ isCapturing: true });
      tokenClass = 'regex-paren capturing-group-start';
      result += `<span class="capturing-group">`;
    }
    else if (isNonCapturingGroupOpen(token)) {
      openGroups.push({ isCapturing: false });
      tokenClass = 'regex-paren non-capturing-group-start';
      result += `<span class="non-capturing-group">`;
    }
    else if (isGroupClose(token) && openGroups.length > 0) {

      const openGroup = openGroups.pop()!;
      if (openGroup.isCapturing) {
        tokenClass = 'regex-paren capturing-group-close';
      }
      else {
        tokenClass = 'regex-paren non-capturing-group-close';
      }
      result += `<span class="${tokenClass}">${token}</span>`;
      result += `</span>`;
      skip = true;
    }
    else if (isCharClass(token)) {
      if (isCharClassNegated(token)) {
        tokenClass = 'regex-charclass-negated';
      }
      else {
        tokenClass = 'regex-charclass';
      }
    }
    else if (isCharClassIncomplete(token)) {
      tokenClass = 'regex-error';
    }
    else if (isEscapeSequence(token)) {
      tokenClass = 'regex-escape';
    }
    else if (isOperator(token)) {
      tokenClass = 'regex-operator';
    }
    else {
      tokenClass = 'regex-literal';
    }

    if (!skip) {
      result += `<span class="${tokenClass}">${token}</span>`;
    }

  }

  return result;
}
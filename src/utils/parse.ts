export interface Input {
  lines: string[];
  paragraphs: string[];
  nums: number[];
}

export function parse(rawInput: string): Input {
  const txt = rawInput.trim();
  return {
    lines: txt.split('\n'),
    paragraphs: txt.split('\n\n'),
    nums: txt.split('\n').map(x => +x)
  }
}
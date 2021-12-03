export interface Input {
  lines: string[];
  paragraphs: string[];
  nums: number[];
}

export function parse(rawInput: string): Input {
  return {
    lines: rawInput.split('\n'),
    paragraphs: rawInput.split('\n'),
    nums: rawInput.split('\n').map(x => +x)
  }
}
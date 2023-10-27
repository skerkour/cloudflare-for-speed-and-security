export function slugify(input: string): string {
  let output = input.toLowerCase();
  output = output.replace(' ', '-');
  output = output.replace('.', '-');
  output = output.replace('_', '-');
  output = output.replace('--', '-');
  output = output.trim();
  return output;
}

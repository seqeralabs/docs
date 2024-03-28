function fixMultiline(content) {
  const match = /:::((\n+\s{8}[^\n]+)+)/g;
  let result = content.replace(match, "$1\n:::");
  return result;
}

function fixMultiline2(content) {
  const match = /:::((\n+\s{3,4}[^\n]+)+)/g;
  let result = content.replace(match, "$1\n:::");
  return result;
}

export function fixAdmonitions(content) {
  const notePattern = /\n(\s*)!!! note\s*(".*")*\n(.+)/g;
  const warningPattern = /\n(\s*)!!! warning\s*(".*")*\n(.+)/g;
  const tipPattern = /\n(\s*)!!! tip\s*(".*")*\n(.+)/g;
  const hintPattern = /\n(\s*)!!! hint\s*(".*")*\n(.+)/g;
  let result = content.replace(notePattern, "\n\n$1:::note\n$3\n:::");
  result = result.replace(warningPattern, "\n\n$1:::caution\n$3\n:::");
  result = result.replace(tipPattern, "\n\n$1:::tip\n$3\n:::");
  result = result.replace(hintPattern, "\n\n$1:::tip\n$3\n:::");
  return fixMultiline(fixMultiline2(result));
}

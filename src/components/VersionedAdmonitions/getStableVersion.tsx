import stableVersions from '/stableVersion.json';

type Tool = keyof typeof stableVersions;

type Rule = {
  stable: string;
  replaces: string[];
};

export function getDisplayVersion(tool: Tool, version?: string): string {
  const toolRules = stableVersions[tool] as Rule[];
  if (!toolRules) return version || "unknown";

  // If multiple rules, find the first that matches the version in replaces
  for (const rule of toolRules) {
    if (version && rule.replaces.includes(version)) {
      return rule.stable;
    }
  }
  // If no match, return the latest stable (last in the array)
  return version || toolRules[toolRules.length - 1].stable;
} 
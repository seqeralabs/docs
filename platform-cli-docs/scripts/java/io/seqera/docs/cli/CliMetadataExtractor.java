package io.seqera.docs.cli;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import io.seqera.tower.cli.Tower;
import picocli.CommandLine;
import picocli.CommandLine.Model.ArgSpec;
import picocli.CommandLine.Model.CommandSpec;
import picocli.CommandLine.Model.OptionSpec;
import picocli.CommandLine.Model.PositionalParamSpec;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.IdentityHashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/** Extracts the resolved picocli command model from a released tower-cli fat JAR. */
public final class CliMetadataExtractor {
    private static final String SCHEMA_VERSION = "1";
    private static final Set<String> SENSITIVE_OPTION_TERMS = Set.of(
        "access-token", "api-key", "credential", "password", "private-key", "secret", "token"
    );

    private CliMetadataExtractor() {}

    public static void main(String[] args) throws Exception {
        if (args.length != 1 || args[0].isBlank()) {
            System.err.println("Usage: CliMetadataExtractor <release-tag>");
            System.exit(2);
        }

        CommandLine commandLine = new CommandLine(new Tower());
        CommandSpec root = commandLine.getCommandSpec();

        Map<String, Object> document = new LinkedHashMap<>();
        Map<String, Object> metadata = new LinkedHashMap<>();
        metadata.put("schema_version", SCHEMA_VERSION);
        metadata.put("cli_version", args[0]);
        metadata.put("source", "released-fat-jar");
        document.put("metadata", metadata);
        document.put("hierarchy", command(root, root.name(), new IdentityHashMap<>()));

        ObjectMapper mapper = new ObjectMapper().enable(SerializationFeature.INDENT_OUTPUT);
        mapper.writeValue(System.out, document);
        System.out.println();
    }

    private static Map<String, Object> command(
        CommandSpec spec,
        String fullCommand,
        IdentityHashMap<CommandLine, Boolean> ancestors
    ) {
        Map<String, Object> node = new LinkedHashMap<>();
        node.put("name", spec.name());
        node.put("full_command", fullCommand);
        node.put("description", text(spec.usageMessage().description()));

        List<String> aliases = Arrays.stream(spec.aliases())
            .filter(alias -> !alias.isBlank())
            .toList();
        if (!aliases.isEmpty()) {
            node.put("aliases", aliases);
        }

        List<Map<String, Object>> options = spec.options().stream()
            .filter(option -> !option.hidden() && !option.usageHelp() && !option.versionHelp())
            .map(CliMetadataExtractor::option)
            .toList();
        node.put("options", options);

        List<Map<String, Object>> positionals = spec.positionalParameters().stream()
            .filter(positional -> !positional.hidden())
            .map(CliMetadataExtractor::positional)
            .toList();
        node.put("positionals", positionals);

        List<Map<String, Object>> children = new ArrayList<>();
        IdentityHashMap<CommandLine, Boolean> seenChildren = new IdentityHashMap<>();
        for (CommandLine child : spec.subcommands().values()) {
            if (seenChildren.put(child, Boolean.TRUE) != null || ancestors.containsKey(child)) {
                continue;
            }
            CommandSpec childSpec = child.getCommandSpec();
            if (childSpec.usageMessage().hidden()) {
                continue;
            }
            IdentityHashMap<CommandLine, Boolean> childAncestors = new IdentityHashMap<>(ancestors);
            childAncestors.put(child, Boolean.TRUE);
            children.add(command(childSpec, fullCommand + " " + childSpec.name(), childAncestors));
        }
        node.put("children", children);
        return node;
    }

    private static Map<String, Object> option(OptionSpec option) {
        Map<String, Object> result = argument(option);
        List<String> names = Arrays.asList(option.names());
        result.put("names", names);
        result.put("required", option.required());
        result.put("default_value", safeDefault(option, names));
        return result;
    }

    private static Map<String, Object> positional(PositionalParamSpec positional) {
        Map<String, Object> result = argument(positional);
        result.put("index", positional.index().toString());
        result.put("required", positional.arity().min() > 0);
        return result;
    }

    private static Map<String, Object> argument(ArgSpec argument) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("description", text(argument.description()));
        result.put("param_label", argument.paramLabel());
        result.put("arity", argument.arity().toString());
        if (argument.type() != null) {
            result.put("type", argument.type().getTypeName());
        }
        return result;
    }

    private static String safeDefault(OptionSpec option, List<String> names) {
        String normalizedNames = names.stream()
            .map(name -> name.toLowerCase(Locale.ROOT).replace('_', '-'))
            .collect(Collectors.joining(" "));
        if (SENSITIVE_OPTION_TERMS.stream().anyMatch(normalizedNames::contains)) {
            return null;
        }

        String value = option.defaultValue();
        if (value == null || value.isBlank() || "null".equalsIgnoreCase(value)) {
            return null;
        }
        return value;
    }

    private static String text(String[] lines) {
        if (lines == null) {
            return "";
        }
        return Arrays.stream(lines)
            .map(String::trim)
            .filter(line -> !line.isBlank())
            .collect(Collectors.joining(" "));
    }
}

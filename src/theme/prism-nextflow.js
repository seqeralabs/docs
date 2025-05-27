(function (Prism) {
  Prism.languages.nextflow = Prism.languages.extend('groovy', {
    'keyword': /\b(?:abstract|as|assert|boolean|break|byte|case|catch|char|class|const|continue|def|default|do|double|else|enum|extends|final|finally|float|for|goto|if|implements|import|in|instanceof|int|interface|long|native|new|package|private|protected|public|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|trait|transient|try|void|volatile|while|process|workflow|input|output|publishDir|exec|shell|script|stub|container|conda|module|include|from)\b/,
    'string': {
      pattern: /"""(?:[^\\]|\\[\s\S])*?"""|'''(?:[^\\]|\\[\s\S])*?'''|'(?:\\.|[^\\'\r\n])*'|"(?:\\.|[^\\"\r\n])*"/,
      greedy: true
    },
    'operator': {
      pattern: /(^|[^.])(?:~|==?~?|\?[.:]?|\*(?:[.=]|\*=?)?|\.[@&]|\.\.<|\.\.(?!\.)|-[-=>]?|\+[+=]?|!=?|<(?:<=?|=>?)?|>(?:>>?=?|=)?|&[&=]?|\|[|=]?|\/=?|\^=?|%=?)/,
      lookbehind: true
    },
    'punctuation': /\.+|[{}[\];(),:$]/
  });

  // Add support for Nextflow-specific directives
  Prism.languages.insertBefore('nextflow', 'keyword', {
    'directive': {
      pattern: /(?:^|\n)\s*(?:process|workflow|exec|shell|script|stub|container|conda|module|include|from|publishDir|input|output):/,
      lookbehind: true,
      alias: 'keyword'
    }
  });

  // Add support for Nextflow-specific operators
  Prism.languages.insertBefore('nextflow', 'operator', {
    'nextflow-operator': {
      pattern: /(?:->|>>|<<|:|::)/,
      alias: 'operator'
    }
  });

}(Prism));

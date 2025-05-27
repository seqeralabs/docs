(function (Prism) {
  Prism.languages.nextflow = Prism.languages.extend('groovy', {
    'keyword': /\b(?:as|assert|boolean|byte|catch|char|def|double|else|enum|float|if|in|instanceof|int|long|new|return|short|throw|try|void|process|workflow|input|output|exec|shell|script|stub|include|from)\b/,
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

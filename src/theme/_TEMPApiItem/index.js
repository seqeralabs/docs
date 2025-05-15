import React from 'react';
import ApiItem from '@theme-original/ApiItem';

export default function ApiItemWrapper(props) {
  return (
    <>
      <ApiItem {...props} />
    </>
  );
}

const blockedLangs = ['objectivec', 'ocaml', 'csharp', 'dart', 'kotlin', 'c', 'php', 'swift'];

const cleanExamples = props.examples.filter(ex => 
  !blockedLangs.includes(ex.lang.toLowerCase())
);

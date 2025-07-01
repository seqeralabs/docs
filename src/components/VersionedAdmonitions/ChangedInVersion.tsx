import React from "react";
import VersionedAdmonition from "./VersionedAdmonition";

interface Props {
  tool?: "nextflow";
  version?: string;
  children: React.ReactNode;
}

const ChangedInVersion: React.FC<Props> = ({ tool = "nextflow", version, children }) => (
  <VersionedAdmonition type="warning" tool={tool} version={version} titlePrefix="Changed in version">
    {children}
  </VersionedAdmonition>
);

export default ChangedInVersion; 
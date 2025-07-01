import React from "react";
import VersionedAdmonition from "./VersionedAdmonition";

interface Props {
  tool?: "nextflow";
  version?: string;
  children: React.ReactNode;
}

const DeprecatedInVersion: React.FC<Props> = ({ tool = "nextflow", version, children }) => (
  <VersionedAdmonition type="danger" tool={tool} version={version} titlePrefix="Deprecated in version">
    {children}
  </VersionedAdmonition>
);

export default DeprecatedInVersion; 
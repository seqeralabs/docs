import React from "react";
import VersionedAdmonition from "./VersionedAdmonition";

interface Props {
  tool?: "nextflow";
  version?: string;
  children: React.ReactNode;
}

const AddedInVersion: React.FC<Props> = ({ tool = "nextflow", version, children }) => (
  <VersionedAdmonition type="info" tool={tool} version={version} titlePrefix="Added in version">
    {children}
  </VersionedAdmonition>
);

export default AddedInVersion; 
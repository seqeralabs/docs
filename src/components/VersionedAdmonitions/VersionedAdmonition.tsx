import React, { ReactNode } from "react";
import Admonition from "@theme/Admonition";
import { getDisplayVersion } from "../../constants/getStableVersion";

interface VersionedAdmonitionProps {
  type?: "info" | "warning" | "danger" | "success";
  tool?: "nextflow";
  version?: string;
  titlePrefix: string; // e.g. "Added in version"
  children: ReactNode;
}

const VersionedAdmonition: React.FC<VersionedAdmonitionProps> = ({
  type = "info",
  tool = "nextflow",
  version,
  titlePrefix,
  children,
  ...props
}) => {
  const displayVersion = getDisplayVersion(tool, version);
  const displayTitle = `${titlePrefix} ${displayVersion}`;

  return (
    <Admonition type={type} title={displayTitle} {...props}>
      {children}
    </Admonition>
  );
};

export default VersionedAdmonition; 
import React from "react";
import { Redirect } from "react-router-dom";

export default function Platform(): JSX.Element {
  return (
    <Redirect
      to={`/platform-api/seqera-api`}
    />
  );
}
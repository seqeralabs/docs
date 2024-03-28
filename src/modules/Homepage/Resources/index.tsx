import React from "react";

import Nextflow from "./Nextflow";
import Platform from "./Platform";
import Training from "./Training";
import ExternalGuides from "./ExternalGuides";

const Resources = () => {
  return (
    <div className="flex flex-wrap -m-8 p-8">
      <div className="w-full md:w-1/2 md:p-4 lg:p-8 mt-4 md:mt-0">
        <Nextflow />
      </div>
      <div className="w-full md:w-1/2 md:p-4 lg:p-8 mt-10 md:mt-0">
        <Platform />
      </div>
      <div className="w-full md:w-1/2 md:p-4 lg:p-8 mt-10 md:mt-0">
        <h3 className="mb-6">Training and workshop material</h3>
        <Training />
      </div>
      <div className="w-full md:w-1/2 md:p-4 lg:p-8 mt-10 md:mt-0">
        <ExternalGuides />
      </div>
    </div>
  );
};

export default Resources;

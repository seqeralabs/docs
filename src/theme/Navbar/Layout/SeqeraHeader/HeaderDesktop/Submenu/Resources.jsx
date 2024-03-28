import React from "react";

import Panels from "./Panels";
import EventPanel from "./Panels/EventPanel";

import { links } from "../../links";

const Resources = ({ isOpen }) => {
  return (
    <Panels isOpen={isOpen}>
      <Panels.Panel
        title="Learn"
        subtitle="Learn how to use Nextflow and the Seqera Platform."
        links={{
          Documentation: links.docs["Seqera platform"],
          ["nf-core"]: "https://nf-co.re/",
        }}
      />
      <Panels.Panel
        title="Stay current"
        subtitle="Keep up to date with the latest news and announcements."
        links={{
          Blog: "https://seqera.io/blog/",
          Podcast: "https://seqera.io/podcasts/",
          Whitepapers: "https://seqera.io/whitepapers/",
        }}
      />
      <Panels.Panel
        title="Industry"
        subtitle="Learn how Nextflow and the Seqera Platform are being used in your industry."
        links={{
          "Case studies": "https://seqera.io/case-studies/",
          eBooks: "https://seqera.io/ebooks/",
        }}
      />
      <Panels.Panel
        title="Support"
        subtitle="Get in touch with our team."
        links={{
          "Get in touch": "https://seqera.io/contact-us/",
          "Support Hub": links.resources.Support,
        }}
      />
      <EventPanel />
    </Panels>
  );
};

export default Resources;

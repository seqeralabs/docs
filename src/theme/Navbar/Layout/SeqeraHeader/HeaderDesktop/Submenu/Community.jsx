import React from "react";

import Panels from "./Panels";
import EventPanel from "./Panels/EventPanel";

import { links } from "../../links";

const Community = ({ isOpen }) => {
  return (
    <Panels isOpen={isOpen}>
      <Panels.Panel
        title="Community"
        subtitle="Join the community of developers, data scientists, and researchers building the next generation of data pipelines."
        links={{
          Forums: links.community["Forums"],
          "Feedback Forum": "https://seqera.io/feedback/",
        }}
      />
      <Panels.Panel
        title="Events"
        subtitle="Join us at one of our upcoming events."
        links={{
          "Webinars & Talks": "https://seqera.io/events/webinars-and-talks/",
          Conferences: "https://seqera.io/events/conferences/",
          "Seqera Events": "https://seqera.io/events/seqera/",
        }}
      />
      <Panels.Panel
        title="Partners & Platforms"
        subtitle="Learn more about our partners and platforms."
        links={{
          AWS: "https://seqera.io/amazon-web-services/",
          "Microsoft Azure": "https://seqera.io/microsoft-azure/",
          "Google Cloud": "https://seqera.io/google-cloud/",
          "Additional partners": "https://seqera.io/partners-and-platforms/",
        }}
      />
      <EventPanel large />
    </Panels>
  );
};

export default Community;

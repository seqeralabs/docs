import React from "react";
import useGlobalData from "@docusaurus/useGlobalData";
import clsx from "clsx";

import Link from "../../_shared/Link";
import Panels from "./Panels";
import { links } from "../../links";

import styles from "./styles.module.css";

const Company = ({ isOpen }) => {
  const globalData = useGlobalData();
  let jobs = globalData["seqera-jobs"]?.default || [];
  jobs = jobs.slice(0, 6);
  const jobLinks = {};
  for (const job of jobs) {
    jobLinks[job.title] = `https://seqera.io/careers/${job.id}`;
  }
  return (
    <Panels isOpen={isOpen}>
      <Panels.Panel
        title="Company"
        subtitle="Learn more about Seqera."
        links={{
          "About us": "https://seqera.io/about/",
          "Press Center": links.company["Press Center"],
        }}
      />
      <Panels.Panel
        large
        title="Careers"
        subtitle="We're on the hunt for leaders, makers, and creators looking for their next challenge."
        externalLinks
        links={jobLinks || {}}
        footer={
          <>
            <Link
              to={links.company.Careers}
              className={clsx(styles.button, styles.cta)}
            >
              See all open roles
            </Link>
          </>
        }
      />
      <Panels.Panel
        title="Stay Current"
        subtitle="Keep up to date with the latest news and announcements."
        links={{
          Blog: "https://seqera.io/blog/",
          Podcast: "https://seqera.io/podcasts/",
          Whitepapers: "https://seqera.io/whitepapers/",
        }}
      />
    </Panels>
  );
};

export default Company;

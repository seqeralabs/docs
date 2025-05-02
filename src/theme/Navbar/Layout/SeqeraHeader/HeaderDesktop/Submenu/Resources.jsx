import React from "react";
import clsx from "clsx";
import Link from "./shared/Link";
import styles from "./submenu.module.css";


import {
  About,
  Blog,
  Careers,
  CaseStudies,
  Contact,
  Core,
  Docs,
  Events,
  Feedback,
  Forum,
  Partners,
  Podcast,
  Press,
  Support,
  Whitepapers,
} from "./shared/icons";

const links = {
  Help: [
    ["Forum", "https://community.seqera.io", Forum],
    ["Support Portal", "https://support.seqera.io", Support],
    ["Nextflow Slack", "https://seqera.io/blog/nextflow-is-moving-to-slack/", Forum],
    ["Seqera AI", "/ask-ai", Forum],
  ],
  // Resources: [
  //   ["Podcast", "/podcasts/", Podcast],
  //   ["Blog", "/blog/", Blog],
  // ],
  Company: [
    ["Seqera.io", "/about/", About],
    ["Contact us", "/contact-us/", Contact],
    ["Submit Feedback", "/feedback/", Feedback],
  ],
};

function isActive(id) {
  if (typeof window === "undefined") return false;
  return window.location.pathname === id;
}

const LinkItem = ({ to, children }) => {
  let href = to;
  let sameTab = false;
  if (!to.startsWith("http")) {
    href = `https://seqera.io${to}`;
  }
  if (href.includes("seqera.io")) sameTab = true;
  return (
    <Link
      sameTab={sameTab}
      to={href}
     className={clsx(styles.submenuLink,
        "flex items-center text-[14px] px-2 rounded-md",
        "transition-all duration-500 ease-in-out hover:no-underline",
        "h-[37px]",
        { "bg-brand-200": isActive(href) },
      )}
    >
      {children}
    </Link>
  );
};

const Column = ({ title, links }) => {
  return (
    <div className="flex flex-col items-start min-w-[200px]">
      <h3 className="text-[.8rem] font-display font-semibold mt-[2px] mb-[2px]">
        {title}
      </h3>
      <ul className="mt-2 -mx-2 p-0 list-none mb-0">
        {links.map(([label, href, Icon]) => (
          <li key={label}>
            <LinkItem to={href}>
              <div className={clsx(styles.iconItem)}><Icon className="" /></div>
              {label}
            </LinkItem>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Resources = () => {
  return (
    <div className="flex p-2 pl-4">
      <div className="flex-auto flex">
        {Object.entries(links).map(([title, links]) => (
          <Column key={title} title={title} links={links} />
        ))}
      </div>
    </div>
  );
};

export default Resources;

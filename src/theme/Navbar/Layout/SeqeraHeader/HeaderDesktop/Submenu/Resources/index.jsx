import React from "react"
import clsx from "clsx"

import Link from "../shared/Link"
import EventPanel from "../shared/EventPanel"

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
} from "../shared/icons"

const links = {
  Education: [
    ["Documentation", "http://docs.seqera.io/", Docs],
    ["Podcast", "/podcasts/", Podcast],
    ["Blog", "/blog/", Blog],
  ],
  Community: [
    ["Forum", "https://community.seqera.io", Forum],
    ["nf-core", "https://nf-co.re/", Core],
    ["Events", "/events/", Events],
    ["Feedback", "/feedback/", Feedback],
  ],
  Resources: [
    ["Partners", "/partners-and-platforms/", Partners],
    ["Case studies", "/case-studies/", CaseStudies],
    ["Support", "https://support.seqera.io", Support],
    ["Whitepapers", "/whitepapers/", Whitepapers],
  ],
  Company: [
    ["About us", "/about/", About],
    ["Careers", "/careers/", Careers],
    ["Press", "/news/", Press],
    ["Contact us", "/contact-us/", Contact],
  ],
}

function isActive(id) {
  if (typeof window === "undefined") return false
  return window.location.pathname === id
}

const Column = ({ title, links }) => {
  return (
    <div className="flex flex-col items-start w-[25%]">
      <h3 className="text-[12px] font-display text-brand-700 font-semibold">
        {title}
      </h3>
      <ul className="mt-2 -mx-2">
        {links.map(([label, href, Icon]) => (
          <li key={label}>
            <Link
              to={href}
              className={clsx(
                "flex items-center text-[14px] py-2 px-3 rounded-lg",
                "transition-all duration-500 ease-in-out hover:bg-brand-200",
                { "bg-brand-200": isActive(href) }
              )}
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

const Resources = () => {
  return (
    <div className="flex p-2 pl-4">
      <div className="flex-auto flex">
        {Object.entries(links).map(([title, links]) => (
          <Column key={title} title={title} links={links} />
        ))}
      </div>
      <div className="w-[32%]">
        <EventPanel />
      </div>
    </div>
  )
}

export default Resources

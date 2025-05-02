import React, { type ReactNode } from "react";
import clsx from "clsx";
import type { Props } from "@theme/Footer/Layout";
import styles from "./footer.module.css";

// todo: clean up files and dark mode

export default function FooterLayout({
  style,
  links,
  logo,
  copyright,
}: Props): ReactNode {
  const currentYear = new Date().getFullYear();
  return (

    <footer className={clsx( styles.footer )}>
      <div className="px-4">
        <div className="flex flex-wrap w-full">
          <div className="w-full flex flex-col-reverse md:flex-row md:justify-between md:items-center mb-1 md:mb-3">
            <ul
              className={`${styles.footerLinks} flex flex-col md:flex-row flex-wrap mt-6 md:mt-0 md:items-center`}
            >
              <li>
                <a href="https://github.com/seqeralabs/docs">Contribute</a>
              </li>
              <li>
                <a href="https://support.seqera.io">Support Portal</a>
              </li>
              <li>
                <a href="https://community.seqera.io">Forum</a>
              </li>
              <li>
                <a href="https://seqera.io/blog">Blog</a>
              </li>
              <li>
                <a href="https://seqera.io/podcasts">Podcast</a>
              </li>
              <li>
                <a href="https://seqera.io/contact-us">Contact Us</a>
              </li>
              <li>
                <a href="https://seqera.io">Seqera.io</a>
              </li>
            </ul>
            <div className="mb-3 md:mb-0">
            {logo && <div className="">{logo}</div>}
            </div>
          </div>
        </div>
        <div className={styles.copyright}>
          <ul className="flex flex-col-reverse md:flex-row md:w-full justify-start md:justify-between py-2">
            <li>© {currentYear} Seqera. All Rights Reserved.</li>
            <div className="mb-4 sm:mb-0">
              <li>
                <a href="https://seqera.io/legal/">User agreement</a>
              </li>
              <li>
                <a href="https://seqera.io/privacy-policy/">
                  Privacy Statement
                </a>
              </li>
            </div>
          </ul>
        </div>
      </div>
    </footer>
  );
}

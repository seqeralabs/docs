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
    // <footer
    //   className={clsx('footer', {
    //     'footer--dark': style === 'light',
    //   })}>
    //   {/* <div className="container container-fluid">
    //     {links}
    //     {(logo || copyright) && (
    //       <div className="footer__bottom text--center">
    //         {logo && <div className="margin-bottom--sm">{logo}</div>}
    //         {copyright}
    //       </div>
    //     )}
    //   </div> */}
    // </footer>

    <footer
      className={clsx(
        "footer",
        { "footer--dark": style === "light" },
        styles.footer,
      )}
    >
      <div className=" px-4">
        <div className={clsx("flex flex-row md:justify-end", styles.topBar)}>
          {/* <Logo /> */}
          {/* {logo && <div className="">{logo}</div>} */}
          {/* <div className="flex flex-row space-x-8">
            <>
              <a
                className={clsx(styles.button, {})}
                href="https://cloud.seqera.io/login"
              >
                Log In
              </a>

              <a
                className={clsx(styles.button, styles.secondary, {}, "ml-3")}
                href="https://cloud.seqera.io/login"
              >
                <span className="hidden md:inline">Sign Up</span>
              </a>
            </>
          </div> */}
        </div>
        <div className="flex flex-wrap mt-8 mb-8 w-full">
          <div className="w-full flex flex-col-reverse md:flex-row md:justify-between md:items-center">
            <ul
              className={`${styles.footerLinks} flex flex-col md:flex-row flex-wrap mt-6 md:mt-0`}
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
            <div>
            {logo && <div className="">{logo}</div>}
            </div>
          </div>
        </div>
        <div className={styles.copyright}>
          <ul className="flex flex-col-reverse md:flex-row md:w-full justify-start md:justify-between">
            <li>© {currentYear} Seqera. All Rights Reserved.</li>
            <div className="mb-4">
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

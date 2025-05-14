import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useThemeConfig, type NavbarLogo} from '@docusaurus/theme-common';
import ThemedImage from '@theme/ThemedImage';
import type {Props} from '@theme/Logo';
import { useLocation } from 'react-router-dom';

function LogoThemedImage({
  logo,
  alt,
  imageClassName,
}: {
  logo: NavbarLogo;
  alt: string;
  imageClassName?: string;
}) {
  const sources = {
    light: useBaseUrl(logo.src),
    dark: useBaseUrl(logo.srcDark || logo.src),
  };
  const themedImage = (
    <ThemedImage
      className={logo.className}
      sources={sources}
      height={logo.height}
      width={logo.width}
      alt={alt}
      style={logo.style}
    />
  );

  // Is this extra div really necessary?
  // introduced in https://github.com/facebook/docusaurus/pull/5666
  return imageClassName ? (
    <div className={imageClassName}>{themedImage}</div>
  ) : (
    themedImage
  );
}

export default function Logo(props: Props): ReactNode {
  const {
    siteConfig: {title},
  } = useDocusaurusContext();
  const {
    navbar: {title: navbarTitle, logo},
  } = useThemeConfig();

  const {imageClassName, titleClassName, ...propsRest} = props;
  const logoLink = useBaseUrl(logo?.href || '/');

  // If visible title is shown, fallback alt text should be
  // an empty string to mark the logo as decorative.
  const fallbackAlt = navbarTitle ? '' : title;

  // Use logo alt text if provided (including empty string),
  // and provide a sensible fallback otherwise.
  const alt = logo?.alt ?? fallbackAlt;

    // Note: This workaround was added to resolve pages from 404ing when navigating away from platform-api paths, due to separate build implementation. 
    // TODO: Revert this workaround once we have docs in a single build
    const location = useLocation();
    const isOnPlatformAPI = location.pathname.includes('/platform-api');

  return (
    <>
      {/* TODO: Revert this workaround once we have docs in a single build*/}
    {isOnPlatformAPI ? (
    <a href="https://docs.seqera.io">
      {logo && (
        <LogoThemedImage
          logo={logo}
          alt={alt}
          imageClassName={imageClassName}
        />
      )}
      {navbarTitle != null && <b className={titleClassName}>{navbarTitle}</b>}
    </a>
      ) : (
        <Link
        to={logoLink}
        {...propsRest}
        {...(logo?.target && {target: logo.target})}>
        {logo && (
          <LogoThemedImage
            logo={logo}
            alt={alt}
            imageClassName={imageClassName}
          />
        )}
        {navbarTitle != null && <b className={titleClassName}>{navbarTitle}</b>}
      </Link>
      )}
    </>
  );
}

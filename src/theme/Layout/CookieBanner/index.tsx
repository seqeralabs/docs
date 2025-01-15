import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { useCookies } from "react-cookie";
import Button from "@site/src/components/Button";
import Cookie from "./Cookie";
import styles from "./styles.module.css";

const CookieBanner = () => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "preferencesSet",
    "preferencesChoice",
  ]);
  const [isHidden, setIsHidden] = useState(true);

  const giveConsent = () => {
    window.gtag?.("consent", "update", {
      ad_user_data: "granted",
      ad_personalization: "granted",
      ad_storage: "granted",
      analytics_storage: "granted",
    });
    window.posthog?.opt_in_capturing();
  };

  const acceptAll = () => {
    const twelveMonths = 1000 * 60 * 60 * 24 * 30 * 12;
    const expireTime = new Date().getTime() + twelveMonths;
    const expireDate = new Date(expireTime);

    setCookie("preferencesSet", true, { expires: expireDate });
    setCookie("preferencesChoice", "all", { expires: expireDate });
    giveConsent();
  };

  const denyAll = () => {
    setCookie("preferencesSet", true);
    setCookie("preferencesChoice", "essential");
  };

  useEffect(() => {
    const isBrowser = typeof window !== "undefined";
    if (!isBrowser) return;

    const preferenceSet = cookies.preferencesSet;
    const preferredChoice = cookies.preferencesChoice;

    if (preferenceSet && preferredChoice === "all") {
      giveConsent();
    }

    setTimeout(() => {
      if (!preferenceSet) {
        setIsHidden(false);
        return;
      }
    }, 50);
  }, [cookies]);

  if (isHidden) return null;

  return (
    <div
      className={clsx(
        styles.banner,
        "bg-brand fixed bottom-0 w-full lg:left-1/2 lg:transform lg:-translate-x-[50%] lg:w-[70%] z-[2147483648] p-4 lg:rounded-md lg:mb-6",
        {
          hidden: cookies.preferencesSet !== undefined,
        },
      )}
    >
      <div className="container-lg">
        <div className="flex text-white items-center justify-between flex-wrap -my-2">
          <div className="flex items-center py-2 md:pr-4">
            <div className="mr-4 hidden sm:block">
              <Cookie className="h-8 w-8" />
            </div>
            <div className="flex-auto typo-small">
              This website uses cookies to offer you a better browsing
              experience. <br className="hidden md:block" />
              Find out more on{" "}
              <a
                href="/privacy-policy/#cookies"
                className="text-[var(--sl-blue)]"
              >
                how we use cookies
              </a>
              .
            </div>
          </div>
          <div className="py-2">
            <div className="flex flex-wrap -mx-2 -my-1">
              <div className="px-2 py-1">
                <Button white2 small onClick={denyAll}>
                  Essential only
                </Button>
              </div>
              <div className="px-2 py-1">
                <Button blue small onClick={acceptAll}>
                  Accept all cookies
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;

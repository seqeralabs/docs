import React from "react";
import clsx from "clsx";

import Arrow from "./Arrow";
import styles from "./styles.module.css";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  to?: string;
  className?: string;
  sameTab?: boolean;
  small?: boolean;
  medium?: boolean;
  alt?: boolean;
  wide?: boolean;
  wider?: boolean;
  large?: boolean;
  white?: boolean;
  white2?: boolean;
  brand?: boolean;
  brand2?: boolean;
  blue?: boolean;
  blue2?: boolean;
  secondary?: boolean;
  secondaryWhite?: boolean;
  arrow?: boolean;
  disabled?: boolean;
} & React.HTMLAttributes<HTMLButtonElement>;

const Button: React.FC<Props> = ({
  children,
  onClick,
  href,
  to,
  className,
  sameTab,
  disabled,
  ...attributes
}) => {
  const cn = clsx(styles.button, className, {
    [styles.small]: attributes.small,
    [styles.medium]: attributes.medium,
    [styles.alt]: attributes.alt,
    [styles.wide]: attributes.wide,
    [styles.wider]: attributes.wider,
    [styles.large]: attributes.large,
    [styles.white]: attributes.white,
    [styles.white2]: attributes.white2,
    [styles.brand]: attributes.brand,
    [styles.brand2]: attributes.brand2,
    [styles.blue]: attributes.blue,
    [styles.blue2]: attributes.blue2,
    [styles.secondary]: attributes.secondary,
    [styles.secondaryWhite]: attributes.secondaryWhite,
    [styles.disabled]: disabled,
  });

  const content = [children];
  if (attributes.arrow) {
    content.push(<Arrow key="arrow" className={styles.arrow} />);
  }

  const url = to || href;

  if (url) {
    let isOutLink = url.startsWith("http");
    if (sameTab) isOutLink = false;
    if (sameTab === false) isOutLink = true;
    return (
      <a
        href={url}
        onClick={onClick}
        className={cn}
        target={isOutLink ? "_blank" : undefined}
        rel={isOutLink ? "noreferrer" : undefined}
        aria-disabled={disabled}
      >
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={cn} disabled={disabled}>
      {content}
    </button>
  );
};

export default Button;

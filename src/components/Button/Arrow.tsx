import * as React from "react";
const SvgArrowinline = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={6}
    height={10}
    viewBox="0 0 6 10"
    fill="none"
    {...props}
  >
    <g clipPath="url(#arrow_inline_svg__a)">
      <path
        fill="currentColor"
        d="M4.633 4.995.308.652.813.147l4.83 4.848-4.83 4.83-.505-.505z"
      />
    </g>
    <defs>
      <clipPath id="arrow_inline_svg__a">
        <path fill="#fff" d="M0 0h5.909v10H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgArrowinline;

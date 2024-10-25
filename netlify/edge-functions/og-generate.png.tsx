import React from "https://esm.sh/react@18.2.0";
import { ImageResponse } from "https://deno.land/x/og_edge/mod.ts";

// const baseUrl = "https://seqera.io";
// const baseUrl = "http://localhost:8888";
const baseUrl = "https://deploy-preview-264--seqera-docs.netlify.app";

const InterFont = fetch(`${baseUrl}/fonts/inter/Inter-Regular.ttf`).then(
  (res) => res.arrayBuffer(),
);

const DegularFont = fetch(`${baseUrl}/fonts/degular/Degular-Bold.woff`).then(
  (res) => res.arrayBuffer(),
);

const DegularFontLight = fetch(
  `${baseUrl}/fonts/degular/Degular-Regular.woff`,
).then((res) => res.arrayBuffer());

export default async function handler(request: Request) {
  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);
  const defaultTitle = "Documentation";
  const defaultSubTitle = "Learn Seqera, Nextflow, Wave, MultiQC, and Fusion";

  const preTitle = params.get("preTitle");
  const title = params.get("title") || defaultTitle;
  const subTitle = params.get("subTitle") || defaultSubTitle;
  let fontSize = 60;

  // Accomodate for long titles
  if (title.length > 70) fontSize = 50;
  if (title.length > 80) fontSize = 40;

  const bgImg = `${baseUrl}/img/og/bg-default.jpg`;
  const logoImg = `${baseUrl}/img/og/logo.png`;
  const iconImg = `${baseUrl}/img/og/icon-paper.png`;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-around",
          fontSize: "32px",
          color: "#F8F9FA",
          backgroundColor: "#212528",
          backgroundImage: `url(${bgImg})`,
          backgroundSize: "1200px 630px",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: "40rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src={logoImg} style={{ width: 200, marginRight: 30 }} />
              <span
                style={{
                  fontSize: 35,
                  lineHeight: 1,
                  marginBottom: "-1px",
                  opacity: 0.8,
                }}
              >
                DOCS
              </span>
            </div>
            {!!preTitle && (
              <div
                style={{
                  marginTop: "3rem",
                  fontWeight: 200,
                  fontStyle: "normal",
                  fontFamily: "Degular",
                  fontSize: "40px",
                  lineHeight: "40px",
                  color: "#FFFFFF",
                }}
              >
                {preTitle}
              </div>
            )}
            <h1
              style={{
                fontSize: fontSize + "px",
                fontWeight: 200,
                fontFamily: "Degular",
                lineHeight: fontSize + "px",
              }}
            >
              {title}
            </h1>
            {!subTitle ? null : (
              <div
                style={{
                  marginTop: "1rem",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontFamily: "Inter",
                  fontSize: "28px",
                  lineHeight: "38px",
                }}
              >
                {subTitle}
              </div>
            )}
          </div>
          {!!iconImg && (
            <img
              src={iconImg}
              style={{
                width: "350px",
                height: "350px",
              }}
            />
          )}
        </div>
      </div>
    ),
    {
      fonts: [
        { name: "Inter", data: await InterFont, style: "normal", weight: 400 },
        {
          name: "Degular",
          data: await DegularFont,
          style: "normal",
          weight: 400,
        },
        {
          name: "Degular",
          data: await DegularFontLight,
          style: "normal",
          weight: 200,
        },
      ],
    },
  );
}

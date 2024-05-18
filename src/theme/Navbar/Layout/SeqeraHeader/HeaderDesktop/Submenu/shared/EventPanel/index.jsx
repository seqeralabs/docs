import React from "react";
import useGlobalData from "@docusaurus/useGlobalData";

import Panel from "../Panel";

import styles from "./styles.module.css";

const EventPanel = ({ large }) => {
  const globalData = useGlobalData();
  let events = globalData["seqera-events"]?.default || [];
  const event = events[0];
  if (!event) return null;
  let excerpt = event.description;
  if (!large)
    excerpt = event.description.split(" ").slice(0, 32).join(" ") + "...";
  return (
    <Panel large={large} highlighted className={styles.eventPanel}>
      <h3>{event.title}</h3>
      <div className={styles.date}>{event.date}</div>
      <div className={styles.description}>{excerpt}</div>
      <a
        href={`https://seqera.io/events/${event.slug.current}`}
        className={styles.button}
      >
        Learn more
      </a>
    </Panel>
  );
};

export default EventPanel;

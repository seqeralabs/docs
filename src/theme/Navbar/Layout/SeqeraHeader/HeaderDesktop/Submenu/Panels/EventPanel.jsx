import React from "react";
import useGlobalData from "@docusaurus/useGlobalData";

import Panels from ".";
import Button from "../../../../../../../components/Button";

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
    <Panels.Panel large={large} highlighted className={styles.eventPanel}>
      <h3>{event.title}</h3>
      <div className={styles.date}>{event.date}</div>
      <div className={styles.description}>{excerpt}</div>
      <Button
        to={`https://seqera.io/events/${event.slug.current}`}
        className={styles.button}
      >
        Learn more
      </Button>
    </Panels.Panel>
  );
};

export default EventPanel;

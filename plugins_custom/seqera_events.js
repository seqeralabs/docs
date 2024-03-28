async function fetchEvents() {
  try {
    const response = await fetch("https://seqera.io/events.json");
    const events = await response.json();
    if (!events?.length) return [];
    return events;
  } catch (error) {
    console.error("Error fetching events", error);
    return [];
  }
}

export default function () {
  return {
    name: "seqera-events",
    async loadContent() {
      return await fetchEvents();
    },
    async contentLoaded({ content, actions }) {
      const { setGlobalData } = actions;
      setGlobalData(content);
    },
  };
}

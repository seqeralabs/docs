async function fetchJobs() {
  try {
    const response = await fetch("https://seqera.io/jobs.json");
    const jobs = await response.json();
    if (!jobs?.length) return [];
    return jobs;
  } catch (error) {
    console.error("Error fetching jobs", error);
    return [];
  }
}

export default function () {
  return {
    name: "seqera-jobs",
    async loadContent() {
      return await fetchJobs();
    },
    async contentLoaded({ content, actions }) {
      const { setGlobalData } = actions;
      setGlobalData(content);
    },
  };
}

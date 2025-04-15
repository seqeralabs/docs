async function fetchJobs() {
  try {
    const response = await fetch("https://seqera.io/jobs.json");
    
    // Check if the response is ok (status in the range 200-299)
    if (!response.ok) {
      console.warn(`Failed to fetch jobs: ${response.status} ${response.statusText}`);
      return [];
    }
    
    // Check content type to ensure we're getting JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.warn(`Expected JSON response but got ${contentType}`);
      return [];
    }
    
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

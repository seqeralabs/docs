import React, { useState, useEffect } from "react";

type Module = {
    id: string;
    data: {
        name: string;
        summary: string;
    };
};

const MultiqcModules = ({ modules }: { modules: Module[] }) => {
    // Add state for the filter value
    const [filterValue, setFilterValue] = useState("");

    // Update URL when filter changes
    useEffect(() => {
        window.history.replaceState(null, null, "/multiqc/modules/" + (filterValue === "" ? "" : "?filter=" + filterValue));
    }, [filterValue]);

    // Set initial filter value from URL on component mount
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has("filter")) {
            setFilterValue(urlParams.get("filter") || "");
        }
    }, []);

    // Filter modules based on search input
    const filteredModules = modules.filter((module) => {
        const regex = new RegExp(filterValue, "i");
        return regex.test(module.data.name) || regex.test(module.data.summary);
    });

    // Handle clear filter
    const handleClearFilter = (e: React.MouseEvent) => {
        e.preventDefault();
        setFilterValue("");
    };

    return (
        <>
            <form method="get">
                <label htmlFor="filter" className="text-gray-500 dark:text-gray-300 md:ml-2">Search for a tool:</label>
                <div className="relative inline-block w-full whitespace-nowrap sm:w-96">
                    <input
                        id="filter"
                        name="filter"
                        type="text"
                        value={filterValue}
                        onChange={(e) => setFilterValue(e.target.value)}
                        className="my-3 inline-block w-full rounded-lg border border-solid border-gray-500 bg-black/5 p-2 pr-10  focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-black/20 sm:mx-3"
                        placeholder="Tool name, description or keyword"
                    />
                    {filterValue && (
                        <button
                            onClick={handleClearFilter}
                            id="clear_filter"
                            className="absolute -right-4 top-4 bg-transparent border-0 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                            aria-label="Clear search"
                        >
                            <svg className="h-6 w-6" viewBox="0 0 22 22" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </button>
                    )}
                </div>
                <div className="flex flex-col">
                    <div className="grid-cols-4 lg:grid">
                        <div className="typo-intro bg-gray-200 px-4 py-2 dark:bg-zinc-700 lg:hidden">Tool</div>
                        <div className="typo-intro hidden bg-gray-200 px-4 py-2 dark:bg-zinc-700 lg:block">
                        Tool Name
                        </div>
                        <div className="typo-intro col-span-3 hidden bg-gray-200 px-4 py-2 dark:bg-zinc-700 lg:block">
                        Description
                        </div>
                    </div>
                    {filteredModules.map((module: Module) => (
                        <div className="module-row grid-cols-4 lg:grid">
                            <a
                                href={"/multiqc/modules/" + module.id.split("/").pop().replace(".md", "")}
                                className=" hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer hover:no-underline"
                            >
                                <div className="flex items-start border-gray-200 px-4 pb-0 pt-2 dark:border-gray-700 lg:border-b lg:pb-2 hover:underline">
                                    <span className="typo-body text-blue-600 dark:text-blue-400 ">
                                        {module.data.name}
                                    </span>
                                </div>
                            </a>
                            <div className="col-span-3 flex items-start border-b border-gray-200 px-4 pb-3 text-gray-800 dark:border-gray-700 dark:text-gray-300 lg:py-2">
                                {module.data.summary}
                            </div>
                        </div>
                    ))}
                </div>
            </form>
        </>
    );
};

export default MultiqcModules;

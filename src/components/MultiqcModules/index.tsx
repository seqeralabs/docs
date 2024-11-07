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
                        className="peer my-3 inline-block w-full rounded-sm border-gray-300 bg-black/5 p-3 shadow-sm outline-0 focus:border-blue-500/20 focus:ring focus:ring-blue-500/20 focus:ring-opacity-50 dark:bg-black/20 sm:mx-3"
                        placeholder="Tool name, description or keyword"
                    />
                    <button
                        onClick={handleClearFilter}
                        id="clear_filter"
                        className="absolute right-0 top-6 inline-block h-6 w-6 p-0.5 opacity-0 peer-focus:opacity-100 peer-active:opacity-100"
                    >
                        x
                    </button>
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
                        <div className="flex items-center border-gray-200 px-4 pb-0 pt-2 dark:border-gray-700 lg:border-b lg:pb-2">
                            <a
                            href={"/multiqc/modules/" + module.id.split("/").pop().replace(".md", "")}
                            className="typo-body text-blue-600 dark:text-blue-400"
                            >
                            {module.data.name}
                            </a>
                        </div>
                        <div className="col-span-3 flex items-center border-b border-gray-200 px-4 pb-3 text-gray-600 dark:border-gray-700 dark:text-gray-300 lg:py-2">
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

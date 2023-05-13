import { supabase } from "@/lib/database/supabase";
import { useEffect, useState } from "react";
import type { SuperInvestmentRow } from "@/lib/types";
import { formatCurrency, mapToCamelCase } from "@/lib/utils";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { aggregatedSuperFundHoldingsDataTableHeadings } from "@/lib/consts";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { deleteAllDataFromSingleTable } from "@/lib/utils/customSupabaseFunction";

export default function DataPage() {
  const [data, setData] = useState<SuperInvestmentRow[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [sortColumn, setSortColumn] = useState("");
  const [searchOptions, setSearchOptions] = useState<string>(
    aggregatedSuperFundHoldingsDataTableHeadings[0]
  );

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const fetchData = async () => {
    let query = supabase
      .from("data")
      .select("*")
      .filter(`${mapToCamelCase(searchOptions)}`, "ilike", `%${searchInput}%`)
      .range(0, 15);

    if (sortOrder && sortColumn) {
      query = query.order(sortColumn, { ascending: sortOrder === "asc" });
    }

    let { data: data, error } = await query;

    if (error) console.log("error", error);
    else {
      setData(data as SuperInvestmentRow[]);
      setLoaded(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchInput, sortOrder, sortColumn]);

  const handleSortClick = (column: string) => {
    if (sortColumn === column) {
      setSortOrder((prevSortOrder) => {
        if (prevSortOrder === "asc") return "desc";
        if (prevSortOrder === "desc") return null;
        return "asc"; // if prevSortOrder is null, return "asc"
      });
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const onDeleteAllClick = async () => {
    deleteAllDataFromSingleTable("data");
    fetchData();
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchOptions(event.target.value);
  };

  return (
    <>
      <div className="flex">
        <div className="relative mt-2 flex items-center grow">
          <input
            type="text"
            name="search"
            id="search"
            value={searchInput}
            onChange={handleSearchInput}
            className="block w-full rounded-md border-0 py-1.5 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
          <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
            <kbd className="inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-gray-400">
              ⌘K
            </kbd>
          </div>
        </div>
        <div>
          <select name="option" onChange={handleSelectChange}>
            {aggregatedSuperFundHoldingsDataTableHeadings.map(
              (heading, idx) => (
                <option key={idx}>{heading}</option>
              )
            )}
          </select>
        </div>
      </div>

      <button
        className="p-2 bg-red-500 text-white rounded-md m-8"
        onClick={onDeleteAllClick}
      >
        Delete All
      </button>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Data
            </h1>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      {aggregatedSuperFundHoldingsDataTableHeadings.map(
                        (heading, idx) => (
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                            key={idx}
                          >
                            {heading}
                            <button
                              name="sort-table"
                              className="m-1"
                              onClick={() =>
                                handleSortClick(mapToCamelCase(heading) || "")
                              }
                            >
                              {sortOrder === "asc" ? (
                                <ChevronDownIcon className="w-4 h-4 bg-gray-500 text-white rounded-md" />
                              ) : sortOrder === "desc" ? (
                                <ChevronUpIcon className="w-4 h-4 bg-gray-500 text-white rounded-md" />
                              ) : sortOrder === null ? (
                                <ChevronDownIcon className="w-4 h-4" />
                              ) : null}
                            </button>
                          </th>
                        )
                      )}
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                      >
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {loaded ? (
                      <>
                        {data?.map((row, idx) => (
                          <tr key={idx}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                              {row.investmentOptionName}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {row.assetClass}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {row.assetName}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {row.assetIdentifier}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {formatCurrency(row.dollarValue, row.currency)}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {row.currency}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {row.gicsSectorCodeAndName}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {row.gicsIndustryGroupCodeAndName}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {row.gicsIndustryCodeAndName}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {row.gicsSubIndustryCodeAndName}
                            </td>

                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <a
                                href="#"
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                Edit
                                <span className="sr-only">
                                  , {row.investmentOptionName}
                                </span>
                              </a>
                            </td>
                          </tr>
                        ))}
                      </>
                    ) : (
                      <></>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

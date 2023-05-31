import { supabase } from "@/lib/database/supabase";
import { useEffect, useState } from "react";
import {
  formatCurrency,
  toCamelCaseArray,
  toSnakeCaseArray,
} from "@/lib/utils";
import {
  aggregatedSuperFundHoldingsDataTableHeadings,
  dataStructHeadingsCC,
} from "@/lib/consts";
import { SuperInvestmentHoldingsData } from "@/lib/types";
import GeneralCombo from "@/components/inputs/GeneralCombo";
import LoadingIcon from "@/components/LoadingIcon";
import { ChevronLeftIcon, CloudArrowDownIcon } from "@heroicons/react/20/solid";

type filteredHeading = {
  heading: string;
  values: string[];
};

const PAGE_SIZE = 20;

export default function DataPage() {
  //Define state variables
  const [data, setData] = useState<SuperInvestmentHoldingsData[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [sortColumn, setSortColumn] = useState("");
  const [searchOptions, setSearchOptions] = useState<string>(
    dataStructHeadingsCC[0]
  );
  const [filterHeadings, setFilterHeadings] = useState<filteredHeading[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  //Function to handle search input change
  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  //Function to fetch data from the server (Supabase)
  const fetchData = async (page: number) => {
    const offset = (page - 1) * PAGE_SIZE;
    let query = supabase
      .from("data")
      .select("*")
      .ilike(searchOptions, `%${searchInput}%`)
      .range(offset, offset + PAGE_SIZE - 1);

    if (sortOrder && sortColumn) {
      query = query.order(sortColumn, { ascending: sortOrder === "asc" });
    }

    let { data: data, error } = await query;

    if (error) console.log("error", error);
    else {
      console.log("data", data);
      setData(data as SuperInvestmentHoldingsData[]);
    }
  };

  const queryBuilder = (values: { column: string; value: string }[]) => {
    let query = supabase.from("data").select("*").range(0, 15);

    values.forEach((value) => {
      query = query.or(value.column + ".ilike." + value.value + "%");
    });

    return query;
  };

  const fetchTableSortHeadings = async () => {
    const formattedArray: string[] = toSnakeCaseArray(
      aggregatedSuperFundHoldingsDataTableHeadings
    ); // convert the headings to snake case

    const formattedArrayCamelCase: string[] = toCamelCaseArray(
      aggregatedSuperFundHoldingsDataTableHeadings
    ); // convert the headings to camel case

    let tableData: filteredHeading[] = []; // 2D array to store table data

    const getAllUniqueData = async () => {
      for (let i = 0; i < formattedArray.length; i++) {
        let item = formattedArray[i];
        let { data: uniqueData, error } = await supabase.from(item).select("*");
        if (error) console.log("error", error);
        else if (uniqueData) {
          // Extract the 'property1' from each object and convert it to string
          let stringData = uniqueData.map((data: { [x: string]: any }) =>
            String(data[formattedArrayCamelCase[i]])
          );

          // Add the extracted strings to the tableData array
          // Prepend the table heading and index to the data
          tableData.push({ heading: item, values: stringData });
        }
      }
    };

    await getAllUniqueData();
    setFilterHeadings(tableData);
    setLoaded(true);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  useEffect(() => {
    fetchTableSortHeadings();
  }, []);

  useEffect(() => {
    // Fetch data when searchInput, sortOrder, or sortColumn change
    fetchData(currentPage);
  }, [searchInput, sortOrder, sortColumn, searchOptions, currentPage]);

  // Function to handle sorting click
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

  const downloadToCSV = async () => {
    const { data, error } = await supabase.from("data").select("*").csv();
    if (error) {
      console.error(error);
      return;
    }
    const csvData = new Blob([data], { type: "text/csv" });
    const csvUrl = URL.createObjectURL(csvData);
    const link = document.createElement("a");
    link.href = csvUrl;
    link.download = "data.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(csvUrl);
  };

  if (!loaded) {
    return (
      <div className="flex w-full mt-56">
        <div className="w-40 mx-auto">
          <LoadingIcon className="text-black" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex">
        <div className="relative flex items-center grow">
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
        <select
          onChange={(event) => setSearchOptions(event.target.value)}
          className="p-0 border border-gray-300 rounded mx-2 pl-2"
        >
          {dataStructHeadingsCC.map((heading, idx) => (
            <option value={heading} key={idx}>
              {heading}
            </option>
          ))}
        </select>
      </div>
      <div>
        <button
          onClick={downloadToCSV}
          className="mt-12 mb-2 ml-6 flex p-2 bg-blue-500 font-semibold text-white rounded-lg"
        >
          <CloudArrowDownIcon className="w-6 mr-1" /> Download to CSV
        </button>
      </div>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      {filterHeadings.map((item: filteredHeading, idx) => {
                        return (
                          <th
                            scope="col"
                            className="py-3.5 text-left text-sm font-semibold text-gray-900"
                            key={idx}
                          >
                            <GeneralCombo
                              key={idx}
                              placeholder={item.heading}
                              options={item.values}
                            />
                          </th>
                        );
                      })}
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

        <div className="w-full flex mt-2">
          <div className="ml-auto flex">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 flex flex-1"
            >
              <span>
                <ChevronLeftIcon className="w-6" />
              </span>
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={data.length < PAGE_SIZE}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex flex-1"
            >
              Next
              <span>
                <ChevronLeftIcon className="w-6 rotate-180" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

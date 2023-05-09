import { supabase } from "@/lib/database/supabase";
import { useEffect, useState } from "react";
import type { SuperInvestmentRow } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

const dataStructHeadings = [
  "Investment Option Name",
  "Asset Class",
  "Asset Name",
  "Asset Identifier",
  "Dollar Value",
  "Currency",
  "GICS Sector Code and Name",
  "GICS Industry Group Code & Name",
  "GICS Industry Code & name",
  "GICS Sub-Industry Code and Name",
];

export default function DataPage() {
  const [data, setData] = useState<SuperInvestmentRow[]>();
  const [loaded, setLoaded] = useState(false);

  const fetchData = async () => {
    let { data: data, error } = await supabase.from("data").select("*");
    if (error) console.log("error", error);
    else {
      setData(data as SuperInvestmentRow[]);
      setLoaded(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteAllData = async () => {
    const { data, error } = await supabase.from("data").delete().neq("id", 0);

    if (error) {
      console.log("error", error);
    }
    fetchData();
  };

  return (
    <>
      <button
        className="p-2 bg-red-500 text-white rounded-md m-8"
        onClick={deleteAllData}
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
                      {dataStructHeadings.map((heading, idx) => (
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                          key={idx}
                        >
                          {heading}
                        </th>
                      ))}
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

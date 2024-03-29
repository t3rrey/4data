import ComboboxInput from "../inputs/comboboxInput";
import CSVFileUpload from "../CSVFileUpload";
import { useState } from "react";
import { supabase } from "@/lib/database/supabase";
import { SuperFund, SuperInvestmentHoldingsData } from "@/lib/types";
import useEffectOnce from "@/lib/hooks/useEffectOnce";
import { mapParsedDataToJSON } from "@/lib/utils";
import LoadingIcon from "../LoadingIcon";
import SuccessfulUploadModal from "../SuccessfulUploadModal";

export default function AddDataForm() {
  //State variables to hold form data and control component behaviour
  const [loaded, setLoaded] = useState(false);
  const [csvFileData, setCsvFileData] = useState<SuperInvestmentHoldingsData[]>(
    []
  );
  const [rawFileName, setRawFileName] = useState("");
  const [fileName, setFileName] = useState("");
  const [superFunds, setSuperFunds] = useState<SuperFund[]>([]);
  const [selectedSuperFund, setSelectedSuperFund] = useState<SuperFund | null>(
    null
  );
  const [date, setDate] = useState<string>("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Function to fetch Super Fund names from the database
  const getSuperFundNames = async () => {
    let { data: super_funds, error } = await supabase
      .from("super_funds")
      .select("*");
    if (error) console.log("error", error);
    else {
      setSuperFunds(super_funds as SuperFund[]);
      setLoaded(true);
    }
  };

  // Fetch Super Fund names when the component mounts
  useEffectOnce(() => {
    getSuperFundNames();
  });

  // Handle form submission
  const onSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    setLoaded(false);
    event.preventDefault();
    // Update the RecentUploads table
    const { error: recent_upload_error, data: recent_upload }: any =
      await supabase
        .from("recent_uploads")
        .insert({
          current_as_of: date,
          file_name: fileName,
          super_fund: selectedSuperFund?.id,
          rows_added: csvFileData.length,
        })
        .select();

    if (recent_upload_error) {
      console.error("Error updating RecentUploads table:", recent_upload_error);
    }

    // Map parsed CSV data to JSON format
    const mappedData = mapParsedDataToJSON(
      csvFileData,
      selectedSuperFund?.id || 1,
      recent_upload[0].id || 1
    );

    // Insert mapped data into the 'data' table
    const { error: error1 } = await supabase.from("data").insert(mappedData);
    if (error1) {
      console.error("Error uploading CSV data:", error1);
      return;
    }
    setLoaded(true);
    setShowSuccessMessage(true);
  };

  // Render a loading message if data is not yet loaded
  if (!loaded) {
    return (
      <div className="flex w-full mt-56">
        <div className="w-40 mx-auto">
          <LoadingIcon className="text-black" />
        </div>
      </div>
    );
  }

  // Render the form
  return (
    <>
      <SuccessfulUploadModal
        isOpen={showSuccessMessage}
        setIsOpen={setShowSuccessMessage}
      />
      <form onSubmit={onSubmit}>
        <div className="space-y-12 sm:space-y-16">
          <div>
            <h1 className="text-3xl font-semibold leading-7 text-gray-900">
              Add new data
            </h1>
            <div className="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                >
                  Super Fund
                </label>
                <div className="mt-2 sm:col-span-2 sm:mt-0">
                  <ComboboxInput
                    superFunds={superFunds}
                    setSelectedSuperFund={setSelectedSuperFund}
                  />
                </div>
              </div>
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                >
                  File name
                </label>
                <div className="mt-2 sm:col-span-2 sm:mt-0">
                  <input
                    onChange={(e) => setFileName(e.target.value)}
                    type="text"
                    name="file name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                <label
                  htmlFor="last-name"
                  className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                >
                  Current as of
                </label>
                <div className="mt-2 sm:col-span-2 sm:mt-0">
                  <input
                    onChange={(e) => setDate(e.target.value)}
                    type="date"
                    name="current as of"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <CSVFileUpload
                setCSVData={setCsvFileData}
                fileName={rawFileName}
                setFileName={setRawFileName}
                selectedSuperFund={selectedSuperFund}
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add Data
          </button>
        </div>
      </form>
    </>
  );
}

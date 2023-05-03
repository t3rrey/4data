import ComboboxInput from "../inputs/comboboxInput";
import CSVFileUpload from "../CSVFileUpload";

export default function AddDataForm() {
  return (
    <form>
      <div className="space-y-12 sm:space-y-16">
        <h2 className="text-2xl font-bold leading-7 text-gray-900">
          Upload New Data
        </h2>
        <div>
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4">
            <label
              htmlFor="country"
              className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
            >
              Super fund
            </label>
            <div className="mt-2 sm:col-span-1 sm:mt-0">
              <ComboboxInput />
            </div>
          </div>
          <div className="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
              <label
                htmlFor="first-name"
                className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
              >
                Date
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <input
                  type="date"
                  name="first-name"
                  id="first-name"
                  autoComplete="given-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <CSVFileUpload />
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
          Submit
        </button>
      </div>
    </form>
  );
}

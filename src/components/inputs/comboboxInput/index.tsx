import { FC, useState } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";
import { SuperFund } from "@/lib/types";

// Helper function to conditionally apply CSS classes
function classNames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

// Define the props interface for ComboboxInput component
export interface IComboboxInput {
  superFunds: SuperFund[];
  setSelectedSuperFund?: React.Dispatch<React.SetStateAction<SuperFund | null>>;
  selectedSuperFund?: SuperFund | null;
}

// Define the ComboboxInput component
const ComboboxInput: FC<IComboboxInput> = ({
  superFunds,
  selectedSuperFund,
  setSelectedSuperFund,
}) => {
  const [query, setQuery] = useState<string>("");

  // Filter the superFunds based on the query
  const filteredSuperFunds: SuperFund[] =
    query === ""
      ? superFunds
      : superFunds.filter((SuperFund) => {
          return SuperFund.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Combobox
      as="div"
      value={selectedSuperFund}
      onChange={setSelectedSuperFund}
    >
      <div className="relative w-2/5">
        <Combobox.Input<SuperFund>
          className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(SuperFund) => SuperFund?.name}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Combobox.Button>

        {filteredSuperFunds?.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredSuperFunds.map((SuperFund, idx) => (
              <Combobox.Option
                key={idx}
                value={SuperFund}
                className={({ active }) =>
                  classNames(
                    "relative cursor-default select-none py-2 pl-3 pr-9",
                    active ? "bg-indigo-600 text-white" : "text-gray-900"
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <div className="flex">
                      <span
                        className={classNames(
                          "truncate",
                          selected && "font-semibold"
                        )}
                      >
                        {SuperFund.name}
                      </span>
                    </div>

                    {selected && (
                      <span
                        className={classNames(
                          "absolute inset-y-0 right-0 flex items-center pr-4",
                          active ? "text-white" : "text-indigo-600"
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
};

export default ComboboxInput;

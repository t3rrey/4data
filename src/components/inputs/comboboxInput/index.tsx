import { useState } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";

type SuperFund = {
  fund: string;
  fundSubCategory: string;
};

const superFunds: SuperFund[] = [
  { fund: "Australian Super", fundSubCategory: "" },
  { fund: "Australian Super", fundSubCategory: "" },
  { fund: "Australian Super", fundSubCategory: "" },
  { fund: "Australian Super", fundSubCategory: "" },
  { fund: "Australian Super", fundSubCategory: "" },
];

function classNames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export default function ComboboxInput() {
  const [query, setQuery] = useState<string>("");
  const [selectedSuperFund, setSelectedSuperFund] = useState<SuperFund | null>(
    superFunds[0]
  );

  const filteredSuperFunds: SuperFund[] =
    query === ""
      ? superFunds
      : superFunds.filter((SuperFund) => {
          return SuperFund.fund.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Combobox
      as="div"
      value={selectedSuperFund}
      onChange={setSelectedSuperFund}
    >
      <div className="relative">
        <Combobox.Input<SuperFund>
          className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(SuperFund) => SuperFund?.fund}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Combobox.Button>

        {filteredSuperFunds.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredSuperFunds.map((SuperFund) => (
              <Combobox.Option
                key={SuperFund.fundSubCategory}
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
                        {SuperFund.fund}
                      </span>
                      <span
                        className={classNames(
                          "ml-2 truncate text-gray-500",
                          active ? "text-indigo-200" : "text-gray-500"
                        )}
                      >
                        {SuperFund.fundSubCategory}
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
}

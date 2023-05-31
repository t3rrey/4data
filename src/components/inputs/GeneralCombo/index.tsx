import { FC, useState } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";

function classNames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export interface IGeneralCombo {
  placeholder: string;
  options: any;
}

const GeneralCombo: FC<IGeneralCombo> = ({ options, placeholder }) => {
  const [query, setQuery] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([] as any[]);

  const handleSelect = (value: string) => {
    if (selectedOptions.includes(value)) {
      setSelectedOptions(selectedOptions.filter((option) => option !== value));
    } else {
      setSelectedOptions([...selectedOptions, value]);
    }
  };

  const filteredOption =
    query === ""
      ? options
      : options.filter((option: any) => {
          return option.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Combobox as="div" onChange={handleSelect}>
      <div className="relative mt-2">
        <Combobox.Input
          className="w-fit rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          value={selectedOptions.join(", ")}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Combobox.Button>

        {filteredOption.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredOption.map((option: any, idx: any) => (
              <Combobox.Option
                key={idx}
                value={option}
                className={({ active }) =>
                  classNames(
                    "relative cursor-default select-none py-2 pl-3 pr-9",
                    active ? "bg-indigo-600 text-white" : "text-gray-900"
                  )
                }
              >
                {({ active }) => (
                  <>
                    <span
                      className={classNames(
                        "block truncate",
                        selectedOptions.includes(option) && "font-semibold"
                      )}
                    >
                      {option}
                    </span>

                    {selectedOptions.includes(option) && (
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

export default GeneralCombo;

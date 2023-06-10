import { useBoardStore } from "@/store/BoardStore";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { RadioGroup } from "@headlessui/react";

const types= [
  {
    id: "Low",
    name: "Low",
    color: "bg-blue-500",
    description: "",
  },
  {
    id: "Medium",
    name: "Medium",
    color: "bg-yellow-500",
    description: "",
  },
  {
    id: "High",
    name: "High",
    color: "bg-red-500",
    description: "",
  },
];

function PriorityTypeRadioGroup() {
  const [setPriorityType, newPriorityType] = useBoardStore((state) => [
    state.setPriorityType,
    state.newPriorityType,
  ]);

  return (
    <div className="w-full py-5">
      <div className="mx-auto w-full max-w-md">
        <RadioGroup value={newPriorityType} onChange={setPriorityType}>
          <div className="space-y-2">
            {types.map((type) => (
              <RadioGroup.Option
                key={type.id}
                value={type.id}
                className={({ active, checked }) =>
                  `${
                    active
                      ? "ring-2 ring-white ring-opacity-60 ring-offset-sky-3000"
                      : ""
                  }
              ${checked ? `${type.color} bg-opacity-75 text-white` : "bg-white"}
              relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none
                `
                }
              >
                {({ active, checked }) => (
                  <>
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-sm">
                          <RadioGroup.Label
                            as="p"
                            className={`font-medium ${
                              checked ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {type.name}
                          </RadioGroup.Label>
                          <RadioGroup.Description
                            as="span"
                            className={`inline ${
                              checked ? "text: white" : "text-gray-500"
                            }`}
                          >
                            {type.description}
                          </RadioGroup.Description>
                        </div>
                      </div>
                      {checked && (
                        <div className="shrink-0 text-white">
                          <CheckIcon className="h6 w-6" />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}

export default PriorityTypeRadioGroup;

import React, { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { ChevronDown } from "lucide-react";
// import { useIncome } from "../../hooks/useIncome";

const IncomeCards = ({ data = [], loading }) => {
  const [accordionValue, setAccordionValue] = useState("");
  const formatAmount = (val) =>
    new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
      Number(val || 0)
    );

  return (
    <div className="w-full">
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((k) => (
            <div
              key={k}
              className="bg-white p-4 rounded-xl shadow-sm border animate-pulse h-24"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((item) => (
            <div
              key={item.id}
              className={`bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 ${
                item.id === 1 ? "sm:col-span-2 lg:col-span-1 relative" : ""
              }`}
            >
              {/* Header (icon + title + amount) */}
              {item.id !== 1 && (
                <div className="p-4 md:p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="text-2xl md:text-3xl flex-shrink-0">
                        {item.icon}
                      </div>
                      <h2 className="text-sm md:text-base lg:text-lg font-semibold text-gray-800 truncate">
                        {item.title}
                      </h2>
                    </div>
                    <p className="text-gray-800 font-bold text-base md:text-lg lg:text-xl whitespace-nowrap">
                      ₹{formatAmount(item.amount)}
                    </p>
                  </div>
                </div>
              )}

              {/* Accordion only for Total Income */}
              {item.id === 1 && (
                <Accordion
                  type="single"
                  collapsible
                  value={accordionValue}
                  onValueChange={setAccordionValue}
                  className="w-full relative"
                >
                  <AccordionItem value="item-1" className="border-0">
                    <AccordionTrigger className="p-4 md:p-5 hover:no-underline data-[state=open]:bg-gradient-to-r data-[state=open]:from-indigo-50 data-[state=open]:to-purple-50 transition-all duration-300 [&>svg]:hidden">
                      <div className="flex items-center justify-between w-full gap-3 pr-2">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="text-2xl md:text-3xl flex-shrink-0">
                            {item.icon}
                          </div>
                          <h2 className="text-sm md:text-base lg:text-lg font-semibold text-gray-800 truncate">
                            {item.title}
                          </h2>
                        </div>
                        <div className="flex items-center gap-2 md:gap-3">
                          <p className="text-gray-800 font-bold text-base md:text-lg lg:text-xl whitespace-nowrap">
                            ₹{formatAmount(item.amount)}
                          </p>
                          <ChevronDown
                            className={`h-4 w-4 md:h-5 md:w-5 text-gray-500 transition-transform duration-300 flex-shrink-0 ${
                              accordionValue === "item-1" ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="absolute left-0 right-0 top-full z-50 pt-2">
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3 md:p-4 space-y-2 md:space-y-3 border border-gray-200 shadow-xl mx-4 md:mx-5">
                        {item.baseIncome != null && (
                          <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                            <span className="text-xs md:text-sm font-medium text-gray-600">
                              Base Income
                            </span>
                            <span className="text-sm md:text-base font-bold text-gray-800">
                              ₹{formatAmount(item.baseIncome)}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between py-2">
                          <span className="text-xs md:text-sm font-medium text-gray-600">
                            Additional Income
                          </span>
                          <span className="text-sm md:text-base font-bold text-indigo-600">
                            ₹{formatAmount(item.additionalIncome)}
                          </span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IncomeCards;

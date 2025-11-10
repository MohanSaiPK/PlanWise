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
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((k) => (
            <div
              key={k}
              className="bg-white p-2 rounded-lg shadow-sm border animate-pulse h-14 md:h-16"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {data.map((item) => (
            <div
              key={item.id}
              className="bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 relative h-14 md:h-16 flex items-center"
            >
              {/* Compact view - only icon/emoji and amount */}
              {item.id !== 1 && (
                <div className="p-2 md:p-3 w-full flex items-center justify-center gap-1">
                  <div className="text-xl md:text-2xl flex-shrink-0">
                    {item.icon}
                  </div>
                  <p className="text-gray-800 font-bold text-xs md:text-sm whitespace-nowrap">
                    ₹{formatAmount(item.amount)}
                  </p>
                </div>
              )}

              {/* Accordion only for Total Income */}
              {item.id === 1 && (
                <Accordion
                  type="single"
                  collapsible
                  value={accordionValue}
                  onValueChange={setAccordionValue}
                  className="w-full relative h-full flex items-center justify-center"
                >
                  <AccordionItem
                    value="item-1"
                    className="border-0 w-full h-full flex items-center justify-center"
                  >
                    <AccordionTrigger className="p-2 md:p-3 hover:no-underline data-[state=open]:bg-gradient-to-r data-[state=open]:from-indigo-50 data-[state=open]:to-purple-50 transition-all duration-300 [&>svg]:hidden w-full h-full flex items-center justify-center">
                      <div className="flex items-center justify-center gap-1">
                        <div className="text-xl md:text-2xl flex-shrink-0">
                          {item.icon}
                        </div>
                        <div className="flex items-center gap-1">
                          <p className="text-gray-800 font-bold text-xs md:text-sm whitespace-nowrap">
                            ₹{formatAmount(item.amount)}
                          </p>
                          <ChevronDown
                            className={`h-3 w-3 text-gray-500 transition-transform duration-300 flex-shrink-0 ${
                              accordionValue === "item-1" ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="absolute left-0 right-0 top-full z-50 pt-2">
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-2 space-y-2 border border-gray-200 shadow-xl mx-2">
                        {item.baseIncome != null && (
                          <div className="flex items-center justify-between py-1.5 border-b border-gray-200 last:border-0">
                            <span className="text-xs font-medium text-gray-600">
                              Base Income
                            </span>
                            <span className="text-xs font-bold text-gray-800">
                              ₹{formatAmount(item.baseIncome)}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between py-1.5">
                          <span className="text-xs font-medium text-gray-600">
                            Additional Income
                          </span>
                          <span className="text-xs font-bold text-indigo-600">
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

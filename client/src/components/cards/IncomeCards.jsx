import React, { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
// import { useIncome } from "../../hooks/useIncome";

const IncomeCards = ({ data = [], loading }) => {
  const [isOpen, setIsOpen] = useState(false);
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
              className="relative bg-white p-3 rounded-xl shadow-sm border flex overflow-visible"
            >
              {/* Header (icon + title + amount) */}
              {item.id !== 1 && (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{item.icon}</div>
                    <h2 className="text-base md:text-lg font-semibold">
                      {item.title}
                    </h2>
                  </div>
                  <p className="text-gray-800 font-semibold text-lg">
                    ₹{formatAmount(item.amount)}
                  </p>
                </div>
              )}

              {/* Accordion only for Total Income */}
              {item.id === 1 && (
                <Accordion
                  type="single"
                  collapsible
                  value={isOpen ? "item-1" : ""}
                  className="w-full z-50"
                >
                  <AccordionItem value="item-1">
                    <AccordionTrigger
                      onClick={() => setIsOpen(!isOpen)}
                      className="justify-between items-center w-full"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{item.icon}</div>
                        <h2 className="text-base md:text-lg font-semibold">
                          {item.title}
                        </h2>
                      </div>
                      <p className="text-gray-800 font-semibold text-lg">
                        ₹{formatAmount(item.amount)}
                      </p>
                    </AccordionTrigger>
                    <AccordionContent className="absolute left-0 right-0 top-full bg-white shadow-lg border rounded-md mt-2 p-3 z-50">
                      {item.baseIncome != null && (
                        <p className="text-gray-700 mb-1">
                          Base Income: ₹{formatAmount(item.baseIncome)}
                        </p>
                      )}
                      <p className="text-gray-700">
                        Additional Income: ₹
                        {formatAmount(item.additionalIncome)}
                      </p>
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

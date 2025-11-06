import React, { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useIncome } from "../../hooks/useIncome";

const IncomeCards = ({ data = [], loading }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex gap-4 w-full relative">
      {loading ? (
        <p>Loading...</p>
      ) : (
        data.map((item) => (
          <div
            key={item.id}
            className="relative bg-white p-4 rounded-lg shadow-md border-2 flex flex-col justify-between w-1/3 overflow-visible transition-all"
          >
            {/* Header (icon + title + amount) */}
            {item.id !== 1 && (
              <div className="flex items-center justify-center">
                <div className="text-3xl mr-4">{item.icon}</div>
                <div>
                  <h2 className="text-xl font-semibold">{item.title}</h2>
                  <p className="text-gray-600">${item.amount}</p>
                </div>
              </div>
            )}

            {/* Accordion only for Total Income */}
            {item.id === 1 && (
              <Accordion
                type="single"
                collapsible
                value={isOpen ? "item-1" : ""}
                className="w-full"
              >
                <AccordionItem value="item-1">
                  <AccordionTrigger
                    onClick={() => setIsOpen(!isOpen)}
                    className="justify-between items-center w-full p-4 "
                  >
                    <div className="flex items-center justify-start">
                      <div className="text-3xl mr-4">{item.icon}</div>
                      <div>
                        <h2 className="text-xl font-semibold">{item.title}</h2>
                        <p className="text-gray-600">${item.amount}</p>
                      </div>
                    </div>
                  </AccordionTrigger>

                  {/* Floating content overlapping below */}
                  <AccordionContent
                    className="
                      absolute left-0 right-0 
                      bg-white shadow-lg border rounded-md 
                      mt-1 p-3 z-20 
                      animate-accordion-down
                    "
                  >
                    {item.baseIncome && (
                      <p className="text-gray-700 mb-1">
                        Base Income: ${item.baseIncome}
                      </p>
                    )}
                    {
                      <p className="text-gray-700">
                        Additional Income: ${item.additionalIncome}
                      </p>
                    }
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default IncomeCards;

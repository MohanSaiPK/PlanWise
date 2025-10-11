import { useContext } from "react";
import IncomeContext from "../context/IncomeContext";

export const useIncome = () => {
  const context = useContext(IncomeContext);
  if (!context) {
    throw new Error("useIncome must be used within an IncomeProvider");
  }
  return context;
};

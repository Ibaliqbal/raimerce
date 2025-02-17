import { FileDown } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import * as XLSX from "xlsx";

// Tambahkan tipe generik untuk props
type ButtonExportToCSVProps<T> = {
  data: T[]; // Tipe data generik
  title: string;
  nameFile: string;
};

const ButtonExportToCSV = <T,>({
  data,
  title,
  nameFile,
}: ButtonExportToCSVProps<T>) => {
  const exportToCsv = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, title);
    XLSX.writeFile(wb, nameFile);
  };

  return (
    <Button variant="outline" onClick={exportToCsv}>
      <FileDown className="mr-2 h-4 w-4" /> Export to CSV
    </Button>
  );
};

export default ButtonExportToCSV;

import * as XLSX from "xlsx";
import { Customer, Borrow, Book } from "../../@Typs";
import { useQuery } from "react-query";
import { Books, Customers } from "../../service/library-service";
import { FaRegFileExcel } from "react-icons/fa";

const BorrowedExcel = ({ data }: any) => {
  const { data: resCustomers } = useQuery("get all customers", () => Customers());
  const { data: resBooks } = useQuery("get all books", () => Books());

  const exportToExcel = () => {
    const excelData = [];

    // Add the header row
    const headerRow = [
      "Number",
      "Book",
      "Customer",
      "Borrowed on",
      "Return date",
      "Librarian",
      "Returned?",
      "Returned on",
    ];
    excelData.push(headerRow);

    // Iterate over the data and create a row for each entry
    data.forEach((borrow: Borrow) => {
      const row = [
        borrow.id,
        resBooks?.data.find((book: Book) => book.id === borrow.bookId)?.name ||
          "The book has been deleted",
        `${
          resCustomers?.data.find(
            (customer: Customer) => customer.id === borrow.customerId
          )?.firstName || ""
        } ${
          resCustomers?.data.find(
            (customer: Customer) => customer.id === borrow.customerId
          )?.lastName || ""
        }`,
        borrow.borrowingDate ?  borrow.borrowingDate.toString() : "",
        borrow.returnDate ?  borrow.returnDate.toString() : "",
        borrow.addedByUserName,
        borrow.returnBook ? "Yes" : "No",
        borrow.returnedOn ? borrow.returnedOn.toString() : "not returned",
      ];
      excelData.push(row);
    });

    const ws = XLSX.utils.aoa_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "borrowed.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button onClick={exportToExcel} className="flex bg-green-50 mt-3">
      <div className="flex items-cente">
        <FaRegFileExcel className="w-6 h-6" />
        <span className="ml-2">Export to Excel </span>
      </div>
    </button>
  );
};

export default BorrowedExcel;

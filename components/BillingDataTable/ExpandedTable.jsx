import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./TableComponents";

export default function ExpandedTable({
  detailedData,
  formatDate,
  formatCurrency,
}) {
  return (
    <Table className="w-full border-collapse">
      <TableHeader>
        <TableRow className="bg-blue-200">
          <TableHead className="py-2 text-left w-1/6">Tarih</TableHead>
          <TableHead className="py-2 text-left w-1/6">Ürün Kodu</TableHead>
          <TableHead className="py-2 text-left w-1/6">Ürün Cinsi</TableHead>
          <TableHead className="py-2 text-left w-1/6">Miktar</TableHead>
          <TableHead className="py-2 text-left w-1/6">Fiyat</TableHead>
          <TableHead className="py-2 text-left w-1/6">Toplam</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {detailedData.map((detailItem, detailIndex) => (
          <TableRow key={detailIndex}>
            <TableCell className="py-2 pl-4 text-left truncate">
              {formatDate(detailItem.FATHARTAR)}
            </TableCell>
            <TableCell className="py-2 pl-4 text-left truncate">
              {detailItem.FATHARSTKKOD}
            </TableCell>
            <TableCell className="py-2 pl-4 text-left truncate">
              {detailItem.FATHARSTKCINS}
            </TableCell>
            <TableCell className="py-2 pl-4 text-left truncate">
              {detailItem.FATHARMIKTAR}
            </TableCell>
            <TableCell className="py-2 pl-4 text-left truncate">
              {formatCurrency(detailItem.FATHARFIYAT)}
            </TableCell>
            <TableCell className="py-2 pl-4 text-left truncate">
              {formatCurrency(detailItem.FATHARTUTAR)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

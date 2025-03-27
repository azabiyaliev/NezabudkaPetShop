import { IBrand } from "../../../../types";
import React from "react";
import Brand from "./Brand/Brand.tsx";
import Table from "@mui/joy/Table";

interface Props {
  brands: IBrand[];
}

const Brands: React.FC<Props> = ({ brands }) => {
  const tableName = [
    "Логотип",
    "Название бренда",
    "Отредактировать",
    "Удалить",
  ];
  return (
    <Table
      aria-label="table with ellipsis texts"
      noWrap
      sx={{ mx: "auto", width: 850, textAlign: "center" }}
    >
      <thead>
        <tr>
          <th style={{ width: "80px", textAlign: "center", fontSize: "16px" }}>
            №
          </th>
          {tableName.map((name, index) => (
            <th
              style={{ textAlign: "center", fontSize: "16px" }}
              key={name + index}
            >
              {name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {brands.map((brand, index) => (
          <Brand key={brand.id || index} brand={brand} index={index} />
        ))}
      </tbody>
    </Table>
  );
};

export default Brands;

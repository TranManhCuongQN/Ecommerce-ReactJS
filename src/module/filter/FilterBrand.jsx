import React from "react";
import { useState } from "react";
import Accordion from "../../components/accordion/Accordion";
import Filter from "../../components/filter/Filter";

const Brand = [
  {
    id: 1,
    name: "Asus",
  },
  {
    id: 2,
    name: "Acer",
  },
  {
    id: 3,
    name: "Lenevo",
  },
  {
    id: 4,
    name: "HP",
  },
  {
    id: 5,
    name: "MSI",
  },
];
const FilterBrand = ({ filters, onChange }) => {
  const handleChange = (value) => {
    if (!onChange) return;
    onChange(value);
    console.log(value);
  };
  return (
    <div className="border-y-2 border-solid border-[#f5f5f9] w-full">
      <Accordion title="Thương hiệu">
        {Brand.length > 0 &&
          Brand.map((item) => {
            return (
              <Filter
                name="brands"
                value={item.name}
                key={item.id}
                filters={filters}
                onChange={handleChange}
              />
            );
          })}
      </Accordion>
      {/* <Accordion title="Màu sắc">
        <Filter name="Bạc" />
        <Filter name="Vàng" />
        <Filter name="Xám" />
        <Filter name="Đen" />
      </Accordion>
      <Accordion title="Nhu cầu">
        <Filter name="Doanh nhân" />
        <Filter name="Gaming" />
        <Filter name="Học sinh - Sinh viên" />
        <Filter name="Văn phòng" />
        <Filter name="Đồ họa - Kỹ thuật" />
      </Accordion> */}
    </div>
  );
};

export default FilterBrand;

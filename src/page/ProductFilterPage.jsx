import React, { useState } from "react";
import Navbar from "../components/navbar/Navbar";
import { Link, useNavigate, useLocation } from "react-router-dom";
import FilterPrice from "../module/filter/FilterPrice";
import FilterBrand from "../module/filter/FilterBrand";
import { ProductLapTopData } from "../api/ProductLaptopData";
import FilterProduct from "../module/filter/FilterProduct";
import { useMemo } from "react";
import queryString from "query-string";
import FilterSort from "../module/filter/FilterSort";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { refresh } from "../redux/product/filterSlice";
import FilterColor from "../module/filter/FilterColor";
import FilterRam from "../module/filter/FilterRam";
import FilterDemand from "../module/filter/FilterDemand";

const ProductFilterPage = () => {
  const dataLapTopMacBook = ProductLapTopData;
  const { brands } = useSelector((state) => state.filter);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = useMemo(() => {
    const params = queryString.parse(location.search);
    return {
      ...params,
      _page: Number.parseInt(params._page) || 1,
      _sort: params._sort,
    };
  }, [location.search]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  // useEffect(() => {
  //   let str = "";
  //   if (brands.length > 0) {
  //     str = "?brand=";
  //   }

  //   navigate({
  //     pathname: "/product",
  //     search: `${str}${brands.join(" ")}`,
  //   });
  // }, [brands]);

  const handleChange = (newValue) => {
    const filters = {
      ...queryParams,
      ...newValue,
    };
    console.log(newValue);
    navigate({ pathname: "/product", search: queryString.stringify(filters) });
  };

  const handleClickSort = (newSortValue) => {
    const filters = {
      ...queryParams,
      _sort: newSortValue,
    };
    navigate({ pathname: "/product", search: queryString.stringify(filters) });
  };
  console.log(queryParams);
  return (
    <>
      <Navbar />
      <div className="mt-10">
        <div className="container">
          {" "}
          <div className="flex items-center">
            <Link to="/" className=" text-lg text-[#a8b4c9] flex items-center">
              Trang chủ
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5 mx-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </Link>
            <span className="text-lg text-[#a8b4c9]">Laptop chính hãng</span>
          </div>
          <div className="wrapper-product">
            <div className="product-filter w-full  bg-white rounded-lg flex flex-col items-start text-black">
              <FilterPrice onChange={handleChange} />
              <FilterBrand filters={queryParams} onChange={handleChange} />
              <FilterColor filters={queryParams} onChange={handleChange} />
              <FilterRam filters={queryParams} onChange={handleChange} />
              <FilterDemand filters={queryParams} onChange={handleChange} />
            </div>
            <div className="product-list">
              <div className="flex flex-col container rounded-lg bg-white ">
                <div className="flex items-center p-5 gap-x-10 ">
                  <span className="font-medium text-lg ">Sắp xếp theo</span>
                  <FilterSort onClick={handleClickSort} />
                </div>
                <FilterProduct data={dataLapTopMacBook} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductFilterPage;

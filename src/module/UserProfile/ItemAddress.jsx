import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DropdownSelect from "../../components/dropdown/DropdownSelect";
import Input from "../../components/input/Input";
import Label from "../../components/label/Label";
import ModalAdvanced from "../../components/Modal/ModalAdvanced";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../../components/button/Button";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import axios from "axios";

const schema = yup.object({
  fullname: yup
    .string()
    .required("Vui lòng nhập họ tên")
    .min(3, "Tối thiểu phải có 3 ký tự")
    .max(30, "Vượt quá 30 ký tự cho phép"),
  sdt: yup
    .string()
    .required("Vui lòng nhập số điện thoại")
    .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, {
      message: "Định dạng số điện thoại không đúng",
    }),
  address: yup.string().required("Vui lòng nhập địa chỉ nhà"),
  province: yup.string().required("Vui lòng chọn Tỉnh/ Thành phố"),
  dictrict: yup.string().required("Vui lòng chọn Quận/ Huyện"),
  ward: yup.string().required("Vui lòng chọn Phường/Xã"),
});
const ItemAddress = ({ data }) => {
  const [showModal, setShowModal] = useState(false);
  const bodyStyle = document.body.style;
  let isLocked = false;
  const {
    control,
    reset,
    formState: { isSubmitting, isValid, errors },
    setValue,
    getValues,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      fullname: "",
      sdt: "",
      province: "",
      dictrict: "",
      ward: "",
      address: "",
    },
    resolver: yupResolver(schema),
  });

  const [province, setProvince] = useState([]);
  const [provinceId, setProvinceId] = useState("");
  const [district, setDistrict] = useState([]);
  const [districtId, setDistrictId] = useState("");
  const [ward, setWard] = useState([]);

  const fetchProvince = async () => {
    const { data } = await axios.get("https://provinces.open-api.vn/api/p");
    setProvince(data);
  };

  const fetchDistrict = async () => {
    const { data } = await axios.get(
      `https://provinces.open-api.vn/api/p/${provinceId}?depth=2`
    );
    setDistrict(data.districts);
  };

  const fetchWard = async () => {
    const { data } = await axios.get(
      `https://provinces.open-api.vn/api/d/${districtId}?depth=2`
    );
    setWard(data.wards);
  };

  useEffect(() => {
    fetchProvince();
    fetchDistrict();
    fetchWard();
  }, [provinceId, districtId]);

  useEffect(() => {
    if (showModal === false) {
      reset({
        fullname: "",
        sdt: "",
        province: "",
        dictrict: "",
        ward: "",
        address: "",
      });
      enableBodyScroll(bodyStyle);
      isLocked = false;
    } else {
      disableBodyScroll(bodyStyle);
      isLocked = true;
    }
  }, [showModal]);

  return (
    <>
      <div className="w-full bg-white  border-2 border-dotted text-black px-5 py-5 rounded-lg flex items-center justify-between my-7 focus:border-solid">
        <div className="flex flex-col justify-between">
          <h3 className="font-semibold text-lg mb-2">{data.name}</h3>
          <div className="flex flex-col">
            <span className="text-base font-normal">
              Địa chỉ: {data.address}
            </span>
            <span className="text-base font-normal">
              Điện thoại: {data.phone}
            </span>
          </div>
        </div>
        <button
          className="border-2 border-solid px-4 py-3 text-red-600 font-medium border-[red]"
          type="button"
          onClick={() => setShowModal(true)}
        >
          Chỉnh sửa
        </button>
      </div>

      <ModalAdvanced
        visible={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        bodyClassName="w-[750px] bg-white p-10 rounded-lg relative z-10 content h-[850px] overflow-y-auto overflow-x-hidden"
      >
        <h3 className="text-2xl font-semibold text-black text-left mb-5">
          Thông tin người nhận hàng
        </h3>
        <form autoComplete="off">
          <div className="flex flex-col items-start gap-4 mb-10">
            <Label htmlFor="fullname">* Họ tên</Label>
            <Input
              type="text"
              name="fullname"
              placeholder="Mời bạn nhập tên của bạn"
              control={control}
            ></Input>
            {errors.fullname && (
              <p className="text-red-500 text-lg font-medium">
                {errors.fullname?.message}
              </p>
            )}
          </div>

          <div className="flex flex-col items-start gap-4 mb-10">
            <Label htmlFor="sdt">* Số điện thoại</Label>
            <Input
              type="number"
              name="sdt"
              placeholder="Mời bạn nhập số điện thoại"
              control={control}
            ></Input>
            {errors.sdt && (
              <p className="text-red-500 text-lg font-medium">
                {errors.sdt?.message}
              </p>
            )}
          </div>

          <h3 className="text-2xl font-semibold text-black text-left mb-5">
            Địa chỉ nhận hàng
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex flex-col items-start gap-4 mb-10">
              <Label htmlFor="province">* Tỉnh/Thành phố</Label>
              <DropdownSelect
                control={control}
                name="province"
                dropdownLabel="Chọn"
                setValue={setValue}
                data={province}
                onClick={(id) => setProvinceId(id)}
              ></DropdownSelect>
              {errors.province && (
                <p className="text-red-500 text-lg font-medium">
                  {errors.province?.message}
                </p>
              )}
            </div>

            <div className="flex flex-col items-start gap-4 mb-10">
              <Label htmlFor="district">* Quận/Huyện</Label>
              <DropdownSelect
                control={control}
                name="district"
                dropdownLabel="Chọn"
                setValue={setValue}
                data={district}
                onClick={(id) => setDistrictId(id)}
              ></DropdownSelect>
              {errors.dictrict && (
                <p className="text-red-500 text-lg font-medium">
                  {errors.dictrict?.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col items-start gap-4 mb-10">
              <Label htmlFor="ward">* Phường/Xã</Label>
              <DropdownSelect
                control={control}
                name="ward"
                dropdownLabel="Chọn"
                setValue={setValue}
                data={ward}
              ></DropdownSelect>
              {errors.ward && (
                <p className="text-red-500 text-lg font-medium">
                  {errors.ward?.message}
                </p>
              )}
            </div>
            <div className="flex flex-col items-start gap-4 mb-10">
              <Label htmlFor="address">* Địa chỉ cụ thể</Label>
              <Input
                type="text"
                name="address"
                placeholder="Số nhà, ngõ, tên đường"
                style={{ width: "300px" }}
                control={control}
              ></Input>
              {errors.address && (
                <p className="text-red-500 text-lg font-medium">
                  {errors.address?.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center justify-end gap-x-4">
            <button
              className="p-5 text-base font-semibold bg-white text-[#316BFF] rounded-lg border border-solid border-[blue]"
              type="button"
              onClick={() => setShowModal(false)}
            >
              Hủy bỏ
            </button>
            <Button
              style={{
                fontSize: "16px",
              }}
              type="submit"
              isLoding={isSubmitting}
              disable={isSubmitting}
            >
              Lưu địa chỉ
            </Button>
          </div>
        </form>
      </ModalAdvanced>
    </>
  );
};

export default ItemAddress;
import React, { useEffect, useState } from "react";
import DashboardHeading from "../dashboard/DashboardHeding";
import Button from "../../components/button/Button";
import Field from "../../components/field/Field";
import Label from "../../components/label/Label";
import Input from "../../components/input/Input";
import { useForm } from "react-hook-form";
import InputPasswordToggle from "../../components/input/InputPasswordToggle";
import FieldCheckboxes from "../../components/field/FieldCheckboxes";
import Radio from "../../components/checkbox/Radio";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import moment from "moment";
import ImageUpload from "../../components/images/ImageUpload";
import axios from "axios";
import useUserProfile from "../../hooks/useUserProfile";
import Navbar from "../../components/navbar/Navbar";

const today = moment();
const schema = yup.object({
  fullname: yup
    .string()
    .required("Vui lòng nhập họ tên")
    .min(3, "Tối thiểu phải có 3 ký tự")
    .max(30, "Vượt quá 30 ký tự cho phép"),
  password: yup
    .string()
    .required("Vui lòng nhập mật khẩu")
    .min(8, "Tối thiểu 8 ký tự")
    .max(30, "Vượt quá 30 ký tự cho phép")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      {
        message: "Bắt buộc phải có chữ hoa, chữ thường, ký tự đặc biệt, số",
      }
    ),
  sdt: yup
    .string()
    .required("Vui lòng nhập số điện thoại")
    .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, {
      message: "Định dạng số điện thoại không đúng",
    }),
  birthday: yup
    .date()
    .required("Vui lòng chọn ngày sinh")
    .nullable()
    .max(today, "Ngày sinh không hợp lệ"),
});

const Gender = {
  NAM: "nam",
  NU: "nữ",
  Diff: "khác",
};

const UserAccount = () => {
  const {
    control,
    watch,
    setValue,
    handleSubmit,
    getValues,
    reset,
    formState: { isSubmitting, isValid, errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      gender: "nam",
    },
  });

  const { user } = useUserProfile();
  console.log(user);

  const watchGender = watch("gender");
  const [image, setImage] = useState("");
  const [progress, setProgress] = useState();

  const handleSelectImage = async (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (!file) return;
    const urlImage = await handleUpLoadImage(file);
    setImage(urlImage);
  };

  const handleUpLoadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await axios({
      method: "post",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      url: "https://api.imgbb.com/1/upload?key=faf46b849aaf25c8587aec2835f05b26",
      onUploadProgress: (data) => {
        setProgress(Math.round((100 * data.loaded) / data.total));
      },
    });
    return response.data.data.url;
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const handleUpdate = (values) => {
    if (!isValid) return;
    const cloneValues = { ...values };
    cloneValues.gender = getValues("gender");
    cloneValues.image = image;
    console.log(cloneValues);
  };

  return (
    <div className="bg-white rounded-lg">
      <DashboardHeading
        title="Thông tin tài khoản"
        className="px-5 py-5"
      ></DashboardHeading>
      <form className="pb-16" onSubmit={handleSubmit(handleUpdate)}>
        <Field>
          <Label>Image</Label>
          <ImageUpload
            onChange={handleSelectImage}
            className="mx-auto"
            progress={progress}
            image={image}
            // handleDeleteImage={handleDeleteImage}
          ></ImageUpload>
        </Field>

        <Field>
          <Label htmlFor="fullname">Họ tên</Label>
          <Input name="fullname" control={control} type="text"></Input>
          {errors.fullname && (
            <p className="text-red-500 text-lg font-medium">
              {errors.fullname?.message}
            </p>
          )}
        </Field>

        <Field>
          <Label htmlFor="fullname">Email</Label>
          <Input name="email" control={control} disabled></Input>
        </Field>

        <Field>
          <Label htmlFor="sdt">Số điện thoại</Label>
          <Input name="sdt" type="number" control={control}></Input>
          {errors.sdt && (
            <p className="text-red-500 text-lg font-medium">
              {errors.sdt?.message}
            </p>
          )}
        </Field>

        <Field>
          <Label htmlFor="birthday">Ngày sinh</Label>
          <Input name="birthday" type="date" control={control}></Input>
          {errors.birthday && (
            <p className="text-red-500 text-lg font-medium">
              {errors.birthday?.message}
            </p>
          )}
        </Field>

        <Field>
          <FieldCheckboxes>
            <Label htmlFor="gender">Giới tính</Label>
            <Radio
              name="gender"
              control={control}
              checked={watchGender === Gender.NAM}
              value={Gender.NAM}
              onClick={() => setValue("gender", "nam")}
            >
              Nam
            </Radio>
            <Radio
              name="gender"
              control={control}
              checked={watchGender === Gender.NU}
              value={Gender.NU}
              onClick={() => setValue("gender", "nu")}
            >
              Nữ
            </Radio>
            <Radio
              name="gender"
              control={control}
              checked={watchGender === Gender.Diff}
              value={Gender.Diff}
              onClick={() => setValue("gender", "khac")}
            >
              Khác
            </Radio>
          </FieldCheckboxes>
        </Field>

        <Button
          kind="primary"
          className="mx-auto w-[200px] mt-10"
          type="submit"
          disabled={isSubmitting}
          isLoading={isSubmitting}
        >
          Cập nhật thông tin
        </Button>
      </form>
    </div>
  );
};

export default UserAccount;
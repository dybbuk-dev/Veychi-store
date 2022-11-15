import Input from "@components/ui/input";
import { useForm } from "react-hook-form";
import Button from "@components/ui/button";
import Description from "@components/ui/description";
import Card from "@components/common/card";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Premium } from "@ts-types/generated";

import { useTranslation } from "next-i18next";

import SwitchInput from "@components/ui/switch-input";
import axios from "axios";
import Cookies from "js-cookie";

type IProps = {
  initialValues?: Premium | null;
};
axios.defaults.baseURL = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
const defaultValues = {
  title: "",
  price: 1,
  popular: true,
  duration: 1,
  order: 1,
  traits: [""],
};
export default function CreateOrUpdatePremiumForm({ initialValues }: IProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [counter, setCounter] = useState([""]);

  const [trait, setTrait] = useState(initialValues ? initialValues.traits : [""]);

  useEffect(() => {
    if (initialValues?.traits !==undefined) {
      const value =  initialValues?.traits.length 
      const inputs = new Array( value).fill(" ");
      setCounter(inputs);
    }
  }, []);
  useEffect(() => {}, [counter]);
  
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    shouldUnregister: true,
    defaultValues: initialValues ?? defaultValues,
  });

  const onSubmit = async ({
    duration,
    order,
    price,
    title,
    popular,
  }: any) => {
    const tkn = Cookies.get("AUTH_CRED")!;
    const { token } = JSON.parse(tkn);
    if (!tkn) return;
    if (initialValues) {
      const newValues = {
        duration,
        order,
        price,
        title,
        popular,
        traits: trait,
      };
      await axios.put("/premium-plans/" + initialValues.id, newValues, {
        headers: {
          authorization: "Bearer " + token,
        },
      });
    } else {
      const newValues = {
        duration,
        order,
        price,
        title,
        popular,
        traits: trait,
      };

      try {
        await axios.post("premium-plans", newValues, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        router.push("/es/premium-plans");
      } catch (e) {}
    }
    router.push("/es/premium-plans");
  };

  const addCounter = () => {
    setCounter([...counter, ""]);
  };
  const deleteCounter = () => {
    counter.splice(counter.length - 1, 1);
    setCounter([...counter]);
    if (trait[counter.length] ){
      trait.splice(counter.length - 1, 1);
      setTrait(trait)
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap my-5 sm:my-8">
        <Description
          title={t("form:form-title-information")}
          details={`${
            initialValues
              ? t("form:item-description-update")
              : t("form:item-description-add")
          } ${t("form:premium-form-info-help-text")}`}
          className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8 "
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t("form:input-label-title")}
            {...register("title", { required: "Name is required" })}
            required
            error={t(errors.title?.message!)}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t("form:input-label-price")}
            {...register("price")}
            type="number"
            error={t(errors.price?.message!)}
            required
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t("form:input-label-duration-in-days")}
            type="number"
            {...register("duration")}
            error={t(errors.duration?.message!)}
            required
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t("form:input-label-order")}
            type="number"
            {...register("order")}
            error={t(errors.order?.message!)}
            required
            variant="outline"
            className="mb-5"
          />
          <SwitchInput
            label={
              <label className="block text-body-dark font-semibold text-sm leading-none my-3">
                Popular?
              </label>
            }
            errors={t(errors.popular?.message!)}
            name="popular"
            control={control}
          />
          {counter.map((_, i) => (
            <>
            <label >Rasgos {i}</label>
            <input
             name="traits"
             defaultValue={initialValues ? initialValues.traits[i] : ""}
             required
             onChange={(e: any) => {
               trait[i]= e.target.value
               setTrait(trait)
              }}
              style={{ border: "1px solid black"}}
              className=" block flex flex-wrap   w-full  lg:h-12 "
              />
              </>
          ))}
          <div className="flex gap-2">
            <button onClick={() => addCounter()}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-green-800"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
            {counter.length > 1 && (
              <button onClick={() => deleteCounter()}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-red-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            )}
          </div>
        </Card>
      </div>

      <div className="mb-4 text-end">
        {initialValues && (
          <Button
            variant="outline"
            onClick={router.back}
            className="me-4"
            type="button"
          >
            {t("form:button-label-back")}
          </Button>
        )}

        <Button>
          {initialValues
            ? t("form:button-label-update")
            : t("form:button-label-add")}{" "}
          Plan
        </Button>
      </div>
    </form>
  );
}

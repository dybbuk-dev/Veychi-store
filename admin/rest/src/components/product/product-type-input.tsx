import SelectInput from '@components/ui/select-input';
import Label from '@components/ui/label';
import { useFormContext } from 'react-hook-form';
import Card from '@components/common/card';
import ValidationError from '@components/ui/form-validation-error';
import { ProductType } from '@ts-types/generated';
import { useTranslation } from 'next-i18next';

const productType = [
  { name: 'Simple Product', value: ProductType.Simple },
  { name: 'Variable Product', value: ProductType.Variable },
];

const ProductTypeInput = ({ tooltip }: { tooltip?: string }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const { t } = useTranslation();

  return (
    <Card className="w-full sm:w-8/12 md:w-2/3">
      <div className="mb-5">
        <div className="has-tooltip">
          {tooltip && (
            <span className="tooltip rounded shadow-lg p-1 bg-gray-100 text-red-500 font-bold text-[0.8rem] -mt-10 mr-12 w-48">
              {tooltip}
            </span>
          )}
          <Label>
            {t('form:form-title-product-type')}{' '}
            <span className="text-red-500">(?)</span>
          </Label>
        </div>
        <SelectInput
          name="productTypeValue"
          control={control}
          getOptionLabel={(option: any) => option.name}
          getOptionValue={(option: any) => option.value}
          options={productType}
        />
        <ValidationError message={t(errors.productTypeValue?.message)} />
      </div>
    </Card>
  );
};

export default ProductTypeInput;

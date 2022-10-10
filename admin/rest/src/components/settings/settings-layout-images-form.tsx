import Description from '@components/ui/description';
import Card from '@components/common/card';
import FileInput from '@components/ui/file-input';
import Button from '@components/ui/button';
import Input from '@components/ui/input';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { Control, UseFormRegister } from 'react-hook-form/dist/types/form';
import { FieldValues } from 'react-hook-form/dist/types/fields';
import { DeepMap, DeepPartial } from 'react-hook-form/dist/types/utils';
import { FieldError } from 'react-hook-form/dist/types/errors';
import { useMemo } from 'react';
import SelectInput from '@components/ui/select-input';
import Label from '@components/ui/label';
import { useTagsQuery } from '@data/tag/use-tags.query';

async function onSubmit(values: any) {
  console.log(values);
}
export default function SettingsLayoutImagesForm() {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm();
  const fieldsArray = useMemo(() => {
    return new Array(8).fill('');
  }, []);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {fieldsArray.map((_, i) => (
        <ImageInput
          register={register}
          control={control}
          errors={errors}
          index={i}
        />
      ))}

      <div className="mb-4 text-end">
        <Button>{t('form:button-label-save-settings')}</Button>
      </div>
    </form>
  );
}

const positionOptions = [
  { label: 'Izquierda', value: 'left' },
  { label: 'Centro', value: 'middle' },
  { label: 'Derecha', value: 'right' },
];

const ImageInput = ({
  control,
  register,
  errors,
  index,
}: {
  register: UseFormRegister<FieldValues>;
  control: Control<FieldValues, object>;
  errors: DeepMap<DeepPartial<any>, FieldError>;
  index: number;
}) => {
  const { t } = useTranslation();
  const { data = { tags: { data: [] } }, isLoading: loading } = useTagsQuery({
    limit: 999,
  });
  console.log(data);
  return (
    <div className="flex flex-wrap pb-8 border-t border-dashed border-border-base my-5 sm:my-8 pt-6">
      <Description
        title={'Image ' + String.fromCharCode(97 + index).toUpperCase()}
        details={'Information'}
        className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
      />
      <Card className="w-full sm:w-8/12 md:w-2/3">
        <Input
          label={'Título'}
          {...register('title')}
          error={t(errors.siteTitle?.message!)}
          variant="outline"
          className="mb-5"
        />
        <Input
          label={'Texto'}
          {...register('text')}
          error={t(errors.siteTitle?.message!)}
          variant="outline"
          className="mb-5"
        />
        <Label>Posición del texto</Label>
        <SelectInput
          control={control}
          name="text_position"
          defaultValue={positionOptions[1]}
          options={positionOptions}
        />
        <Input
          label={'Subtítulo'}
          {...register('subtitle')}
          error={t(errors.siteTitle?.message!)}
          variant="outline"
          className="mb-5 mt-5"
        />
        <Label className="mt-5">Posición del subtítulo</Label>
        <SelectInput
          control={control}
          name="subtitle_position"
          defaultValue={positionOptions[1]}
          options={positionOptions}
        />
        <Label className="mt-5">Colección</Label>
        <SelectInput
          control={control}
          name="slug"
          options={data.tags.data.map((item) => ({
            value: item.slug,
            label: item.name,
          }))}
        />
        <br />
        <FileInput name={'image' + index} control={control} multiple={false} />
      </Card>
    </div>
  );
};

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
import { UseQueryResult } from 'react-query';
import { TagPaginator } from '@ts-types/generated';
import axios from 'axios';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
axios.defaults.baseURL = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;

const formatHref = (url: string) => '/' + url.split('/').slice(3).join('/');

async function onSubmit(values: any) {
  const marketingImages = Object.values(values).map(
    ({
      id,
      title,
      subtitle,
      text,
      type,
      subtitle_position,
      slug,
      text_position,
      image,
    }: any) => ({
      id,
      title: title || '',
      subtitle: subtitle || '',
      text: text || '',
      type,
      slug: slug.value,
      subtitle_position: subtitle_position.value,
      text_position: text_position.value,
      image: {
        desktop: {
          height: image.desktop.height,
          width: image.desktop.width,
          slug: formatHref(image.desktop.attachment.thumbnail),
          url: formatHref(image.desktop.attachment.thumbnail),
        },
        mobile: {
          height: image.mobile.height,
          width: image.mobile.width,
          slug: formatHref(image.mobile.attachment.thumbnail),
          url: formatHref(image.mobile.attachment.thumbnail),
        },
      },
    })
  );
  try {
    const tkn = Cookies.get('AUTH_CRED')!;
    if (!tkn) return;
    const { token } = JSON.parse(tkn);
    const res: any = await axios.put(
      'marketing',
      { marketing_images: marketingImages },
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    );
    Swal.fire('Perfecto!', 'Información actualizada correctamente', 'success');
  } catch (e) {
    Swal.fire('Ups!', 'Hubo un error', 'error');
  }
}

const positionOptions = [
  { label: 'Izquierda', value: 'left' },
  { label: 'Centro', value: 'middle' },
  { label: 'Derecha', value: 'right' },
];
interface FormData {
  title: string;
  text: string;
  subtitle: string;
  img: [
    {
      slug: string;
      url: string;
      width: number;
      height: number;
    }
  ];
  slug: { label: string; value: string };
  subtitle_position: { label: string; value: string };
  text_position: { label: string; value: string };
}
export interface LayoutImage {
  id: number;
  title: string;
  text: string;
  text_position: string;
  subtitle: string;
  subtitle_position: string;
  slug: string;
  image: {
    mobile: {
      slug: string;
      url: string;
      width: number;
      height: number;
    };
    desktop: {
      slug: string;
      url: string;
      width: number;
      height: number;
    };
  };
  type: string;
}

export default function SettingsLayoutImagesForm({
  imagesData,
  tags,
}: {
  imagesData: LayoutImage[];
  tags: { tags: TagPaginator };
}) {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm({ defaultValues: formFormmater({ imagesData, tags }) });
  const fieldsArray = useMemo(() => {
    return new Array(imagesData.length).fill('');
  }, []);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {fieldsArray.map((_, i) => (
        <ImageInput
          register={register}
          control={control}
          errors={errors}
          index={i}
          data={tags}
        />
      ))}

      <div className="mb-4 text-end">
        <Button>{t('form:button-label-save-settings')}</Button>
      </div>
    </form>
  );
}

const ImageInput = ({
  control,
  register,
  errors,
  index,
  data,
}: {
  register: UseFormRegister<FieldValues>;
  control: Control<FieldValues, object>;
  errors: DeepMap<DeepPartial<any>, FieldError>;
  index: number;
  data: { tags: TagPaginator };
}) => {
  const { t } = useTranslation();

  const imageLabel = useMemo(() => {
    return 'image' + index + '.';
  }, []);
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
          {...register(imageLabel + 'title')}
          error={t(errors.siteTitle?.message!)}
          variant="outline"
          className="mb-5"
        />
        <Input
          label={'Texto'}
          {...register(imageLabel + 'text')}
          error={t(errors.siteTitle?.message!)}
          variant="outline"
          className="mb-5"
        />
        <Label>Posición del texto</Label>
        <SelectInput
          control={control}
          name={imageLabel + 'text_position'}
          defaultValue={positionOptions[1]}
          options={positionOptions}
        />
        <Input
          label={'Subtítulo'}
          {...register(imageLabel + 'subtitle')}
          error={t(errors.siteTitle?.message!)}
          variant="outline"
          className="mb-5 mt-5"
        />
        <Label className="mt-5">Posición del subtítulo</Label>
        <SelectInput
          control={control}
          name={imageLabel + 'subtitle_position'}
          defaultValue={positionOptions[1]}
          options={positionOptions}
        />
        <Label className="mt-5">Colección</Label>
        <SelectInput
          control={control}
          name={imageLabel + 'slug'}
          options={data.tags.data.map((item) => ({
            value: item.slug,
            label: item.name,
          }))}
        />
        <br />
        <Label className="mt-5">Imagen en Pantallas Grandes</Label>

        <FileInput
          name={imageLabel + 'image.desktop.attachment'}
          control={control}
          multiple={false}
        />
        <br />
        <Label className="mt-5">Imagen en Pantallas Pequeñas / Móviles</Label>

        <FileInput
          name={imageLabel + 'image.mobile.attachment'}
          control={control}
          multiple={false}
        />
      </Card>
    </div>
  );
};
const formFormmater = ({
  imagesData,
  tags,
}: {
  imagesData: LayoutImage[];
  tags: { tags: TagPaginator };
}) => {
  const result: {
    [key: string]: LayoutImage;
  } = imagesData.reduce(
    (acc, curr, i) => ({
      ...acc,
      [`image${i}`]: {
        ...curr,
        slug: {
          value: curr.slug,
          label: tags.tags.data.find((tag) => tag.slug === curr.slug)!.name,
        },
        text_position: positionOptions.find(
          (option) => option.value === curr.text_position
        ),
        subtitle_position: positionOptions.find(
          (option) => option.value === curr.subtitle_position
        ),
        image: {
          desktop: {
            ...curr.image.desktop,
            attachment: {
              id: 391,
              thumbnail:
                process.env.NEXT_PUBLIC_REST_API_ENDPOINT +
                curr.image.desktop.slug.slice(1),
              original:
                process.env.NEXT_PUBLIC_REST_API_ENDPOINT +
                curr.image.desktop.slug.slice(1),
            },
          },
          mobile: {
            ...curr.image.mobile,
            attachment: {
              id: 391,
              thumbnail:
                process.env.NEXT_PUBLIC_REST_API_ENDPOINT +
                curr.image.mobile.slug.slice(1),
              original:
                process.env.NEXT_PUBLIC_REST_API_ENDPOINT +
                curr.image.mobile.slug.slice(1),
            },
          },
        },
      },
    }),
    {}
  );
  return result;
};

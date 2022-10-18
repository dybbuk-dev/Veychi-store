import Link from '@components/ui/link';
import Image from 'next/image';
import type { FC } from 'react';
import { useWindowSize } from '@utils/use-window-size';
import cn from 'classnames';
import { LinkProps } from 'next/link';

interface BannerProps {
  data: any;
  variant?: 'rounded' | 'default';
  effectActive?: boolean;
  className?: string;
  classNameInner?: string;
  href: LinkProps['href'];
}

function getImage(deviceWidth: number, imgObj: any) {
  return deviceWidth < 480 ? imgObj.mobile : imgObj.desktop;
}

const BannerCard: FC<BannerProps> = ({
  data,
  className,
  variant = 'rounded',
  effectActive = false,
  classNameInner,
  href,
}) => {
  const { width } = useWindowSize();
  const { title, image, text, text_position, subtitle_position, subtitle } =
    data;
  const selectedImage = getImage(width, image);
  console.log({ text });
  return (
    <div className={cn('mx-auto', className)}>
      <Link
        href={href}
        className={cn(
          'h-full group flex justify-center relative overflow-hidden',
          classNameInner
        )}
      >
        <Image
          src={
            process.env.NEXT_PUBLIC_REST_API_ENDPOINT +
            selectedImage.url.slice(1)
          }
          width={selectedImage.width}
          height={selectedImage.height}
          alt={title}
          quality={100}
          className={cn('bg-gray-300 object-cover w-full', {
            'rounded-md': variant === 'rounded',
          })}
        />
        <div
          className={` p-4 flex-col gap-2 text-gray-300 flex w-full h-full absolute justify-center  font-bold  `}
        >
          <span
            className={`text-[2rem]  ${
              text_position === 'left'
                ? 'self-start'
                : text_position === 'right'
                ? 'self-end'
                : 'self-center'
            }`}
          >
            {text}
          </span>
          <span
            className={` text-[1.7rem] ${
              subtitle_position === 'left'
                ? 'self-start'
                : subtitle_position === 'right'
                ? 'self-end'
                : 'self-center'
            }`}
          >
            {subtitle}
          </span>
        </div>
        {effectActive && (
          <div className="absolute top-0 -left-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine" />
        )}
      </Link>
    </div>
  );
};

export default BannerCard;

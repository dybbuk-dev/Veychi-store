import Image from 'next/image';
import Link from '@components/ui/link';
import cn from 'classnames';
import { siteSettings } from '@settings/site.settings';
import { useSettings } from '@contexts/settings.context';

const Logo: React.FC<React.AnchorHTMLAttributes<{}>> = ({
  className,
  ...props
}) => {
  const { logo, siteTitle } = useSettings();
  return (
    <Link
      href={siteSettings.logo.href}
      className={cn('inline-flex', className)}
      {...props}
    >
      <div className="overflow-hidden relative w-[90px] h-[90px] ">
        <Image
          src={logo?.original ?? siteSettings.logo.url}
          alt={siteTitle ?? siteSettings.logo.alt}
          layout="fill"
          objectFit="contain"
          loading="eager"
        />
      </div>
    </Link>
  );
};

export default Logo;

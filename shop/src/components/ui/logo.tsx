import Image from 'next/image';
import Link from '@components/ui/link';
import cn from 'classnames';
import { siteSettings } from '@settings/site.settings';
import { useSettings } from '@contexts/settings.context';

const Logo: React.FC<any> = ({
  className,
  width = 95,
  height = 85,
  ...props
}) => {
  const { logo, siteTitle } = useSettings();

  return (
    <Link
      href={'/'}
      className={cn('inline-flex focus:outline-none', className)}
      {...props}
    >
      <Image
        src={logo?.original ?? siteSettings.logo.url}
        alt={siteTitle || 'ChawkBazar Logo'}
        // TODO: Make it dynamic
        height={height}
        width={width}
        layout="fixed"
        loading="eager"
      />
    </Link>
  );
};

export default Logo;

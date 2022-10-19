import Description from '@components/ui/description';
import Card from '@components/common/card';
import { siteSettings } from '@settings/site.settings';
import { useTranslation } from 'next-i18next';
import QRImage from './qr-code.svg';
import Image from 'next/image';
import Button from '@components/ui/button';
import ReactToPrint from 'react-to-print';
import QRCode from 'react-qr-code';
import React from 'react';
import Box from '@mui/material/Box';
export default function QRViewer() {
  const { t } = useTranslation();
  const docRef = React.useRef(null);

  const logoInformation = (
    <span>
      {t('form:qr-help-text')} <br />
      {t('form:qr-dimension-help-text')} &nbsp;
    </span>
  );

  return (
    <div>
      <div className="flex flex-wrap pb-8 border-b border-dashed border-border-base my-5 sm:my-8">
        <Description
          title={t('form:input-label-qr-code')}
          details={logoInformation}
          className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3 flex justify-center items-center flex-col">
          <Box ref={docRef}>
            <Image
              src={QRImage}
              layout="fixed"
              width="320"
              height="320"
              className="mx-auto"
            />
          </Box>
          <ReactToPrint
            trigger={() => <Button>{t('form:print-button')}</Button>}
            content={() => docRef.current}
          />
        </Card>
      </div>
    </div>
  );
}

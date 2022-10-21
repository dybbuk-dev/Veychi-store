import Container from '@components/ui/container';
import BrandGridBlock from '@containers/brand-grid-block';
import CategoryBlock from '@containers/category-block';
import { getLayout } from '@components/layout/layout';
import BannerWithProducts from '@containers/banner-with-products';
import BannerBlock from '@containers/banner-block';
import Divider from '@components/ui/divider';
import ProductsFeatured from '@containers/products-featured';
import BannerSliderBlock from '@containers/banner-slider-block';
import Subscription from '@components/common/subscription';
import {
  masonryBanner,
  promotionBanner,
  modernDemoProductBanner as productBanner,
} from '@data/static/banners';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { getToken } from '@framework/utils/get-token';

export { getStaticProps } from '@framework/ssr/homepage/modern';

export default function Home() {
  const [marketingImages, setMarketingImages] = useState<any>([]);

  const masonryBanner = useMemo(() => {
    return marketingImages.slice(0, 6).map((image: any) => ({
      ...image,
      image: {
        ...image.image,
        mobile: {
          ...image.image.mobile,
          url: image.image.mobile.url.split('/backend')[1],
        },
        desktop: {
          ...image.image.desktop,
          url: image.image.desktop.url.split('/backend')[1],
        },
      },
    }));
  }, [marketingImages]);
  const promotionBanner = useMemo(() => {
    return marketingImages.slice(6, 9).map((image: any) => ({
      ...image,
      image: {
        ...image.image,
        mobile: {
          ...image.image.mobile,
          url: image.image.mobile.url.split('/backend')[1],
        },
        desktop: {
          ...image.image.desktop,
          url: image.image.desktop.url.split('/backend')[1],
        },
      },
    }));
  }, [marketingImages]);
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          process.env.NEXT_PUBLIC_REST_API_ENDPOINT + 'marketing-images-data',
          {
            headers: {
              Authorization: 'Bearer ' + getToken()!,
            },
          }
        );
        setMarketingImages(res.data.data);
      } catch (e) {}
    })();
  }, []);
  return (
    <>
      <div className="md:px-8 xl:px-14 px-3">
        <BannerBlock data={masonryBanner} />
      </div>
      <Container>
        <CategoryBlock
          sectionHeading="text-shop-by-category"
          variant="rounded"
        />
        <ProductsFeatured sectionHeading="text-featured-products" />
        <BannerSliderBlock data={promotionBanner} />
        <BannerWithProducts
          sectionHeading="text-on-selling-products"
          categorySlug="/search"
          data={productBanner}
          variant="reverse"
        />
        <BrandGridBlock sectionHeading="text-top-brands" limit={8} />
        <Subscription className="bg-opacity-0 px-5 sm:px-16 xl:px-0 py-12 md:py-14 xl:py-16" />
      </Container>
      <Divider className="mb-0" />
    </>
  );
}

Home.getLayout = getLayout;

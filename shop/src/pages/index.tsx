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

export { getStaticProps } from '@framework/ssr/homepage/modern';

export default function Home() {
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

import { adminAndOwnerOnly, adminOwnerAndStaffOnly } from '@utils/auth-utils';
import { ROUTES } from '@utils/routes';

export const siteSettings = {
  name: 'ChawkBazar',
  description: '',
  logo: {
    url: '/logo.webp',
    alt: 'ChawkBazar',
    href: '/',
    width: 128,
    height: 40,
  },
  defaultLanguage: 'en',
  author: {
    name: 'RedQ, Inc.',
    websiteUrl: 'https://redq.io',
    address: '',
  },
  headerLinks: [],
  authorizedLinks: [
    {
      href: ROUTES.PROFILE_UPDATE,
      labelTransKey: 'authorized-nav-item-profile',
    },
    {
      href: ROUTES.LOGOUT,
      labelTransKey: 'authorized-nav-item-logout',
    },
  ],
  currencyCode: 'USD',
  sidebarLinks: {
    admin: [
      {
        label: 'Comercial',
        children: [
          {
            href: ROUTES.DASHBOARD,
            label: 'sidebar-nav-item-dashboard',
            icon: 'DashboardIcon',
          },
          {
            href: ROUTES.SHOPS,
            label: 'sidebar-nav-item-shops',
            icon: 'ShopIcon',
          },
          {
            href: ROUTES.ADMIN_MY_SHOPS,
            label: 'sidebar-nav-item-my-shops',
            icon: 'MyShopIcon',
          },
          {
            href: ROUTES.PRODUCTS,
            label: 'sidebar-nav-item-products',
            icon: 'ProductsIcon',
          },
          {
            href: ROUTES.ORDERS,
            label: 'sidebar-nav-item-orders',
            icon: 'OrdersIcon',
          },
          {
            href: ROUTES.ORDER_STATUS,
            label: 'sidebar-nav-item-order-status',
            icon: 'OrdersStatusIcon',
          },
          {
            href: ROUTES.SHIPPINGS,
            label: 'sidebar-nav-item-shippings',
            icon: 'ShippingsIcon',
          },
          {
            href: ROUTES.TICKETS,
            label: 'sidebar-nav-item-tickets',
            icon: 'WithdrawIcon',
          },
        ],
      },
      {
        label: 'Marketing',
        children: [
          {
            href: ROUTES.ATTRIBUTES,
            label: 'sidebar-nav-item-attributes',
            icon: 'AttributeIcon',
          },
          {
            href: ROUTES.BRANDS,
            label: 'sidebar-nav-item-categories',
            icon: 'TypesIcon',
          },
          {
            href: ROUTES.CATEGORIES,
            label: 'sidebar-nav-item-subcategories',
            icon: 'CategoriesIcon',
          },
          {
            href: ROUTES.TAGS,
            label: 'sidebar-nav-item-tags',
            icon: 'TagIcon',
          },
          {
            href: ROUTES.SETTINGS,
            label: 'sidebar-nav-item-settings',
            icon: 'SettingsIcon',
          },
          {
            href: ROUTES.COUPONS,
            label: 'sidebar-nav-item-coupons',
            icon: 'CouponsIcon',
          },
        ],
      },
      {
        label: 'Administración',
        children: [
          {
            href: ROUTES.USERS,
            label: 'sidebar-nav-item-customers-user',
            icon: 'UsersIcon',
          },

          {
            href: ROUTES.TAXES,
            label: 'sidebar-nav-item-taxes',
            icon: 'TaxesIcon',
          },

          {
            href: ROUTES.WITHDRAWS,
            label: 'sidebar-nav-item-withdraws',
            icon: 'WithdrawIcon',
          },
        ],
      },
      {
        label: 'RH',
        children: [
          {
            href: ROUTES.ADMINISTRATORS,
            label: 'sidebar-nav-item-staff',
            icon: 'UsersIcon',
          },
        ],
      },
    ],
    shop: [
      {
        href: (shop: string) => `${ROUTES.DASHBOARD}${shop}`,
        label: 'sidebar-nav-item-dashboard',
        icon: 'DashboardIcon',
        permissions: adminOwnerAndStaffOnly,
      },
      {
        href: (shop: string) => `/${shop}${ROUTES.ATTRIBUTES}`,
        label: 'sidebar-nav-item-attributes',
        icon: 'AttributeIcon',
        permissions: adminOwnerAndStaffOnly,
      },
      {
        href: (shop: string) => `/${shop}${ROUTES.PRODUCTS}`,
        label: 'sidebar-nav-item-products',
        icon: 'ProductsIcon',
        permissions: adminOwnerAndStaffOnly,
      },
      {
        href: (shop: string) => `/${shop}${ROUTES.ORDERS}`,
        label: 'sidebar-nav-item-orders',
        icon: 'OrdersIcon',
        permissions: adminOwnerAndStaffOnly,
      },
      {
        href: (shop: string) => `/${shop}${ROUTES.STAFFS}`,
        label: 'sidebar-nav-item-staff',
        icon: 'UsersIcon',
        permissions: adminAndOwnerOnly,
      },
      {
        href: (shop: string) => `/${shop}${ROUTES.WITHDRAWS}`,
        label: 'sidebar-nav-item-withdraws',
        icon: 'AttributeIcon',
        permissions: adminAndOwnerOnly,
      },
      {
        href: (shop: string) => `/${shop}${ROUTES.GET_PREMIUM}`,
        label: 'sidebar-nav-item-premium',
        icon: 'CouponsIcon',
        permissions: adminAndOwnerOnly,
      },
    ],
  },
  product: {
    placeholder: '/product-placeholder.svg',
  },
  avatar: {
    placeholder: '/avatar-placeholder.svg',
  },
};

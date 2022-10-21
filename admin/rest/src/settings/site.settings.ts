import { adminAndOwnerOnly, adminOwnerAndStaffOnly } from '@utils/auth-utils';
import {
  CEO,
  LEGAL,
  MANAGEMENT,
  MANAGER_RH,
  MARKETING,
  SHAREHOLDER,
  STAFF,
  SUPER_ADMIN,
} from '@utils/constants';
import { ROUTES } from '@utils/routes';

const allRoutes = [SUPER_ADMIN, STAFF];
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
        allowedRoles: [...allRoutes, CEO, SHAREHOLDER],
        children: [
          {
            href: ROUTES.DASHBOARD,
            label: 'sidebar-nav-item-dashboard',
            allowedRoles: [...allRoutes, CEO, SHAREHOLDER],
            icon: 'DashboardIcon',
          },
          {
            href: ROUTES.SHOPS,
            label: 'sidebar-nav-item-shops',
            allowedRoles: [...allRoutes, CEO],
            icon: 'ShopIcon',
          },
          {
            href: ROUTES.ADMIN_MY_SHOPS,
            label: 'sidebar-nav-item-my-shops',
            allowedRoles: [...allRoutes, CEO],
            icon: 'MyShopIcon',
          },
          {
            href: ROUTES.PRODUCTS,
            label: 'sidebar-nav-item-products',
            allowedRoles: [...allRoutes, CEO],
            icon: 'ProductsIcon',
          },
          {
            href: ROUTES.ORDERS,
            label: 'sidebar-nav-item-orders',
            allowedRoles: [...allRoutes, CEO, SHAREHOLDER],
            icon: 'OrdersIcon',
          },
          {
            href: ROUTES.ORDER_STATUS,
            label: 'sidebar-nav-item-order-status',
            allowedRoles: [...allRoutes, CEO],
            icon: 'OrdersStatusIcon',
          },
          {
            href: ROUTES.SHIPPINGS,
            label: 'sidebar-nav-item-shippings',
            allowedRoles: [...allRoutes, CEO],
            icon: 'ShippingsIcon',
          },
          {
            href: ROUTES.TOKENS,
            label: 'Tokens',
            allowedRoles: [...allRoutes, CEO],
            icon: 'WithdrawIcon',
          },
          {
            href: ROUTES.PREMIUMPLANS,
            label: 'sidebar-nav-item-premium-plans',
            allowedRoles: [...allRoutes, CEO],
            icon: 'CategoriesIcon',
          },
        ],
      },
      {
        label: 'Marketing',
        allowedRoles: [...allRoutes, CEO, MARKETING],
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
            href: ROUTES.SITEQR,
            label: 'QR',
            icon: 'AttributeIcon',
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
        allowedRoles: [...allRoutes, CEO, MANAGEMENT, SHAREHOLDER],

        children: [
          {
            href: ROUTES.USERS,
            label: 'sidebar-nav-item-customers-user',
            allowedRoles: [...allRoutes, MANAGEMENT],
            icon: 'UsersIcon',
          },

          {
            href: ROUTES.TAXES,
            label: 'sidebar-nav-item-taxes',
            allowedRoles: [...allRoutes, MANAGEMENT],
            icon: 'TaxesIcon',
          },

          {
            href: ROUTES.WITHDRAWS,
            label: 'sidebar-nav-item-withdraws',
            allowedRoles: [...allRoutes, MANAGEMENT, SHAREHOLDER],
            icon: 'WithdrawIcon',
          },
          {
            href: ROUTES.PREMIUM_SALES,
            label: 'sidebar-nav-item-sales',
            allowedRoles: [...allRoutes, MANAGEMENT, SHAREHOLDER],
            icon: 'CategoriesIcon',
          },
        ],
      },
      {
        label: 'RH',
        allowedRoles: [...allRoutes, CEO, LEGAL, MANAGER_RH],

        children: [
          {
            href: ROUTES.ADMINISTRATORS,
            label: 'sidebar-nav-item-staff',
            allowedRoles: [...allRoutes, CEO, LEGAL, MANAGER_RH],
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
        href: (shop: string) => `/${shop}/disputes`,
        label: 'sidebar-nav-item-disputes',
        icon: 'ProductsIcon',
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

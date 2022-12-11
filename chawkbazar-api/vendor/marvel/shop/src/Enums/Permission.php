<?php


namespace Marvel\Enums;

use BenSampo\Enum\Enum;

/**
 * Class RoleType
 * @package App\Enums
 */
final class Permission extends Enum
{
    public const SUPER_ADMIN = 'super_admin';
    public const STORE_OWNER = 'store_owner';
    public const STAFF = 'staff';
    public const CUSTOMER = 'customer';
    public const SHAREHOLDER= 'shareholder';
    public const CEO = 'CEO';
    public const MANAGER_RH = 'manager_rh';
    public const MARKETING = 'marketing';
    public const MANAGEMENT = 'management';
    public const LEGAL = 'legal';
}

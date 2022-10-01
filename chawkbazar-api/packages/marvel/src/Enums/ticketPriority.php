<?php

namespace Marvel\Enums;

use BenSampo\Enum\Enum;

/**
 * @method static static low()
 * @method static static medium()
 * @method static static high()
 */
final class ticketPriority extends Enum
{
    const LOW = 'low';
    const MEDIUM = 'medium';
    const HIGH = 'high';
}

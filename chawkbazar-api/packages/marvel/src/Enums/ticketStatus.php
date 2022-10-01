<?php

namespace Marvel\Enums;

use BenSampo\Enum\Enum;

/**
 * @method static static open()
 * @method static static closed()
 */
final class ticketStatus extends Enum
{
    const OPEN =   'open';
    const CLOSED =   'closed';
}

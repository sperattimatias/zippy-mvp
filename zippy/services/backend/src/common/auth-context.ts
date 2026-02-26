import { ForbiddenException } from '@nestjs/common';
import { AppRole } from './roles';

export function requireRole(actual: string | undefined, allowed: AppRole[]) {
  if (!actual || !allowed.includes(actual as AppRole)) {
    throw new ForbiddenException('FORBIDDEN_ROLE');
  }
}

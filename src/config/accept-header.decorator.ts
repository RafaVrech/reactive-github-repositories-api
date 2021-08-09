import { SetMetadata } from '@nestjs/common';

export const Accept = (...accepted: string[]) => SetMetadata('accept', accepted);

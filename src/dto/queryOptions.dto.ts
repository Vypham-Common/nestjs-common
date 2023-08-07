import { ApiProperty } from '@nestjs/swagger'
import { TransformArray } from '../decorators'

export class QueryOptionDto {
  @ApiProperty({ example: 1 })
  page?: number
  @ApiProperty({ example: 10 })
  limit?: number
  @ApiProperty({ example: ['name:asc'] })
  @TransformArray
  sort?: string[]
}

import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsOptional, Min } from 'class-validator'
import { TransformArray } from '../decorators'

export class QueryOptionDto {
  @ApiProperty({ example: 1 })
  @IsOptional()
  @Min(1)
  page?: number

  @ApiProperty({ example: 10 })
  @IsOptional()
  @Min(1)

  limit?: number
  @ApiProperty({ example: ['name:asc'] })
  @IsOptional()
  @IsArray()
  @TransformArray
  sort?: string[]
}

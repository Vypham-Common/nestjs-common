import { Module } from '@nestjs/common'
import { AttachmentModel } from './attachment.schema'
import { AttachmentService } from './attachment.service'

@Module({
  providers: [AttachmentService, AttachmentModel],
  exports: [AttachmentService, AttachmentModel],
})
export class AttachmentModule {}

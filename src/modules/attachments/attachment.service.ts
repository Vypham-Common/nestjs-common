import { Inject } from '@nestjs/common'
import { AbstractService } from '../../abstracts'
import { TOKEN } from '../../enums'
import { AttachmentModel } from './attachment.schema'

export class AttachmentService extends AbstractService<AttachmentModel> {
  constructor(@Inject(TOKEN.USER) user: JWTPayload, model: AttachmentModel) {
    super(model, user)
  }
}

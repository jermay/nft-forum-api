import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiRequest } from '../auth/api-request';
import { ThreadService } from '../thread/thread.service';

@Injectable()
export class ThreadAuthorGuard implements CanActivate {
  constructor(private threadService: ThreadService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<ApiRequest>();
    if (!req.user) {
      throw new UnauthorizedException(
        'ThreadAuthorGuard expects an authenticated user',
      );
    }

    const threadId = +req.params.threadId;
    if (!threadId) {
      throw new BadRequestException(
        'PostAuthorGuard expects a threadId in the request params',
      );
    }

    const thread = await this.threadService.findOne(threadId);
    const author = thread?.comments?.length ? thread.comments[0].author : '';
    if (!author) {
      throw new BadRequestException('PostAuthorGuard post not found');
    }

    if (author !== req.user.sub) {
      throw new ForbiddenException('Authenticated user is not the author');
    }

    return true;
  }
}

import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiRequest } from '../auth/api-request';
import { PostService } from '../post/post.service';

@Injectable()
export class PostAuthorGuard implements CanActivate {
  constructor(private postService: PostService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<ApiRequest>();
    if (!req.user) {
      throw new UnauthorizedException(
        'PostAuthorGuard expects an authenticated user',
      );
    }

    const postId = +req.params.postId;
    if (!postId) {
      throw new BadRequestException(
        'PostAuthorGuard expects a postId in the request params',
      );
    }

    const post = await this.postService.findOne(postId);
    if (!post) {
      throw new BadRequestException('PostAuthorGuard post not found');
    }

    if (post.author !== req.user.sub) {
      throw new ForbiddenException('Authenticated user is not the author');
    }

    return true;
  }
}

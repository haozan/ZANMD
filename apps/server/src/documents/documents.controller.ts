import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Get()
  async listDocuments(@CurrentUser() user: any) {
    return this.documentsService.listDocuments(user.id);
  }

  @Get('*')
  async getDocument(@CurrentUser() user: any, @Param('0') path: string) {
    return this.documentsService.getDocument(user.id, path);
  }

  @Post()
  async saveDocument(
    @CurrentUser() user: any,
    @Body()
    body: {
      path: string;
      name: string;
      content: string;
      meta?: Record<string, unknown>;
    },
  ) {
    return this.documentsService.saveDocument(
      user.id,
      body.path,
      body.name,
      body.content,
      body.meta,
    );
  }

  @Delete()
  async deleteDocuments(
    @CurrentUser() user: any,
    @Body() body: { paths: string[] },
  ) {
    await this.documentsService.deleteDocuments(user.id, body.paths);
    return { success: true };
  }

  @Delete('*')
  async deleteDocument(@CurrentUser() user: any, @Param('0') path: string) {
    await this.documentsService.deleteDocument(user.id, path);
    return { success: true };
  }
}

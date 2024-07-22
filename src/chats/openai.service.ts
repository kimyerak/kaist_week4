import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { PROMPT_TEMPLATE } from './prompt';

@Injectable()
export class OpenAiService {
  private readonly apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('OPENAI_API_KEY');
  }

  async sendMessage(userMessage: string): Promise<string> {
    const prompt = PROMPT_TEMPLATE.replace('{{message}}', userMessage);

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          'https://api.openai.com/v1/engines/davinci-codex/completions',
          {
            prompt,
            max_tokens: 100,
          },
          {
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
            },
          },
        ),
      );

      return response.data.choices[0].text;
    } catch (error) {
      throw new HttpException(
        'Failed to communicate with OpenAI API',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

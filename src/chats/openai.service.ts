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

  async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async sendMessage(userMessage: string): Promise<string> {
    const prompt = PROMPT_TEMPLATE.replace('{{message}}', userMessage);

    try {
      // 지연 시간 추가
      await this.delay(1000);

      const response = await firstValueFrom(
        this.httpService.post(
          'https://api.openai.com/v1/chat/completions', // 올바른 엔드포인트
          {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 100,
          },
          {
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      console.log('OpenAI API response:', response.data); // 디버깅용 응답 출력

      if (
        response.data &&
        response.data.choices &&
        response.data.choices.length > 0
      ) {
        const messageContent = response.data.choices[0].message.content.trim();
        console.log('Extracted message content:', messageContent); // 디버깅용 출력
        return messageContent;
      } else {
        throw new HttpException(
          'Invalid response from OpenAI API',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      console.error('OpenAI API error:', error);
      if (error.response) {
        console.error('OpenAI API response data:', error.response.data);
      }
      throw new HttpException(
        'Failed to communicate with OpenAI API',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

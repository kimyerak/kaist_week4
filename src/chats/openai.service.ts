import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { PROMPT_DATE_TEMPLATE } from './prompts/prompt_date';
import { PROMPT_FIGHT_TEMPLATE } from './prompts/prompt_fight';
import { PROMPT_CONVERSATION_TEMPLATE } from './prompts/prompt_conversation';
import { PROMPT_ACTIVITY_TEMPLATE } from './prompts/prompt_activity';
import { PROMPT_GENERAL_TEMPLATE } from './prompts/prompt_general';

@Injectable()
export class OpenAiService {
  private readonly apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('OPENAI_API_KEY');
  }

  // async sendMessage(userMessage: string): Promise<string> {
  //   const prompt = PROMPT_TEMPLATE.replace('{{message}}', userMessage);
  async sendMessage(userMessage: string, topic: string): Promise<string> {
    let prompt = '';

    switch (topic) {
      case 'date':
        prompt = PROMPT_DATE_TEMPLATE.replace('{{message}}', userMessage);
        break;
      case 'activity':
        prompt = PROMPT_ACTIVITY_TEMPLATE.replace('{{message}}', userMessage);
        break;
      case 'fight':
        prompt = PROMPT_FIGHT_TEMPLATE.replace('{{message}}', userMessage);
        break;
      case 'conversation':
        prompt = PROMPT_CONVERSATION_TEMPLATE.replace(
          '{{message}}',
          userMessage,
        );
        break;
      default:
        prompt = PROMPT_GENERAL_TEMPLATE.replace('{{message}}', userMessage);
    }
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          'https://api.openai.com/v1/chat/completions', // 올바른 엔드포인트
          {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 500,
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

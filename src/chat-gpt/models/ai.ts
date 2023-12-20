import axios from 'axios';
import { Renderer } from '../renderer';
import { Conversation } from './conversation';
import { Prompt } from './prompt';
import { Race, Speaker } from './speaker';
import { Temperature } from './temperature';
import { Token } from './token';
import { Configuration, OpenAIApi } from 'openai';

export class AI extends Speaker {
  temperature: Temperature;
  token: Token;
  prompt: Prompt;

  constructor(temp: Temperature, token: Token, prompt: Prompt) {
    super(Race.AI);
    this.temperature = temp;
    this.token = token;
    this.prompt = prompt;
  }

  configure(temperature: Temperature, token: Token, prompt: Prompt) {
    this.temperature = this.temperature.update(temperature);
    this.token = this.token.update(token);
    this.prompt = this.prompt.update(prompt);
  }

  async think(conversation: Conversation) {
    const response = await this.request(this.prompt, conversation, this.token.length, this.temperature.value);
    return response;
  }

  async summarize(conversation: Conversation) {
    const titlePrompt = new Prompt("Summarize the following conversation with a title that doesn't exceed 20 letters.");
    const descriptionPrompt = new Prompt(
      'Read the following conversation, and based on the topic, predict what will be talked about. Then, write a short paragraph that summarizes the conversation.',
    );
    const title = await this.request(titlePrompt, conversation, this.token.length, 0);
    const description = await this.request(descriptionPrompt, conversation, this.token.length, 0);
    conversation.summarize({ title: title.content, description: description.content });
  }

  private async request(prompt: Prompt, conversation: Conversation, tokens: number, temperature: number) {
    const response = await axios.post('https://metagpt-server.glitch.me', {
      prompt,
      conversation,
      tokens,
      temperature,
    });

    return this.speak(response.data);
  }
}

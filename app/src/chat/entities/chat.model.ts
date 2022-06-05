import { User } from 'src/users/entities/user.model';

export interface ChatMessage {
  message: string;
  user: User;
}

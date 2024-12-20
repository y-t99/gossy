import { z } from 'zod';
import { audioMessageContentSchema } from './audio-message-content';
import { imageMessageContentSchema } from './image-message-content';
import { textMessageContentSchema } from './text-message-content';
import { videoMessageContentSchema } from './video-message-content';
import { locationMessageContentSchema } from './location-message-content';
import { fileMessageContentSchema } from './file-message-content';
import { noticeMessageContentSchema } from './notice-message-content';
import { emoteMessageContentSchema } from './emote-message-content';

export * from './audio-message-content';
export * from './file-message-content';
export * from './location-message-content';
export * from './text-message-content';
export * from './video-message-content';
export * from './image-message-content';
export * from './notice-message-content';
export * from './emote-message-content';

export const roomMessageContentSchema = z.union([
  audioMessageContentSchema,
  fileMessageContentSchema,
  locationMessageContentSchema,
  textMessageContentSchema,
  videoMessageContentSchema,
  imageMessageContentSchema,
  noticeMessageContentSchema,
  emoteMessageContentSchema,
]);

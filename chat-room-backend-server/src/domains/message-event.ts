import { audioInfoSchema } from './audio-info.type';
import { encryptedFileSchema } from './encrypted-file.type';
import { fileInfoSchema } from './file-info.type';
import { imageInfoSchema } from './image-info.type';
import { locationInfoSchema } from './location-info.type';
import { RoomMessageType } from './room-message-type.enum';
import z from 'zod';
import { videoInfoSchema } from './video-info.type';

export const textMessageContentSchema = z.object({
  body: z.string(),
  format: z.string().optional(),
  formatted_body: z.string().optional(),
  msgtype: z.literal(RoomMessageType.TEXT),
});

export const emoteMessageContentSchema = z.object({
  body: z.string(),
  format: z.string().optional(),
  formatted_body: z.string().optional(),
  msgtype: z.literal(RoomMessageType.EMOTE),
});

export const noticeMessageContentSchema = z.object({
  body: z.string(),
  format: z.string().optional(),
  formatted_body: z.string().optional(),
  msgtype: z.literal(RoomMessageType.NOTICE),
});

export const imageMessageContentSchema = z.object({
  body: z.string(),
  msgtype: z.literal(RoomMessageType.IMAGE),
  file: encryptedFileSchema.optional(),
  filename: z.string(),
  format: z.string(),
  formatted_body: z.string().optional(),
  info: imageInfoSchema,
  url: z.string().url().optional(),
});

export const fileMessageContentSchema = z.object({
  body: z.string(),
  msgtype: z.literal(RoomMessageType.FILE),
  file: encryptedFileSchema,
  filename: z.string(),
  format: z.string(),
  formatted_body: z.string().optional(),
  info: fileInfoSchema.optional(),
  url: z.string().url().optional(),
});

export const audioMessageContentSchema = z.object({
  body: z.string(),
  msgtype: z.literal(RoomMessageType.AUDIO),
  file: z.string(),
  filename: z.string(),
  format: z.string(),
  formatted_body: z.string().optional(),
  info: audioInfoSchema.optional(),
  url: z.string().url().optional(),
});

export const locationMessageContentSchema = z.object({
  body: z.string(),
  msgtype: z.literal(RoomMessageType.LOCATION),
  geo_uri: z.string().url(),
  info: locationInfoSchema.optional(),
});

export const videoMessageContentSchema = z.object({
  body: z.string(),
  msgtype: z.literal(RoomMessageType.VIDEO),
  file: encryptedFileSchema.optional(),
  filename: z.string().optional(),
  format: z.string().optional(),
  formatted_body: z.string().optional(),
  info: videoInfoSchema.optional(),
  url: z.string().url().optional(),
});

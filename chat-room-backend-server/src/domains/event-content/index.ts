import { z } from 'zod';

import { roomAvatarContentSchema } from './room-avatar-content';
import { roomCanonicalAliasContentSchema } from './room-canonical-alias-content';
import { roomCreateContentSchema } from './room-create-content';
import { roomJoinRulesContentSchema } from './room-join-rules-content';
import { roomMemberContentSchema } from './room-member-content';
import { roomMessageContentSchema } from './room-message-content';
import { roomNameContentSchema } from './room-name-content';
import { roomPowerLevelsContentSchema } from './room-power-levels-content';
import { roomTopicContentSchema } from './room-topic-content';
import { roomPinnedEventsContentSchema } from './room-pinned-events';
import { historyVisibilityContentSchema } from './history-visibility-content';
import { guestAccessContentSchema } from './guest-access-content';
import { roomThirdPartyInviteContentSchema } from './third-party-invite-content';
export * from './room-message-content';
export * from './room-avatar-content';
export * from './room-canonical-alias-content';
export * from './room-create-content';
export * from './room-name-content';
export * from './room-topic-content';
export * from './room-join-rules-content';
export * from './room-member-content';
export * from './room-pinned-events';
export * from './room-power-levels-content';
export * from './history-visibility-content';
export * from './guest-access-content';
export * from './third-party-invite-content';
export const eventContentSchema = z.union([
  roomMessageContentSchema,
  roomMemberContentSchema,
  roomAvatarContentSchema,
  roomCanonicalAliasContentSchema,
  roomCreateContentSchema,
  roomNameContentSchema,
  roomTopicContentSchema,
  roomJoinRulesContentSchema,
  roomPinnedEventsContentSchema,
  roomPowerLevelsContentSchema,
  historyVisibilityContentSchema,
  guestAccessContentSchema,
  roomThirdPartyInviteContentSchema,
]);

export type EventContent = z.infer<typeof eventContentSchema>;

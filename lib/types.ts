export type Platform = "twitter" | "youtube";

export type User = {
  id?: string;
  userId?: string;
  username?: string;
  author?: string;
  name?: string;
  text?: string;
  comment?: string;

  profilePicture?: string;
  avatar?: string;
  profileImage?: string;
  profile_image_url?: string;
  image?: string;

  isPrivate?: boolean;
  followers?: number;
  posts?: number;
  bio?: string;
  createdAt?: string;
};

export type Rules = {
  mustRetweet?: boolean;
  mustFollow?: boolean;
  mustLike?: boolean;
  mustComment?: boolean;

  mustMention?: boolean;
  mustKeyword?: boolean;
  mustMinLength?: boolean;
  mustProfile?: boolean;
  mustMinFollowers?: boolean;

  mustExtraFollow?: boolean;
  mustAccountAge?: boolean;
  advancedBotFilter?: boolean;

  blockHidden?: boolean;
  blockPrevious?: boolean;

  aiSafe?: boolean;
  uniqueComments?: boolean;

  // YENI kurallar
  excludePastWinners?: boolean;
  uniqueUsers?: boolean;
  mustName?: boolean;
  mustBio?: boolean;
  mustMinMentions?: boolean;
  mustMinPosts?: boolean;

  keyword?: string;
  mentionUsername?: string;
  extraFollowAccount?: string;

  minLength?: number | string;
  minLen?: number | string;
  minMentions?: number | string;
  minPosts?: number | string;

  minFollowers?: number | string;
  accountAgeDays?: number | string;
};

export type DrawRequest = {
  platform: Platform;
  input: string;

  winnerCount?: number;
  backupCount?: number;

  rules?: Rules;
  excluded?: string[];
};

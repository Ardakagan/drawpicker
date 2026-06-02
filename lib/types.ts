export type Platform = "twitter" | "youtube";

export type User = {
  id: string;
  userId: string;
  username: string;
  author: string;
  text: string;
  profilePicture?: string;
  isPrivate?: boolean;
  followers?: number;
};

export type Rules = {
  mustRetweet?: boolean;
  mustFollow?: boolean;
  mustLike?: boolean;
  mustComment?: boolean;
  mustMention?: boolean;
  mustKeyword?: boolean;
  keyword?: string;
  mustMinLength?: boolean;
  minLen?: number;
  mustProfile?: boolean;
  mustMinFollowers?: boolean;
  minFollowers?: number;
  blockHidden?: boolean;
  blockPrevious?: boolean;
  aiSafe?: boolean;
  uniqueComments?: boolean;
};

export type DrawRequest = {
  platform: Platform;
  input: string;
  winnerCount: number;
  backupCount: number;
  rules: Rules;
  excluded?: string[];
};

export type DrawResult = {
  success: boolean;
  truncated: boolean;
  totalParticipants: number;
  eligibleCount: number;
  mainWinners: User[];
  backupWinners: User[];
  error?: string;
};

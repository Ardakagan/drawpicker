"use client";

import GiveawayPage from "@/components/GiveawayPage";

const config = {
  platform: "twitter",
  accent: "sky",
  icon: "𝕏",

  titleKey: "tw_title",
  subKey: "tw_sub",

  inputKey: "tw_input",
  inputPhKey: "tw_inputPh",

  // FREE: beğeni + retweet + yorum  |  BRONZ: + takip
  quickRules: [
    { key: "mustLike", icon: "❤️", plan: "free" },
    { key: "mustRetweet", icon: "🔁", plan: "free" },
    { key: "mustComment", icon: "💬", plan: "free" },
    { key: "mustFollow", icon: "👤", plan: "free" },
  ],

  advancedRules: [
    { key: "mustKeyword", icon: "🔑", plan: "free", input: "keyword" },
    { key: "mustMention", icon: "🏷️", plan: "free", input: "mentionUsername" },
    { key: "mustMinLength", icon: "✍️", plan: "free", input: "minLength" },
    { key: "uniqueComments", icon: "🔄", plan: "free" },
    { key: "mustProfile", icon: "📸", plan: "free" },
    { key: "mustMinFollowers", icon: "👥", plan: "free", input: "minFollowers" },
    { key: "mustExtraFollow", icon: "➕", plan: "free", input: "extraFollowAccount" },
    { key: "aiSafe", icon: "🤖", plan: "free" },
    { key: "mustAccountAge", icon: "📅", plan: "free", input: "accountAgeDays" },
    { key: "blockHidden", icon: "🔓", plan: "free" },
    { key: "advancedBotFilter", icon: "🛡️", plan: "free" },
  ],

  ruleDefs: [
    { key: "mustLike" },
    { key: "mustRetweet" },
    { key: "mustComment" },
    { key: "mustFollow" },
    { key: "mustKeyword" },
    { key: "mustMention" },
    { key: "mustMinLength" },
    { key: "uniqueComments" },
    { key: "mustProfile" },
    { key: "mustMinFollowers" },
    { key: "mustExtraFollow" },
    { key: "aiSafe" },
    { key: "mustAccountAge" },
    { key: "blockHidden" },
    { key: "advancedBotFilter" },
  ],

  showKeyword: true,
  showMinLen: true,
};

export default function TwitterPage() {
  return <GiveawayPage config={config} />;
}

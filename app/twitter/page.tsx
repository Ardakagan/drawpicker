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

  quickRules: [
    { key: "mustLike", icon: "❤️", plan: "free" },
    { key: "mustRetweet", icon: "🔁", plan: "free" },
    { key: "mustComment", icon: "💬", plan: "free" },
    { key: "mustFollow", icon: "👤", plan: "free" },
    { key: "excludePastWinners", icon: "🚫", plan: "free" },
  ],

  advancedRules: [
    { key: "mustMention", icon: "🏷️", plan: "free", input: "mentionUsername" },
    { key: "mustKeyword", icon: "🔑", plan: "free", input: "keyword" },
    { key: "mustExtraFollow", icon: "➕", plan: "free", input: "extraFollowAccount" },
    { key: "mustProfile", icon: "📸", plan: "free" },
    { key: "mustMinFollowers", icon: "👥", plan: "free", input: "minFollowers" },
    { key: "mustMinLength", icon: "✍️", plan: "free", input: "minLength" },
    { key: "mustMinMentions", icon: "🔖", plan: "free", input: "minMentions" },
    { key: "mustMinPosts", icon: "📝", plan: "free", input: "minPosts" },
    { key: "mustName", icon: "🆔", plan: "free" },
    { key: "mustBio", icon: "📄", plan: "free" },
    { key: "uniqueComments", icon: "🔄", plan: "free" },
    { key: "uniqueUsers", icon: "👥", plan: "free" },
    { key: "aiSafe", icon: "🤖", plan: "free" },
    { key: "mustAccountAge", icon: "📅", plan: "free", input: "accountAgeDays" },
    { key: "blockHidden", icon: "🔓", plan: "free" },
    { key: "advancedBotFilter", icon: "🛡️", plan: "free" },
  ],

  ruleDefs: [
    { key: "mustLike" }, { key: "mustRetweet" }, { key: "mustComment" }, { key: "mustFollow" },
    { key: "excludePastWinners" }, { key: "mustMention" }, { key: "mustKeyword" }, { key: "mustExtraFollow" },
    { key: "mustProfile" }, { key: "mustMinFollowers" }, { key: "mustMinLength" }, { key: "mustMinMentions" },
    { key: "mustMinPosts" }, { key: "mustName" }, { key: "mustBio" }, { key: "uniqueComments" },
    { key: "uniqueUsers" }, { key: "aiSafe" }, { key: "mustAccountAge" }, { key: "blockHidden" },
    { key: "advancedBotFilter" },
  ],

  showKeyword: true,
  showMinLen: true,
};

export default function TwitterPage() {
  return <GiveawayPage config={config} />;
}

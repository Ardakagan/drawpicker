"use client";

import GiveawayPage from "@/components/GiveawayPage";

const config = {
  platform: "youtube",
  accent: "purple",
  icon: "▶️",

  titleKey: "yt_title",
  subKey: "yt_sub",

  inputKey: "yt_input",
  inputPhKey: "yt_inputPh",

  // YouTube sadece yorum verisi verir (begeni/abone API'de yok)
  quickRules: [
    { key: "mustComment", icon: "💬", plan: "free", fixed: true, default: true },
    { key: "excludePastWinners", icon: "🚫", plan: "free" },
  ],

  advancedRules: [
    { key: "mustKeyword", icon: "🔑", plan: "free", input: "keyword" },
    { key: "mustMention", icon: "🏷️", plan: "free", input: "mentionUsername" },
    { key: "mustMinLength", icon: "✍️", plan: "free", input: "minLength" },
    { key: "mustMinMentions", icon: "🔖", plan: "free", input: "minMentions" },
    { key: "mustName", icon: "🆔", plan: "free" },
    { key: "uniqueComments", icon: "🔄", plan: "free" },
    { key: "uniqueUsers", icon: "👥", plan: "free" },
    { key: "aiSafe", icon: "🤖", plan: "free" },
  ],

  ruleDefs: [
    { key: "mustComment", default: true }, { key: "excludePastWinners" }, { key: "mustKeyword" },
    { key: "mustMention" }, { key: "mustMinLength" }, { key: "mustMinMentions" }, { key: "mustName" },
    { key: "uniqueComments" }, { key: "uniqueUsers" }, { key: "aiSafe" },
  ],

  showKeyword: true,
  showMinLen: true,
};

export default function YoutubePage() {
  return <GiveawayPage config={config} />;
}

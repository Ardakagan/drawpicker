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

  // YouTube sadece yorum verisi verir -> yorum bazli kurallar
  quickRules: [
    { key: "mustComment", icon: "💬", plan: "free", fixed: true, default: true },
    { key: "mustKeyword", icon: "🔑", plan: "free", input: "keyword" },
  ],

  advancedRules: [
    { key: "mustMention", icon: "🏷️", plan: "free", input: "mentionUsername" },
    { key: "mustMinLength", icon: "✍️", plan: "free", input: "minLength" },
    { key: "uniqueComments", icon: "🔄", plan: "free" },
    { key: "aiSafe", icon: "🤖", plan: "free" },
  ],

  ruleDefs: [
    { key: "mustComment", default: true },
    { key: "mustKeyword" },
    { key: "mustMention" },
    { key: "mustMinLength" },
    { key: "uniqueComments" },
    { key: "aiSafe" },
  ],

  showKeyword: true,
  showMinLen: true,
};

export default function YoutubePage() {
  return <GiveawayPage config={config} />;
}

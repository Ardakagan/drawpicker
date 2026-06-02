"use client";

import GiveawayPage, { GiveawayConfig } from "@/components/GiveawayPage";

const config: GiveawayConfig = {
  platform: "youtube",
  accent: "purple",
  icon: "▶️",
  titleKey: "yt_title",
  subKey: "yt_sub",
  inputKey: "yt_input",
  inputPhKey: "yt_inputPh",

  ruleDefs: [
    { key: "mustComment", fixed: true },
    { key: "uniqueComments", default: true },
    { key: "aiSafe", default: true },

    { key: "mustKeyword" },
    { key: "mustMention" },
    { key: "mustMinLength" },
  ],

  showKeyword: true,
  showMinLen: true,
};

export default function Page() {
  return <GiveawayPage config={config} />;
}
"use client";

import GiveawayPage, { GiveawayConfig } from "@/components/GiveawayPage";

const config: GiveawayConfig = {
  platform: "twitter",
  accent: "sky",
  icon: "𝕏",
  titleKey: "tw_title",
  subKey: "tw_sub",
  inputKey: "tw_input",
  inputPhKey: "tw_inputPh",
  ruleDefs: [
    { key: "mustLike" },
    { key: "mustFollow" },
    { key: "mustRetweet", default: true },
    { key: "mustComment" },
    { key: "aiSafe", default: true },
    { key: "uniqueComments", default: true },
    { key: "mustMention" },
    { key: "mustKeyword" },
    { key: "mustMinLength" },
    { key: "mustProfile" },
    { key: "mustMinFollowers" },
    { key: "blockHidden" },
  ],
  showKeyword: true,
  showMinLen: true,
  showMinFollowers: true,
};

export default function Page() {
  return <GiveawayPage config={config} />;
}
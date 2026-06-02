"use client";

import { useState } from "react";

export default function Flag({
  code,
  name,
  className = "w-6 h-4",
}: {
  code: string;
  name?: string;
  className?: string;
}) {
  const [err, setErr] = useState(false);

  if (err) {
    return (
      <span
        className={`${className} rounded-sm bg-white/10 text-[9px] font-bold flex items-center justify-center uppercase text-zinc-300`}
      >
        {code}
      </span>
    );
  }

  return (
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      srcSet={`https://flagcdn.com/w80/${code}.png 2x`}
      alt={name || code}
      width={24}
      height={16}
      loading="eager"
      referrerPolicy="no-referrer"
      onError={() => setErr(true)}
      className={`${className} rounded-sm object-cover`}
    />
  );
}

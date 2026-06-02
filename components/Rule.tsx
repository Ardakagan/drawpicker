"use client";

export default function Rule({
  label,
  val,
  toggle,
  fixed = false,
  onClass,
  chkClass,
}: {
  label: string;
  val: boolean;
  toggle?: () => void;
  fixed?: boolean;
  onClass: string;
  chkClass: string;
}) {
  return (
    <div
      onClick={fixed ? undefined : toggle}
      className={`flex items-center gap-3 border-2 rounded-xl px-4 py-3 transition select-none ${
        val ? onClass : "border-white/10 hover:border-white/20"
      } ${fixed ? "cursor-default opacity-90" : "cursor-pointer"}`}
    >
      <div
        className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-black flex-shrink-0 ${
          val ? `${chkClass} text-white` : "border border-white/20"
        }`}
      >
        {val ? "✓" : ""}
      </div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

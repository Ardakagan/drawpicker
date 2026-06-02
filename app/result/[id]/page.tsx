type Winner = {
  username?: string;
  author?: string;
};

async function getResult(id: string) {
  const res = await fetch(
    `https://drawpicker.io/api/result/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) return null;

  const data = await res.json();

  return data.result;
}

export default async function ResultPage({
  params,
}: {
  params: { id: string };
}) {
  const result = await getResult(params.id);

  if (!result) {
    return (
      <main className="min-h-screen bg-[#080812] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">❌</div>
          <h1 className="text-3xl font-black mb-2">
            Result Not Found
          </h1>
        </div>
      </main>
    );
  }

  const winners: Winner[] = result.winners || [];
  const backups: Winner[] = result.backups || [];

  return (
    <main className="min-h-screen bg-[#080812] text-white px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="text-6xl mb-4">🎉</div>

          <h1 className="text-5xl font-black mb-4">
            Draw Result
          </h1>

          <div className="text-zinc-400">
            Certificate: {result.cert_code}
          </div>
        </div>

        <div className="bg-[#16161f] border border-cyan-500/20 rounded-3xl p-6 mb-6">
          <div className="text-cyan-300 font-black text-2xl mb-5">
            🏆 Winners
          </div>

          <div className="space-y-3">
            {winners.map((w, i) => (
              <div
                key={i}
                className="bg-[#1d1d2b] rounded-2xl p-4 border border-white/10"
              >
                <div className="text-xl font-black">
                  @{w.username}
                </div>

                <div className="text-zinc-400 text-sm mt-1">
                  {w.author}
                </div>
              </div>
            ))}
          </div>
        </div>

        {backups.length > 0 && (
          <div className="bg-[#16161f] border border-white/10 rounded-3xl p-6">
            <div className="text-zinc-300 font-black text-2xl mb-5">
              🥈 Backup Winners
            </div>

            <div className="space-y-3">
              {backups.map((w, i) => (
                <div
                  key={i}
                  className="bg-[#1d1d2b] rounded-2xl p-4 border border-white/10"
                >
                  <div className="font-bold">
                    @{w.username}
                  </div>

                  <div className="text-zinc-500 text-sm mt-1">
                    {w.author}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
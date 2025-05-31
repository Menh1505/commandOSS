import Image from 'next/image';

type HealthUI = {
    name: string;
    hp: number;
    maxHp: number;
    align?: "left" | "right"; // để style khác nhau nếu cần
    avatarUrl?: string;
};

export default function HP({ name, hp, maxHp, avatarUrl }: HealthUI) {
    const percent = Math.max(0, (hp / maxHp) * 100);

    const hpColor =
        percent > 60 ? "bg-green-500" : percent > 30 ? "bg-yellow-400" : "bg-red-500";

    return (
        <div
            className={`flex items-center gap-3 mb-3`}
        >
            {/* Avatar (optional) */}
            {avatarUrl && (
                <div className="relative w-10 h-10">
                    <Image
                        src={avatarUrl}
                        fill
                        sizes="40px"
                        className="rounded shadow border border-yellow-400 bg-black object-cover"
                        alt={`${name} avatar`}
                    />
                </div>
            )}

            <div className="w-full">
                <p className="font-orbitron text-sm tracking-wide">{name}</p>

                {/* Bar wrapper */}
                <div className="w-full h-5 bg-gray-800 border border-yellow-600 rounded-sm overflow-hidden shadow-inner font-orbitron">
                    <div
                        className={`h-full ${hpColor} transition-all duration-300`}
                        style={{ width: `${percent}%` }}
                    />
                </div>

                <p className="text-[10px] text-gray-300 mt-0.5 font-orbitron">
                    HP: {hp} / {maxHp}
                </p>
            </div>
        </div>
    );
}

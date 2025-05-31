import { Skill } from "@/types/skill.type";

type SkillPanelProps = {
    skills?: Skill[];
    disabled: boolean;
    onClick: (skill: Skill) => void;
};


export default function SkillPanel({ skills, disabled, onClick }: SkillPanelProps) {
    skills = [
        {
            name: "Slash",
            type: "attack",
            powerMultiplier: 1,
            icon: "/icons/slash.png",
            description: "Chém thường, sát thương cơ bản.",
        },
        {
            name: "Strike",
            type: "attack",
            powerMultiplier: 1.4,
            icon: "/icons/strike.png",
            description: "Đòn mạnh hơn, tốn thời gian hơn.",
        },
        {
            name: "Block",
            type: "defense",
            powerMultiplier: 0,
            icon: "/icons/block.png",
            description: "Tăng phòng thủ, không gây sát thương.",
        },
    ]

    return (
        <div className="grid grid-cols-3 gap-2">
            {skills.map((skill, idx) => (
                <button
                    key={idx}
                    onClick={() => onClick(skill)}
                    disabled={disabled}
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white py-2 text-sm rounded shadow transition-all"
                >
                    {skill.name}
                </button>
            ))}
        </div>
    );
}

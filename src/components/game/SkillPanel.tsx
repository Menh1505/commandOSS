import { Skill } from "@/types/skill.type";
import { useState, useEffect } from "react";
import Image from "next/image";

type SkillPanelProps = {
    skills?: Skill[];
    disabled: boolean;
    onClick: (skill: Skill) => void;
};

type SkillWithCooldownState = Skill & {
    isOnCooldown?: boolean;
    remainingCooldown?: number;
};

export default function SkillPanel({ disabled, onClick }: SkillPanelProps) {
    // State để quản lý cooldown của các kỹ năng
    const [skillsState, setSkillsState] = useState<SkillWithCooldownState[]>([]);

    // Khởi tạo skill state nếu chưa có
    useEffect(() => {
        const defaultSkills: SkillWithCooldownState[] = [
            {
                name: "Slash",
                type: "attack",
                powerMultiplier: 1,
                icon: "/icons/slash.png",
                description: "Chém thường, sát thương cơ bản.",
                isOnCooldown: false,
                remainingCooldown: 0
            },
            {
                name: "Strike",
                type: "attack",
                powerMultiplier: 1.4,
                icon: "/icons/strike.png",
                cooldown: 2,
                description: "Đòn mạnh hơn, tốn thời gian hơn.",
                isOnCooldown: false,
                remainingCooldown: 0
            },
            {
                name: "Block",
                type: "defense",
                powerMultiplier: 0,
                icon: "/icons/block.png",
                cooldown: 2,
                description: "Tăng phòng thủ, không gây sát thương.",
                isOnCooldown: false,
                remainingCooldown: 0
            },
        ];

        setSkillsState(defaultSkills);
    }, []);

    // Hàm xử lý khi nhấn vào skill
    const handleSkillClick = (skill: SkillWithCooldownState, index: number) => {
        // Gọi callback onClick từ props
        onClick(skill);

        // Nếu skill có cooldown, thiết lập trạng thái cooldown
        if (skill.cooldown && skill.cooldown > 0) {
            // Cập nhật trạng thái cho skill này
            setSkillsState(prevSkills => {
                const newSkills = [...prevSkills];
                newSkills[index] = {
                    ...skill,
                    isOnCooldown: true,
                    remainingCooldown: skill.cooldown
                };
                return newSkills;
            });

            // Thiết lập interval để giảm thời gian cooldown
            let remainingTime = skill.cooldown;
            const cooldownInterval = setInterval(() => {
                remainingTime -= 1;

                if (remainingTime <= 0) {
                    // Hết cooldown
                    clearInterval(cooldownInterval);
                    setSkillsState(prevSkills => {
                        const newSkills = [...prevSkills];
                        newSkills[index] = {
                            ...skill,
                            isOnCooldown: false,
                            remainingCooldown: 0
                        };
                        return newSkills;
                    });
                } else {
                    // Cập nhật thời gian còn lại
                    setSkillsState(prevSkills => {
                        const newSkills = [...prevSkills];
                        newSkills[index] = {
                            ...skill,
                            remainingCooldown: remainingTime
                        };
                        return newSkills;
                    });
                }
            }, 1000);
        }
    };

    // Render UI
    return (
        <div className="grid grid-cols-3 gap-3">
            {skillsState.map((skill, idx) => {
                // Kiểm tra trạng thái disable
                const isDisabled = disabled || skill.isOnCooldown;

                // Tính phần trăm cooldown còn lại
                const cooldownPercent = skill.isOnCooldown && skill.cooldown
                    ? (skill.remainingCooldown! / skill.cooldown) * 100
                    : 0;

                return (
                    <button
                        key={idx}
                        onClick={() => handleSkillClick(skill, idx)}
                        disabled={isDisabled || !!skill.cooldown}
                        className={`
                            relative bg-cyan-800 border-2 
                            ${skill.type === "attack" ? "border-red-500" : "border-blue-500"}
                            hover:bg-gray-700 disabled:opacity-70
                            text-white rounded-lg shadow-lg transition-all
                            p-2 w-16 h-16 overflow-hidden
                        `}
                        title={skill.name} // Thêm tooltip để người dùng có thể thấy tên khi hover
                    >
                        {/* Chỉ hiển thị icon lớn hơn */}
                        {skill.icon && (
                            <div className="flex items-center justify-center w-full h-full">
                                <div className="relative w-12 h-12">
                                    <Image
                                        src={skill.icon}
                                        alt={skill.name}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Cooldown Overlay */}
                        {skill.isOnCooldown && (
                            <>
                                {/* Darkened overlay */}
                                <div
                                    className="absolute inset-0 bg-black/50 flex items-center justify-center"
                                    style={{
                                        clipPath: `inset(0 0 ${100 - cooldownPercent}% 0)`
                                    }}
                                />

                                {/* Cooldown text */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <span className="font-orbitron font-bold text-2xl text-white drop-shadow-lg">
                                        {skill.remainingCooldown}
                                    </span>
                                </div>
                            </>
                        )}
                    </button>
                );
            })}
        </div>
    );
}

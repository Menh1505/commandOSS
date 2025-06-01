type SkillType = "attack" | "defense";

export type Skill = {
    name: string;
    type: SkillType;
    powerMultiplier: number;
    cooldown?: number; // (optional) thời gian hồi chiêu tính bằng giây
    icon?: string;         // (optional) đường dẫn đến icon
    description?: string;  // (optional) mô tả kỹ năng
};
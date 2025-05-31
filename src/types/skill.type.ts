type SkillType = "attack" | "defense";

export type Skill = {
    name: string;
    type: SkillType;
    powerMultiplier: number;
    icon?: string;         // (optional) đường dẫn đến icon
    description?: string;  // (optional) mô tả kỹ năng
};
import { IconHeartFilled, IconMoodAngry, IconMoodSad, IconMoodSmile, IconMoodSurprised, IconThumbUp } from "@tabler/icons-react";
import type { IReact } from "../../interfaces/ReactComment";
import { getReactColor } from "../../utils/reactComment";
import { ThemeIcon } from "@mantine/core";

export const ReactIcons = {
    like: <IconThumbUp size={16} />,
    love: <IconHeartFilled size={16} />,
    haha: <IconMoodSmile size={16} />,
    wow: <IconMoodSurprised size={16} />,
    sad: <IconMoodSad size={16} />,
    angry: <IconMoodAngry size={16} />,
    unlike: <IconThumbUp size={16} />,
};

export const ReactIconList = ({ react }: { react: IReact }) => {
    const mapReact = Object.entries(react).map(([key, value]) => ({
        key,
        value
    }));
    const sorted = mapReact.sort((a, b) => b.value - a.value);
    const top3 = sorted.slice(0, 3);
    console.log("sprt", sorted)
    return (
        <div className="flex flex-col justify-center">
            <span className="w-full min-w-[50px] h-full min-h-5 flex gap-2">
                {top3.reverse().map(({ key, value }, index) => {
                    if (value > 0) {
                        return (
                            <div key={key} className={`absolute !aspect-square m-0 p-0 top-[5px] bottom-[5px] left-${(3 - index) * 3} 
                            text-${getReactColor(key as keyof typeof ReactIcons).split(".")[0]}-500 
                            bg-gray-50 rounded-full`}>
                                <ThemeIcon
                                    radius="xl"
                                    size="xs"
                                    variant="outline"
                                    c={getReactColor(key as keyof typeof ReactIcons)}
                                    color={getReactColor(key as keyof typeof ReactIcons)}
                                >
                                    {ReactIcons[key as keyof typeof ReactIcons]}
                                </ThemeIcon>
                            </div>
                        );
                    }
                })}
            </span>
        </div>
    )
}
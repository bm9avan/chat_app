import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import emojiData from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { SmileIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { FC } from "react";

interface EmojiPickerProps {
  onChange: (emoji: string) => void;
}

const EmojiPicker: FC<EmojiPickerProps> = ({ onChange }) => {
  const { theme } = useTheme();
  return (
    <div>
      <Popover>
        <PopoverTrigger>
          <SmileIcon className="h-5 w-5 text-muted-foreground hover:text-foreground transition" />
        </PopoverTrigger>
        <PopoverContent align="end" className="w-full">
          <Picker
            data={emojiData}
            emojiSize={18}
            maxFrequentRows={1}
            theme={theme}
            onEmojiSelect={(emoji: any) => onChange(emoji.native)}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default EmojiPicker;

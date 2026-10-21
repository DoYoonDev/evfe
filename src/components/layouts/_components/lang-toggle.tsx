import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx';

import { type Lang, useLang } from '../_hooks/use-lang.tsx';

export const LangToggle = () => {
  const { lang, setLang } = useLang();

  return (
    <Select defaultValue={lang} onValueChange={(e) => setLang(e as Lang)}>
      <SelectTrigger className="w-[100px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent position="popper" >
        <SelectGroup>
          <SelectItem value="ko">KOR</SelectItem>
          <SelectItem value="en">ENG</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

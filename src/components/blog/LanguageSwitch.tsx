import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe, Loader2 } from 'lucide-react';

export type Language = 'en' | 'hi' | 'ur' | 'ar';

interface LanguageSwitchProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  isTranslating?: boolean;
}

const languages: { code: Language; name: string; nativeName: string; flag: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
];

export function LanguageSwitch({ currentLanguage, onLanguageChange, isTranslating }: LanguageSwitchProps) {
  const currentLang = languages.find(l => l.code === currentLanguage);

  return (
    <div className="flex items-center gap-2">
      {isTranslating ? (
        <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-md">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          <span className="text-sm text-primary font-medium">Translating...</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-muted-foreground" />
          <Select 
            value={currentLanguage} 
            onValueChange={(value) => onLanguageChange(value as Language)}
            disabled={isTranslating}
          >
            <SelectTrigger className="w-[180px] bg-background border-primary/30 hover:border-primary">
              <SelectValue>
                <span className="flex items-center gap-2">
                  <span>{currentLang?.flag}</span>
                  <span>{currentLang?.nativeName}</span>
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-background z-50">
              {languages.map((lang) => (
                <SelectItem 
                  key={lang.code} 
                  value={lang.code}
                  className="cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <span>{lang.nativeName}</span>
                    <span className="text-muted-foreground text-xs">({lang.name})</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}

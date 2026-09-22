import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { RegistrationData } from "./schema";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger, PopoverClose } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Check, Mail, User, Sparkles, Heart, Ruler, Users, Shield } from "lucide-react";
import { format, setMonth, setYear, differenceInYears } from "date-fns";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Step1Props {
  form: UseFormReturn<RegistrationData>;
}

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1945 }, (_, i) => currentYear - 18 - i);

const heights = [
  '4\'8" (142 cm)', '4\'9" (145 cm)', '4\'10" (147 cm)', '4\'11" (150 cm)',
  '5\'0" (152 cm)', '5\'1" (155 cm)', '5\'2" (157 cm)', '5\'3" (160 cm)',
  '5\'4" (162 cm)', '5\'5" (165 cm)', '5\'6" (168 cm)', '5\'7" (170 cm)',
  '5\'8" (173 cm)', '5\'9" (175 cm)', '5\'10" (178 cm)', '5\'11" (180 cm)',
  '6\'0" (183 cm)', '6\'1" (185 cm)', '6\'2" (188 cm)', '6\'3" (190 cm)', '6\'4"+ (193+ cm)'
];

const complexions = [
  "Very Fair",
  "Fair",
  "Wheatish",
  "Medium / Wheatish Brown",
  "Dusky / Dark"
];

const maslaks = [
  "Sunni",
  "Salafi (Ahle Hadees)",
  "Deobandi",
  "Barelvi",
  "Ahle Sunnat Wal Jamaat",
  "Tablighi",
  "Shafi'i / Maliki / Hanbali",
  "Any / Practicing Muslim"
];

export function Step1({ form }: Step1Props) {
  const [calendarMonth, setCalendarMonth] = useState<Date>(
    form.getValues("dateOfBirth") || new Date(2000, 0, 1)
  );

  const handleYearChange = (year: string) => {
    const newDate = setYear(calendarMonth, parseInt(year));
    setCalendarMonth(newDate);
  };

  const handleMonthChange = (month: string) => {
    const newDate = setMonth(calendarMonth, parseInt(month));
    setCalendarMonth(newDate);
  };

  const selectedDate = form.watch("dateOfBirth");
  const calculatedAge = selectedDate ? differenceInYears(new Date(), selectedDate) : null;
  const currentGender = form.watch("gender");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Section Header */}
      <div className="border-b pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
            <User className="w-6 h-6 text-primary" />
            <span>Personal Information</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Basic details for matchmaking & verification (ID ke mutabiq bharein)
          </p>
        </div>
      </div>

      {/* Gender Selection */}
      <FormField
        control={form.control}
        name="gender"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <User className="w-4 h-4 text-primary" />
              <span>Gender *</span>
            </FormLabel>
            <FormControl>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => field.onChange("Female")}
                  className={`p-3.5 sm:p-4 rounded-2xl border-2 flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer ${
                    field.value === "Female"
                      ? "border-primary bg-primary/10 ring-2 ring-primary/20 shadow-sm"
                      : "border-border hover:border-primary/40 bg-card"
                  }`}
                >
                  <span className="text-2xl sm:text-3xl">👰</span>
                  <div className="text-left">
                    <p className="font-bold text-sm sm:text-base text-foreground">Female (Bride)</p>
                    <p className="text-[11px] text-muted-foreground">Dulhan Profile</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => field.onChange("Male")}
                  className={`p-3.5 sm:p-4 rounded-2xl border-2 flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer ${
                    field.value === "Male"
                      ? "border-primary bg-primary/10 ring-2 ring-primary/20 shadow-sm"
                      : "border-border hover:border-primary/40 bg-card"
                  }`}
                >
                  <span className="text-2xl sm:text-3xl">🤵</span>
                  <div className="text-left">
                    <p className="font-bold text-sm sm:text-base text-foreground">Male (Groom)</p>
                    <p className="text-[11px] text-muted-foreground">Dulha Profile</p>
                  </div>
                </button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Full Name & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-primary" />
                <span>Full Name *</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Candidate's official full name" {...field} className="h-11" />
              </FormControl>
              <FormDescription className="text-[11px]">
                Enter complete name as per Aadhar / ID proof.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-primary" />
                <span>Email Address *</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="example@gmail.com" type="email" {...field} className="h-11" />
              </FormControl>
              <FormDescription className="text-[11px]">
                Official updates and confirmation will be sent here.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Date of Birth with Live Age */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <CalendarIcon className="w-3.5 h-3.5 text-primary" />
                  <span>Date of Birth *</span>
                </span>
                {calculatedAge !== null && (
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    Age: {calculatedAge} Years
                  </span>
                )}
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal h-11",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "dd MMMM yyyy")
                      ) : (
                        <span>Select Date of Birth</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-[120]" align="start">
                  <div className="p-3 border-b border-border bg-muted/30">
                    <div className="flex gap-2">
                      <Select
                        value={calendarMonth.getMonth().toString()}
                        onValueChange={handleMonthChange}
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent className="z-[130]">
                          {months.map((month, index) => (
                            <SelectItem key={month} value={index.toString()}>
                              {month}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={calendarMonth.getFullYear().toString()}
                        onValueChange={handleYearChange}
                      >
                        <SelectTrigger className="w-[105px]">
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[220px] z-[130]">
                          {years.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      field.onChange(date);
                      if (date) setCalendarMonth(date);
                    }}
                    month={calendarMonth}
                    onMonthChange={setCalendarMonth}
                    disabled={(date) =>
                      date > new Date(currentYear - 18, 11, 31) || date < new Date("1945-01-01")
                    }
                    initialFocus
                    className="pointer-events-auto p-3"
                  />
                  {selectedDate && (
                    <div className="p-2 border-t border-border bg-muted/20">
                      <PopoverClose asChild>
                        <Button className="w-full" size="sm">
                          <Check className="w-4 h-4 mr-1.5" />
                          Confirm Date
                        </Button>
                      </PopoverClose>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
              <FormDescription className="text-[11px]">
                Must be at least 18 years old.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Marital Status */}
        <FormField
          control={form.control}
          name="maritalStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-primary" />
                <span>Marital Status *</span>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select marital status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="z-[120]">
                  <SelectItem value="Single">Single (Never Married)</SelectItem>
                  <SelectItem value="Divorced">Divorced</SelectItem>
                  <SelectItem value="Widowed">Widowed</SelectItem>
                  <SelectItem value="Khula">Khula</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription className="text-[11px]">
                Current status.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Height & Complexion */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="height"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5">
                <Ruler className="w-3.5 h-3.5 text-primary" />
                <span>Height *</span>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select height" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-[220px] z-[120]">
                  {heights.map((h) => (
                    <SelectItem key={h} value={h.split(" ")[0]}>
                      {h}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="complexion"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>Complexion *</span>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select complexion" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="z-[120]">
                  {complexions.map((comp) => (
                    <SelectItem key={comp} value={comp}>
                      {comp}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Caste & Maslak */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="maslak"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-primary" />
                <span>Maslak / Sect *</span>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select Maslak / Sect" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="z-[120]">
                  {maslaks.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription className="text-[11px]">
                Islamic tradition / school of thought.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="caste"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-primary" />
                <span>Caste / Community (Optional)</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="e.g., Ansari, Khan, Syed, Sheikh, Kokani" {...field} className="h-11" />
              </FormControl>
              <FormDescription className="text-[11px]">
                Leave blank or write "Any" if not applicable.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

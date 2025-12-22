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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format, setMonth, setYear } from "date-fns";
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
const years = Array.from({ length: currentYear - 1939 }, (_, i) => currentYear - i);

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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary mb-6">Personal Information</h2>

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email Address *</FormLabel>
            <FormControl>
              <Input placeholder="your.email@example.com" {...field} />
            </FormControl>
            <FormDescription>
              Email recorded for profile verification.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="fullName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name *</FormLabel>
            <FormControl>
              <Input placeholder="Enter your complete name" {...field} />
            </FormControl>
            <FormDescription>
              Enter your complete name as per ID or official documents.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="gender"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gender *</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormDescription>
              Select correct gender for matchmaking.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="dateOfBirth"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Date of Birth *</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="p-3 border-b border-border">
                  <div className="flex gap-2">
                    <Select
                      value={calendarMonth.getMonth().toString()}
                      onValueChange={handleMonthChange}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
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
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
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
                    date > new Date() || date < new Date("1940-01-01")
                  }
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            <FormDescription>
              Select your accurate DOB.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="height"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Height *</FormLabel>
            <FormControl>
              <Input placeholder="e.g., 5'6&quot; or 168 cm" {...field} />
            </FormControl>
            <FormDescription>
              Enter height in ft/in or cm.
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
            <FormLabel>Caste *</FormLabel>
            <FormControl>
              <Input placeholder="Enter your caste" {...field} />
            </FormControl>
            <FormDescription>
              Provide your correct caste information.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="complexion"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Complexion *</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Fair, Wheatish, Medium" {...field} />
            </FormControl>
            <FormDescription>
              Enter your complexion (e.g., Fair, Wheatish, Medium).
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="maritalStatus"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Marital Status *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select marital status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Single">Single</SelectItem>
                <SelectItem value="Divorced">Divorced</SelectItem>
                <SelectItem value="Widowed">Widowed</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Select your current marital status.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="maslak"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Maslak *</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Sunni, Deobandi, Barelvi" {...field} />
            </FormControl>
            <FormDescription>
              Enter your Islamic maslak (e.g., Sunni, Deobandi, Barelvi).
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

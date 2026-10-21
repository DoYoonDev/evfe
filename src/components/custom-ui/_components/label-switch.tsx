import React from 'react';

import { FormControl,FormLabel } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';

type FieldLike = { value: boolean | undefined; onChange: (v: boolean) => void };

export const LabelSwitch = ({
  label,
  field,
  disabled = false,
}: {
  label: React.ReactNode;
  field: FieldLike;
  disabled?: boolean;
}) => {
  return (
    <div className="flex items-center gap-3">
      <FormLabel className="m-0">{label}</FormLabel>
      <FormControl>
        <Switch
          checked={!!field.value}
          onCheckedChange={field.onChange}
          className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-300"
          disabled={disabled}
        />
      </FormControl>
    </div>
  );
}

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Box, Button, InputAdornment } from "@mui/material";
import { TextInput, type TextInputProps } from "react-admin";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import { toSlug } from "@/lib/slug";

interface SlugInputProps extends Omit<TextInputProps, "source"> {
  source?: string;
  sourceToWatch?: string;
}

export const SlugInput: React.FC<SlugInputProps> = ({
  source = "slug",
  sourceToWatch = "full_name",
  label = "Slug",
  helperText = "Used in the public URL.",
  ...props
}) => {
  const { setValue } = useFormContext();
  const watchedValue = useWatch({ name: sourceToWatch }) as string | undefined;

  const handleGenerateSlug = () => {
    if (watchedValue) {
      const generated = toSlug(watchedValue);
      setValue(source, generated, { shouldValidate: true, shouldDirty: true });
    }
  };

  const textInputProps: any = {
    source,
    label,
    required: true,
    helperText,
    InputProps: {
      endAdornment: (
        <InputAdornment position="end">
          <Button
            size="small"
            onClick={handleGenerateSlug}
            title="Generate slug from name/title"
            startIcon={<AutoFixHighIcon fontSize="small" />}
            sx={{
              textTransform: "none",
              fontSize: "0.75rem",
              py: 0.2,
              px: 1,
              minWidth: "auto",
            }}
          >
            Auto-Slug
          </Button>
        </InputAdornment>
      ),
    },
    ...props,
  };

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      <TextInput {...textInputProps} />
    </Box>
  );
};

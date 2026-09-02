import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import { Box, Typography } from "@mui/material";
import { useRecordContext } from "react-admin";

export type MediaChoiceRecord = {
  id?: string;
  title?: string;
  file_name?: string | null;
  image_preview?: string | null;
};

export function MediaChoice() {
  const record = useRecordContext<MediaChoiceRecord>();
  if (!record) return null;

  return (
    <Box sx={{ display: "flex", minWidth: 0, alignItems: "center", gap: 1.25, py: 0.25 }}>
      {record.image_preview ? (
        <Box
          component="img"
          src={record.image_preview}
          alt=""
          loading="lazy"
          decoding="async"
          sx={{
            width: 52,
            height: 36,
            flex: "0 0 auto",
            borderRadius: 0.75,
            border: 1,
            borderColor: "divider",
            bgcolor: "grey.100",
            objectFit: "cover",
          }}
        />
      ) : (
        <Box
          sx={{
            display: "grid",
            width: 52,
            height: 36,
            flex: "0 0 auto",
            placeItems: "center",
            borderRadius: 0.75,
            bgcolor: "grey.100",
            color: "text.disabled",
          }}
        >
          <ImageOutlinedIcon fontSize="small" />
        </Box>
      )}
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="body2" noWrap sx={{ fontWeight: 700 }}>
          {record.title || record.file_name || "Untitled image"}
        </Typography>
        {record.file_name && record.file_name !== record.title ? (
          <Typography variant="caption" color="text.secondary" noWrap sx={{ display: "block" }}>
            {record.file_name}
          </Typography>
        ) : null}
      </Box>
    </Box>
  );
}

export function mediaChoiceInputText(record: MediaChoiceRecord): string {
  return record?.title || record?.file_name || "";
}

export function mediaChoiceMatchSuggestion(
  filterValue: string,
  record: MediaChoiceRecord,
): boolean {
  const searchableText = `${record?.title || ""} ${record?.file_name || ""}`.toLowerCase();
  return searchableText.includes(filterValue.toLowerCase());
}

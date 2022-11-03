import Uploader from "@components/common/uploader";
import { Controller } from "react-hook-form";

interface FileInputProps {
  control: any;
  name: string;
  multiple?: boolean;
  accept?: string | boolean;
}

const FileInput = ({
  control,
  name,
  multiple = true,
  accept = false,
}: FileInputProps) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={[]}
      render={({ field: { ref, ...rest } }) => (
        <Uploader {...rest} multiple={multiple} accept={accept} />
      )}
    />
  );
};

export default FileInput;

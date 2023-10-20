import { LoadingIcon } from "../../shared/components/LoadingIcon";
import useLabels from "../hooks/useLabels";

interface Props {
  selectedLabel: string[];
  onChange: (labelName: string) => void;
}

export const LabelPicker = ({ selectedLabel, onChange }: Props) => {
  const labelsQuery = useLabels();

  if (labelsQuery.isLoading) {
    //! Por qué isLoading y no isFetching
    return <LoadingIcon />;
  }

  return (
    <>
      {labelsQuery.data?.map((label) => (
        <span
          key={label.id}
          onClick={() => onChange(label.name)}
          className={`badge rounded-pill m-1 label-picker ${
            selectedLabel.includes(label.name) ? "label-active" : ""
          }`}
          style={{
            border: `1px solid #${label.color}`,
            color: `#${label.color}`,
          }}
        >
          {label.name}
        </span>
      ))}
    </>
  );
};

import { useState } from "react";
import useIssuesInfinite from "../hooks/useIssuesInfinite";

import { IssueList } from "../components/IssueList";
import { LabelPicker } from "../components/LabelPicker";
import { LoadingIcon } from "../../shared/components/LoadingIcon";
import { Issue, State } from "../interfaces/issue";

export const ListViewInfinite = () => {
  //* Guarda todos los labels seleccionados para filtrar issues
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [state, setState] = useState<State>();

  const { issuesQuery } = useIssuesInfinite({
    state,
    labels: selectedLabels,
  });

  //* Evento que guarda las labels al realizar click en ellas
  const onLabelChanged = (labelName: string) => {
    selectedLabels.includes(labelName)
      ? setSelectedLabels(selectedLabels.filter((label) => label !== labelName))
      : setSelectedLabels([...selectedLabels, labelName]);
  };

  return (
    <div className="row mt-5">
      <div className="col-8">
        {issuesQuery.isLoading ? (
          <LoadingIcon />
        ) : (
          <IssueList
            issues={issuesQuery.data?.pages.flat() as Issue[]}
            state={state}
            onStateChanged={(newState) => setState(newState)}
          />
        )}

        <button
          className="btn btn-outline-primary mt-2"
          disabled={!issuesQuery.hasNextPage}
          onClick={() => issuesQuery.fetchNextPage()}
        >
          {issuesQuery.isFetchingNextPage ? <LoadingIcon /> : "Load more..."}
        </button>
      </div>

      <div className="col-4">
        <LabelPicker
          selectedLabel={selectedLabels}
          onChange={(labelName) => onLabelChanged(labelName)}
        />
      </div>
    </div>
  );
};

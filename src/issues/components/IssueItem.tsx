import { FiInfo, FiMessageSquare, FiCheckCircle } from "react-icons/fi";
import { Issue, State } from "../interfaces/issue";

import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { getIssueComments, getIssueInfo } from "../hooks/useIssue";
import { timeSince } from "../../helpers/time-since";

interface Props {
  issue: Issue;
}

export const IssueItem = ({ issue }: Props) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const prefetchData = () => {
    //* Precargando info de Issue a visitar al posicionar el mouse en el issue
    queryClient.prefetchQuery({
      queryKey: ["issue", issue.number],
      queryFn: () => getIssueInfo(issue.number),
    });

    //* Precargando comentarios de Issue a visitar al posicionar el mouse en el issue
    queryClient.prefetchQuery({
      queryKey: ["issue", issue.number, "comments"],
      queryFn: () => getIssueComments(issue.number),
    });
  };

  const preSetData = () => {
    //* Precargando info de Issue a visitar al posicionar el mouse en el issue pero sin realizar peticion http
    queryClient.setQueryData(["issue", issue.number], issue, {
      updatedAt: new Date().getTime() + 10000, //* 1 min
    });
  };

  const { title, comments, number, state, user, labels,created_at } = issue;

  return (
    <div
      className="card mb-2 issue"
      onClick={() => navigate(`/issues/issue/${number}`)}
      onMouseEnter={preSetData}
    >
      <div className="card-body d-flex align-items-center">
        {state === State.Open ? (
          <FiInfo size={30} color="red" />
        ) : (
          <FiCheckCircle size={30} color="green" />
        )}

        <div className="d-flex flex-column flex-fill px-2">
          <span>{title}</span>
          <span className="issue-subinfo">
            #{number} opened {timeSince(created_at)} ago by{" "}
            <span className="fw-bold">{user.login}</span>
          </span>

          <div>
            {labels.map((label) => (
              <span
                key={label.id}
                className="badge rounded-pill m-1"
                style={{ backgroundColor: `#${label.color}`, color: "#222" }}
              >
                {label.name}
              </span>
            ))}
          </div>
        </div>

        <div className="d-flex align-items-center">
          <img src={user.avatar_url} alt="User Avatar" className="avatar" />
          <span className="px-2">{comments}</span>
          <FiMessageSquare />
        </div>
      </div>
    </div>
  );
};

import { Link, Navigate, useParams } from 'react-router-dom';
import { IssueComment } from '../components/IssueComment';
import useIssue from '../hooks/useIssue';
import { LoadingIcon } from '../../shared/components/LoadingIcon';
import { Issue } from '../interfaces/issue';



export const IssueView = () => {
  const params = useParams();
  const { id = "0" } = params;

  const { issueQuery,commentsQuery } = useIssue(Number(id));

  /* if(!issueQuery.data){
    return <Navigate to={"./issues/list"}/>
  } */

  return (
    <div className="row mb-5">
      <div className="col-12 mb-3">
        <Link to="./issues/list">Go Back</Link>
      </div>

      {/* Primer comentario */}
      {issueQuery.isLoading ? (
        <LoadingIcon />
      ) : (
        <IssueComment issue={issueQuery.data as Issue} />
      )}

      {commentsQuery.isLoading && <LoadingIcon />}

      {/* Comentario de otros */}
      {commentsQuery.data?.map((issue) => (
        <IssueComment key={issue.id} issue={issue} />
      ))}
    </div>
  );
}

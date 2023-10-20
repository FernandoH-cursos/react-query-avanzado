import { useQuery } from "@tanstack/react-query";
import { githubApi } from "../../api/githubApi";
import { Issue } from "../interfaces/issue";
import { sleep } from "../../helpers/sleep";

export const getIssueInfo = async (issueNumber: number): Promise<Issue> => {
  await sleep(2);
  const { data } = await githubApi.get<Issue>(`/issues/${issueNumber}`);

  return data;
}

export const getIssueComments = async (issueNumber: number): Promise<Issue[]> => {
  await sleep(2);
  const { data } = await githubApi.get<Issue[]>(`/issues/${issueNumber}/comments`);
  return data;
};

const useIssue = (issueNumber: number) => {

  const issueQuery = useQuery({
    queryKey: ["issue", issueNumber],
    queryFn: () => getIssueInfo(issueNumber),
  });

  //* Guarda en caché el "issue" obtenido anteriormente, el `issueNumber` que es el parametro y "comments" que
  //* son los comentarios del issue 
  const commentsQuery = useQuery({
    //* Esta queryKey es el id único de nuestra caché 
    queryKey: ["issue", issueNumber, "comments"],
    queryFn: () => getIssueComments(issueQuery.data!.number),
    enabled: issueQuery.data !== undefined
  });

  return {
    issueQuery,
    commentsQuery,
  };
}

export default useIssue;
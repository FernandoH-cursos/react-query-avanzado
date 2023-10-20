import { useState, useEffect } from "react";
import { githubApi } from "../../api/githubApi"
import { sleep } from "../../helpers/sleep";
import { Issue, State } from "../interfaces/issue"

import { useQuery } from "@tanstack/react-query";

interface Props{
  state?: State;
  labels: string[];
  page?: number;
}


const getIssues = async ({labels,page = 1,state}: Props): Promise<Issue[]> => {
  await sleep(2);

  const params = new URLSearchParams();

  //* Creando query strings para filtrar la peticion por el state del issue
  if (state) params.append("state", state);

  //* Creando query strings para filtrar la peticion por los labels de los issues
  if (labels.length > 0) {
    const labelsString = labels.join(",");
    params.append("labels", labelsString);
  }

  //* Creando query strings para mostrar las paginas de issues de 5 en 5
  params.append("page", page.toString());
  params.append("per_page", "5");

  const { data } = await githubApi.get<Issue[]>("/issues", { params });

  return data;
};

const useIssues = ({ state, labels }: Props) => {
  const [page, setPage] = useState(1);

  useEffect(() => {
    
    setPage(1);
  }, [state, labels])
  

  const issuesQuery = useQuery({
    //* Se pasa un objeto como queryKey cuando se filtra por un valor y un arreglo de valores, si se mandaran
    //* el state y labels por separado se crearía caché innecesario
    queryKey: ["issues", { state, labels,page }],
    //* Pasando como argumento el arreglo de labels y el State del issue
    queryFn: () => getIssues({labels, state,page}),
  });

  //* Funcion para ir a la siguiente página 
  const nextPage = () => {
    if (issuesQuery.data?.length === 0) return;

    setPage(page + 1);
  }

  const prevPage = () => {
    if(page > 1) setPage(page - 1);
  }
  return {
    // Properties
    issuesQuery,

    // Getter
    page: issuesQuery.isFetching ? "Loading" : page,

    // Methods
    nextPage,
    prevPage,
  };
};

export default useIssues;
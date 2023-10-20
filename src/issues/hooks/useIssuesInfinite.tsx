import { useInfiniteQuery } from "@tanstack/react-query";
import { Issue, State } from "../interfaces/issue";
import { sleep } from "../../helpers/sleep";
import { githubApi } from "../../api/githubApi";

interface Props {
  state?: State;
  labels: string[];
  page?: number;
}

interface QueryProps{
  pageParam?: number;
  queryKey: (string | Props)[];
}

const getIssues = async ({ pageParam = 1, queryKey }: QueryProps): Promise<Issue[]> => {
  //* Desestructurando state y labels del queryKey 
  const [,,args] = queryKey;
  const { state,labels} = args as Props;

  await sleep(2);

  const params = new URLSearchParams();

  //* Creando query strings para filtrar la peticion por el state del issue
  if (state) params.append("state", state);

  //* Creando query strings para filtrar la peticion por los labels de los issues
  if (labels.length > 0) {
    const labelsString = labels.join(",");
    params.append("labels", labelsString);
  }

  //* Creando query strings para mostrar el infinite scroll de issues de 5 en 5
  params.append("page", pageParam.toString());
  params.append("per_page", "5");

  const { data } = await githubApi.get<Issue[]>("/issues", { params });

  return data;
};

const useIssuesInfinite = ({ state, labels }: Props) => {
  const issuesQuery = useInfiniteQuery({
    //* Creando caché de infinite scroll
    queryKey: ["issues", "infinite", { state, labels }],
    //* Enviando data que contiene la queryKey y el pageParam(numero de pagina) 
    queryFn: (data) => getIssues(data),
    //* "lastPage" es un arreglo con la data de la última página cargada del infinite scroll y  pages
    getNextPageParam: (lastPage, pages) => {
      //* Si ya no hay data en la ultima página frenamos la ejecucion
      if (lastPage.length === 0) return;
      
      //* Retorna la cantidad de páginas más 1 
      return pages.length + 1
    }
  });

  return { issuesQuery };
};

export default useIssuesInfinite;
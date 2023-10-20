import { githubApi } from "../../api/githubApi";
import { sleep } from "../../helpers/sleep";
import { Label } from "../interfaces/label";
import { useQuery } from "@tanstack/react-query";

const getLabels = async (): Promise<Label[]> => {
  //* Retrasando 2 seg. la peticion 
  await sleep(2);

  const { data } = await githubApi.get<Label[]>("/labels?per_page=100");

  return data;
};

const useLabels = () => {

  const labelsQuery = useQuery({
    queryKey: ["labels"],
    queryFn: getLabels,
    staleTime: 1000 * 60 * 60,
    // initialData:[],
    placeholderData: [
      {
        id: 725156255,
        node_id: "MDU6TGFiZWw3MjUxNTYyNTU=",
        url: "https://api.github.com/repos/facebook/react/labels/good%20first%20issue%20(taken)",
        name: "good first issue (taken)",
        color: "b60205",
        default: false,
        description: null,
      },
      {
        id: 717031390,
        node_id: "MDU6TGFiZWw3MTcwMzEzOTA=",
        url: "https://api.github.com/repos/facebook/react/labels/good%20first%20issue",
        name: "good first issue",
        color: "6ce26a",
        default: true,
        description: null,
      },
    ],
  });

  return labelsQuery
};

export default useLabels;

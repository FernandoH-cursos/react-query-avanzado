import axios from "axios";

// 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;
export const githubApi = axios.create({
  baseURL: "https://api.github.com/repos/facebook/react",
  headers: {
    Authorization:
      "Bearer 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",
  },
});
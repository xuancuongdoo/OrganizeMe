import formatTodosForAI from "./formatTodoForAI";

async function requestWithRateLimit(requestInit: RequestInit | undefined) {
  const response = await fetch("/api/generateSummary", requestInit);
  if (response.status === 429) {
    const secondsToWait = Number(response.headers.get("retry-after"));
    await new Promise((resolve) => setTimeout(resolve, secondsToWait * 1000));
    return requestWithRateLimit(requestInit);
  }
  return response;
}

const fetchSuggestions = async (board: Board) => {
  const todos = formatTodosForAI(board);
  console.log(">> ", todos);

  const requestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ todos }),
  };

  try {
    const res = await requestWithRateLimit(requestInit);
    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }
    const GPTdata = await res.json();
    const { content } = GPTdata;
    console.log(content);
    return content;
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return null;
  }
};

export default fetchSuggestions;

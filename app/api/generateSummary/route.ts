import openai from "@/openai"; // Assuming the file is in the same directory as this code
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { todos } = await request.json();

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-0301",
    temperature: 0.8,
    n: 1,
    stream: false,
    messages: [
      {
        role: "system",
        content: `When responding, welcome the user always as Mr.CaesarDo and say welcome to the Organizr App! Limit the response to 200 characters`,
      },
      {
        role: "user",
        content: `Hi there, provide a summary of the following todos. Count how many todos are in each category such as Backlogs, In Progress, Done, and then tell the user to have productive days! Here's the data: ${JSON.stringify(
          todos
        )}`,
      },
    ],
  });
  const { data } = response;
  return NextResponse.json(data.choices[0].message);
}

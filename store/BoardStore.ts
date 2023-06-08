import { create } from "zustand";
import { getTodosGroupedByColumns } from "../lib/getTodosGroupedByColumn";
import { databases } from "@/appwrite";

interface BoardState {
  board: Board;
  getBoard: () => void;
  setBoardState: (board: Board) => void;
  updateTotoInDB: (todo: Todo, columnId: TypedColumn) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },
  getBoard: async () => {
    const board = await getTodosGroupedByColumns();
    set({ board });
  },
  setBoardState: (board) => set({ board }),
  updateTotoInDB: async (todo, columnId) => {
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id,
      {
        title: todo.title,
        status: columnId,
      }
    );
  },
}));

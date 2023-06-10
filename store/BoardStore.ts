import { create } from "zustand";
import { getTodosGroupedByColumns } from "../lib/getTodosGroupedByColumn";
import { ID, databases, storage } from "@/appwrite";
import uploadImage from "@/lib/uploadImage";

interface BoardState {
  newTaskInput: string;
  newTaskType: TypedColumn;
  newPriorityType: TypedPriority;
  searchString: string;
  board: Board;

  image: File | null;
  getBoard: () => void;
  setBoardState: (board: Board) => void;
  updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;
  addTask: (
    todo: string,
    columnId: TypedColumn,
    priorityId: TypedPriority,
    image?: File | null
  ) => void;
  setSearchString: (searchString: string) => void;
  setPriorityType: (priorityId: TypedPriority) => void;
  deleteTask: (taskIndex: number, todo: Todo, id: TypedColumn) => void;
  setNewTaskInput: (input: string) => void;
  setNewTaskType: (columnId: TypedColumn) => void;
  setImage: (image: File | null) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  searchString: "",
  newTaskType: "Backlogs",
  image: null,
  newPriorityType: "Low",
  newTaskInput: "",
  board: {
    columns: new Map<TypedColumn, Column>(),
  },
  setNewTaskInput: (input: string) => set({ newTaskInput: input }),
  setSearchString: (searchString) => set({ searchString }),
  getBoard: async () => {
    const board = await getTodosGroupedByColumns();
    set({ board });
  },
  deleteTask: async (taskIndex: number, todo: Todo, id: TypedColumn) => {
    const newColumns = new Map(get().board.columns);
    newColumns.get(id)?.todos.splice(taskIndex, 1);
    if (todo.image) {
      await storage.deleteFile(todo.image.buckedId, todo.image.fieldId);
    }
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id
    );
  },
  setPriorityType: (priorityId: TypedPriority) =>
    set({ newPriorityType: priorityId }),
  setNewTaskType: (columnId: TypedColumn) => set({ newTaskType: columnId }),
  setBoardState: (board) => set({ board }),

  setImage: (image: File | null) => set({ image }),
  updateTodoInDB: async (todo, columnId) => {
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
  addTask: async (
    todo: string,
    columnId: TypedColumn,
    priorityId: TypedPriority,
    image?: File | null
  ) => {
    let file: Image | undefined;
    if (image) {
      const fileUploaded = await uploadImage(image);
      if (fileUploaded) {
        file = {
          buckedId: fileUploaded.bucketId,
          fieldId: fileUploaded.$id,
        };
      }
    }
    const { $id } = await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      ID.unique(),
      {
        title: todo,
        status: columnId,
        priority: priorityId,
        ...(file && { image: file }),
      }
    );

    set({ newTaskInput: "" });

    set((state) => {
      const newColumns = new Map(state.board.columns);

      const newTodo: Todo = {
        $id,
        $createdAt: new Date().toISOString(),
        title: todo,
        status: columnId,
        priority: priorityId,
        ...(file && { image: file }),
      };
      const column = newColumns.get(columnId);

      if (!column) {
        newColumns.set(columnId, {
          id: columnId,
          todos: [newTodo],
        });
      } else {
        newColumns.get(columnId)?.todos.push(newTodo);
      }
      return {
        board: {
          columns: newColumns,
        },
      };
    });
  },
}));

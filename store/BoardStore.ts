import { create } from "zustand";
import { getTodosGroupedByColumns } from '../lib/getTodosGroupedByColumn';

interface BoardState {
    board: Board;
    getBoard: () => void;
}

export const useBoardStore = create<BoardState>((set) => ({
    board: {
        columns: new Map<TypedColumn, Column>()
    },
    getBoard: async () => {
        const board = await getTodosGroupedByColumns();
        set({ board })
    }
}));

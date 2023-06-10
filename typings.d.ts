interface Board {
  columns: Map<TypedColumn, Column>;
}

type TypedColumn = "Backlogs" | "Inprogress" | "Done";
type TypedPriority = "Low" | "Medium" | "High";

interface Column {
  id: TypedColumn;
  todos: Todo[];
}

interface Todo {
  $id: string;
  $createdAt: string;
  title: string;
  priority: TypedPriority;
  status: TypedColumn;
  image?: Image;
}

interface Image {
  buckedId: string;
  fieldId: string;
}

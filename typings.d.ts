interface Board {
  columns: Map<TypedColumn, Column>;
}

type TypedColumn = "Backlogs" | "Inprogress" | "Done";
type TypedPrority = "Low" | "Medium" | "High";

interface Column {
  id: TypedColumn;
  todos: Todo[];
}

interface Todo {
  $id: string;
  $createdAt: string;
  title: string;
  priority: TypedPrority;
  status: TypedColumn;
  image?: Image;
}

interface Image {
  buckedId: string;
  fieldId: string;
}

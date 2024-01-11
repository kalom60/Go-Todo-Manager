import { useEffect, useState } from "react";
import Todos from "../Todos";
import AddButton from "../AddButton";
import { Todo } from "../../App";

const Today = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const fetchData = async () => {
    try {
      await fetch("http://localhost:8080/todo/today").then(async (res) => {
        const data: Todo[] = await res.json();
        setTodos(data);
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
      <Todos data={todos} onFetchData={fetchData} />
      <AddButton dataFetch={fetchData} />
    </div>
  );
};

export default Today;

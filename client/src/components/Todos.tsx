import React, { useState } from "react";
import { Todo } from "../App";
import { Trash, Edit } from "react-feather";
import "./Custom-CSS.css";
import { toast } from "react-toastify";
import EditTodo from "./EditTodo";
import { useTodo } from "../hooks/useTodo";
import { useLocation } from "react-router-dom";
import Modal from "./UI/Modal";

const Todos: React.FC = () => {
  const [edit, setIsEdit] = useState(0);
  const [modalIsShown, setModalIsShown] = React.useState(false);
  const todo = useTodo();
  const { pathname } = useLocation();

  const showModalHandler = () => {
    setModalIsShown(true);
  };

  const hideModalHandler = () => {
    setModalIsShown(false);
  };

  const handleDelete = async (
    id: number,
    event: { stopPropagation: () => void } | undefined,
  ) => {
    event?.stopPropagation();

    try {
      await todo.deleteTodo(id);
      await todo.getTodos(pathname);
      toast.success("Todo Successfully Deleted!");
    } catch (err) {
      if (
        err &&
        typeof err === "object" &&
        "status" in err &&
        "message" in err
      ) {
        if (typeof err.message === "string") {
          toast.error(err.message);
        }
      } else {
        toast.error("Failed to delete todo");
      }
    }
  };

  const handleComplete = async (
    id: number,
    status: boolean,
    event: { stopPropagation: () => void } | undefined,
  ) => {
    event?.stopPropagation();

    try {
      await todo.toggleCompletion(id, { Completed: status });
      await todo.getTodos(pathname);
    } catch (err) {
      if (
        err &&
        typeof err === "object" &&
        "status" in err &&
        "message" in err
      ) {
        if (typeof err.message === "string") {
          toast.error(err.message);
        }
      } else {
        toast.error("Failed to completed todo");
      }
    }
  };

  return (
    // <Box>
    <>
      {modalIsShown && (
        <Modal onClose={hideModalHandler}>
          <EditTodo data={todo.todos[edit]} onClose={hideModalHandler} />
        </Modal>
      )}
      <div className="columns container is-multiline mx-auto">
        {todo.todos.map((todo: Todo, index: number) => (
          <div
            className="column is-4-desktop is-6-tablet is-12-mobile"
            key={todo.ID}
          >
            <div
              className="box custom-box is-flex is-flex-direction-column is-justify-content-space-between"
              onClick={() => {
                setIsEdit(index);
                showModalHandler();
              }}
            >
              <div>
                <h1 className="is-size-4-mobile has-text-weight-bold is-family-code">
                  {todo.Completed ? <s>{todo.Todo}</s> : todo.Todo}
                </h1>
                <div className="description is-family-code">
                  {todo.Description}
                </div>
              </div>
              <div>
                <div className="is-size-6-mobile is-family-code mb-2">
                  {todo.Date}
                </div>
                <div className="buttons is-flex-tablet is-justify-content-space-between is-flex-direction-column-tablet is-gapless">
                  {todo.Completed ? (
                    <button
                      className="button is-success is-rounded is-light"
                      onClick={(e) =>
                        handleComplete(todo.ID, !todo.Completed, e)
                      }
                    >
                      Completed
                    </button>
                  ) : (
                    <button
                      className="button is-danger is-rounded is-light"
                      onClick={(e) =>
                        handleComplete(todo.ID, !todo.Completed, e)
                      }
                    >
                      Incomplete
                    </button>
                  )}

                  <div className="is-flex is-align-items-center">
                    <button
                      className="button is-white custom-hover-off is-small"
                      onClick={() => {
                        setIsEdit(index);
                        showModalHandler();
                      }}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="button is-white custom-hover-off is-small"
                      onClick={(e) => handleDelete(todo.ID, e)}
                    >
                      <Trash color="red" size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Todos;

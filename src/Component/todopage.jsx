import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { addTodo, deleteTodo, updateStatus, updatetodo } from "../Redux/todoSlice";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";


const validation = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  endDate: Yup.date().required("End date is required"),
  image: Yup.mixed().required("Image is required"),
});

const TodoPage = () => {
  const dispatch = useDispatch();
  const { todostorage } = useSelector((state) => state.todoKey);

  const { register, handleSubmit, formState: { errors }, reset, setValue, } = useForm({ resolver: yupResolver(validation), });

  const [editingTodo, setEditingTodo] = useState(null);

  const onSubmit = (data) => {
    if (editingTodo) {

      const updatedTodo = {
        ...editingTodo,
        title: data.title,
        description: data.description,
        endDate: data.endDate,
        image: data.image[0]
          ? URL.createObjectURL(data.image[0])
          : editingTodo.image,
      };
      dispatch(updatetodo({ id: editingTodo.id, updatedTodo }));
      setEditingTodo(null);
    } else {

      const newTodo = {
        id: Date.now(),
        title: data.title,
        description: data.description,
        endDate: data.endDate,
        image: URL.createObjectURL(data.image[0]),
        isCompleted: false,
      };
      dispatch(addTodo(newTodo));
    }
    reset();
  };

  const handleEdit = (todo) => {
    setEditingTodo(todo);
    setValue("title", todo.title);
    setValue("description", todo.description);
    setValue("endDate", todo.endDate);
    setValue("image", null);
  };

  const columns = [
    { headerName: "Title", field: "title", sortable: true },
    { headerName: "Description", field: "description" },
    { headerName: "End Date", field: "endDate" },
    {
      headerName: "Image",
      field: "image",
      cellRenderer: (params) => (
        <img src={params.value} alt="todo" width="50" height="50" />
      ),
    },
    {
      headerName: "Completed",
      field: "isCompleted",
      cellRenderer: (params) => (
        <span>{params.value ? "✔ Completed" : " Pending"}</span>
      ),
    },
    {
      headerName: "Actions",
      cellRenderer: (params) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => handleEdit(params.data)}
            style={{ backgroundColor: "green", color: "white", border: "none",height:'25px' }}
          >
            Edit
          </button>
          <button
            onClick={() => dispatch(updateStatus(params.data.id))}
            style={{ backgroundColor: "yellowgreen", color: "white", border: "none" }}
          >
            Status
          </button>
          <button
            onClick={() => dispatch(deleteTodo(params.data.id))}
            style={{ backgroundColor: "red", color: "white", border: "none", width: '150px' }}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>TODO LIST</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "400px",
          margin: "0 auto 20px auto",
        }}
      >

        <input
          placeholder="Title"
          {...register("title")}
          style={{
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <p style={{ color: "red" }}>{errors.title?.message}</p>


        <textarea
          placeholder="Description"
          {...register("description")}
          style={{
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            minHeight: "50px",
          }}
        />
        <p style={{ color: "red" }}>{errors.description?.message}</p>


        <input
          type="date"
          {...register("endDate")}
          style={{
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <p style={{ color: "red" }}>{errors.endDate?.message}</p>


        <input
          type="file"
          {...register("image")}
          accept="image/*"
          style={{
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <p style={{ color: "red" }}>{errors.image?.message}</p>


        <button
          type="submit"
          style={{
            backgroundColor: editingTodo ? "blue" : "#007BFF",
            color: "white",
            border: "none",
            padding: "10px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {editingTodo ? "Update ToDo" : "Add ToDo"}
        </button>
      </form>


      <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
        <AgGridReact rowData={todostorage} columnDefs={columns} />
      </div>
    </div>

  );
};

export default TodoPage;

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTodo, updateTodo, deleteTodo } from "../../slices/todosSlice";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Checkbox,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export default function Todos() {
  const todos = useSelector((s) => s.todos.items);
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [editing, setEditing] = useState(null);
  const [selected, setSelected] = useState([]);

  const handleAdd = () => {
    if (!title.trim()) return;
    const newTodo = { id: Date.now(), title: title.trim(), done: false };
    dispatch(addTodo(newTodo));
    setTitle("");
  };

  const startEdit = (t) => {
    setEditing(t);
    setTitle(t.title);
  };

  const handleSaveEdit = () => {
    if (!title.trim() || !editing) return;
    dispatch(updateTodo({ ...editing, title: title.trim() }));
    setEditing(null);
    setTitle("");
  };

  const handleToggle = (t) => {
    dispatch(updateTodo({ ...t, done: !t.done }));
  };

  const handleDelete = (id) => dispatch(deleteTodo(id));

  const handleSelectToggle = (id) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      return [...prev, id];
    });
  };

  const handleSelectAll = () => {
    if (selected.length === todos.length) {
      setSelected([]);
    } else {
      setSelected(todos.map((t) => t.id));
    }
  };

  const handleDeleteSelected = () => {
    selected.forEach((id) => dispatch(deleteTodo(id)));
    setSelected([]);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h6">Todos ? Total: {todos.length}</Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Checkbox
            checked={selected.length === todos.length && todos.length > 0}
            indeterminate={selected.length > 0 && selected.length < todos.length}
            onChange={handleSelectAll}
            inputProps={{ "aria-label": "select-all" }}
          />
          <Typography variant="body2">Select all</Typography>
          <Button
            color="error"
            variant="outlined"
            disabled={selected.length === 0}
            onClick={handleDeleteSelected}
          >
            Delete selected ({selected.length})
          </Button>
        </Stack>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ my: 2 }}>
        <TextField
          placeholder="Add todo"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
        />
        {editing ? (
          <Button variant="contained" onClick={handleSaveEdit}>
            Save
          </Button>
        ) : (
          <Button variant="contained" onClick={handleAdd}>
            Add
          </Button>
        )}
      </Stack>

      <List>
        {todos.map((t) => (
          <ListItem
            key={t.id}
            divider
            // Use the secondaryAction prop instead of ListItemSecondaryAction
            secondaryAction={
              <>
                <IconButton
                  edge="end"
                  onClick={() => startEdit(t)}
                  aria-label={`edit-${t.id}`}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  onClick={() => handleDelete(t.id)}
                  aria-label={`delete-${t.id}`}
                >
                  <DeleteIcon />
                </IconButton>
              </>
            }
          >
            <Checkbox checked={selected.includes(t.id)} onChange={() => handleSelectToggle(t.id)} />
            <Checkbox checked={!!t.done} onChange={() => handleToggle(t)} />
            <ListItemText
              primary={t.title}
              sx={{ textDecoration: t.done ? "line-through" : "none" }}
            />
          </ListItem>
        ))}
      </List>

      <Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}>
        <Typography variant="body2">Total records: {todos.length}</Typography>
        <Typography variant="body2">Selected: {selected.length}</Typography>
      </Stack>
    </Paper>
  );
}
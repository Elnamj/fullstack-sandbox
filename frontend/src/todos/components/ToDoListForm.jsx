import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/styles'
import { TextField, Card, CardContent, CardActions, Button, Typography, Checkbox } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import AddIcon from '@material-ui/icons/Add'


const useStyles = makeStyles({
  card: {
    margin: '1rem'
  },
  todoLine: {
    display: 'flex',
    alignItems: 'center'
  },
  textField: {
    flexGrow: 1
  },
  standardSpace: {
    margin: '8px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1
  }
})

export const ToDoListForm = ({ toDoList, saveToDoList }) => {
  const classes = useStyles()
  const [todos, setTodos] = useState(toDoList.todos)

  const handleCompleteTodo = (index, completed) => {
    let newTodos = [...todos]
    let newTodo = newTodos[index]
    newTodo.completed = completed
    newTodos[index] = newTodo
    setTodos(newTodos)
  }

  const handleTitle = (index, title) => {
    let newTodos = [...todos]
    let newTodo = newTodos[index]
    newTodo.title = title
    newTodos[index] = newTodo
    setTodos(newTodos)
  }

  const handleChangeTodo = async (newTodos) => {
    await fetch(`http://localhost:5000/toDoLists/${toDoList.id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ id: toDoList.id, title: toDoList.title, todos: newTodos })
    })
  }

  useEffect(() => {
    handleChangeTodo(todos)
    saveToDoList({ ...toDoList, todos })
  }, [todos])

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography component='h2'>
          {toDoList.title}
        </Typography>
        <form className={classes.form}>
          {todos.map((todo, index) => (
            <div key={index} className={classes.todoLine}>
              <Typography className={classes.standardSpace} variant='h6'>
                {index + 1}
              </Typography>
              <TextField
                label='What to do?'
                value={todo.title}
                onChange={event => {
                  handleTitle(index, event.target.value)
                }}
                className={classes.textField}
              />
              <Button
                size='small'
                color='secondary'
                className={classes.standardSpace}
                onClick={() => {
                  setTodos([...todos.slice(0, index), ...todos.slice(index + 1)])
                }}>
                <DeleteIcon />
              </Button>
              <Checkbox checked={todo.completed} color="primary" onChange={(event) => {
                handleCompleteTodo(index, event.target.checked)
              }}></Checkbox>
            </div>
          ))}
          <CardActions>
            <Button
              type='button'
              color='primary'
              onClick={() => {
                setTodos([...todos, { title: "", completed: false }])
              }}
            >
              Add Todo <AddIcon />
            </Button>
          </CardActions>
        </form>
      </CardContent>
    </Card >
  )
}
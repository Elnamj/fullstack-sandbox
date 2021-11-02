import React, { Fragment, useState, useEffect } from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ReceiptIcon from '@material-ui/icons/Receipt'
import Typography from '@material-ui/core/Typography'
import { ToDoListForm } from './ToDoListForm'
import CheckIcon from '@material-ui/icons/Check'

export const ToDoLists = ({ style }) => {
  const [toDoLists, setToDoLists] = useState([])
  const [activeList, setActiveList] = useState()

  useEffect(() => {
    const getTodos = async () => {
      const todosFromServer = await fetchTodos()
      setToDoLists(todosFromServer)
    }

    getTodos()
  }, [])

  const fetchTodos = async () => {
    const res = await fetch('http://localhost:5000/toDoLists')
    const data = await res.json()
    return data
  }

  if (!toDoLists.length) return null

  return <Fragment>
    <Card style={style}>
      <CardContent>
        <Typography component='h2'>
          My ToDo Lists
        </Typography>
        <List>
          {toDoLists.map((list, index) => <ListItem
            key={list.id}
            button
            onClick={() => setActiveList(index)}>
            <ListItemIcon>
              <ReceiptIcon />
            </ListItemIcon>
            <ListItemText primary={list.title} />
            {list.todos.every(todo => todo.completed) && <CheckIcon />}
          </ListItem>)}
        </List>
      </CardContent>
    </Card>
    {toDoLists[activeList] && <ToDoListForm
      key={activeList} // use key to make React recreate component to reset internal state
      toDoList={toDoLists[activeList]}
      saveToDoList={(id, updatedList) => {
        let toDolistIndex = toDoLists.findIndex(list => list.id === id)
        let newToDoLists = [...toDoLists]
        newToDoLists[toDolistIndex] = updatedList
        setToDoLists(newToDoLists)
      }
      }
    />
    }
  </Fragment >
}

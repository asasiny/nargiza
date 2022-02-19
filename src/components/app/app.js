import React, { Component } from "react";

import AppHeader from "../app-header";
import SearchPanel from "../search-panel";
import TodoList from "../todo-list";
import ItemStatusFilter from "../item-status-filter";
import ItemAddForm from "../item-add-form";

import "./app.css";

export default class App extends Component {
  maxId = 50;

  state = {
    todoData: [
      this.createItem("Drink Coffee"),
      this.createItem("Make Awesome App"),
      this.createItem("Have a lunch"),
      this.createItem("Take a bath"),
    ],
    term: "",
    filter: "all",
  };

  createItem(label) {
    return {
      label,
      id: this.maxId++,
      important: false,
      done: false,
    };
  }

  deleteItem = (id) => {
    console.log("Deleted: " + id);
    this.setState(({ todoData }) => {
      const idx = todoData.findIndex((el) => el.id === id);

      const before = todoData.slice(0, idx);
      const after = todoData.slice(idx + 1);

      const newArray = [...before, ...after];

      return {
        todoData: newArray,
      };
    });
  };

  addItem = (text) => {
    const newItem = this.createItem(text);

    this.setState(({ todoData }) => {
      // todoData.push(newItem); -- zlo (don't touch there)

      
      const newArr = [...todoData, newItem];

      return {
        todoData: newArr,
      };
    });
  };



  
  

  onToggleDone = (id) => {
    console.log("Done:", id);
    this.setState(({ todoData }) => {
      const idx = todoData.findIndex((el) => el.id === id);
      const oldItem = todoData[idx];

      const before = todoData.slice(0, idx);
      const after = todoData.slice(idx + 1);

      const newItem = { ...oldItem, done: !oldItem.done };
      const newArray = [...before, newItem, ...after];

      return {
        todoData: newArray,
      };
    });
  };

  onToggleImportant = (id) => {
    console.log("Important:", id);
    this.setState(({ todoData }) => {
      const idx = todoData.findIndex((el) => el.id === id);
      const oldItem = todoData[idx];

      const before = todoData.slice(0, idx);
      const after = todoData.slice(idx + 1);

      const newItem = { ...oldItem, important: !oldItem.important };
      const newArray = [...before, newItem, ...after];

      return {
        todoData: newArray,
      };
    });
  };

  search(items, term) {
    return items.filter((item) => {
      return item.label.toLowerCase().indexOf(term.toLowerCase()) > -1;
    });
  }

  filtered(items, filter) {
    switch (filter) {
      case "all":
        return items;
      case "active":
        return items.filter((item) => !item.done);
      case "done":
        return items.filter((item) => item.done);
      default:
        return items;
    }
  }

  onChangeTerm = (term) => {
    this.setState({ term });
  };
  onFilterChange = (filter) => {
    this.setState({ filter });
  };

  render() {
    const { todoData, term, filter } = this.state;
    const {
      deleteItem,
      addItem,
      onToggleDone,
      onToggleImportant,
      filtered,
      search,
    } = this;

    const visibleItems = filtered(search(todoData, term), filter);

    let doneCount = todoData.filter((el) => el.done).length;
    let todoCount = todoData.length - doneCount;

    return (
      <div className="todo-app">
        <AppHeader toDo={todoCount} done={doneCount} />
        <div className="top-panel d-flex">
          <SearchPanel onChangeTerm={this.onChangeTerm} />
          <ItemStatusFilter
            filter={filter}
            filterChange={this.onFilterChange}
          />
        </div>

        <TodoList
          onDelete={deleteItem}
          todos={visibleItems}
          onToggleDone={onToggleDone}
          onToggleImportant={onToggleImportant}
        />
        <ItemAddForm onAddItem={addItem} />
      </div>
    );
  }
}

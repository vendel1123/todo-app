import { useState, useEffect } from 'react'

const STORAGE_KEY  = 'todo-app'


function App() {
  // szűrő belső állapota
  const [filter, setFilter] = useState('all')

  // todo-k listájának állapota
  //const [todos, setTodos] = useState([])
  const [todos, setTodos]  = useState(()=>{
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.log(`Hiba a localstorage  beolvasásakor: ${error}`);
      return [] //ha nem tudja beolvasni a localstoragebol, akkor ures tomb lesz  a beslo allapot
    }
  })

  // az input mező belső állapota (amibe írjuk a szöveget)
  const [text, setText] = useState('')
  

  //mentes localStorge-be amikor változik a lista

  useEffect(()=>{
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))

    } catch (error) {
      console.log(`Hiba a localstorage írásakor: ${error}`);
    }
  }, 
  [todos])


  // 
  // const toggleTodo = (id) => {
  //   setTodos((prev) => {
  //     prev.map((prevTodo) => {
  //       let newTodo
  //       if (prevTodo.id === id) {
  //         newTodo.id = prevTodo.id,
  //         newTodo.text = prevTodo.text,
  //         newTodo.isChecked = !prevTodo.isChecked
  //       } else {
  //         newTodo = prevTodo
  //       }

  //       return newTodo
  //     })
  //   })
  // }

  // spread operatorral
  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((prevTodo) =>
        prevTodo.id === id
          ? { ...prevTodo, isChecked: !prevTodo.isChecked }
          : prevTodo
      )
    )
  }

  // új feladat hozzáadása
  const addTodo = () => {
    //{ id: 5, text: 'assa fsadasd', isChecked: true },
    const todoText = text.trim()

    if (!todoText) return

    const newTodo = {
      id: crypto.randomUUID(),
      text: todoText,
      isChecked: false,
      createdAt: Date.now()
    }

    setTodos((prev) => [newTodo, ...prev])
    setText('')
  }

  // ha leütöm az enter-t az input mezőben, akkor is lefut az addTodo függvény
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      addTodo()
    }
  }

  // egy db todo törlése id alapján
  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((prevTodo) => prevTodo.id !== id))
  }

  // az összes kijelölt todo törlése egyszerre
  const clearCompleted = () => {
    setTodos((prev) => prev.filter((prevTodo) => !prevTodo.isChecked))
  }

  // hozzunk létre egy újabb tömböt a todos-ból, és módosítsuk meg bizonyos feltételek szerint az eredeti todos-hoz képest
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.isChecked
    if (filter === 'done') return todo.isChecked
    return true
  })

  // hány feladat van hátra
  const activeCount = todos.filter((todo) => !todo.isChecked).length

  return (
    // fő keret
    <div className='app-root'>
      {/* kártya */}
      <div className="todo-card">
        {/* kártya fejléc */}
        <header>
          <h1>Teendőlista</h1>
          <p>Egyszerű todo app</p>
        </header>

        {/* input mező és a hozzáadás gomb */}
        <div className="input-row">
          <input
            type="text"
            placeholder='Új feladat hozzáadása...'
            value={text}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            type="button"
            onClick={addTodo}
          >Hozzáad
          </button>
        </div>

        {todos.length > 0 ? (
          <>
            {/* -----ha már van todo listánk----- */}

            {/* szűrő sáv */}
            <div className="toolbar">
              <div className="filter">
                <button
                  type="button"
                  className={filter === 'all' ? 'black' : ''}
                  onClick={() => setFilter('all')}
                >Mind
                </button>
                <button
                  type="button"
                  className={filter === 'active' ? 'black' : ''}
                  onClick={() => setFilter('active')}
                >Aktív
                </button>
                <button
                  type="button"
                  className={filter === 'done' ? 'black' : ''}
                  onClick={() => setFilter('done')}
                >Kész
                </button>
              </div>
              <button
                type="button"
                className='clear-btn'
                disabled={todos.every((todo) => !todo.isChecked)}
                onClick={clearCompleted}
              >Kész feladatok törlése
              </button>
            </div>

            {/* todo-k felsorolás litája */}
            <ul className='todo-list'>
              {filteredTodos.map((todo) => {
                return <li key={todo.id} className={todo.isChecked ? 'completed' : ''}>
                  <label>
                    <input type="checkbox" checked={todo.isChecked} onChange={() => toggleTodo(todo.id)} />
                    <span className='todo-text'>{todo.text}</span>
                  </label>
                  <button
                    type="button"
                    className='delete-btn'
                    onClick={() => deleteTodo(todo.id)}
                  >X
                  </button>
                </li>
              })}
            </ul>

            {/* footer */}
            <footer>
              <span>{activeCount} feladat van hátra</span>
            </footer>
          </>
        ) : (
          <>
            {/* -----empty state - ha még nincs todo listánk------ */}
            <p className='empty-state'>Még nincs teendőd. Írj be valamit fent és nyomd meg a <strong>Hozzáad</strong> gombot!</p>
          </>
        )}
      </div>
    </div>
  )
}

export default App

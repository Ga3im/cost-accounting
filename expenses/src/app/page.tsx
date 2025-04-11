'use client'
import { useState } from 'react'
import styles from './page.module.css'

type ListType = {
  id: number
  date: string
  store: string
  activity: string
  price: number
}

export default function Home() {
  const [newItem, setNewItem] = useState<ListType>({
    id: 0,
    date: '',
    store: '',
    activity: '',
    price: 0,
  })
  const listStorage: ListType[] =
    JSON.parse(localStorage.getItem('purchases')) || []
  const [list, setList] = useState<ListType[]>(listStorage)

  const addNewItem = () => {
    setList([...list, newItem])
    localStorage.setItem('purchases', JSON.stringify(list))
    console.log(list)
    console.log(localStorage.getItem('purchases'))
  }
  console.log(newItem)
  return (
    <>
      <div className={styles.main}>
        <div className={styles.listHead}>
          <p className={styles.item}>Дата</p>
          <p className={styles.item}>Магазин</p>
          <p className={styles.item}>Предназначение</p>
          <p className={styles.item}>Цена</p>
        </div>
        <form onSubmit={addNewItem} className={styles.form} action="">
          <div className={styles.listHead}>
            <input
              className={styles.item}
              onChange={(e) => setNewItem({ ...newItem, date: e.target.value })}
              type="date"
            />
            <input
              className={styles.item}
              onChange={(e) =>
                setNewItem({ ...newItem, store: e.target.value })
              }
              type="text"
            />
            <select
              className={styles.item}
              defaultValue="Питание"
              onChange={(e) =>
                setNewItem({ ...newItem, activity: e.target.value })
              }
            >
              <option value="Питание">Питание</option>
              <option value="Хобби">Хобби</option>
              <option value="Работа">Работа</option>
              <option value="Развлечение">Развлечение</option>
              <option value="Прочее">Прочее</option>
            </select>
            <input
              type="number"
              onChange={(e) =>
                setNewItem({ ...newItem, price: Number(e.target.value) })
              }
              className={styles.item}
            />
          </div>
          <button type="submit" className={styles.btn}>
            Добавить
          </button>
        </form>
        {/* {list.map((i) => {
          return (
            <div className={styles.listHead} key={i.id}>
              <div>{i.date}</div>
              <div>{i.store}</div>
              <div>{i.price}</div>
            </div>
          )
        })} */}
      </div>
    </>
  )
}

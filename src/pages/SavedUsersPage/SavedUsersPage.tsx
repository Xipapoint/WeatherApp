import React from 'react'
import UserList from '../../components/UserList/UserList'
import styles from './savedUsersPage.module.scss'
const SavedUsersPage = () => {
  return (
    <div className={styles.container}>
      <UserList pageType={'saved'}/>
    </div>
  )
}

export default SavedUsersPage

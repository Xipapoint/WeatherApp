import UserList from '../../components/UserList/UserList'
import { UserDataProvider } from '../../context/UserDataContext'
import styles from './allUsersPage.module.scss'
const AllUsersPage = () => {
  return (
    <div className={styles.container}>
      <UserDataProvider>
        <UserList pageType={'all-users'}/>
      </UserDataProvider>
    </div>
  )
}

export default AllUsersPage

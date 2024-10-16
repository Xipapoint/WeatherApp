import UserList from '../../components/UserList/UserList'
import styles from './allUsersPage.module.scss'
const AllUsersPage = () => {
  return (
    <div className={styles.container}>
      <UserList/>
    </div>
  )
}

export default AllUsersPage

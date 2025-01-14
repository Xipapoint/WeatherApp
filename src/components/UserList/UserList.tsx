import React, { memo, useEffect, useMemo, useRef } from 'react'
import { ToastContainer, Bounce } from 'react-toastify'
import UserCard from './UserCard/UserCard'

import 'react-toastify/dist/ReactToastify.css';
import styles from './userList.module.scss'
import { useUserDataContext } from '../../context/UserDataContext'

interface UserListProps{
  pageType: 'saved' | 'all-users'
}

const UserList: React.FC<UserListProps> = ({pageType}) => {
    const { userState, weatherState, loadUsers, loadSavedUsers} = useUserDataContext()
    const observer = useRef<IntersectionObserver | null>(null)
    const loadMoreRef = useRef<HTMLDivElement | null>(null)

      useEffect(() => {
        if(pageType === 'all-users')
          loadUsers()
      }, [pageType])

      useEffect(() => {
        if(pageType === 'saved')
          loadSavedUsers()
      }, [pageType])
    
      useEffect(() => {
        if (userState.loading) return
    
        const handleIntersection = (entries: IntersectionObserverEntry[]) => {
          if (entries[0].isIntersecting) {
            loadUsers()
          }
        };
    
        observer.current = new IntersectionObserver(handleIntersection)
        if (loadMoreRef.current) {
          observer.current.observe(loadMoreRef.current)
        }
    
        return () => {
          if (observer.current && loadMoreRef.current) {
            observer.current.unobserve(loadMoreRef.current)
          }
        }
      }, [userState.loading, weatherState.loading, loadUsers])

      const renderedUsers = useMemo(() => {
        return userState.users.map((user, index) => (
          <div className={styles.userCardContainer} key={index}>
            <UserCard
              key={Number(user.id.value)}
              userKey={Number(user.id.value)}
              userId={user.id}
              gender={user.gender}
              name={user.name}
              location={user.location}
              coordinates={user.location.coordinates}
              picture={user.picture}
              email={user.email}
              weather={weatherState.weatherData[index]}
              
            />
          </div>
        ));
      }, [userState.users, weatherState.weatherData]);
  return (
    <>
      {userState.loading && <p>Loading users...</p>}
      {
        pageType === 'all-users' ?
        <h1>All Users</h1> :
        <h1>Saved Users</h1>
    }

      <ul className={styles.userList}>
        {renderedUsers}
      </ul>
      <div ref={loadMoreRef} style={{ height: '20px', background: 'transparent' }} />
      <ToastContainer 
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
        />
    </>
  )
}

export default memo(UserList)

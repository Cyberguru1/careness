import Link from 'next/link'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faUser, faCog } from '@fortawesome/free-solid-svg-icons'
import styles from '@/styles/bottombar.module.css'
import { LucideEdit, LucideEdit3, LucideFileQuestion, LucideHome, LucideMessageSquare, LucideSearch, LucideUser, LucideUserCog } from 'lucide-react'

export default function Bottombar() {
  const router = useRouter()

  return (
    <div className={styles.bottombar}>
  <Link href="/home">
    <div className={router.pathname === '/home' ? styles.active : ''}>
      <LucideHome className='icons' />
      {/*<span>Home</span>*/}
    </div>
  </Link>
  <Link href="/chats">
    <div className={router.pathname === '/chats' ? styles.active : ''}>
      <LucideMessageSquare className='icons' />
      {/*<span>Profile</span>*/}
    </div>
  </Link>
  <Link href="/search">
    <div className={router.pathname === '/search' ? styles.active : ''}>
      <LucideSearch className='icons' />
      {/*<span>Profile</span>*/}
    </div>
  </Link>
  <Link href="/quizes">
    <div className={router.pathname === '/quizes' ? styles.active : ''}>
      <LucideEdit className='icons' />
      {/*<span>Settings</span>*/}
    </div>
  </Link>
</div>

  )
}

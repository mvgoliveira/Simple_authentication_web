import { useAuth } from '../../context/authContext';
import { useRouter } from 'next/router';

import styles from '../../styles/Dashboard.module.scss';

export default function UserDashboard() {
  const router = useRouter()
  const { logout } = useAuth();

  async function handleLogout() {
    logout();
    router.replace("/");
  }
   
    return (
      <div className={styles.container}>
        <button type="button" onClick={handleLogout}> Logout </button>
      </div>
    )
}
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Form } from '@unform/web';

import { BsFillGearFill } from 'react-icons/bs';
import Input from '../../components/Input';

import { useAuth } from '../../context/authContext';
import styles from '../../styles/Dashboard.module.scss';

import { api } from '../../services/api';

export default function AdminDashboard({ usersData, page }) {
  const router = useRouter()
  const { logout } = useAuth();

  const [isOpening, setIsOpening] = useState(false);
  const [userIndexConfig, setUserIndexConfig] = useState(0);


  async function handleLogout() {
    logout();
    router.replace("/");
  }

  async function handleToggleConfigs(index) {
    setIsOpening(!isOpening);
    setUserIndexConfig(index);
  }

  async function handleSubmit(data) {
    const {name, email, newPassword, confirmNewPassword} = data;
    
    let userNewConfigs = {
      email,
      name,
      newPassword,
      confirmNewPassword,
      id: usersData[userIndexConfig].id
    };
    
    try {
      await api.put('/users', userNewConfigs );
      router.reload();
    } catch (error) {}
  }

  return (
    <div className={styles.container}>
      <div className={styles.leftContainer}>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th></th>
            </tr>
          </thead>
          
          <tbody>
            { usersData.map((user, index: number) => {
              return (
                <tr key={index}>
                  {user.admin ? (
                    <>
                      <td className={styles.admin}>{user.name}</td>
                      <td className={styles.admin}>{user.email}</td>
                      <td className={styles.admin}>
                        <button>
                          <BsFillGearFill color="aaa"/>
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <button onClick={() => handleToggleConfigs((index))}>
                          <BsFillGearFill color="000"/>
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>

        <div className={styles.pagination}>
          <button type="button" onClick={() => router.replace(`/dashboard/${Number(page)-1}`)}>anterior</button>
          <button type="button" onClick={() => router.replace(`/dashboard/${Number(page)+1}`)}>próximo</button>
        </div>
      </div>

      <div className={styles.rightContainer}>
        <button type="button" onClick={handleLogout}> Logout </button>
      </div>
      
      { isOpening ? (
        <div className={styles.configContainer}>
          <span>
              <Form onSubmit={handleSubmit} initialData={{ id: usersData[userIndexConfig].id }}>
                <Input name="name" label="Nome" type="name" defaultValue={usersData[userIndexConfig].name}/>
                <Input name="email" label="E-mail" type="email" defaultValue={usersData[userIndexConfig].email}/>
                <Input name="newPassword" label="Nova Senha" type="password"/>
                <Input name="confirmNewPassword" label="Confirme a nova Senha" type="password"/>
                <div className={styles.buttonContainer}>
                  <button type="submit"> Salvar </button>
                  <button type="button" onClick={handleToggleConfigs}> Cancelar </button>
                </div>
            </Form>
          </span>
        </div>
      ) : (
        null
      )}
    </div>
  )
}
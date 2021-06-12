import { useState } from 'react';
import { useRouter } from 'next/router';
import { Form } from '@unform/web';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css'; 

import { BsFillGearFill } from 'react-icons/bs';
import { FaTrashAlt, FaWindowClose } from 'react-icons/fa';
import { FcCheckmark } from 'react-icons/fc';
import { HiX } from 'react-icons/hi';
import Input from '../../components/Input';

import { useAuth } from '../../context/authContext';
import styles from '../../styles/Dashboard.module.scss';

import { api } from '../../services/api';

interface IData {
  name: string;
  email: string; 
  newPassword: string; 
  confirmNewPassword: string;
}

interface IUser {
  admin: string;
  name: string;
  email: string;
}

export default function AdminDashboard({ usersData, page, previous, next, token }) {
  const router = useRouter()
  const { logout } = useAuth();

  const [isOpening, setIsOpening] = useState(false);
  const [userIndexConfig, setUserIndexConfig] = useState(0);


  async function handleLogout() {
    logout();
    router.replace("/");
  }

  async function handleToggleConfigs(index : number) {
    setIsOpening(!isOpening);
    setUserIndexConfig(index);
  }

  async function handleSubmit(data: IData) {
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

  async function handleDeleteUser(index: number) {
    try {
      await api.delete(`/users/${usersData[index].id}`, { headers: {'Authorization': `Bearer ${token}`}})
      router.reload();
    } catch (error) {}
  }

  return (
    <div className={styles.container}>
      <ToastContainer enableMultiContainer autoClose={false} containerId="ContainerPrivado"/>
      <div className={styles.leftContainer}>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th></th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            { usersData.map((user: IUser, index: number) => {
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
                      <td>
                        <button>
                          <FaTrashAlt color="aaa" />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <button onClick={() => handleToggleConfigs(index)}>
                          <BsFillGearFill color="000"/>
                        </button>
                      </td>
                      <td>
                        <button>
                          <FaTrashAlt color="000" onClick={() => handleDeleteUser(index)}/>
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
          { previous === false ? (
              < button type="button" className={styles.false}
              > Anterior </button>
          ) : (
              < button type="button" 
                onClick={() => router.replace(`/dashboard/${Number(page)-1}`)}
              > anterior </button>
          )}

          { next === false ? (
              < button type="button" className={styles.false}
              > próximo </button>
          ) : (
              < button type="button" 
                onClick={() => router.replace(`/dashboard/${Number(page)+1}`)}
              > próximo </button>
          )}
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
                  <button type="button" onClick={() => handleToggleConfigs(0)}> Cancelar </button>
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
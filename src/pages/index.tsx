import { GetServerSideProps } from 'next';
import jwt from 'jsonwebtoken';
import { Form } from '@unform/web';
import { VscLoading } from 'react-icons/vsc'

import Input from '../components/Input';
import styles from '../styles/Home.module.scss';
import { useAuth } from '../context/authContext';

export default function Home() {
  const { login, error, setError, isValidating } = useAuth();

  async function handleSubmit(data, { reset }) {
    login(data.email, data.password);
    setError(false);
    reset();
  }

  return (
    <div className={styles.container}>
      <div className={styles.inputCard}>
        <Form onSubmit={handleSubmit}>
            <Input name="email" label="E-mail" type="email"/>
            <Input name="password" label="Senha" type="password"/>
            { error ? <p className={styles.error}>email ou senha incorretos</p> : null } 
            <button type="submit"> { isValidating ? <VscLoading className={styles.loadingButton}/> : <>Entrar</> } </button>
        </Form>
      </div>
    </div> 
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  let { token } = req.cookies;

  try {
    if (token) {
      jwt.verify(token, process.env.TOKEN_SECRET);
      return {
        props: {},
        redirect: {
          permanent: false,
          destination: '/dashboard/1'
        }
      }
    }
  } catch (error) {
    return {
      props: {
      },
    }
  }

  return {
    props: {
    },
  }
}
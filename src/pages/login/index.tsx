import { useLogin } from '@/hooks/auth'
import { useRouter } from 'next/router'
import Login from "lib/pages/login";

const LoginComponent = () => {
  const router = useRouter()
  const { mutate: login, isPending } = useLogin()

  return (
    <LoginForm onSubmit={login} isLoading={isPending} />
  )
}

export default LoginComponent;

// COMPONENTS
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
// HOOKS
import useLoginForm from '../hooks/useLoginForm'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button';

export default function LoginForm() {
  const { form, handleSubmit } = useLoginForm()

  return (
    <Form {...form}>
      <div className='flex flex-col items-center gap-2 mb-10 text-center'>
        <h1 className='text-2xl font-bold'>Login to your account</h1>
        <p className='text-balance text-sm text-muted-foreground'>
          Enter your email below to login to your account
        </p>
      </div>
      <form onSubmit = {handleSubmit} id = 'login-form' className = 'flex flex-col gap-4'> 
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder='Ej: m@example.com'
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input
                  type = 'password'
                  placeholder = '******'
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />
      <Button type='submit' className='w-full  mt-10'>
        Login
      </Button>
      </form>
    </Form>
  )
}

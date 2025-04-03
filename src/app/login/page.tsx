'use client'

import { supabase } from "@/utils/supabase";
import { useRouter } from "next/navigation";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";

type FormData = {
  email: string;
  password: string;
}

export default function FormBasic() {
  const router = useRouter();

     const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
     });

     const onsubmit: SubmitHandler<FormData> = async (data) => {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if(error) {
        alert('ログインに失敗しました');
      } else {
        router.push('/admin/posts');
      }
     };

     const onerror: SubmitErrorHandler<FormData> = (errors) => {
      console.log(errors);
     }

      return (
    <div className="flex justify-center pt-[240px]">
      <form onSubmit={handleSubmit(onsubmit, onerror)} noValidate className="space-y-4 w-full max-w-[400px]">
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            メールアドレス
          </label>
          <input
            type="email"
            {...register('email', {
              required: 'emailは必須入力です',
              maxLength: {
                value: 100,
                message: 'emailは100字以内で入力してください'
              }
            })}
            name="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="name@company.com"
            required
            //onChange={(e) => setEmail(e.target.value)}
          />
          <div>{errors.email?.message}</div>
        </div>
        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            パスワード
          </label>
          <input
            type="password"
            {...register('password', {
              required: 'パスワードは必須です',
            })}
            name="password"
            id="password"
            placeholder="••••••••"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
          <div>{errors.password?.message}</div>
        </div>

        <div>
          <button
            type="submit"
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            ログイン
          </button>
        </div>
      </form>
    </div>
  )
} 
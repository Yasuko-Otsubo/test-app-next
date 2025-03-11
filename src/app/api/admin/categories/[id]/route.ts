import { NextRequest, NextResponse } from 'next/server'
import { /*Category,*/  PrismaClient } from '@prisma/client'
import { supabase } from '@/utils/supabase';

//Prismaクライアントの初期化 データベース操作を行う
const prisma = new PrismaClient()

const authenticate = async ( request: NextRequest ) => {
  const token = request.headers.get('Authorization') ?? '';

const { error } = await supabase.auth.getUser(token);
if(error) {
  return NextResponse.json({ status: error.message }, { status : 400} );
}
return null; 
};

export const GET = async (
  //Next.jsのリクエストオブジェクト
  request: NextRequest,
  //URLパラメータをオブジェクトとして受け取るための構文
  //`params`オブジェクトから`id`というキーを持つ値を取り出して
  { params }: { params: { id: string } }) => {
    const authError = await authenticate(request);

    if(authError) return authError;

  const { id } = params

  try {
    //Prismaを使用してデータベースから特定のカテゴリーを取得し
    const category = await prisma.category.findUnique({
      where: {
        id: parseInt(id),
      },
    })
    if (!category) {
      return NextResponse.json({ status: 'Not Found' }, { status: 404 });
    }
    //Next.jsの`NextResponse`オブジェクトを使用して、JSON形式のレスポンスを生成
    //{ status: 'OK', category }: レスポンスボディとして、ステータスと取得したカテゴリー情報
    //{ status: 200 }: HTTPステータスコード200（成功）を指定
    return NextResponse.json({ status: 'OK', category }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}

// カテゴリーの更新時に送られてくるリクエストのbodyの型
interface UpdateCategoryRequestBody {
  name: string
}

export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } } // ここでリクエストパラメータを受け取る
) => {
  const authError = await authenticate(request);
  if(authError) return authError;

  // paramsの中にidが入っているので、それを取り出す
  const { id } = params

  // リクエストのbodyを取得
  const { name }: UpdateCategoryRequestBody = await request.json()

  try {
    // idを指定して、Categoryを更新
    const category = await prisma.category.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name,
      },
    })

    // レスポンスを返す
    return NextResponse.json({ status: 'OK', category }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}


export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } } // ここでリクエストパラメータを受け取る
) => {

  const authError = await authenticate(request);
  if(authError) return authError;
  // paramsの中にidが入っているので、それを取り出す
  const { id } = params

  try {
    // idを指定して、Categoryを削除
    await prisma.category.delete({
      where: {
        id: parseInt(id),
      },
    })

    // レスポンスを返す
    return NextResponse.json({ status: 'OK' }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
  }
}

